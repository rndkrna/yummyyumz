import { describe, expect, it } from 'vitest';
import { buildWhatsAppOrderLink } from '../utils/contact';

describe('buildWhatsAppOrderLink', () => {
  it('mengembalikan error bila nama atau pesan kosong', () => {
    expect(buildWhatsAppOrderLink({ name: '', phone: '', email: '', message: '' })).toEqual({
      error: 'Nama dan pesan wajib diisi.',
    });
  });

  it('membentuk tautan WhatsApp terformat dari data kontak', () => {
    const result = buildWhatsAppOrderLink({
      name: 'Rani',
      phone: '08123456789',
      email: 'rani@example.com',
      message: 'Saya ingin pesan bento cake tema floral.',
    });

    expect(result.error).toBeUndefined();
    expect(result.url).toContain('https://wa.me/');
    expect(decodeURIComponent(result.url)).toContain('Nama: Rani');
    expect(decodeURIComponent(result.url)).toContain('Telepon: 08123456789');
    expect(decodeURIComponent(result.url)).toContain('Email: rani@example.com');
    expect(decodeURIComponent(result.url)).toContain('Pesan: Saya ingin pesan bento cake tema floral.');
  });
});
