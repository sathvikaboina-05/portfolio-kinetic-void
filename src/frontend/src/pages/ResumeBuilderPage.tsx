import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Download, FileText, Lock, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SubscriptionStatus } from "../backend";
import { useGetAllProjectsByUser, useGetUserData } from "../hooks/useQueries";
import { type ResumeData, generateResumePDF } from "../utils/generateResumePDF";

const DOMAIN_SKILLS: Record<string, string[]> = {
  cse: ["Java", "C++", "Data Structures", "Algorithms", "OOP", "SQL", "Git"],
  aiml: [
    "Python",
    "TensorFlow",
    "scikit-learn",
    "NumPy",
    "Pandas",
    "Deep Learning",
    "NLP",
  ],
  ds: [
    "Python",
    "SQL",
    "Pandas",
    "Tableau",
    "R",
    "Statistics",
    "Data Visualization",
  ],
  iot: [
    "Arduino",
    "MQTT",
    "Embedded C",
    "Raspberry Pi",
    "Sensors",
    "Node-RED",
    "C",
  ],
  cybersecurity: [
    "Ethical Hacking",
    "Firewalls",
    "Network Security",
    "Kali Linux",
    "Penetration Testing",
    "SIEM",
    "Cryptography",
  ],
};

const DOMAIN_LABELS: Record<string, string> = {
  cse: "Computer Science & Engineering",
  aiml: "AI / Machine Learning",
  ds: "Data Science",
  iot: "Internet of Things",
  cybersecurity: "Cybersecurity",
};

export default function ResumeBuilderPage() {
  const { data: userData } = useGetUserData();
  const { data: projects } = useGetAllProjectsByUser();
  const isPremium = userData?.subscriptionStatus === SubscriptionStatus.premium;

  const [form, setForm] = useState<ResumeData>({
    fullName: userData?.name || "",
    email: userData?.email || "",
    phone: "",
    degree: "",
    institution: "",
    graduationYear: "",
    projectTitle: "",
    domain: "",
    skills: "",
    careerObjective: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [_showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const handleDomainChange = (domain: string) => {
    const suggestedSkills = DOMAIN_SKILLS[domain] || [];
    setForm((prev) => ({
      ...prev,
      domain: DOMAIN_LABELS[domain] || domain,
      skills: suggestedSkills.join(", "),
    }));
  };

  const handleProjectSelect = (projectId: string) => {
    const project = projects?.find((p) => String(p.id) === projectId);
    if (project) {
      const domainKey = String(project.domain);
      setForm((prev) => ({
        ...prev,
        projectTitle: project.title,
        domain: DOMAIN_LABELS[domainKey] || domainKey,
        skills: (DOMAIN_SKILLS[domainKey] || []).join(", "),
      }));
    }
  };

  const handleDownload = async () => {
    if (!isPremium) {
      setShowUpgradePrompt(true);
      return;
    }
    if (!form.fullName) {
      toast.error("Please enter your full name");
      return;
    }
    setIsGenerating(true);
    try {
      await generateResumePDF(form);
      toast.success("Resume downloaded successfully!");
    } catch (_err) {
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Resume Builder</h1>
          <p className="text-muted-foreground text-sm">
            Create an ATS-friendly resume for your job applications
          </p>
        </div>
        {isPremium && (
          <Badge className="ml-auto" variant="default">
            Premium
          </Badge>
        )}
      </div>

      {/* Upgrade Prompt Banner */}
      {!isPremium && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-center gap-4 py-4">
            <Lock className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-foreground">Premium Feature</p>
              <p className="text-sm text-muted-foreground">
                Upgrade to Premium to download your ATS-friendly resume as PDF.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => {
                window.location.href = "/dashboard/upgrade";
              }}
            >
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Personal Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+91 9876543210"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="degree">Degree</Label>
                  <Input
                    id="degree"
                    placeholder="B.Tech / B.E. / MCA"
                    value={form.degree}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, degree: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input
                    id="graduationYear"
                    placeholder="2025"
                    value={form.graduationYear}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        graduationYear: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  placeholder="University / College Name"
                  value={form.institution}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      institution: e.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Project & Domain */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Project & Domain</CardTitle>
              <CardDescription>
                Select a saved project or enter manually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects && projects.length > 0 && (
                <div className="space-y-1.5">
                  <Label>Auto-fill from Saved Project</Label>
                  <Select onValueChange={handleProjectSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project..." />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((p) => (
                        <SelectItem key={String(p.id)} value={String(p.id)}>
                          {p.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-1.5">
                <Label>Domain</Label>
                <Select onValueChange={handleDomainChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select domain..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cse">
                      Computer Science & Engineering
                    </SelectItem>
                    <SelectItem value="aiml">AI / Machine Learning</SelectItem>
                    <SelectItem value="ds">Data Science</SelectItem>
                    <SelectItem value="iot">Internet of Things</SelectItem>
                    <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="projectTitle">Project Title</Label>
                <Input
                  id="projectTitle"
                  placeholder="Your final year project title"
                  value={form.projectTitle}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      projectTitle: e.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                Technical Skills
                <Sparkles className="w-4 h-4 text-primary" />
              </CardTitle>
              <CardDescription>
                Auto-suggested based on domain. Edit as needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Java, C++, Data Structures, SQL, Git..."
                value={form.skills}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, skills: e.target.value }))
                }
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Career Objective */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Career Objective</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="A motivated engineering graduate seeking opportunities to apply technical skills..."
                value={form.careerObjective}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    careerObjective: e.target.value,
                  }))
                }
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Download Resume</CardTitle>
              <CardDescription>ATS-optimized PDF format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isPremium ? (
                <Button
                  className="w-full"
                  onClick={handleDownload}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      window.location.href = "/dashboard/upgrade";
                    }}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Upgrade to Download
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Premium plan required for PDF download
                  </p>
                </div>
              )}

              <div className="pt-2 border-t space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Features
                </p>
                {[
                  "ATS-friendly format",
                  "Clean single-page layout",
                  "Domain-based skill suggestions",
                  "Professional typography",
                ].map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {f}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
