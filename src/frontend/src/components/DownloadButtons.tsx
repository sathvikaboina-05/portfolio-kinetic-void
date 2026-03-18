import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2, Presentation } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type Project, SubscriptionStatus } from "../backend";
import { generateDOCX } from "../utils/generateDOCX";
import { generatePDF } from "../utils/generatePDF";
import { generatePPTX } from "../utils/generatePPTX";

interface DownloadButtonsProps {
  project: Project;
  isPremium: boolean;
}

export default function DownloadButtons({
  project,
  isPremium,
}: DownloadButtonsProps) {
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loadingDOCX, setLoadingDOCX] = useState(false);
  const [loadingPPTX, setLoadingPPTX] = useState(false);
  const [loadingIEEEPDF, setLoadingIEEEPDF] = useState(false);
  const [loadingIEEEDOCX, setLoadingIEEEDOCX] = useState(false);

  const handlePDF = async () => {
    setLoadingPDF(true);
    try {
      await generatePDF(project, isPremium, "standard");
      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to generate PDF");
    } finally {
      setLoadingPDF(false);
    }
  };

  const handleDOCX = () => {
    setLoadingDOCX(true);
    try {
      generateDOCX(project, isPremium, "standard");
      toast.success("DOCX downloaded!");
    } catch {
      toast.error("Failed to generate DOCX");
    } finally {
      setLoadingDOCX(false);
    }
  };

  const handlePPTX = async () => {
    setLoadingPPTX(true);
    try {
      await generatePPTX(project, isPremium);
      toast.success("PPTX downloaded!");
    } catch {
      toast.error("Failed to generate PPTX");
    } finally {
      setLoadingPPTX(false);
    }
  };

  const handleIEEEPDF = async () => {
    setLoadingIEEEPDF(true);
    try {
      await generatePDF(project, isPremium, "ieee");
      toast.success("IEEE PDF downloaded!");
    } catch {
      toast.error("Failed to generate IEEE PDF");
    } finally {
      setLoadingIEEEPDF(false);
    }
  };

  const handleIEEEDOCX = () => {
    setLoadingIEEEDOCX(true);
    try {
      generateDOCX(project, isPremium, "ieee");
      toast.success("IEEE DOCX downloaded!");
    } catch {
      toast.error("Failed to generate IEEE DOCX");
    } finally {
      setLoadingIEEEDOCX(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Standard Downloads */}
      <Button
        variant="outline"
        size="sm"
        onClick={handlePDF}
        disabled={loadingPDF}
      >
        {loadingPDF ? (
          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
        ) : (
          <FileText className="w-3.5 h-3.5 mr-1.5" />
        )}
        PDF
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleDOCX}
        disabled={loadingDOCX}
      >
        {loadingDOCX ? (
          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
        ) : (
          <Download className="w-3.5 h-3.5 mr-1.5" />
        )}
        DOCX
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handlePPTX}
        disabled={loadingPPTX}
      >
        {loadingPPTX ? (
          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
        ) : (
          <Presentation className="w-3.5 h-3.5 mr-1.5" />
        )}
        PPTX
      </Button>

      {/* IEEE Format Downloads */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleIEEEPDF}
        disabled={loadingIEEEPDF}
        className="border-blue-500/40 text-blue-600 hover:bg-blue-500/10 dark:text-blue-400"
      >
        {loadingIEEEPDF ? (
          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
        ) : (
          <FileText className="w-3.5 h-3.5 mr-1.5" />
        )}
        IEEE PDF
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleIEEEDOCX}
        disabled={loadingIEEEDOCX}
        className="border-blue-500/40 text-blue-600 hover:bg-blue-500/10 dark:text-blue-400"
      >
        {loadingIEEEDOCX ? (
          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
        ) : (
          <Download className="w-3.5 h-3.5 mr-1.5" />
        )}
        IEEE DOCX
      </Button>
    </div>
  );
}
