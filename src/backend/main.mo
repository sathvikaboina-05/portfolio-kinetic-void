import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type ProjectDomain = {
    #cse;
    #aiml;
    #ds;
    #iot;
    #cybersecurity;
  };

  module ProjectDomain {
    public func compare(d1 : ProjectDomain, d2 : ProjectDomain) : Order.Order {
      func orderDomain(domain : ProjectDomain) : Nat {
        switch (domain) {
          case (#cse) { 0 };
          case (#aiml) { 1 };
          case (#ds) { 2 };
          case (#iot) { 3 };
          case (#cybersecurity) { 4 };
        };
      };
      Nat.compare(orderDomain(d1), orderDomain(d2));
    };
  };

  type SubscriptionStatus = {
    #free;
    #premium;
  };

  type ProjectSection = {
    abstract : Text;
    introduction : Text;
    literature_review : Text;
    methodology : Text;
    system_design : Text;
    results : Text;
    discussion : Text;
    references : Text;
  };

  type UserProfile = {
    principal : Principal;
    name : Text;
    email : Text;
    role : AccessControl.UserRole;
    subscriptionStatus : SubscriptionStatus;
    projectsCount : Nat;
    createdAt : Int;
  };

  type Project = {
    id : Nat;
    userId : Principal;
    title : Text;
    domain : ProjectDomain;
    description : Text;
    generatedContent : ProjectSection;
    createdAt : Int;
  };

  var nextProjectId = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let projects = Map.empty<Nat, Project>();
  let adminProjectTemplates = Map.empty<ProjectDomain, ProjectSection>();
  let interviewQuestions = Map.empty<Text, [Text]>();

  func domainToText(domain : ProjectDomain) : Text {
    switch (domain) {
      case (#cse) { "CSE" };
      case (#aiml) { "AIML" };
      case (#ds) { "DS" };
      case (#iot) { "IoT" };
      case (#cybersecurity) { "Cybersecurity" };
    };
  };

  // Helper to resolve domain questions and optional viva questions for a project
  // This is a pure function (no caller context) used internally after auth checks are done.
  func resolveInterviewQuestions(domain : Text, projectId : ?Nat, callerPrincipal : Principal) : [Text] {
    let domainQuestions = switch (interviewQuestions.get(domain)) {
      case (null) { [] };
      case (?questions) { questions };
    };

    switch (projectId) {
      case (null) { domainQuestions };
      case (?id) {
        switch (projects.get(id)) {
          case (null) { Runtime.trap("Project not found") };
          case (?project) {
            // Ownership check: only the project owner can use their project for viva questions
            if (project.userId != callerPrincipal and not AccessControl.isAdmin(accessControlState, callerPrincipal)) {
              Runtime.trap("Unauthorized: Can only use your own projects for interview questions");
            };
            let vivaQuestions = [
              "Explain the main objective of your project " # project.title # " in the " # domain # " domain.",
              "How did you design the methodology for the " # project.title # " project?",
              "Discuss the challenges you faced during the implementation of " # project.title # ".",
              "What technologies or tools did you use in the " # project.title # " project?",
              "How does your project contribute to advancements in the " # domain # " domain?"
            ];
            domainQuestions.concat(vivaQuestions);
          };
        };
      };
    };
  };

  // ─── Required profile interface ───

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get their profile");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save their profile");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // ─── User registration ───

  public shared ({ caller }) func createDashboardUser(name : Text, email : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register");
    };

    if (userProfiles.containsKey(caller)) {
      Runtime.trap("User already exists");
    };

    let userProfile : UserProfile = {
      principal = caller;
      name;
      email;
      role = #user;
      subscriptionStatus = #free;
      projectsCount = 0;
      createdAt = Time.now();
    };

    userProfiles.add(caller, userProfile);
  };

  public query ({ caller }) func getUserData() : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get their data");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?userProfile) { userProfile };
    };
  };

  // ─── Subscription ───

  public shared ({ caller }) func upgradeSubscription() : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can upgrade their subscription");
    };

    let oldProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile };
    };

    let updatedProfile : UserProfile = {
      oldProfile with subscriptionStatus = #premium;
    };

    userProfiles.add(caller, updatedProfile);
    updatedProfile;
  };

  // ─── Projects ───

  public shared ({ caller }) func createProject(title : Text, domain : ProjectDomain, description : Text) : async Project {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create projects");
    };

    let userProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile };
    };

    if (userProfile.subscriptionStatus == #free and userProfile.projectsCount >= 1) {
      Runtime.trap("Project limit reached for free plan. Please upgrade to premium to create more projects.");
    };

    let generatedContent = {
      abstract = "This project explores the challenges and opportunities of " # domainToText(domain) # " in the context of " # description;
      introduction = "The " # domainToText(domain) # " field has seen significant advancements in recent years, particularly in areas related to " # description # ".";
      literature_review = "Previous studies have focused on various aspects of " # domainToText(domain) # " providing a foundation for this work.";
      methodology = "The proposed methodology involves a combination of data collection, analysis, and experimentation.";
      system_design = "The system architecture consists of multiple interconnected components, each serving a specific purpose.";
      results = "Preliminary results indicate that the proposed approach offers significant improvements over traditional methods.";
      discussion = "The findings suggest that further research is needed to explore the full potential of this methodology.";
      references = "Institutional Credit";
    };

    let project : Project = {
      id = nextProjectId;
      userId = caller;
      title;
      domain;
      description;
      generatedContent;
      createdAt = Time.now();
    };

    projects.add(nextProjectId, project);
    nextProjectId += 1;

    let updatedProfile : UserProfile = {
      userProfile with projectsCount = userProfile.projectsCount + 1;
    };
    userProfiles.add(caller, updatedProfile);

    project;
  };

  public query ({ caller }) func getProjectsByUser(userId : Principal) : async [Project] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own projects");
    };

    let userProjects = List.empty<Project>();
    for ((_, project) in projects.entries()) {
      if (project.userId == userId) {
        userProjects.add(project);
      };
    };
    userProjects.toArray();
  };

  public shared ({ caller }) func updateProject(projectId : Nat, title : Text, description : Text) : async Project {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update projects");
    };

    let project = switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?p) { p };
    };

    if (project.userId != caller) {
      Runtime.trap("Unauthorized: Only the owner can update this project");
    };

    let updatedProject : Project = {
      project with
      title;
      description;
      generatedContent = {
        abstract = "This project focuses on " # title # " within the context of " # description;
        introduction = "The importance of " # domainToText(project.domain) # " cannot be overstated, especially when considering projects like " # title # ".";
        literature_review = "Recent advancements in the field of " # domainToText(project.domain) # " provide context for this work.";
        methodology = "The research methodology involves a comprehensive analysis of existing literature, followed by experimental validation.";
        system_design = "The system architecture is designed to maximize efficiency and scalability, with a focus on modularity and flexibility.";
        results = "Initial testing has shown promising results, indicating that the proposed approach outperforms traditional methods.";
        discussion = "The results highlight the need for further exploration in this area, particularly in terms of scalability.";
        references = "Okey Bear AI";
      };
    };

    projects.add(projectId, updatedProject);
    updatedProject;
  };

  public query ({ caller }) func getAllProjectsByUser() : async [Project] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their projects");
    };

    let userProjects = List.empty<Project>();
    for ((_, project) in projects.entries()) {
      if (project.userId == caller) {
        userProjects.add(project);
      };
    };
    userProjects.toArray();
  };

  // ─── Admin functions ───

  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };

    let allUsers = List.empty<UserProfile>();
    for ((_, profile) in userProfiles.entries()) {
      allUsers.add(profile);
    };
    allUsers.toArray();
  };

  public shared ({ caller }) func deleteUser(userId : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete users");
    };

    userProfiles.remove(userId);
  };

  public query ({ caller }) func getAllProjects() : async [Project] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all projects");
    };

    let allProjects = List.empty<Project>();
    for ((_, project) in projects.entries()) {
      allProjects.add(project);
    };
    allProjects.toArray();
  };

  public shared ({ caller }) func updateProjectTemplate(domain : ProjectDomain, template : ProjectSection) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update project templates");
    };
    adminProjectTemplates.add(domain, template);
  };

  public query ({ caller }) func getProjectTemplates() : async [(ProjectDomain, ProjectSection)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view project templates");
    };
    adminProjectTemplates.toArray();
  };

  // ====================== INTERVIEW QUESTIONS ============================

  public shared ({ caller }) func initializeDefaultQuestions() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can initialize interview questions");
    };

    let dsaQuestions = [
      "Explain the difference between a stack and a queue.",
      "What is the time complexity of searching for an element in a binary search tree?",
      "Describe the process of balancing a binary tree.",
      "How does a hash table resolve collisions?",
      "Explain the difference between breadth-first search and depth-first search.",
      "What is dynamic programming and how is it used?",
      "Describe the process of quick sort and its time complexity.",
      "What is the difference between a linked list and an array?",
      "Explain the concept of memoization in recursive algorithms.",
      "Describe the process of graph traversal using depth-first search.",
      "What is the purpose of a stack data structure?",
      "Explain the difference between a tree and a graph.",
      "Describe the process of heapification in a binary heap.",
      "What is the time complexity of insertion in a balanced binary search tree?",
      "How does dynamic programming differ from greedy algorithms?",
      "Explain the concept of memoization in recursive functions.",
      "Describe the process of merge sort and its time complexity.",
      "What is the time complexity of binary search in a sorted array?"
    ];

    let backendQuestions = [
      "Explain the difference between RESTful APIs and GraphQL.",
      "What is the role of an ORM (Object-Relational Mapping) in backend development?",
      "Describe the process of scaling a backend service to handle increased traffic.",
      "What is the difference between synchronous and asynchronous programming?",
      "Explain the concept of statelessness in RESTful services.",
      "What is the significance of caching in backend development?",
      "Describe the process of load balancing in distributed systems.",
      "What is the purpose of middleware in backend frameworks?",
      "Explain the concept of data normalization in databases.",
      "What is the difference between SQL and NoSQL databases?",
      "Describe the process of handling authentication in backend applications.",
      "What is the significance of microservices architecture?",
      "Explain the concept of transactions in database management.",
      "What is the role of message queues in backend systems?",
      "Describe the process of implementing authentication using tokens."
    ];

    let aimlQuestions = [
      "Explain the difference between supervised and unsupervised learning.",
      "What is the role of feature engineering in machine learning?",
      "Describe the process of training a neural network.",
      "What is the difference between classification and regression tasks?",
      "Explain the concept of overfitting in machine learning models.",
      "What is the significance of activation functions in neural networks?",
      "Describe the process of cross-validation in model evaluation.",
      "What is the purpose of dropout in deep learning models?",
      "Explain the concept of reinforcement learning.",
      "What is the difference between precision and recall in classification tasks?",
      "Describe the process of gradient descent optimization.",
      "What is the role of loss functions in machine learning?",
      "Explain the concept of transfer learning in neural networks.",
      "What is the significance of learning rate in model training?",
      "Describe the process of hyperparameter tuning in machine learning."
    ];

    let iotQuestions = [
      "Explain the difference between IoT and traditional embedded systems.",
      "What is the role of sensors in IoT applications?",
      "Describe the process of connecting IoT devices to the cloud.",
      "What is the significance of low-power communication protocols in IoT?",
      "Explain the concept of edge computing in IoT systems.",
      "What is the purpose of device provisioning in IoT?",
      "Describe the process of data aggregation in IoT deployments.",
      "What is the role of gateways in IoT networks?",
      "Explain the concept of device management in IoT ecosystems.",
      "What is the significance of security in IoT applications?",
      "Describe the process of firmware update management in IoT devices.",
      "What is the purpose of remote monitoring in IoT systems?",
      "Explain the concept of interoperability in IoT technologies.",
      "What is the difference between managed and unmanaged services in IoT?",
      "Describe the process of integrating IoT with cloud platforms."
    ];

    let cybersecurityQuestions = [
      "Explain the concept of a threat model in cybersecurity.",
      "What is the difference between symmetric and asymmetric encryption?",
      "Describe the process of penetration testing.",
      "What is the significance of firewalls in network security?",
      "Explain the concept of social engineering attacks.",
      "What is the role of intrusion detection systems in cybersecurity?",
      "Describe the process of vulnerability assessment.",
      "What is the purpose of digital forensics in cybersecurity investigations?",
      "Explain the concept of multi-factor authentication.",
      "What is the significance of data encryption at rest?",
      "Describe the process of secure software development.",
      "What is the purpose of public key infrastructure (PKI)?",
      "Explain the concept of network segmentation.",
      "What is the difference between phishing and spear-phishing attacks?",
      "Describe the process of incident response in cybersecurity."
    ];

    interviewQuestions.add("dsa", dsaQuestions);
    interviewQuestions.add("backend", backendQuestions);
    interviewQuestions.add("aiml", aimlQuestions);
    interviewQuestions.add("iot", iotQuestions);
    interviewQuestions.add("cybersecurity", cybersecurityQuestions);
  };

  public query ({ caller }) func getInterviewQuestions(domain : Text, projectId : ?Nat) : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access interview questions");
    };

    let userProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile };
    };

    if (userProfile.subscriptionStatus != #premium) {
      Runtime.trap("Access denied: Premium subscription required for this feature");
    };

    resolveInterviewQuestions(domain, projectId, caller);
  };

  public query ({ caller }) func getInterviewQuestionsByCategory(category : Text, projectId : ?Nat) : async [Text] {
    // Full authorization check duplicated here — do NOT delegate to getInterviewQuestions
    // because that would pass the canister principal as caller, bypassing auth.
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access interview questions");
    };

    let userProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile };
    };

    if (userProfile.subscriptionStatus != #premium) {
      Runtime.trap("Access denied: Premium subscription required for this feature");
    };

    resolveInterviewQuestions(category, projectId, caller);
  };
};
