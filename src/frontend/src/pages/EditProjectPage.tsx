import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Edit3, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetAllProjectsByUser, useUpdateProject } from "../hooks/useQueries";

export default function EditProjectPage() {
  const navigate = useNavigate();
  const { projectId } = useParams({ from: "/dashboard/edit/$projectId" });
  const { data: projects, isLoading } = useGetAllProjectsByUser();
  const updateProject = useUpdateProject();

  const project = projects?.find((p) => String(p.id) === projectId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
    }
  }, [project]);

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
    if (!validate() || !project) return;

    try {
      await updateProject.mutateAsync({
        projectId: project.id,
        title: title.trim(),
        description: description.trim(),
      });
      toast.success("Project updated successfully!");
      navigate({ to: "/dashboard/projects" });
    } catch {
      toast.error("Failed to update project. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 md:p-8 text-center">
        <p className="text-muted-foreground">Project not found.</p>
        <button
          type="button"
          onClick={() => navigate({ to: "/dashboard/projects" })}
          className="mt-4 text-accent hover:underline text-sm"
        >
          Back to My Projects
        </button>
      </div>
    );
  }

  const domainKey =
    typeof project.domain === "object"
      ? Object.keys(project.domain)[0]
      : String(project.domain);

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto animate-fade-in">
      <button
        type="button"
        onClick={() => navigate({ to: "/dashboard/projects" })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Projects
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
            <Edit3 className="w-5 h-5 text-accent" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Edit Project
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Update your project details and regenerate the content.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="section-card space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="edit-title" className="label-text">
              Project Title *
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
            />
            {errors.title && (
              <p className="text-destructive text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Domain (read-only) */}
          <div>
            <label htmlFor="edit-domain" className="label-text">
              Domain (read-only)
            </label>
            <input
              id="edit-domain"
              type="text"
              value={domainKey.toUpperCase()}
              readOnly
              className="input-field bg-muted/50 cursor-not-allowed text-muted-foreground"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="edit-desc" className="label-text">
              Short Description *
            </label>
            <textarea
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard/projects" })}
            className="flex-1 py-3 rounded-lg border border-border text-foreground/70 hover:bg-muted transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateProject.isPending}
            className="flex-1 flex items-center justify-center gap-2 bg-accent text-accent-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {updateProject.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Update & Regenerate
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
