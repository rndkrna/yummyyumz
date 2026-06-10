import { businessInfo } from "../data/siteData";

const normalizeField = (value) => value.trim();

export function buildWhatsAppOrderLink({
  name = "",
  phone = "",
  email = "",
  product = "",
  flavor = "",
  eventDate = "",
  deliveryMethod = "",
  theme = "",
  referenceUrl = "",
  subject = "",
  message = "",
}) {
  const normalizedName = normalizeField(name);
  const normalizedPhone = normalizeField(phone);
  const normalizedEmail = normalizeField(email);
  const normalizedProduct = normalizeField(product);
  const normalizedFlavor = normalizeField(flavor);
  const normalizedEventDate = normalizeField(eventDate);
  const normalizedDeliveryMethod = normalizeField(deliveryMethod);
  const normalizedTheme = normalizeField(theme);
  const normalizedReferenceUrl = normalizeField(referenceUrl);
  const normalizedSubject = normalizeField(subject);
  const normalizedMessage = normalizeField(message);

  if (!normalizedName || !normalizedPhone || !normalizedMessage) {
    return { error: "Nama, nomor WhatsApp, dan catatan pesanan wajib diisi." };
  }

  const lines = [
    `Halo ${businessInfo.brandName}, saya ingin konsultasi pesanan bento cake.`,
    `Nama: ${normalizedName}`,
    `WhatsApp: ${normalizedPhone}`,
    normalizedEmail ? `Email: ${normalizedEmail}` : null,
    normalizedProduct ? `Produk: ${normalizedProduct}` : null,
    normalizedFlavor ? `Rasa: ${normalizedFlavor}` : null,
    normalizedEventDate ? `Tanggal dibutuhkan: ${normalizedEventDate}` : null,
    normalizedDeliveryMethod
      ? `Metode ambil/kirim: ${normalizedDeliveryMethod}`
      : null,
    normalizedTheme ? `Tema/warna: ${normalizedTheme}` : null,
    normalizedReferenceUrl
      ? `Referensi desain: ${normalizedReferenceUrl}`
      : null,
    normalizedSubject ? `Subjek: ${normalizedSubject}` : null,
    `Catatan pesanan: ${normalizedMessage}`,
  ].filter(Boolean);

  return {
    url: `https://wa.me/${businessInfo.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`,
  };
}

export function buildProductWhatsAppLink(product) {
  const lines = [
    `Halo ${businessInfo.brandName}, saya ingin order produk ini:`,
    `Produk: ${product.name}`,
    `Harga: ${product.price}`,
    `Deskripsi: ${product.desc}`,
    "",
    "Mohon info ketersediaan, pilihan rasa, dan estimasi pengerjaannya ya.",
  ];

  return `https://wa.me/${businessInfo.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}
