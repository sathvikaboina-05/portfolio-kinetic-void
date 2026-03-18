import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileEdit,
  Loader2,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProjectDomain, type ProjectSection } from "../backend";
import {
  useGetProjectTemplates,
  useUpdateProjectTemplate,
} from "../hooks/useQueries";

const DOMAINS = [
  { value: ProjectDomain.cse, label: "Computer Science Engineering (CSE)" },
  { value: ProjectDomain.aiml, label: "Artificial Intelligence & ML (AIML)" },
  { value: ProjectDomain.ds, label: "Data Science (DS)" },
  { value: ProjectDomain.iot, label: "Internet of Things (IoT)" },
  { value: ProjectDomain.cybersecurity, label: "Cybersecurity" },
];

const SECTION_FIELDS: { key: keyof ProjectSection; label: string }[] = [
  { key: "abstract", label: "Abstract" },
  { key: "introduction", label: "Introduction" },
  { key: "literature_review", label: "Literature Review" },
  { key: "methodology", label: "Methodology" },
  { key: "system_design", label: "System Design" },
  { key: "results", label: "Results" },
  { key: "discussion", label: "Discussion" },
  { key: "references", label: "References" },
];

const DEFAULT_TEMPLATE: ProjectSection = {
  abstract: "",
  introduction: "",
  literature_review: "",
  methodology: "",
  system_design: "",
  results: "",
  discussion: "",
  references: "",
};

export default function TemplateEditorPage() {
  const { data: templates, isLoading, error } = useGetProjectTemplates();
  const updateTemplate = useUpdateProjectTemplate();

  const [selectedDomain, setSelectedDomain] = useState<ProjectDomain>(
    ProjectDomain.cse,
  );
  const [formData, setFormData] = useState<ProjectSection>(DEFAULT_TEMPLATE);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["abstract"]),
  );

  useEffect(() => {
    if (templates) {
      const domainKey = selectedDomain;
      const existing = templates.find(([d]) => {
        const key = typeof d === "object" ? Object.keys(d)[0] : String(d);
        return key === domainKey;
      });
      if (existing) {
        setFormData(existing[1]);
      } else {
        setFormData(DEFAULT_TEMPLATE);
      }
    }
  }, [templates, selectedDomain]);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSave = async () => {
    try {
      await updateTemplate.mutateAsync({
        domain: selectedDomain,
        template: formData,
      });
      toast.success("Template saved successfully!");
    } catch {
      toast.error("Failed to save template. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-3" />
        <p className="text-destructive font-medium">
          Access denied or failed to load templates.
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          Only admins can edit templates.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-accent/20 rounded-xl flex items-center justify-center">
              <FileEdit className="w-4 h-4 text-accent" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Template Editor
            </h1>
          </div>
          <p className="text-muted-foreground text-sm ml-12">
            Edit the AI content generation templates per domain.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={updateTemplate.isPending}
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {updateTemplate.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Template
        </button>
      </div>

      {/* Domain selector */}
      <div className="section-card mb-6">
        <label htmlFor="domain-group" className="label-text">
          Select Domain
        </label>
        <div id="domain-group" className="flex flex-wrap gap-2">
          {DOMAINS.map((d) => (
            <button
              type="button"
              key={d.value}
              onClick={() => setSelectedDomain(d.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                selectedDomain === d.value
                  ? "bg-accent/20 text-accent border-accent/40"
                  : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/60"
              }`}
            >
              {d.label.split(" (")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Section editors */}
      <div className="space-y-3">
        {SECTION_FIELDS.map(({ key, label }) => (
          <div key={key} className="section-card p-0 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection(key)}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-colors"
            >
              <span className="font-medium text-foreground text-sm">
                {label}
              </span>
              {expandedSections.has(key) ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            {expandedSections.has(key) && (
              <div className="px-5 pb-4 border-t border-border">
                <textarea
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  rows={4}
                  placeholder={`Enter template text for ${label}...`}
                  className="input-field resize-none mt-3"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData[key].length} characters
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={updateTemplate.isPending}
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {updateTemplate.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Template
        </button>
      </div>
    </div>
  );
}
