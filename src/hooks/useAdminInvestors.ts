import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/auth";
import { sendEventEmail } from "@/lib/email";

const SUPABASE_URL = "https://ngklmluckyetcshnzpgv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5na2xtbHVja3lldGNzaG56cGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTcyOTEsImV4cCI6MjA5MDEzMzI5MX0.Gax424G3QueolbPjTkfmVGOZbBfVVDnpLacZ15KolKA";

async function callAdminUsers(action: string, payload: Record<string, unknown>) {
  // Force token refresh to ensure valid session
  const { data: { session }, error: sessionError } = await supabase.auth.refreshSession();

  if (sessionError || !session) {
    throw new Error("Sesión expirada. Por favor, cierra sesión y vuelve a entrar.");
  }

  const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ action, ...payload }),
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result;
}

export function useAdminInvestors() {
  return useQuery({
    queryKey: ["admin-investors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
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
      const result = await callAdminUsers("create", { email, password, fullName, phone });

      // Send welcome email
      sendEventEmail({
        eventKey: "investor_welcome",
        to: email,
        recipientId: result.user?.id,
        variables: {
          investor_name: fullName,
          investor_email: email,
          login_url: "https://grupomgp.com/login",
        },
      });

      return result.user;
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
      password,
    }: {
      id: string;
      fullName: string;
      phone: string;
      email: string;
      password?: string;
    }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, phone, email })
        .eq("id", id);
      if (error) throw error;

      // Update password if provided
      if (password && password.length >= 6) {
        await callAdminUsers("update_password", { userId: id, password });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-investors"] }),
  });
}

export function useDeleteInvestor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await callAdminUsers("delete", { userId: id });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-investors"] }),
  });
}
