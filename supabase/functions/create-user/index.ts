// Supabase Edge Function: create-user
// Lets an authenticated admin create a new employee/admin account.
// The service_role key never leaves the server.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ ok: false, error: "Method tidak diizinkan." });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey || !serviceKey) {
    return json({ ok: false, error: "Server belum dikonfigurasi." });
  }

  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    return json({ ok: false, error: "Tidak terautentikasi." });
  }

  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const {
    data: { user: caller },
    error: callerError,
  } = await adminClient.auth.getUser(token);
  if (callerError || !caller) {
    return json({ ok: false, error: "Sesi tidak valid." });
  }

  const { data: callerProfile, error: profileError } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", caller.id)
    .single();
  if (profileError || callerProfile?.role !== "admin") {
    return json({ ok: false, error: "Hanya admin yang bisa menambah akun." });
  }

  let payload: { email?: string; password?: string; role?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "Body permintaan tidak valid." });
  }

  const email = (payload.email || "").trim();
  const password = payload.password || "";
  const role = payload.role === "admin" ? "admin" : "karyawan";

  if (!email || !password) {
    return json({ ok: false, error: "Email dan password wajib diisi." });
  }
  if (password.length < 6) {
    return json({ ok: false, error: "Password minimal 6 karakter." });
  }

  const { data: created, error: createError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
  if (createError || !created?.user) {
    return json({
      ok: false,
      error: createError?.message || "Gagal membuat user.",
    });
  }

  const { error: upsertError } = await adminClient
    .from("profiles")
    .upsert({ id: created.user.id, email, role });
  if (upsertError) {
    await adminClient.auth.admin.deleteUser(created.user.id);
    return json({
      ok: false,
      error: `Gagal menyimpan profil: ${upsertError.message}`,
    });
  }

  return json({ ok: true, user: { id: created.user.id, email, role } });
});
