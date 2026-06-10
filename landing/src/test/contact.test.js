import { describe, expect, it } from "vitest";
import { buildWhatsAppOrderLink } from "../utils/contact";

describe("buildWhatsAppOrderLink", () => {
  it("mengembalikan error bila nama atau pesan kosong", () => {
    expect(
      buildWhatsAppOrderLink({ name: "", phone: "", email: "", message: "" }),
    ).toEqual({
      error: "Nama, nomor WhatsApp, dan catatan pesanan wajib diisi.",
    });
  });

  it("membentuk tautan WhatsApp terformat dari data kontak", () => {
    const result = buildWhatsAppOrderLink({
      name: "Rani",
      phone: "08123456789",
      email: "rani@example.com",
      product: "Velvet Rose",
      flavor: "Chocolate",
      eventDate: "2026-06-20",
      deliveryMethod: "Pickup",
      theme: "Floral pink",
      message: "Saya ingin pesan bento cake tema floral.",
    });

    expect(result.error).toBeUndefined();
    expect(result.url).toContain("https://wa.me/");
    expect(decodeURIComponent(result.url)).toContain("Nama: Rani");
    expect(decodeURIComponent(result.url)).toContain("WhatsApp: 08123456789");
    expect(decodeURIComponent(result.url)).toContain("Email: rani@example.com");
    expect(decodeURIComponent(result.url)).toContain("Produk: Velvet Rose");
    expect(decodeURIComponent(result.url)).toContain("Rasa: Chocolate");
    expect(decodeURIComponent(result.url)).toContain(
      "Tanggal dibutuhkan: 2026-06-20",
    );
    expect(decodeURIComponent(result.url)).toContain(
      "Metode ambil/kirim: Pickup",
    );
    expect(decodeURIComponent(result.url)).toContain("Tema/warna: Floral pink");
    expect(decodeURIComponent(result.url)).toContain(
      "Catatan pesanan: Saya ingin pesan bento cake tema floral.",
    );
  });
});
