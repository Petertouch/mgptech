import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
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
        .in("status", ["active", "completed"])
        .order("open_for_investment", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ProjectWithPhases[];
    },
  });
}

export interface PublicProjectsFilters {
  status: "all" | "active" | "completed";
  location: string;
  investmentType: string;
  minBedrooms: number;
  minBathrooms: number;
  priceRange: "all" | "under200" | "200to400" | "over400";
}

const PAGE_SIZE = 6;

export function usePublicProjectsPaginated(filters: PublicProjectsFilters) {
  return useInfiniteQuery({
    queryKey: ["public-projects-paginated", filters],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from("projects")
        .select("*, project_phases(*), project_images(*)", { count: "exact" })
        .eq("is_public", true)
        .in("status", ["active", "completed"])
        .order("open_for_investment", { ascending: false })
        .order("created_at", { ascending: false });

      // Server-side filters
      if (filters.status !== "all") {
        query = query.eq("status", filters.status);
      }
      if (filters.location !== "all") {
        query = query.ilike("location", `%${filters.location}%`);
      }
      if (filters.investmentType !== "all") {
        query = query.eq("investment_type", filters.investmentType);
      }
      if (filters.minBedrooms > 0) {
        query = query.gte("bedrooms", filters.minBedrooms);
      }
      if (filters.minBathrooms > 0) {
        query = query.gte("bathrooms", filters.minBathrooms);
      }
      if (filters.priceRange === "under200") {
        query = query.lt("total_value", 200000);
      } else if (filters.priceRange === "200to400") {
        query = query.gte("total_value", 200000).lte("total_value", 400000);
      } else if (filters.priceRange === "over400") {
        query = query.gt("total_value", 400000);
      }

      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        projects: data as ProjectWithPhases[],
        nextPage: (count ?? 0) > to + 1 ? pageParam + 1 : undefined,
        total: count ?? 0,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
}
