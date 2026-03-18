import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  Crown,
  FileText,
  Loader2,
  Shield,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUpgradeSubscription } from "../hooks/useQueries";

export default function UpgradePage() {
  const navigate = useNavigate();
  const upgradeSubscription = useUpgradeSubscription();
  const [paymentStep, setPaymentStep] = useState<
    "plan" | "processing" | "success"
  >("plan");

  const handlePayment = async () => {
    setPaymentStep("processing");
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      await upgradeSubscription.mutateAsync();
      setPaymentStep("success");
      toast.success("🎉 Welcome to Premium! Your subscription is now active.");
      setTimeout(() => navigate({ to: "/dashboard/account" }), 2500);
    } catch {
      setPaymentStep("plan");
      toast.error("Payment failed. Please try again.");
    }
  };

  if (paymentStep === "success") {
    return (
      <div className="p-6 md:p-8 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6">
          <Crown className="w-10 h-10 text-accent" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          You're Premium!
        </h2>
        <p className="text-muted-foreground text-center mb-4">
          Your subscription is now active. Enjoy unlimited projects and all
          premium features.
        </p>
        <div className="flex items-center gap-2 text-accent text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Redirecting to account...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-lg mx-auto animate-fade-in">
      <button
        type="button"
        onClick={() => navigate({ to: "/dashboard/account" })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Account
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-accent" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Upgrade to Premium
        </h1>
        <p className="text-muted-foreground">
          Unlock the full power of ProjectMate
        </p>
      </div>

      {/* Plan Card */}
      <div className="section-card border-2 border-accent/40 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-xl text-foreground">
              Premium Plan
            </h2>
            <p className="text-muted-foreground text-sm">Billed monthly</p>
          </div>
          <div className="text-right">
            <p className="font-display font-bold text-3xl text-foreground">
              ₹499
            </p>
            <p className="text-muted-foreground text-xs">/month</p>
          </div>
        </div>

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
              icon: <Shield className="w-4 h-4" />,
              text: "No watermarks on any file",
            },
            { icon: <Crown className="w-4 h-4" />, text: "Priority support" },
            {
              icon: <CheckCircle className="w-4 h-4" />,
              text: "All domains (CSE, AIML, DS, IoT, Cybersecurity)",
            },
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

        <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground mb-4">
          🔒 This is a simulated payment for demonstration purposes. No real
          payment will be processed.
        </div>

        <button
          type="button"
          onClick={handlePayment}
          disabled={paymentStep === "processing"}
          className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground font-bold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-base"
        >
          {paymentStep === "processing" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <Crown className="w-5 h-5" />
              Pay ₹499 — Activate Premium
            </>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        By upgrading, you agree to our terms of service. Cancel anytime.
      </p>
    </div>
  );
}
