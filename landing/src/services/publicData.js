import { supabase, isSupabaseConfigured } from "../lib/supabase";
import {
  catalogProducts,
  featuredProducts,
  momentSlides,
} from "../data/siteData";

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const mapProduct = (product, index = 0) => {
  let displayPrice = product.price;
  if (typeof product.price === "number") {
    displayPrice = formatCurrency(product.price);
  } else if (typeof product.price === "string" && /^\d+$/.test(product.price.trim())) {
    displayPrice = formatCurrency(Number(product.price.trim()));
  }

  return {
    id: product.id,
    name: product.name,
    title: product.name,
    desc: product.description || product.desc || "Produk YummyYumz",
    price: displayPrice,
    img: product.image_url || product.img || "",
    color:
      product.card_color ||
      ["bg-bakeryPeach", "bg-[#f5f5f5]", "bg-[#e8f0e6]"][index % 3],
    accent: product.accent_color || "bg-bakeryBerry",
    isFeatured: product.is_featured ?? true,
  };
};

const mapMoment = (moment) => ({
  id: moment.id,
  title: moment.title,
  caption: moment.caption,
  image: moment.image_url || moment.image,
  tag: moment.tag,
});

export async function getPublicProducts() {
  if (!isSupabaseConfigured) {
    return {
      catalog: catalogProducts,
      featured: featuredProducts,
      source: "fallback",
    };
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,description,price,image_url,is_featured,card_color,accent_color,sort_order,is_available",
    )
    .eq("is_available", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return {
      catalog: catalogProducts,
      featured: featuredProducts,
      source: "fallback",
      error,
    };
  }

  const products = data.map(mapProduct);

  return {
    catalog: products,
    featured: products.filter((product) => product.isFeatured).slice(0, 8),
    source: "supabase",
  };
}

export async function createPublicOrder(values) {
  if (!isSupabaseConfigured) {
    return { source: "fallback" };
  }

  const product = values.product || values.subject || "Konsultasi custom cake";
  const noteParts = [
    values.message,
    values.price ? `Harga katalog: ${values.price}` : null,
    values.desc ? `Deskripsi produk: ${values.desc}` : null,
    values.flavor ? `Rasa: ${values.flavor}` : null,
    values.eventDate ? `Tanggal: ${values.eventDate}` : null,
    values.deliveryMethod ? `Metode: ${values.deliveryMethod}` : null,
    values.theme ? `Tema: ${values.theme}` : null,
    values.referenceUrl ? `Referensi: ${values.referenceUrl}` : null,
    values.phone ? `WhatsApp pelanggan: ${values.phone}` : null,
    values.email ? `Email: ${values.email}` : null,
  ].filter(Boolean);

  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer: values.name || "Pengunjung landing",
      product,
      items: 1,
      status: "Menunggu",
      total: 0,
      note: noteParts.join("\n"),
    })
    .select("id")
    .single();

  if (error) {
    return { source: "fallback", error };
  }

  return { source: "supabase", orderId: data.id };
}

export async function getPublicMoments() {
  if (!isSupabaseConfigured) {
    return { moments: momentSlides, source: "fallback" };
  }

  const { data, error } = await supabase
    .from("moments")
    .select("id,title,caption,tag,image_url,sort_order,is_published")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return { moments: momentSlides, source: "fallback", error };
  }

  return { moments: data.map(mapMoment), source: "supabase" };
}
