import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProjectSection {
    references: string;
    results: string;
    literature_review: string;
    introduction: string;
    abstract: string;
    discussion: string;
    methodology: string;
    system_design: string;
}
export interface Project {
    id: bigint;
    title: string;
    domain: ProjectDomain;
    userId: Principal;
    createdAt: bigint;
    description: string;
    generatedContent: ProjectSection;
}
export interface UserProfile {
    principal: Principal;
    name: string;
    createdAt: bigint;
    role: UserRole;
    projectsCount: bigint;
    email: string;
    subscriptionStatus: SubscriptionStatus;
}
export enum ProjectDomain {
    ds = "ds",
    cse = "cse",
    iot = "iot",
    aiml = "aiml",
    cybersecurity = "cybersecurity"
}
export enum SubscriptionStatus {
    premium = "premium",
    free = "free"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createDashboardUser(name: string, email: string): Promise<void>;
    createProject(title: string, domain: ProjectDomain, description: string): Promise<Project>;
    deleteUser(userId: Principal): Promise<void>;
    getAllProjects(): Promise<Array<Project>>;
    getAllProjectsByUser(): Promise<Array<Project>>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInterviewQuestions(domain: string, projectId: bigint | null): Promise<Array<string>>;
    getInterviewQuestionsByCategory(category: string, projectId: bigint | null): Promise<Array<string>>;
    getProjectTemplates(): Promise<Array<[ProjectDomain, ProjectSection]>>;
    getProjectsByUser(userId: Principal): Promise<Array<Project>>;
    getUserData(): Promise<UserProfile>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeDefaultQuestions(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProject(projectId: bigint, title: string, description: string): Promise<Project>;
    updateProjectTemplate(domain: ProjectDomain, template: ProjectSection): Promise<void>;
    upgradeSubscription(): Promise<UserProfile>;
}
