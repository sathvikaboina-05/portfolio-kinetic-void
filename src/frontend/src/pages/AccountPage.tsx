import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Crown,
  FolderOpen,
  Loader2,
  Mail,
  User,
} from "lucide-react";
import { SubscriptionStatus } from "../backend";
import { useGetCallerUserProfile } from "../hooks/useGetCallerUserProfile";

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AccountPage() {
  const navigate = useNavigate();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const isPremium =
    userProfile?.subscriptionStatus === SubscriptionStatus.premium;

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="p-6 md:p-8 text-center">
        <p className="text-muted-foreground">
          Profile not found. Please log in again.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-foreground mb-8">
        Account
      </h1>

      {/* Profile Card */}
      <div className="section-card mb-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center text-accent font-bold text-xl font-display">
            {userProfile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-foreground">
              {userProfile.name}
            </h2>
            <p className="text-muted-foreground text-sm">{userProfile.email}</p>
          </div>
          {isPremium ? (
            <span className="ml-auto inline-flex items-center gap-1.5 bg-accent/20 text-accent border border-accent/30 px-3 py-1.5 rounded-full text-sm font-semibold">
              <Crown className="w-3.5 h-3.5" />
              Premium
            </span>
          ) : (
            <span className="ml-auto inline-flex items-center bg-muted text-muted-foreground border border-border px-3 py-1.5 rounded-full text-sm font-medium">
              Free Plan
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <FolderOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Projects:</span>
            <span className="font-semibold text-foreground">
              {String(userProfile.projectsCount)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Joined:</span>
            <span className="font-semibold text-foreground">
              {formatDate(userProfile.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="section-card mb-6">
        <h3 className="font-display font-semibold text-foreground mb-4">
          Plan Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Free */}
          <div
            className={`p-4 rounded-xl border ${!isPremium ? "border-accent/50 bg-accent/5" : "border-border bg-muted/30"}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-sm text-foreground">
                Free Plan
              </span>
              {!isPremium && (
                <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
            </div>
            <ul className="space-y-2">
              {[
                { text: "1 project", ok: true },
                { text: "PDF & DOCX downloads", ok: true },
                { text: "Watermarked files", ok: false },
                { text: "PPTX access", ok: false },
              ].map((item) => (
                <li
                  key={item.text}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <CheckCircle
                    className={`w-3.5 h-3.5 flex-shrink-0 ${item.ok ? "text-accent" : "text-muted-foreground/40"}`}
                  />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Premium */}
          <div
            className={`p-4 rounded-xl border ${isPremium ? "border-accent/50 bg-accent/5" : "border-border bg-muted/30"}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-accent" />
                Premium Plan
              </span>
              {isPremium && (
                <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
            </div>
            <ul className="space-y-2">
              {[
                "Unlimited projects",
                "PDF, DOCX & PPTX",
                "No watermarks",
                "Priority support",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Upgrade CTA */}
      {!isPremium && (
        <button
          type="button"
          onClick={() => navigate({ to: "/dashboard/upgrade" })}
          className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity"
        >
          <Crown className="w-4 h-4" />
          Upgrade to Premium — ₹499/month
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {isPremium && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          🎉 You're on the Premium plan. Enjoy unlimited projects and all
          features!
        </div>
      )}
    </div>
  );
}
