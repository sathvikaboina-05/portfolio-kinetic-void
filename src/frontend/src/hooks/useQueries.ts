import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Project,
  ProjectDomain,
  ProjectSection,
  UserProfile,
} from "../backend";
import { useActor } from "./useActor";

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetUserData() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile>({
    queryKey: ["userData"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getUserData();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllProjectsByUser() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Project[]>({
    queryKey: ["userProjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProjectsByUser();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      domain,
      description,
    }: { title: string; domain: ProjectDomain; description: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createProject(title, domain, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProjects"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useUpdateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      title,
      description,
    }: { projectId: bigint; title: string; description: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateProject(projectId, title, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProjects"] });
    },
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });
}

export function useCreateDashboardUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, email }: { name: string; email: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createDashboardUser(name, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });
}

export function useUpgradeSubscription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.upgradeSubscription();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useGetAllUsers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useDeleteUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!actor) throw new Error("Actor not available");
      const { Principal } = await import("@dfinity/principal");
      return actor.deleteUser(Principal.fromText(userId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });
}

export function useGetAllProjects() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Project[]>({
    queryKey: ["allProjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProjects();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetProjectTemplates() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<[ProjectDomain, ProjectSection][]>({
    queryKey: ["projectTemplates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProjectTemplates();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateProjectTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      domain,
      template,
    }: { domain: ProjectDomain; template: ProjectSection }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateProjectTemplate(domain, template);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectTemplates"] });
    },
  });
}

export function useGetInterviewQuestions() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      domain,
      projectId,
    }: { domain: string; projectId: bigint | null }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.getInterviewQuestions(domain, projectId);
    },
  });
}
