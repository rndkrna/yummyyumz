import Footer from '../components/sections/Footer';
import { businessInfo } from '../data/siteData';

const storyBlocks = [
  {
    title: 'Berawal dari dapur kecil',
    text: `YummyYumz tumbuh dari dapur kecil di ${businessInfo.city}, dengan niat sederhana: bikin bento cake yang cantik dilihat tapi tetap memorable saat digigit.`,
  },
  {
    title: 'Rasa tetap utama',
    text: 'Desain yang lucu tidak cukup. Kami tetap menaruh fokus pada tekstur cake, whipcream yang nyaman dimakan, dan kombinasi rasa yang terasa seimbang.',
  },
  {
    title: 'Setiap order terasa personal',
    text: 'Dari ucapan singkat sampai mood warna, kami ingin setiap cake terasa dekat dengan momen yang sedang dirayakan pelanggan.',
  },
];

export default function About() {
  return (
    <>
      <main className="bg-bakeryBg pt-32">
        <section className="px-6 pb-16 md:px-16 md:pb-24">
          <div className="mx-auto grid max-w-[1500px] gap-10 rounded-[2.5rem] border-4 border-bakeryText bg-bakeryBerry px-6 py-10 text-white shadow-[14px_14px_0px_0px_rgba(74,62,61,1)] md:grid-cols-[1.15fr_0.85fr] md:px-12 md:py-14">
            <div>
              <span className="mb-5 inline-block rounded-full border-2 border-white/40 px-4 py-2 font-body text-xs font-bold uppercase tracking-[0.3em] text-bakeryPeach">
                About YummyYumz
              </span>
              <h1 className="font-groovy text-[clamp(3.4rem,8vw,8rem)] uppercase leading-[0.82] text-white">
                Cerita di
                <br />
                balik setiap
                <br />
                bento cake.
              </h1>
              <p className="mt-8 max-w-2xl font-body text-base font-medium leading-relaxed text-white/85 md:text-lg">
                Kami membuat kue untuk momen yang ingin terasa akrab, personal, dan
                tidak generik. Hasil akhirnya tetap playful, tapi keputusan rasa,
                warna, dan detailnya selalu kami pikirkan dengan serius.
              </p>
            </div>

            <div className="grid gap-5 md:pl-8">
              <div className="min-h-[240px] rounded-[2rem] border-4 border-bakeryText bg-[url('https://images.unsplash.com/photo-1559622214-f8a9850965bb?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center shadow-[10px_10px_0px_0px_rgba(253,241,222,0.28)]" />
              <div className="rounded-[2rem] border-4 border-bakeryText bg-bakeryPeach p-6 text-bakeryText shadow-[10px_10px_0px_0px_rgba(253,241,222,0.28)]">
                <p className="font-display text-xl font-bold uppercase tracking-wide text-bakeryBerry">
                  Visi kami
                </p>
                <p className="mt-3 font-body text-sm font-medium leading-relaxed md:text-base">
                  Menjadi brand bento cake yang dikenal karena desain yang penuh
                  karakter dan rasa yang tetap bikin orang ingin pesan lagi.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-20 md:px-16 md:pb-28">
          <div className="mx-auto grid max-w-[1500px] gap-6 md:grid-cols-3">
            {storyBlocks.map((block) => (
              <article
                key={block.title}
                className="rounded-[2rem] border-4 border-bakeryText bg-white p-7 shadow-[10px_10px_0px_0px_rgba(74,62,61,1)]"
              >
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-bakeryBerry">
                  {block.title}
                </h2>
                <p className="mt-4 font-body text-sm font-medium leading-relaxed text-bakeryText md:text-base">
                  {block.text}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
