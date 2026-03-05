import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { ProjectWithPhases, ProjectDocument, PhaseWithPhotos } from "@/types/project";

export function useInvestorProjects(userId: string | undefined) {
  return useQuery({
    queryKey: ["investor-projects", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_investors")
        .select(`
          invested_amount,
          investment_date,
          project:projects(*, project_phases(*))
        `)
        .eq("investor_id", userId!);

      if (error) throw error;
      return data as { invested_amount: number; investment_date: string; project: ProjectWithPhases }[];
    },
    enabled: !!userId,
  });
}

export function useProjectDetail(projectId: string) {
  return useQuery({
    queryKey: ["project-detail", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, project_phases(*, phase_photos(*))")
        .eq("id", projectId)
        .single();

      if (error) throw error;
      return data as ProjectWithPhases & { project_phases: PhaseWithPhotos[] };
    },
    enabled: !!projectId,
  });
}

export function useProjectInvestment(projectId: string, userId: string | undefined) {
  return useQuery({
    queryKey: ["project-investment", projectId, userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_investors")
        .select("*")
        .eq("project_id", projectId)
        .eq("investor_id", userId!)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!projectId && !!userId,
  });
}

export function useProjectDocuments(projectId: string, userId: string | undefined) {
  return useQuery({
    queryKey: ["project-documents", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_documents")
        .select("*")
        .eq("project_id", projectId)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      return data as ProjectDocument[];
    },
    enabled: !!projectId && !!userId,
  });
}

export function usePublicProjects() {
  return useQuery({
    queryKey: ["public-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, project_phases(*), project_images(*)")
        .eq("is_public", true)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ProjectWithPhases[];
    },
  });
}
