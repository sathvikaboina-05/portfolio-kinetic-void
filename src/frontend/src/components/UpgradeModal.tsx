import { useNavigate } from "@tanstack/react-router";
import { CheckCircle, Crown, FileText, X, Zap } from "lucide-react";

interface UpgradeModalProps {
  onClose: () => void;
}

export default function UpgradeModal({ onClose }: UpgradeModalProps) {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate({ to: "/dashboard/upgrade" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
              <Crown className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-display font-bold text-xl text-foreground">
              Upgrade to Premium
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-muted-foreground text-sm mb-6">
          You've reached the free plan limit. Upgrade to Premium to unlock all
          features.
        </p>

        <div className="space-y-3 mb-6">
          {[
            {
              icon: <Zap className="w-4 h-4" />,
              text: "Unlimited project creation",
            },
            {
              icon: <FileText className="w-4 h-4" />,
              text: "PDF, DOCX & PPTX downloads",
            },
            {
              icon: <CheckCircle className="w-4 h-4" />,
              text: "No watermarks on any file",
            },
            { icon: <Crown className="w-4 h-4" />, text: "Priority support" },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-3 text-sm text-foreground/80"
            >
              <span className="text-accent">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-border text-foreground/70 hover:bg-muted transition-colors font-medium text-sm"
          >
            Maybe Later
          </button>
          <button
            type="button"
            onClick={handleUpgrade}
            className="flex-1 flex items-center justify-center gap-2 bg-accent text-accent-foreground font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            <Crown className="w-4 h-4" />
            Upgrade — ₹499/mo
          </button>
        </div>
      </div>
    </div>
  );
}
