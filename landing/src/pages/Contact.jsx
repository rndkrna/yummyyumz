import { useState } from 'react';
import Footer from '../components/sections/Footer';
import { businessInfo } from '../data/siteData';
import { buildWhatsAppOrderLink } from '../utils/contact';

export default function Contact() {
  const [formValues, setFormValues] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = buildWhatsAppOrderLink(formValues);

    if (result.error) {
      setFormStatus(result.error);
      return;
    }

    setFormStatus('WhatsApp akan dibuka di tab baru dengan pesan yang sudah terisi.');
    window.open(result.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <main className="bg-[#E7F2B7] pt-32">
        <section className="px-6 pb-16 md:px-16 md:pb-24">
          <div className="mx-auto grid max-w-[1500px] gap-8 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2.5rem] border-4 border-bakeryText bg-bakeryBerry p-8 text-white shadow-[14px_14px_0px_0px_rgba(74,62,61,1)] md:p-12">
              <span className="font-body text-xs font-bold uppercase tracking-[0.3em] text-[#E7F2B7]">
                Contact & Order
              </span>
              <h1 className="mt-5 font-display text-[clamp(2.8rem,6vw,5.5rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
                Pesan cake
                <br />
                spesialmu.
              </h1>
              <p className="mt-6 max-w-lg font-body text-sm font-medium leading-relaxed text-[#E7F2B7] md:text-base">
                Ceritakan rasa, tanggal, tema, atau referensi desain yang Anda
                inginkan. Setelah form diisi, kami siapkan pesan WhatsApp agar proses
                order lebih cepat.
              </p>

              <div className="mt-10 rounded-[2rem] border-4 border-bakeryText bg-[#E7F2B7] p-6 text-bakeryText">
                <h2 className="font-display text-2xl font-bold uppercase text-bakeryBerry">
                  Info singkat
                </h2>
                <ul className="mt-5 space-y-3 font-body text-sm font-medium md:text-base">
                  {businessInfo.openingHours.map((item) => (
                    <li key={item.label} className="flex items-center justify-between gap-4 border-b-2 border-bakeryText/20 pb-2">
                      <span>{item.label}</span>
                      <span>{item.hours}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 font-body text-sm leading-relaxed text-bakeryText/80">
                  {businessInfo.addressLines.join(', ')}
                </p>
              </div>
            </div>

            <div className="rounded-[2.5rem] border-4 border-bakeryText bg-white p-8 shadow-[14px_14px_0px_0px_rgba(74,62,61,1)] md:p-12">
              <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
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

                <label className="flex flex-col gap-3 font-body text-sm font-bold uppercase tracking-[0.18em] text-bakeryBerry">
                  Email
                  <input
                    name="email"
                    type="email"
                    value={formValues.email}
                    onChange={handleChange}
                    placeholder="Alamat email"
                    className="rounded-2xl border-2 border-bakeryText bg-bakeryBg px-5 py-4 font-body text-base font-medium normal-case tracking-normal text-bakeryText outline-none transition-colors focus:border-bakeryBerry"
                  />
                </label>

                <label className="flex flex-col gap-3 font-body text-sm font-bold uppercase tracking-[0.18em] text-bakeryBerry">
                  Pesan
                  <textarea
                    name="message"
                    rows="5"
                    value={formValues.message}
                    onChange={handleChange}
                    placeholder="Tulis kebutuhan pesanan Anda"
                    className="rounded-[1.75rem] border-2 border-bakeryText bg-bakeryBg px-5 py-4 font-body text-base font-medium normal-case tracking-normal text-bakeryText outline-none transition-colors focus:border-bakeryBerry"
                  />
                </label>

                <p className="font-body text-sm font-medium text-bakeryText/70" aria-live="polite">
                  {formStatus || businessInfo.contactNote}
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    type="submit"
                    className="rounded-full border-2 border-bakeryText bg-bakeryBerry px-8 py-4 font-display text-lg font-bold uppercase tracking-[0.18em] text-white shadow-[6px_6px_0px_0px_rgba(74,62,61,1)] transition-transform hover:-translate-y-1"
                  >
                    Buka WhatsApp
                  </button>
                  <a
                    href={businessInfo.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border-2 border-bakeryText bg-bakeryPeach px-8 py-4 font-display text-lg font-bold uppercase tracking-[0.18em] text-bakeryBerry shadow-[6px_6px_0px_0px_rgba(74,62,61,1)] transition-transform hover:-translate-y-1"
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
