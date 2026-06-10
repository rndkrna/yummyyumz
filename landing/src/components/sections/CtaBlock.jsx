export default function CtaBlock() {
  return (
    <section className="bg-bakeryBg px-8 md:px-16 py-32 grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
       <div className="font-display text-5xl md:text-7xl font-extrabold text-bakeryBerry uppercase leading-[0.95] tracking-tighter mix-blend-multiply">
          <span className="block mb-2">SIAPA YANG UDAH NYOBA, PASTI TAU.</span>
          <span className="block">SIAP-SIAP KETAGIHAN!</span>
       </div>
       <div className="font-body text-bakeryText text-lg max-w-lg space-y-6 flex flex-col justify-end">
          <p>Tujuan kami bukan cuma sekadar bikin kue. Kalau cuma gitu sih gampang. Kami mau bikin kamu "tersentuh" setiap kali nyuap bento cake buatan kami.</p>
          <p>Gimana caranya? Kami nggak main-main soal bahan baku, komposisi rasa, maupun proses pembuatan. Semuanya dipastikan sempurna.</p>
          <div className="pt-8">
            <a href="#catalog" className="inline-block border-2 border-bakeryText rounded-full px-8 py-3 font-display font-bold uppercase hover:bg-bakeryText hover:text-white transition-colors cursor-pointer">
              LIHAT KATALOG
            </a>
          </div>
       </div>
    </section>
  );
}
