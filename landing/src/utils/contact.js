import { businessInfo } from '../data/siteData';

const normalizeField = (value) => value.trim();

export function buildWhatsAppOrderLink({
  name = '',
  phone = '',
  email = '',
  subject = '',
  message = '',
}) {
  const normalizedName = normalizeField(name);
  const normalizedPhone = normalizeField(phone);
  const normalizedEmail = normalizeField(email);
  const normalizedSubject = normalizeField(subject);
  const normalizedMessage = normalizeField(message);

  if (!normalizedName || !normalizedMessage) {
    return { error: 'Nama dan pesan wajib diisi.' };
  }

  const lines = [
    `Halo ${businessInfo.brandName}, saya ingin konsultasi pesanan bento cake.`,
    `Nama: ${normalizedName}`,
    normalizedPhone ? `Telepon: ${normalizedPhone}` : null,
    normalizedEmail ? `Email: ${normalizedEmail}` : null,
    normalizedSubject ? `Subjek: ${normalizedSubject}` : null,
    `Pesan: ${normalizedMessage}`,
  ].filter(Boolean);

  return {
    url: `https://wa.me/${businessInfo.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`,
  };
}
