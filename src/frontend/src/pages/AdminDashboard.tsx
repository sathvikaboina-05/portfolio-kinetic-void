import { Skeleton } from "@/components/ui/skeleton";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  FileEdit,
  FolderOpen,
  IndianRupee,
  LayoutDashboard,
  Loader2,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SubscriptionStatus, UserRole } from "../backend";
import AccessDeniedScreen from "../components/AccessDeniedScreen";
import { useGetCallerUserProfile } from "../hooks/useGetCallerUserProfile";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetAllProjects, useGetAllUsers } from "../hooks/useQueries";

export default function AdminDashboard() {
  const { identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { data: userProfile, isLoading: profileLoading } =
    useGetCallerUserProfile();
  const { data: users, isLoading: usersLoading } = useGetAllUsers();
  const { data: projects, isLoading: projectsLoading } = useGetAllProjects();

  useEffect(() => {
    if (!isInitializing && !identity) {
      navigate({ to: "/" });
    }
  }, [identity, isInitializing, navigate]);

  if (isInitializing || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!identity) return null;

  if (userProfile && userProfile.role !== UserRole.admin) {
    return <AccessDeniedScreen />;
  }

  const premiumUsers =
    users?.filter((u) => u.subscriptionStatus === SubscriptionStatus.premium) ??
    [];
  const revenue = premiumUsers.length * 499;

  const navItems = [
    {
      label: "Overview",
      path: "/admin",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: <Users className="w-4 h-4" />,
    },
    {
      label: "Templates",
      path: "/admin/templates",
      icon: <FileEdit className="w-4 h-4" />,
    },
  ];

  const isOverview = currentPath === "/admin";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent/20 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-accent" />
          </div>
          <div>
            <span className="font-display font-bold text-sidebar-foreground text-sm">
              Admin Panel
            </span>
            <p className="text-xs text-sidebar-foreground/50">ProjectMate</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.path}
            onClick={() => navigate({ to: item.path as "/admin" })}
            className={`sidebar-link w-full text-left ${
              currentPath === item.path
                ? "sidebar-link-active"
                : "sidebar-link-inactive"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
        <div className="pt-4 border-t border-sidebar-border mt-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="sidebar-link w-full text-left sidebar-link-inactive"
          >
            <LayoutDashboard className="w-4 h-4" />
            Student Dashboard
          </button>
        </div>
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 flex-col bg-sidebar border-r border-sidebar-border flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center gap-3 px-4 h-14 border-b border-border bg-card flex-shrink-0">
          <Shield className="w-5 h-5 text-accent" />
          <span className="font-display font-bold text-foreground">
            Admin Panel
          </span>
        </header>

        {/* Mobile nav */}
        <div className="md:hidden flex gap-1 px-3 py-2 border-b border-border bg-card overflow-x-auto">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.path}
              onClick={() => navigate({ to: item.path as "/admin" })}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                currentPath === item.path
                  ? "bg-accent/20 text-accent"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <main className="flex-1 overflow-y-auto">
          {isOverview ? (
            <div className="p-6 md:p-8 animate-fade-in">
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                Admin Overview
              </h1>
              <p className="text-muted-foreground text-sm mb-8">
                Platform statistics and management tools.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                <StatCard
                  icon={<Users className="w-5 h-5" />}
                  label="Total Users"
                  value={usersLoading ? null : String(users?.length ?? 0)}
                  sub={`${premiumUsers.length} premium`}
                  color="text-blue-400"
                  bg="bg-blue-500/10"
                />
                <StatCard
                  icon={<FolderOpen className="w-5 h-5" />}
                  label="Total Projects"
                  value={projectsLoading ? null : String(projects?.length ?? 0)}
                  sub="across all users"
                  color="text-accent"
                  bg="bg-accent/10"
                />
                <StatCard
                  icon={<IndianRupee className="w-5 h-5" />}
                  label="Simulated Revenue"
                  value={
                    usersLoading ? null : `₹${revenue.toLocaleString("en-IN")}`
                  }
                  sub={`${premiumUsers.length} × ₹499`}
                  color="text-green-400"
                  bg="bg-green-500/10"
                />
              </div>

              {/* Quick links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <QuickLink
                  icon={<Users className="w-5 h-5 text-blue-400" />}
                  title="Manage Users"
                  desc="View, manage, and delete user accounts"
                  onClick={() => navigate({ to: "/admin/users" })}
                />
                <QuickLink
                  icon={<FileEdit className="w-5 h-5 text-accent" />}
                  title="Edit Templates"
                  desc="Customize AI content generation templates per domain"
                  onClick={() => navigate({ to: "/admin/templates" })}
                />
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  sub: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="section-card">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      {value === null ? (
        <Skeleton className="h-8 w-24 mb-1" />
      ) : (
        <p className="font-display text-2xl font-bold text-foreground mb-1">
          {value}
        </p>
      )}
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function QuickLink({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="section-card text-left hover:shadow-card-hover hover:border-accent/30 transition-all group"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent/10 transition-colors">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
    </button>
  );
}
