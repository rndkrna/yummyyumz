import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../components/sections/Footer";
import { businessInfo } from "../data/siteData";
import { buildWhatsAppOrderLink } from "../utils/contact";

gsap.registerPlugin(ScrollTrigger);

export default function AboutContact() {
  const containerRef = useRef(null);
  const letterRef = useRef(null);
  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState("");

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Rotating 3D Object Effect
      gsap.to(letterRef.current, {
        rotationY: 360,
        duration: 8,
        repeat: -1,
        ease: "linear",
        transformOrigin: "center center",
      });

      // Simple fade-up
      gsap.from(".fade-up", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

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

    setFormStatus(
      "Pesan siap dikirim. WhatsApp dibuka untuk konfirmasi ke admin.",
    );
    window.open(result.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      ref={containerRef}
      className="bg-[#E7F2B7] min-h-screen pt-32 overflow-hidden flex flex-col relative perspective-[1000px]"
    >
      {/* Top Section Layout like 0-3s of video */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-16 w-full relative min-h-screen md:h-[80vh] flex flex-col md:flex-row items-center justify-between pt-16 md:pt-0 gap-16 md:gap-0">
        {/* Left Text: Visi & Misi */}
        <div className="w-full md:w-1/3 z-10 flex flex-col justify-start md:justify-end md:h-full md:pb-32 mt-12 md:mt-0 text-center md:text-left">
          <h1 className="font-display font-extrabold text-[clamp(3rem,10vw,6rem)] text-bakeryBerry leading-[0.8] uppercase tracking-tighter mb-6 md:mb-8">
            VISI &<br className="hidden md:block" />
            MISI
            <br className="hidden md:block" />
            KAMI
          </h1>
          <div className="font-body text-bakeryBerry text-base md:text-lg leading-relaxed font-medium">
            <p className="mb-4">
              <strong>Visi:</strong> Menjadi pelopor bento cake premium di
              Tanjungpinang yang memadukan desain estetik dengan cita rasa tak
              terlupakan.
            </p>
            <p>
              <strong>Misi:</strong>
              <br />
              • Menggunakan bahan premium konsisten.
              <br />
              • Mewujudkan imajinasi kustom pelanggan.
              <br />• Menyajikan pesanan freshly baked.
            </p>
          </div>
        </div>

        {/* Center 3D Letter Placeholder */}
        <div className="md:absolute md:inset-0 flex items-center justify-center pointer-events-none z-0 my-12 md:my-0 w-full overflow-hidden">
          <div
            ref={letterRef}
            className="text-[clamp(12rem,30vw,40rem)] leading-none font-display font-black text-[#E91E63] transform-style-3d drop-shadow-2xl"
            style={{
              textShadow:
                "10px 10px 0 #880E4F, 20px 20px 0 #4A148C, 30px 30px 20px rgba(0,0,0,0.5)",
              WebkitTextStroke: "4px white",
            }}
          >
            Y
          </div>
        </div>

        {/* Right Form Link Placeholder: Tentang Kami */}
        <div className="w-full md:w-1/4 z-10 flex flex-col justify-start md:h-full md:pt-12 items-center md:items-end text-center md:text-right pb-24 md:pb-0">
          <h1 className="font-display font-extrabold text-[clamp(3rem,10vw,5rem)] text-bakeryBerry leading-[0.8] uppercase tracking-tighter mb-4 md:mb-6">
            TENTANG
            <br className="hidden md:block" />
            KAMI
          </h1>
          <p className="font-body text-bakeryBerry text-base md:text-sm leading-relaxed font-medium mb-8">
            YummyYumz bermula dari dapur kecil di Tanjungpinang pada{" "}
            <strong>Agustus 2020</strong>.<br />
            <br />
            Misi sederhana kami: menciptakan kue yang indah di mata dan meleleh
            di lidah.
          </p>
          <a
            href="#contact"
            className="w-20 h-20 md:w-24 md:h-24 bg-bakeryBerry rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer"
          >
            <span className="text-2xl">↓</span>
          </a>
        </div>
      </div>

      {/* Contact Section */}
      <div
        id="contact"
        className="max-w-[1600px] mx-auto px-8 md:px-16 w-full pb-20"
      >
        <div className="bg-[#A91E45] rounded-[3rem] p-12 md:p-20 border-4 border-bakeryText shadow-[20px_20px_0px_0px_rgba(74,62,61,1)] text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <span className="fade-up font-body text-[#E7F2B7] uppercase tracking-widest text-sm font-bold block mb-4">
                Let's Talk
              </span>
              <h2 className="fade-up font-display font-extrabold text-[clamp(2.5rem,5vw,5rem)] text-white leading-[0.9] uppercase tracking-tighter mb-8">
                Pesan Kue Spesialmu.
              </h2>
              <p className="fade-up font-body text-[#E7F2B7] text-lg mb-6 max-w-md">
                Punya desain impian atau sekadar ingin bertanya tentang rasa?
                Isi detail singkat di bawah ini, lalu kami siapkan pesan
                WhatsApp yang siap dikirim.
              </p>
              <p className="fade-up font-body text-[#E7F2B7]/80 text-sm mb-12 max-w-lg">
                {businessInfo.contactNote}
              </p>

              <form
                className="fade-up flex flex-col gap-8"
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="border-b-2 border-white/30 pb-2">
                    <label
                      htmlFor="contact-name"
                      className="block font-body text-sm text-[#E7F2B7] mb-2"
                    >
                      Nama
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      value={formValues.name}
                      onChange={handleChange}
                      className="w-full bg-transparent border-none outline-none font-display text-xl text-white placeholder-white/30"
                      placeholder="Masukkan nama..."
                    />
                  </div>
                  <div className="border-b-2 border-white/30 pb-2">
                    <label
                      htmlFor="contact-phone"
                      className="block font-body text-sm text-[#E7F2B7] mb-2"
                    >
                      Telepon
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      value={formValues.phone}
                      onChange={handleChange}
                      className="w-full bg-transparent border-none outline-none font-display text-xl text-white placeholder-white/30"
                      placeholder="Nomor WA..."
                    />
                  </div>
                </div>
                <div className="border-b-2 border-white/30 pb-2">
                  <label
                    htmlFor="contact-email"
                    className="block font-body text-sm text-[#E7F2B7] mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formValues.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-none outline-none font-display text-xl text-white placeholder-white/30"
                    placeholder="Alamat email..."
                  />
                </div>
                <div className="border-b-2 border-white/30 pb-2">
                  <label
                    htmlFor="contact-message"
                    className="block font-body text-sm text-[#E7F2B7] mb-2"
                  >
                    Pesan
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows="3"
                    value={formValues.message}
                    onChange={handleChange}
                    className="w-full bg-transparent border-none outline-none font-display text-xl text-white placeholder-white/30 resize-none"
                    placeholder="Tulis pesan Anda..."
                  ></textarea>
                </div>
                <p
                  className="font-body text-sm text-[#E7F2B7]"
                  aria-live="polite"
                >
                  {formStatus}
                </p>
                <button
                  type="submit"
                  className="mt-4 bg-white text-[#A91E45] font-display font-bold uppercase tracking-widest py-4 px-8 rounded-xl hover:bg-[#E7F2B7] transition-colors w-max shadow-[4px_4px_0px_0px_rgba(74,62,61,1)] border-2 border-bakeryText"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>

            <div className="fade-up bg-[#E7F2B7] p-8 md:p-12 rounded-3xl border-4 border-bakeryText transform md:rotate-2 text-bakeryText">
              <h3 className="font-display font-bold text-2xl text-bakeryBerry mb-6">
                Info & Jam Buka
              </h3>
              <ul className="space-y-4 font-body text-bakeryText">
                {businessInfo.openingHours.map((item) => (
                  <li
                    key={item.label}
                    className="flex justify-between border-b-2 border-bakeryText/20 pb-2"
                  >
                    <span className="font-bold">{item.label}</span>
                    <span>{item.hours}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-8 border-t-4 border-bakeryText">
                <h4 className="font-bold mb-2">
                  {businessInfo.brandName} Kitchen
                </h4>
                <p className="text-sm leading-relaxed">
                  {businessInfo.addressLines.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </div>
              <div className="mt-8 pt-8 border-t-4 border-bakeryText flex flex-col gap-4">
                <a
                  href={`https://wa.me/${businessInfo.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                  data-cursor-hover
                >
                  <div className="w-12 h-12 bg-[#A91E45] text-white rounded-full flex items-center justify-center font-display text-xl group-hover:scale-110 transition-transform">
                    →
                  </div>
                  <span className="font-display font-bold text-lg text-bakeryText">
                    {businessInfo.whatsappDisplay}
                  </span>
                </a>
                <a
                  href={businessInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                  data-cursor-hover
                >
                  <div className="w-12 h-12 bg-[#A91E45] text-white rounded-full flex items-center justify-center font-display text-xl group-hover:scale-110 transition-transform">
                    @
                  </div>
                  <span className="font-display font-bold text-lg text-bakeryText">
                    {businessInfo.instagramHandle}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
