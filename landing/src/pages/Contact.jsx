import { useState } from "react";
import Footer from "../components/sections/Footer";
import { businessInfo } from "../data/siteData";
import { createPublicOrder } from "../services/publicData";
import { buildWhatsAppOrderLink } from "../utils/contact";

export default function Contact() {
  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    email: "",
    product: "",
    flavor: "",
    eventDate: "",
    deliveryMethod: "Pickup",
    theme: "",
    referenceUrl: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = buildWhatsAppOrderLink(formValues);

    if (result.error) {
      setFormStatus(result.error);
      return;
    }

    const orderResult = await createPublicOrder(formValues);

    setFormStatus(
      orderResult.source === "supabase"
        ? "Order tercatat di dashboard admin. WhatsApp dibuka untuk konfirmasi ke admin."
        : "Pesanan siap dikirim. WhatsApp dibuka untuk konfirmasi ke admin.",
    );
    window.open(result.url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <main className="overflow-x-hidden bg-[#E7F2B7] pt-28 md:pt-32">
        <section className="px-4 pb-16 md:px-16 md:pb-24">
          <div className="mx-auto grid max-w-[1500px] min-w-0 gap-8 md:grid-cols-[0.9fr_1.1fr]">
            <div className="min-w-0 overflow-hidden rounded-[1.75rem] border-3 border-bakeryText bg-bakeryBerry p-6 text-white shadow-[8px_8px_0px_0px_rgba(74,62,61,1)] md:rounded-[2.5rem] md:border-4 md:p-12 md:shadow-[14px_14px_0px_0px_rgba(74,62,61,1)]">
              <span className="font-body text-xs font-bold uppercase tracking-[0.3em] text-[#E7F2B7]">
                Contact & Order
              </span>
              <h1 className="mt-5 max-w-full break-words font-display text-[clamp(2.25rem,14vw,4.2rem)] font-extrabold uppercase leading-[0.9] tracking-tight md:text-[clamp(2.8rem,6vw,5.5rem)]">
                Pesan cake
                <br />
                spesialmu.
              </h1>
              <p className="mt-6 max-w-lg font-body text-sm font-medium leading-relaxed text-[#E7F2B7] md:text-base">
                Ceritakan rasa, tanggal, tema, atau referensi desain yang Anda
                inginkan. Setelah form diisi, kami siapkan pesan WhatsApp agar
                proses order lebih cepat.
              </p>

              <div className="mt-8 min-w-0 rounded-[1.5rem] border-3 border-bakeryText bg-[#E7F2B7] p-5 text-bakeryText md:mt-10 md:rounded-[2rem] md:border-4 md:p-6">
                <h2 className="font-display text-2xl font-bold uppercase text-bakeryBerry">
                  Info singkat
                </h2>
                <ul className="mt-5 space-y-3 font-body text-sm font-medium md:text-base">
                  {businessInfo.openingHours.map((item) => (
                    <li
                      key={item.label}
                      className="flex flex-col gap-1 border-b-2 border-bakeryText/20 pb-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    >
                      <span>{item.label}</span>
                      <span>{item.hours}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 break-words font-body text-sm leading-relaxed text-bakeryText/80">
                  {businessInfo.addressLines.join(", ")}
                </p>
              </div>
            </div>

            <div className="min-w-0 overflow-hidden rounded-[1.75rem] border-3 border-bakeryText bg-white p-6 shadow-[8px_8px_0px_0px_rgba(74,62,61,1)] md:rounded-[2.5rem] md:border-4 md:p-12 md:shadow-[14px_14px_0px_0px_rgba(74,62,61,1)]">
              <form
                className="flex min-w-0 flex-col gap-6 md:gap-7"
                onSubmit={handleSubmit}
              >
                <div className="grid gap-7 md:grid-cols-2">
                  <label className="flex flex-col gap-3 font-body text-sm font-bold uppercase tracking-[0.18em] text-bakeryBerry">
                    Nama
                    <input
                      name="name"
                      type="text"
                      value={formValues.name}
                      onChange={handleChange}
                      placeholder="Nama Anda"
                      className="rounded-2xl border-2 border-bakeryText bg-bakeryBg px-5 py-4 font-body text-base font-medium normal-case tracking-normal text-bakeryText outline-none transition-colors focus:border-bakeryBerry"
                    />
                  </label>
                  <label className="flex flex-col gap-3 font-body text-sm font-bold uppercase tracking-[0.18em] text-bakeryBerry">
                    Telepon
                    <input
                      name="phone"
                      type="tel"
                      value={formValues.phone}
                      onChange={handleChange}
                      placeholder="Nomor WhatsApp"
                      className="rounded-2xl border-2 border-bakeryText bg-bakeryBg px-5 py-4 font-body text-base font-medium normal-case tracking-normal text-bakeryText outline-none transition-colors focus:border-bakeryBerry"
                    />
                  </label>
                </div>

                <div className="grid gap-7 md:grid-cols-2">
                  <label className="flex flex-col gap-3 font-body text-sm font-bold uppercase tracking-[0.18em] text-bakeryBerry">
                    Email
                    <input
                      name="email"
                      type="email"
                      value={formValues.email}
                      onChange={handleChange}
                      placeholder="Alamat email opsional"
                      className="rounded-2xl border-2 border-bakeryText bg-bakeryBg px-5 py-4 font-body text-base font-medium normal-case tracking-normal text-bakeryText outline-none transition-colors focus:border-bakeryBerry"
                    />
                  </label>
                  <label className="flex flex-col gap-3 font-body text-sm font-bold uppercase tracking-[0.18em] text-bakeryBerry">
                    Produk
                    <input
                      name="product"
                      type="text"
                      value={formValues.product}
                      onChange={handleChange}
                      placeholder="Mis. Velvet Rose / custom"
                      className="rounded-2xl border-2 border-bakeryText bg-bakeryBg px-5 py-4 font-body text-base font-medium normal-case tracking-normal text-bakeryText outline-none transition-colors focus:border-bakeryBerry"
                    />
                  </label>
                </div>

                <div className="grid gap-7 md:grid-cols-2">
                  <label className="flex flex-col gap-3 font-body text-sm font-bold uppercase tracking-[0.18em] text-bakeryBerry">
                    Rasa
                    <select
                      name="flavor"
                      value={formValues.flavor}
                      onChange={handleChange}
                      className="rounded-2xl border-2 border-bakeryText bg-bakeryBg px-5 py-4 font-body text-base font-medium normal-case tracking-normal text-bakeryText outline-none transition-colors focus:border-bakeryBerry"
                    >
                      <option value="">Pilih rasa</option>
                      <option value="Chocolate">Chocolate</option>
                      <option value="Vanilla">Vanilla</option>
                      <option value="Matcha">Matcha</option>
                      <option value="Cheese">Cheese</option>
                      <option value="Red Velvet">Red Velvet</option>
                      <option value="Custom">Custom / tanya admin</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-3 font-body text-sm font-bold uppercase tracking-[0.18em] text-bakeryBerry">
                    Tanggal Dibutuhkan
                    <input
                      name="eventDate"
                      type="date"
                      value={formValues.eventDate}
                      onChange={handleChange}
                      className="rounded-2xl border-2 border-bakeryText bg-bakeryBg px-5 py-4 font-body text-base font-medium normal-case tracking-normal text-bakeryText outline-none transition-colors focus:border-bakeryBerry"
                    />
                  </label>
                </div>

                <div className="grid gap-7 md:grid-cols-2">
                  <label className="flex flex-col gap-3 font-body text-sm font-bold uppercase tracking-[0.18em] text-bakeryBerry">
                    Ambil / Kirim
                    <select
                      name="deliveryMethod"
                      value={formValues.deliveryMethod}
                      onChange={handleChange}
                      className="rounded-2xl border-2 border-bakeryText bg-bakeryBg px-5 py-4 font-body text-base font-medium normal-case tracking-normal text-bakeryText outline-none transition-colors focus:border-bakeryBerry"
                    >
                      <option value="Pickup">Pickup</option>
                      <option value="Delivery">Delivery</option>
                      <option value="Diskusikan dengan admin">
                        Diskusikan dengan admin
                      </option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-3 font-body text-sm font-bold uppercase tracking-[0.18em] text-bakeryBerry">
                    Tema / Warna
                    <input
                      name="theme"
                      type="text"
                      value={formValues.theme}
                      onChange={handleChange}
                      placeholder="Mis. pink, floral, graduation"
                      className="rounded-2xl border-2 border-bakeryText bg-bakeryBg px-5 py-4 font-body text-base font-medium normal-case tracking-normal text-bakeryText outline-none transition-colors focus:border-bakeryBerry"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-3 font-body text-sm font-bold uppercase tracking-[0.18em] text-bakeryBerry">
                  Link Referensi Desain
                  <input
                    name="referenceUrl"
                    type="url"
                    value={formValues.referenceUrl}
                    onChange={handleChange}
                    placeholder="Link Pinterest/Instagram/Drive opsional"
                    className="rounded-2xl border-2 border-bakeryText bg-bakeryBg px-5 py-4 font-body text-base font-medium normal-case tracking-normal text-bakeryText outline-none transition-colors focus:border-bakeryBerry"
                  />
                </label>

                <label className="flex flex-col gap-3 font-body text-sm font-bold uppercase tracking-[0.18em] text-bakeryBerry">
                  Catatan Pesanan
                  <textarea
                    name="message"
                    rows="5"
                    value={formValues.message}
                    onChange={handleChange}
                    placeholder="Tulisan di cake, ukuran, alamat delivery, atau request khusus lainnya"
                    className="rounded-[1.75rem] border-2 border-bakeryText bg-bakeryBg px-5 py-4 font-body text-base font-medium normal-case tracking-normal text-bakeryText outline-none transition-colors focus:border-bakeryBerry"
                  />
                </label>

                <p
                  className="font-body text-sm font-medium text-bakeryText/70"
                  aria-live="polite"
                >
                  {formStatus || businessInfo.contactNote}
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    type="submit"
                    className="rounded-full border-2 border-bakeryText bg-bakeryBerry px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[5px_5px_0px_0px_rgba(74,62,61,1)] transition-transform hover:-translate-y-1 md:px-8 md:py-4 md:text-lg md:tracking-[0.18em]"
                  >
                    Kirim Pesanan
                  </button>
                  <a
                    href={businessInfo.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border-2 border-bakeryText bg-bakeryPeach px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.14em] text-bakeryBerry shadow-[5px_5px_0px_0px_rgba(74,62,61,1)] transition-transform hover:-translate-y-1 md:px-8 md:py-4 md:text-lg md:tracking-[0.18em]"
                  >
                    Instagram
                  </a>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
