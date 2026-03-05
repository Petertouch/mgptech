import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Profile } from "@/types/auth";

export function useAdminInvestors() {
  return useQuery({
    queryKey: ["admin-investors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "investor")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Profile[];
    },
  });
}

export function useAllInvestors() {
  return useQuery({
    queryKey: ["all-investors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("role", "investor")
        .order("full_name");

      if (error) throw error;
      return data as Pick<Profile, "id" | "full_name" | "email">[];
    },
  });
}

export function useCreateInvestor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      email,
      password,
      fullName,
      phone,
    }: {
      email: string;
      password: string;
      fullName: string;
      phone: string;
    }) => {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, role: "investor" },
      });

      if (error) throw error;

      // Update phone in profile
      if (data.user && phone) {
        await supabase
          .from("profiles")
          .update({ phone })
          .eq("id", data.user.id);
      }

      return data.user;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-investors"] }),
  });
}

export function useUpdateInvestor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      fullName,
      phone,
      email,
    }: {
      id: string;
      fullName: string;
      phone: string;
      email: string;
    }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, phone, email })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-investors"] }),
  });
}

export function useDeleteInvestor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-investors"] }),
  });
}
