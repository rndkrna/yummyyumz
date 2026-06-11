import { isSupabaseConfigured, supabase } from "../lib/supabase";

const productColumns =
  "id,name,description,price,image_url,is_featured,is_available,card_color,accent_color,sort_order,created_at";
const momentColumns =
  "id,title,caption,tag,event_date,target,actual,image_url,is_published,sort_order,created_at";
const orderColumns = "id,created_at,customer,product,items,status,total,note";
const financeColumns =
  "id,created_at,type,category,label,amount,transaction_date";

export const dashboardRemoteEnabled = isSupabaseConfigured;

const requireSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase belum dikonfigurasi.");
  }
};

export async function fetchDashboardData() {
  requireSupabase();

  const [products, moments, orders, finances] = await Promise.all([
    supabase
      .from("products")
      .select(productColumns)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("moments")
      .select(momentColumns)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select(orderColumns)
      .order("created_at", { ascending: false }),
    supabase
      .from("finance_records")
      .select(financeColumns)
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  const firstError = [products, moments, orders, finances].find(
    (result) => result.error,
  )?.error;
  if (firstError) throw firstError;

  return {
    products: products.data || [],
    moments: moments.data || [],
    orders: orders.data || [],
    finances: finances.data || [],
  };
}

export async function insertProduct(product) {
  requireSupabase();
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select(productColumns)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id) {
  requireSupabase();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function insertMoment(moment) {
  requireSupabase();
  const { data, error } = await supabase
    .from("moments")
    .insert(moment)
    .select(momentColumns)
    .single();
  if (error) throw error;
  return data;
}

export async function insertOrder(order) {
  requireSupabase();
  const { data, error } = await supabase
    .from("orders")
    .insert(order)
    .select(orderColumns)
    .single();
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id, status) {
  requireSupabase();
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select(orderColumns)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteOrder(id) {
  requireSupabase();
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw error;
}

export async function insertFinanceRecord(record) {
  requireSupabase();
  const { data, error } = await supabase
    .from("finance_records")
    .insert(record)
    .select(financeColumns)
    .single();
  if (error) throw error;
  return data;
}
