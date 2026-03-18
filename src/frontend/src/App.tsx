import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import ProfileSetupModal from "./components/ProfileSetupModal";
import { useGetCallerUserProfile } from "./hooks/useGetCallerUserProfile";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import AccountPage from "./pages/AccountPage";
import AdminDashboard from "./pages/AdminDashboard";
import CreateProjectPage from "./pages/CreateProjectPage";
import EditProjectPage from "./pages/EditProjectPage";
import LandingPage from "./pages/LandingPage";
import MockInterviewPage from "./pages/MockInterviewPage";
import MyProjectsPage from "./pages/MyProjectsPage";
import ResumeBuilderPage from "./pages/ResumeBuilderPage";
import StudentDashboard from "./pages/StudentDashboard";
import TemplateEditorPage from "./pages/TemplateEditorPage";
import UpgradePage from "./pages/UpgradePage";
import UserManagementPage from "./pages/UserManagementPage";

const queryClient = new QueryClient();

function RootLayout() {
  const { identity } = useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      <Outlet />
      {showProfileSetup && <ProfileSetupModal />}
      <Toaster richColors position="top-right" />
    </>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: StudentDashboard,
});

const createProjectRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/create",
  component: CreateProjectPage,
});

const myProjectsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/projects",
  component: MyProjectsPage,
});

const editProjectRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/edit/$projectId",
  component: EditProjectPage,
});

const accountRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/account",
  component: AccountPage,
});

const upgradeRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/upgrade",
  component: UpgradePage,
});

const resumeBuilderRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/resume",
  component: ResumeBuilderPage,
});

const mockInterviewRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/interview",
  component: MockInterviewPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboard,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/users",
  component: UserManagementPage,
});

const adminTemplatesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/templates",
  component: TemplateEditorPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute.addChildren([
    createProjectRoute,
    myProjectsRoute,
    editProjectRoute,
    accountRoute,
    upgradeRoute,
    resumeBuilderRoute,
    mockInterviewRoute,
  ]),
  adminRoute.addChildren([adminUsersRoute, adminTemplatesRoute]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
