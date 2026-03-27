import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Project, ProjectPhase, PhasePhoto, ProjectDocument, ProjectImage, ProjectWithInvestment, PhaseWithPhotos } from "@/types/project";
import { sendEventEmail, sendToProjectInvestors } from "@/lib/email";

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
      // Get old status before update
      const { data: old } = await supabase.from("projects").select("status, name, location").eq("id", id).single();

      const { data, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;

      // Email on status change
      if (updates.status && old && updates.status !== old.status) {
        const eventKey = updates.status === "completed" ? "project_completed" as const : "project_status_changed" as const;
        sendToProjectInvestors(id, eventKey, {
          project_name: old.name,
          project_location: old.location || "",
          old_status: old.status,
          new_status: updates.status,
          sale_value: String((data as Record<string, unknown>).sale_value || ""),
          dashboard_url: "https://grupomgp.com/dashboard",
        });
      }

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

      // Email on phase status change
      if (updates.status === "in_progress" || updates.status === "completed") {
        const { data: project } = await supabase.from("projects").select("name").eq("id", data.project_id).single();
        const eventKey = updates.status === "completed" ? "phase_completed" as const : "phase_started" as const;

        // Get next phase name for completed events
        let nextPhaseName = "";
        if (updates.status === "completed") {
          const { data: nextPhase } = await supabase
            .from("project_phases")
            .select("phase_name")
            .eq("project_id", data.project_id)
            .eq("phase_number", data.phase_number + 1)
            .single();
          nextPhaseName = nextPhase?.phase_name || "Finalizado";
        }

        sendToProjectInvestors(data.project_id, eventKey, {
          project_name: project?.name || "",
          phase_name: data.phase_name,
          phase_number: String(data.phase_number),
          next_phase_name: nextPhaseName,
          dashboard_url: "https://grupomgp.com/dashboard",
        });
      }

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

      // Email notification
      const { data: project } = await supabase.from("projects").select("name").eq("id", projectId).single();
      const eventKey = investorId ? "document_uploaded_private" as const : "document_uploaded" as const;

      if (investorId) {
        const { data: investor } = await supabase.from("profiles").select("full_name, email").eq("id", investorId).single();
        if (investor?.email) {
          sendEventEmail({
            eventKey,
            to: investor.email,
            recipientId: investorId,
            variables: {
              investor_name: investor.full_name,
              project_name: project?.name || "",
              document_name: name,
              document_type: documentType,
              dashboard_url: "https://grupomgp.com/dashboard",
            },
          });
        }
      } else {
        sendToProjectInvestors(projectId, eventKey, {
          project_name: project?.name || "",
          document_name: name,
          document_type: documentType,
          dashboard_url: "https://grupomgp.com/dashboard",
        });
      }
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

      // Get project and investor info for email
      const [{ data: project }, { data: investor }] = await Promise.all([
        supabase.from("projects").select("name, location").eq("id", projectId).single(),
        supabase.from("profiles").select("full_name, email").eq("id", investorId).single(),
      ]);

      if (investor?.email) {
        sendEventEmail({
          eventKey: "project_assigned",
          to: investor.email,
          recipientId: investorId,
          variables: {
            investor_name: investor.full_name,
            project_name: project?.name || "",
            project_location: project?.location || "",
            invested_amount: `$${investedAmount.toLocaleString()}`,
            investment_date: investmentDate,
            dashboard_url: "https://grupomgp.com/dashboard",
          },
        });
      }
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
