import { supabase } from "../lib/supabase";

const requireSupabase = () => {
  if (!supabase) {
    throw new Error("Database belum dikonfigurasi.");
  }
};

export async function fetchCurrentRole(userId) {
  requireSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data?.role || "karyawan";
}

export async function fetchAccounts() {
  requireSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,role,created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createEmployeeAccount({ email, password, role }) {
  requireSupabase();
  const { data, error } = await supabase.functions.invoke("create-user", {
    body: { email, password, role },
  });
  if (error) throw new Error(error.message || "Gagal membuat akun.");
  if (data && data.ok === false) {
    throw new Error(data.error || "Gagal membuat akun.");
  }
  return data?.user || null;
}
