import { Loader2, Mail, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SubscriptionStatus, UserRole } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveCallerUserProfile } from "../hooks/useSaveCallerUserProfile";

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const saveProfile = useSaveCallerUserProfile();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email address";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !identity || !actor) return;

    const principal = identity.getPrincipal();
    const profile = {
      principal,
      name: name.trim(),
      email: email.trim(),
      role: UserRole.user,
      subscriptionStatus: SubscriptionStatus.free,
      projectsCount: BigInt(0),
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    };

    try {
      await saveProfile.mutateAsync(profile);
      // Also create dashboard user for backend tracking
      await actor.createDashboardUser(name.trim(), email.trim());
      toast.success("Profile created! Welcome to ProjectMate.");
    } catch {
      // Profile might already exist, that's okay
      toast.success("Welcome to ProjectMate!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
            <img
              src="/assets/generated/projectmate-logo.dim_256x256.png"
              alt="ProjectMate"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-foreground">
              Welcome to ProjectMate!
            </h2>
            <p className="text-sm text-muted-foreground">
              Set up your profile to get started
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="psm-name" className="label-text">
              <User className="w-3.5 h-3.5 inline mr-1" />
              Full Name
            </label>
            <input
              id="psm-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="input-field"
            />
            {errors.name && (
              <p className="text-destructive text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="psm-email" className="label-text">
              <Mail className="w-3.5 h-3.5 inline mr-1" />
              Email Address
            </label>
            <input
              id="psm-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rahul@college.edu"
              className="input-field"
            />
            {errors.email && (
              <p className="text-destructive text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={saveProfile.isPending}
            className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Setting up...
              </>
            ) : (
              "Complete Setup"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
