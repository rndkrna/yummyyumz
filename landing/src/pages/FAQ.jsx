import { useState } from 'react';
import Footer from '../components/sections/Footer';
import { faqItems } from '../data/siteData';

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <article className="rounded-[2rem] border-4 border-bakeryText bg-white shadow-[8px_8px_0px_0px_rgba(74,62,61,1)]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left md:px-8"
      >
        <span className="font-display text-xl font-bold uppercase tracking-tight text-bakeryBerry md:text-2xl">
          {item.question}
        </span>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-bakeryText bg-bakeryPeach font-display text-2xl font-bold text-bakeryBerry">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen ? (
        <div className="border-t-2 border-bakeryText/15 px-6 pb-6 pt-2 md:px-8 md:pb-8">
          <p className="font-body text-sm font-medium leading-relaxed text-bakeryText md:text-base">
            {item.answer}
          </p>
        </div>
      ) : null}
    </article>
  );
}

export default function FAQ() {
  const [openId, setOpenId] = useState(faqItems[0]?.id ?? null);

  return (
    <>
      <main className="bg-bakeryBg pt-32">
        <section className="px-6 pb-20 md:px-16 md:pb-28">
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-12 rounded-[2.5rem] border-4 border-bakeryText bg-bakeryPeach px-6 py-10 shadow-[12px_12px_0px_0px_rgba(74,62,61,1)] md:px-10 md:py-12">
              <span className="font-body text-xs font-bold uppercase tracking-[0.3em] text-bakeryBerry">
                FAQ
              </span>
              <h1 className="mt-5 font-display text-[clamp(2.8rem,7vw,6rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-bakeryBerry">
                Pertanyaan yang
                <br />
                sering ditanyakan.
              </h1>
              <p className="mt-5 max-w-2xl font-body text-sm font-medium leading-relaxed text-bakeryText md:text-base">
                Halaman ini memudahkan pengunjung memahami alur order, custom
                desain, pengiriman, dan hal-hal penting lain sebelum mereka
                menghubungi admin.
              </p>
            </div>

            <div className="grid gap-5">
              {faqItems.map((item) => (
                <FaqItem
                  key={item.id}
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={() => setOpenId((currentId) => (currentId === item.id ? null : item.id))}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
