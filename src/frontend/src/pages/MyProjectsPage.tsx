import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, Edit2, FolderOpen, Plus, Tag } from "lucide-react";
import { type Project, SubscriptionStatus } from "../backend";
import DownloadButtons from "../components/DownloadButtons";
import { useGetCallerUserProfile } from "../hooks/useGetCallerUserProfile";
import { useGetAllProjectsByUser } from "../hooks/useQueries";

const DOMAIN_LABELS: Record<string, string> = {
  cse: "CSE",
  aiml: "AIML",
  ds: "Data Science",
  iot: "IoT",
  cybersecurity: "Cybersecurity",
};

const DOMAIN_COLORS: Record<string, string> = {
  cse: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  aiml: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  ds: "bg-green-500/10 text-green-400 border-green-500/20",
  iot: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  cybersecurity: "bg-red-500/10 text-red-400 border-red-500/20",
};

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MyProjectsPage() {
  const navigate = useNavigate();
  const { data: projects, isLoading, error } = useGetAllProjectsByUser();
  const { data: userProfile } = useGetCallerUserProfile();
  const isPremium =
    userProfile?.subscriptionStatus === SubscriptionStatus.premium;

  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-52 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center py-16">
          <p className="text-destructive">
            Failed to load projects. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            My Projects
          </h1>
          <p className="text-muted-foreground text-sm">
            {projects?.length ?? 0} project
            {(projects?.length ?? 0) !== 1 ? "s" : ""} saved
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: "/dashboard/create" })}
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display font-semibold text-foreground mb-2">
            No projects yet
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Create your first project to get started with AI-powered report
            generation.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard/create" })}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard
              key={String(project.id)}
              project={project}
              isPremium={isPremium}
              onEdit={() =>
                navigate({
                  to: "/dashboard/edit/$projectId",
                  params: { projectId: String(project.id) },
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  isPremium,
  onEdit,
}: {
  project: Project;
  isPremium: boolean;
  onEdit: () => void;
}) {
  const domainKey =
    typeof project.domain === "object"
      ? Object.keys(project.domain)[0]
      : String(project.domain);

  return (
    <div className="section-card flex flex-col gap-4 hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display font-semibold text-foreground text-base leading-snug line-clamp-2 flex-1">
          {project.title}
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title="Edit project"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border font-medium ${DOMAIN_COLORS[domainKey] || "bg-muted text-muted-foreground border-border"}`}
        >
          <Tag className="w-3 h-3" />
          {DOMAIN_LABELS[domainKey] || domainKey.toUpperCase()}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {formatDate(project.createdAt)}
        </span>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2">
        {project.description}
      </p>

      <div className="pt-2 border-t border-border">
        <DownloadButtons project={project} isPremium={isPremium} />
      </div>
    </div>
  );
}
