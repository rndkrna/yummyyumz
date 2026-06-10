import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { businessInfo } from '../../data/siteData';
import { buildWhatsAppOrderLink } from '../../utils/contact';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const containerRef = useRef(null);
  const archRef = useRef(null);
  const boxRef = useRef(null);
  const titleRef = useRef(null);
  const [formValues, setFormValues] = useState({
    subject: '',
    name: '',
    phone: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState('');

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 3D Box rotating effect on scroll
      gsap.to(boxRef.current, {
        rotationY: 360,
        rotationZ: 10,
        ease: "none",
        scrollTrigger: {
          trigger: archRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });
      
      // Title reveal
      gsap.fromTo(titleRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        { 
          scale: 1, opacity: 1, y: 0, 
          duration: 1, ease: 'power4.out',
          scrollTrigger: { trigger: titleRef.current, start: "top 80%" }
        }
      );
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

    setFormStatus('WhatsApp akan dibuka dengan template pesan dari formulir ini.');
    window.open(result.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-bakeryPeach relative z-10 overflow-hidden" ref={containerRef}>
      
      {/* Arch Section (Pseudo 3D Delivery Box) */}
      <div className="pt-32 pb-16 flex flex-col items-center justify-center px-4 relative z-20">
         <h2 ref={titleRef} className="font-display font-extrabold text-bakeryBerry text-[clamp(2.5rem,8vw,8rem)] text-center tracking-tighter uppercase leading-[0.8] mb-12" style={{ WebkitTextStroke: '2px #4A3E3D', textShadow: '6px 6px 0 #4A3E3D' }}>
           BISA DIKIRIM<br/>SAMPAI DEPAN PINTU
         </h2>
         
         <div ref={archRef} className="w-[80vw] max-w-[500px] h-[400px] md:h-[500px] bg-[#96cba1] rounded-t-full border-4 border-bakeryText flex items-center justify-center relative shadow-[0_20px_0_rgba(74,62,61,0.2)]">
            <div 
              ref={boxRef}
              className="w-64 h-48 bg-white border-2 border-bakeryText shadow-[10px_10px_0_rgba(166,28,60,1)] flex items-center justify-center transform preserve-3d"
            >
               {/* Simulating 3D Box / Cake Box */}
               <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iNCIgZmlsbD0iI2E2MWMzYyIgLz48L3N2Zz4=')] opacity-30"></div>
               <span className="font-display font-extrabold text-bakeryBerry text-3xl z-10 bg-white px-2 border-2 border-bakeryBerry">YUMMY BENTO</span>
            </div>
            
            <a
              href="#cta"
              className="absolute -bottom-8 bg-bakeryBerry text-white rounded-full w-32 h-32 flex items-center justify-center font-display font-extrabold text-xl uppercase tracking-widest border-4 border-bakeryText hover:scale-110 transition-transform shadow-[0_8px_0_rgba(74,62,61,1)]"
              data-cursor-hover
            >
              PESAN<br/>SEKARANG
            </a>
         </div>
      </div>

      {/* Conditions Form / Contact Section */}
      <div id="cta" className="bg-bakeryBg py-32 px-8 md:px-16 border-t-2 border-bakeryText mt-16 relative z-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <div>
            <h2 className="font-display font-extrabold text-4xl md:text-7xl text-bakeryBerry uppercase leading-none tracking-tighter mb-8">
              PUNYA PERTANYAAN?<br/>KAMI ADA JAWABANNYA!
            </h2>
            <p className="font-body text-bakeryText text-lg max-w-lg mb-8">
              Form ini tidak lagi berhenti di halaman saja. Setelah diisi, kami siapkan pesan WhatsApp yang bisa langsung Anda kirim ke admin.
            </p>
            <p className="font-body text-bakeryText/70 text-sm max-w-lg">
              {businessInfo.contactNote}
            </p>
          </div>

          <div className="bg-bakeryBerry p-8 md:p-12 rounded-3xl border-2 border-bakeryText shadow-[10px_10px_0_rgba(74,62,61,1)]">
             <form className="flex flex-col space-y-8" onSubmit={handleSubmit}>
                <input name="subject" type="text" value={formValues.subject} onChange={handleChange} placeholder="Subjek Pertanyaan" className="bg-transparent border-b-2 border-white/30 pb-2 text-white font-body placeholder-white/50 focus:outline-none focus:border-white transition-colors" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <input name="name" type="text" value={formValues.name} onChange={handleChange} placeholder="Nama Anda" className="bg-transparent border-b-2 border-white/30 pb-2 text-white font-body placeholder-white/50 focus:outline-none focus:border-white transition-colors" />
                  <input name="phone" type="text" value={formValues.phone} onChange={handleChange} placeholder="No. WhatsApp" className="bg-transparent border-b-2 border-white/30 pb-2 text-white font-body placeholder-white/50 focus:outline-none focus:border-white transition-colors" />
                </div>
                <input name="message" type="text" value={formValues.message} onChange={handleChange} placeholder="Pesan Anda" className="bg-transparent border-b-2 border-white/30 pb-2 text-white font-body placeholder-white/50 focus:outline-none focus:border-white transition-colors" />
                <p className="font-body text-sm text-white/80" aria-live="polite">
                  {formStatus}
                </p>
                
                <button type="submit" className="self-start border-2 border-white text-white rounded-full px-8 py-3 font-display font-bold uppercase hover:bg-white hover:text-bakeryBerry transition-colors" data-cursor-hover>
                  Buka WhatsApp
                </button>
             </form>
          </div>

        </div>
      </div>

      {/* Footer Bar */}
      <div className="bg-bakeryBerry text-white py-6 px-8 md:px-16 border-t-2 border-bakeryText">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center text-sm font-body font-medium">
          <div className="mb-4 md:mb-0">
            © {businessInfo.brandName} / Hak Cipta Dilindungi.
          </div>
          <div className="flex space-x-8">
            <a href={businessInfo.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-70">Facebook</a>
            <a href={businessInfo.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-70">Instagram</a>
            <a href={`https://wa.me/${businessInfo.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-70">WhatsApp</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
