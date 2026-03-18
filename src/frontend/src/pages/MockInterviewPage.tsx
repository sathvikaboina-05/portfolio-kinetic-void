import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Lock, MessageSquare, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SubscriptionStatus } from "../backend";
import {
  useGetAllProjectsByUser,
  useGetInterviewQuestions,
  useGetUserData,
} from "../hooks/useQueries";

const DOMAIN_OPTIONS = [
  { value: "dsa", label: "Data Structures & Algorithms (DSA)" },
  { value: "backend", label: "Backend Development" },
  { value: "aiml", label: "Artificial Intelligence / ML" },
  { value: "iot", label: "Internet of Things (IoT)" },
  { value: "cybersecurity", label: "Cybersecurity" },
];

export default function MockInterviewPage() {
  const { data: userData } = useGetUserData();
  const { data: projects } = useGetAllProjectsByUser();
  const isPremium = userData?.subscriptionStatus === SubscriptionStatus.premium;

  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>([]);

  const { mutate: fetchQuestions, isPending } = useGetInterviewQuestions();

  const handleGenerate = () => {
    if (!selectedDomain) {
      toast.error("Please select a domain first");
      return;
    }

    const projectId =
      selectedProjectId && selectedProjectId !== "none"
        ? BigInt(selectedProjectId)
        : null;

    fetchQuestions(
      { domain: selectedDomain, projectId },
      {
        onSuccess: (data) => {
          setQuestions(data);
          if (data.length === 0) {
            toast.info(
              "No questions found for this domain. Try initializing questions from the admin panel.",
            );
          } else {
            toast.success(`${data.length} questions generated!`);
          }
        },
        onError: (err: any) => {
          const msg = err?.message || String(err);
          if (msg.includes("Premium")) {
            toast.error("Premium subscription required for this feature.");
          } else {
            toast.error("Failed to fetch questions. Please try again.");
          }
        },
      },
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <MessageSquare className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mock Interview</h1>
          <p className="text-muted-foreground text-sm">
            Practice domain-based interview questions and project viva
          </p>
        </div>
        {isPremium && (
          <Badge className="ml-auto" variant="default">
            Premium
          </Badge>
        )}
      </div>

      {/* Premium Gate */}
      {!isPremium && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-center gap-4 py-4">
            <Lock className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-foreground">Premium Feature</p>
              <p className="text-sm text-muted-foreground">
                Upgrade to Premium to access domain-based interview questions
                and project viva preparation.
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

      {/* Configuration */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Configure Your Practice Session
          </CardTitle>
          <CardDescription>
            Select a domain and optionally link your project for viva questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="mock-domain"
                className="text-sm font-medium text-foreground"
              >
                Interview Domain *
              </label>
              <Select onValueChange={setSelectedDomain} disabled={!isPremium}>
                <SelectTrigger>
                  <SelectValue placeholder="Select domain..." />
                </SelectTrigger>
                <SelectContent>
                  {DOMAIN_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="mock-project"
                className="text-sm font-medium text-foreground"
              >
                Project (Optional — for Viva)
              </label>
              <Select
                onValueChange={setSelectedProjectId}
                disabled={!isPremium}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No project (domain only)</SelectItem>
                  {projects?.map((p) => (
                    <SelectItem key={String(p.id)} value={String(p.id)}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!isPremium || !selectedDomain || isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate Questions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Questions */}
      {questions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              Interview Questions
              <Badge variant="secondary">{questions.length} questions</Badge>
            </CardTitle>
            <CardDescription>
              Click on each question to expand and think through your answer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              {questions.map((question, index) => (
                <AccordionItem
                  key={question.slice(0, 30)}
                  value={`q-${index}`}
                  className="border border-border rounded-lg px-4 data-[state=open]:bg-muted/30"
                >
                  <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-3">
                    <span className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold mt-0.5">
                        {index + 1}
                      </span>
                      <span>{question}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-3 pl-9">
                    <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3 border border-border/50">
                      <p className="font-medium text-foreground mb-1">
                        💡 Think about:
                      </p>
                      <p>
                        Take a moment to structure your answer. Consider key
                        concepts, examples from your experience, and how to
                        explain it clearly and concisely.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {questions.length === 0 && isPremium && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground/40 mb-4" />
            <p className="font-medium text-foreground">No questions yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Select a domain above and click "Generate Questions" to start
              practicing
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
