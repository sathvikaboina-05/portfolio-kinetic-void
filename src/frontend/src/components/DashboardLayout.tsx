import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Crown,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PlusCircle,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { SubscriptionStatus } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetUserData } from "../hooks/useQueries";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const studentNavItems: NavItem[] = [
  {
    label: "Create Project",
    path: "/dashboard/create",
    icon: <PlusCircle className="w-4 h-4" />,
  },
  {
    label: "My Projects",
    path: "/dashboard/projects",
    icon: <FolderOpen className="w-4 h-4" />,
  },
  {
    label: "Resume Builder",
    path: "/dashboard/resume",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    label: "Mock Interview",
    path: "/dashboard/interview",
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    label: "Account",
    path: "/dashboard/account",
    icon: <User className="w-4 h-4" />,
  },
  {
    label: "Upgrade",
    path: "/dashboard/upgrade",
    icon: <Crown className="w-4 h-4" />,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userData } = useGetUserData();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  const isPremium = userData?.subscriptionStatus === SubscriptionStatus.premium;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/assets/generated/projectmate-logo.dim_256x256.png"
            alt="ProjectMate"
            className="w-8 h-8 rounded-lg"
          />
          <span className="font-bold text-foreground text-lg">ProjectMate</span>
        </Link>
      </div>

      {/* User Info */}
      {userData && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {userData.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {userData.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userData.email}
              </p>
            </div>
            {isPremium && (
              <Badge variant="default" className="text-xs shrink-0">
                Pro
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {studentNavItems.map((item) => {
          const isActive =
            currentPath === item.path ||
            currentPath.startsWith(`${item.path}/`);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setMobileOpen(false);
            }}
            role="presentation"
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-card border-r border-border flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <span className="font-bold text-foreground">ProjectMate</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
