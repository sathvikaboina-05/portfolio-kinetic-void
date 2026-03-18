import { useNavigate } from "@tanstack/react-router";
import { BookOpen, ChevronDown, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProjectDomain, SubscriptionStatus } from "../backend";
import UpgradeModal from "../components/UpgradeModal";
import { useGetCallerUserProfile } from "../hooks/useGetCallerUserProfile";
import { useCreateProject } from "../hooks/useQueries";

const DOMAINS = [
  { value: ProjectDomain.cse, label: "Computer Science Engineering (CSE)" },
  { value: ProjectDomain.aiml, label: "Artificial Intelligence & ML (AIML)" },
  { value: ProjectDomain.ds, label: "Data Science (DS)" },
  { value: ProjectDomain.iot, label: "Internet of Things (IoT)" },
  { value: ProjectDomain.cybersecurity, label: "Cybersecurity" },
];

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const createProject = useCreateProject();
  const { data: userProfile } = useGetCallerUserProfile();

  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState<ProjectDomain>(ProjectDomain.cse);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const isFree = userProfile?.subscriptionStatus === SubscriptionStatus.free;
  const projectsCount = Number(userProfile?.projectsCount ?? 0);

  const validate = () => {
    const newErrors: { title?: string; description?: string } = {};
    if (!title.trim()) newErrors.title = "Project title is required";
    else if (title.trim().length < 5)
      newErrors.title = "Title must be at least 5 characters";
    if (!description.trim()) newErrors.description = "Description is required";
    else if (description.trim().length < 20)
      newErrors.description = "Description must be at least 20 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Check free plan limit
    if (isFree && projectsCount >= 1) {
      setShowUpgradeModal(true);
      return;
    }

    try {
      await createProject.mutateAsync({
        title: title.trim(),
        domain,
        description: description.trim(),
      });
      toast.success("Project created successfully!");
      navigate({ to: "/dashboard/projects" });
    } catch (err: unknown) {
      const error = err as Error;
      if (error?.message?.includes("limit reached")) {
        setShowUpgradeModal(true);
      } else {
        toast.error("Failed to create project. Please try again.");
      }
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Create New Project
          </h1>
        </div>
        <p className="text-muted-foreground text-sm ml-13">
          Fill in the details below and we'll generate a complete academic
          project report for you.
        </p>
        {isFree && projectsCount >= 1 && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm text-amber-600 dark:text-amber-400">
            ⚠️ You've reached the free plan limit (1 project). Upgrade to Premium
            for unlimited projects.
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="section-card space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="proj-title" className="label-text">
              Project Title *
            </label>
            <input
              id="proj-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Smart Traffic Management System using IoT"
              className="input-field"
            />
            {errors.title && (
              <p className="text-destructive text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Domain */}
          <div>
            <label htmlFor="proj-domain" className="label-text">
              Domain *
            </label>
            <div className="relative">
              <select
                id="proj-domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value as ProjectDomain)}
                className="input-field appearance-none pr-10"
              >
                {DOMAINS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="proj-desc" className="label-text">
              Short Description *
            </label>
            <textarea
              id="proj-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project briefly. What problem does it solve? What technologies will you use?"
              rows={4}
              className="input-field resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {description.length} characters (min 20)
            </p>
            {errors.description && (
              <p className="text-destructive text-xs mt-1">
                {errors.description}
              </p>
            )}
          </div>
        </div>

        {/* What will be generated */}
        <div className="section-card">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-accent" />
            <h3 className="font-medium text-sm text-foreground">
              What will be generated
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Abstract",
              "Introduction",
              "Literature Review",
              "Methodology",
              "System Design",
              "Results",
              "Discussion",
              "References",
            ].map((s) => (
              <div
                key={s}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                {s}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={createProject.isPending || (isFree && projectsCount >= 1)}
          className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {createProject.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Content...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Project Report
            </>
          )}
        </button>
      </form>

      {showUpgradeModal && (
        <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
      )}
    </div>
  );
}
