import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Project, ProjectPhase, PhasePhoto, ProjectDocument, ProjectImage, ProjectWithInvestment, PhaseWithPhotos } from "@/types/project";

export function useAdminProjects() {
  return useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, project_phases(*), project_investors(*, investor:profiles(full_name, email))")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ProjectWithInvestment[];
    },
  });
}

export function useAdminProjectDetail(projectId: string) {
  return useQuery({
    queryKey: ["admin-project", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, project_phases(*, phase_photos(*)), project_investors(*, investor:profiles(full_name, email)), project_documents(*), project_images(*)")
        .eq("id", projectId)
        .single();

      if (error) throw error;
      return data as ProjectWithInvestment & {
        project_phases: PhaseWithPhotos[];
        project_documents: ProjectDocument[];
      };
    },
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (project: Partial<Project>) => {
      const { data, error } = await supabase
        .from("projects")
        .insert(project)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-projects"] }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Project> & { id: string }) => {
      const { data, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      qc.invalidateQueries({ queryKey: ["admin-project", vars.id] });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-projects"] }),
  });
}

export function useUpdatePhase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProjectPhase> & { id: string }) => {
      const { data, error } = await supabase
        .from("project_phases")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["admin-project", data.project_id] });
    },
  });
}

export function useUploadPhasePhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      phaseId,
      projectId,
      file,
      caption,
    }: {
      phaseId: string;
      projectId: string;
      file: File;
      caption: string;
    }) => {
      const ext = file.name.split(".").pop();
      const path = `${projectId}/${phaseId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("project-photos")
        .upload(path, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("project-photos")
        .getPublicUrl(path);

      const { error } = await supabase.from("phase_photos").insert({
        phase_id: phaseId,
        image_url: urlData.publicUrl,
        caption,
      });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["admin-project", vars.projectId] });
    },
  });
}

export function useDeletePhasePhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase.from("phase_photos").delete().eq("id", id);
      if (error) throw error;
      return projectId;
    },
    onSuccess: (projectId) => {
      qc.invalidateQueries({ queryKey: ["admin-project", projectId] });
    },
  });
}

export function useUploadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      investorId,
      file,
      name,
      documentType,
    }: {
      projectId: string;
      investorId: string | null;
      file: File;
      name: string;
      documentType: string;
    }) => {
      const ext = file.name.split(".").pop();
      const path = `${projectId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("project-documents")
        .upload(path, file);
      if (uploadError) throw uploadError;

      const { error } = await supabase.from("project_documents").insert({
        project_id: projectId,
        investor_id: investorId,
        name,
        document_url: path,
        document_type: documentType,
      });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["admin-project", vars.projectId] });
    },
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase.from("project_documents").delete().eq("id", id);
      if (error) throw error;
      return projectId;
    },
    onSuccess: (projectId) => {
      qc.invalidateQueries({ queryKey: ["admin-project", projectId] });
    },
  });
}

export function useAssignInvestor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      investorId,
      investedAmount,
      investmentDate,
    }: {
      projectId: string;
      investorId: string;
      investedAmount: number;
      investmentDate: string;
    }) => {
      const { error } = await supabase.from("project_investors").insert({
        project_id: projectId,
        investor_id: investorId,
        invested_amount: investedAmount,
        investment_date: investmentDate,
      });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["admin-project", vars.projectId] });
    },
  });
}

export function useRemoveInvestor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase.from("project_investors").delete().eq("id", id);
      if (error) throw error;
      return projectId;
    },
    onSuccess: (projectId) => {
      qc.invalidateQueries({ queryKey: ["admin-project", projectId] });
    },
  });
}

export function useUploadProjectImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      file,
      sortOrder,
    }: {
      projectId: string;
      file: File;
      sortOrder: number;
    }) => {
      const ext = file.name.split(".").pop();
      const path = `gallery/${projectId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("project-photos")
        .upload(path, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("project-photos")
        .getPublicUrl(path);

      const { error } = await supabase.from("project_images").insert({
        project_id: projectId,
        image_url: urlData.publicUrl,
        sort_order: sortOrder,
      });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["admin-project", vars.projectId] });
    },
  });
}

export function useDeleteProjectImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase.from("project_images").delete().eq("id", id);
      if (error) throw error;
      return projectId;
    },
    onSuccess: (projectId) => {
      qc.invalidateQueries({ queryKey: ["admin-project", projectId] });
    },
  });
}
