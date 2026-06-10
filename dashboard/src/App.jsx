import './App.css';

import { useMemo, useState } from 'react';

const initialMenuItems = [
  {
    id: 1,
    title: 'Velvet Rose',
    price: 'Rp 150.000',
    desc: 'Bento cake dengan rose buttercream aesthetic.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600',
  },
  {
    id: 2,
    title: 'Matcha Dream',
    price: 'Rp 135.000',
    desc: 'Classic matcha bento dengan cream cheese.',
    image: 'https://images.unsplash.com/photo-1557925923-33b251dc3296?q=80&w=600',
  },
];

const initialMomentItems = [
  {
    id: 1,
    title: 'Birthday Surprise',
    caption: 'Bento cake kecil untuk kejutan ulang tahun yang terasa personal dan hangat.',
    tag: 'Ulang Tahun',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Sweet Anniversary',
    caption: 'Pilihan manis untuk merayakan momen intim dengan desain yang bisa disesuaikan.',
    tag: 'Anniversary',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=1200&auto=format&fit=crop',
  },
];

function App() {
  const [activePanel, setActivePanel] = useState('menu');
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [momentItems, setMomentItems] = useState(initialMomentItems);
  const [menuForm, setMenuForm] = useState({
    title: '',
    price: '',
    desc: '',
    image: '',
  });
  const [momentForm, setMomentForm] = useState({
    title: '',
    caption: '',
    tag: '',
    image: '',
  });
  const [menuEditingId, setMenuEditingId] = useState(null);
  const [momentEditingId, setMomentEditingId] = useState(null);

  const summaryCards = useMemo(
    () => [
      { label: 'Menu aktif', value: String(menuItems.length), trend: 'Siap dipakai untuk landing' },
      { label: 'Moment aktif', value: String(momentItems.length), trend: 'Dipakai untuk slider homepage' },
      { label: 'Mode kerja', value: 'Lokal', trend: 'Belum terhubung ke backend' },
      { label: 'Status editor', value: 'Siap', trend: 'Tambah, edit, hapus sudah aktif' },
    ],
    [menuItems.length, momentItems.length],
  );

  const resetMenuForm = () => {
    setMenuForm({ title: '', price: '', desc: '', image: '' });
    setMenuEditingId(null);
  };

  const resetMomentForm = () => {
    setMomentForm({ title: '', caption: '', tag: '', image: '' });
    setMomentEditingId(null);
  };

  const handleMenuSubmit = (event) => {
    event.preventDefault();

    const nextItem = {
      id: menuEditingId ?? Date.now(),
      title: menuForm.title.trim(),
      price: menuForm.price.trim(),
      desc: menuForm.desc.trim(),
      image: menuForm.image.trim() || 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=600',
    };

    if (!nextItem.title || !nextItem.price || !nextItem.desc) {
      return;
    }

    setMenuItems((currentItems) =>
      menuEditingId
        ? currentItems.map((item) => (item.id === menuEditingId ? nextItem : item))
        : [nextItem, ...currentItems],
    );
    resetMenuForm();
  };

  const handleMomentSubmit = (event) => {
    event.preventDefault();

    const nextItem = {
      id: momentEditingId ?? Date.now(),
      title: momentForm.title.trim(),
      caption: momentForm.caption.trim(),
      tag: momentForm.tag.trim(),
      image:
        momentForm.image.trim() ||
        'https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?q=80&w=1200&auto=format&fit=crop',
    };

    if (!nextItem.title || !nextItem.caption) {
      return;
    }

    setMomentItems((currentItems) =>
      momentEditingId
        ? currentItems.map((item) => (item.id === momentEditingId ? nextItem : item))
        : [nextItem, ...currentItems],
    );
    resetMomentForm();
  };

  return (
    <main className="dashboard-shell">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">YummyYumz content admin</p>
          <h1>Kelola menu dan moment</h1>
          <p className="hero-copy">
            Dashboard ini dipakai untuk menyiapkan konten `landing` secara lokal dulu.
            Struktur datanya sudah dibuat searah dengan kebutuhan homepage, katalog,
            dan slider moment.
          </p>
        </div>

        <aside className="hero-panel" aria-label="status operasional">
          <span className="status-dot"></span>
          <div>
            <strong>Editor lokal aktif</strong>
            <p>Belum terhubung ke backend. Perubahan saat ini masih disimpan di state lokal.</p>
          </div>
        </aside>
      </section>

      <section className="summary-grid" aria-label="ringkasan utama">
        {summaryCards.map((card) => (
          <article key={card.label} className="summary-card">
            <p>{card.label}</p>
            <strong>{card.value}</strong>
            <span>{card.trend}</span>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel panel-wide">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Editor</p>
              <h2>Area pengelolaan konten</h2>
            </div>
            <span className="pill">Siap disambungkan nanti</span>
          </div>

          <div className="panel-switcher" role="tablist" aria-label="Pilih panel admin">
            <button
              type="button"
              role="tab"
              aria-selected={activePanel === 'menu'}
              className={activePanel === 'menu' ? 'tab-button is-active' : 'tab-button'}
              onClick={() => setActivePanel('menu')}
            >
              Kelola Menu
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activePanel === 'moment'}
              className={activePanel === 'moment' ? 'tab-button is-active' : 'tab-button'}
              onClick={() => setActivePanel('moment')}
            >
              Kelola Moment
            </button>
          </div>

          {activePanel === 'menu' ? (
            <div className="editor-grid">
              <form className="editor-form" onSubmit={handleMenuSubmit}>
                <label htmlFor="menu-title">Nama menu</label>
                <input
                  id="menu-title"
                  value={menuForm.title}
                  onChange={(event) =>
                    setMenuForm((currentForm) => ({ ...currentForm, title: event.target.value }))
                  }
                  placeholder="Mis. Choco Berry"
                />

                <label htmlFor="menu-price">Harga menu</label>
                <input
                  id="menu-price"
                  value={menuForm.price}
                  onChange={(event) =>
                    setMenuForm((currentForm) => ({ ...currentForm, price: event.target.value }))
                  }
                  placeholder="Rp 95.000"
                />

                <label htmlFor="menu-desc">Deskripsi menu</label>
                <textarea
                  id="menu-desc"
                  rows="4"
                  value={menuForm.desc}
                  onChange={(event) =>
                    setMenuForm((currentForm) => ({ ...currentForm, desc: event.target.value }))
                  }
                  placeholder="Tulis deskripsi singkat menu"
                />

                <label htmlFor="menu-image">Gambar menu</label>
                <input
                  id="menu-image"
                  value={menuForm.image}
                  onChange={(event) =>
                    setMenuForm((currentForm) => ({ ...currentForm, image: event.target.value }))
                  }
                  placeholder="URL gambar opsional"
                />

                <div className="editor-actions">
                  <button type="submit">Simpan menu</button>
                  <button type="button" className="button-secondary" onClick={resetMenuForm}>
                    Reset
                  </button>
                </div>
              </form>

              <div className="editor-list">
                {menuItems.map((item) => (
                  <article key={item.id} className="editor-card">
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.price}</p>
                    </div>
                    <p>{item.desc}</p>
                    <div className="card-actions">
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() => {
                          setMenuEditingId(item.id);
                          setMenuForm({
                            title: item.title,
                            price: item.price,
                            desc: item.desc,
                            image: item.image,
                          });
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="button-danger"
                        onClick={() =>
                          setMenuItems((currentItems) =>
                            currentItems.filter((currentItem) => currentItem.id !== item.id),
                          )
                        }
                      >
                        Hapus
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="editor-grid">
              <form className="editor-form" onSubmit={handleMomentSubmit}>
                <label htmlFor="moment-title">Judul moment</label>
                <input
                  id="moment-title"
                  value={momentForm.title}
                  onChange={(event) =>
                    setMomentForm((currentForm) => ({ ...currentForm, title: event.target.value }))
                  }
                  placeholder="Mis. Graduation Day"
                />

                <label htmlFor="moment-caption">Caption moment</label>
                <textarea
                  id="moment-caption"
                  rows="4"
                  value={momentForm.caption}
                  onChange={(event) =>
                    setMomentForm((currentForm) => ({
                      ...currentForm,
                      caption: event.target.value,
                    }))
                  }
                  placeholder="Ceritakan konteks momen"
                />

                <label htmlFor="moment-tag">Tag moment</label>
                <input
                  id="moment-tag"
                  value={momentForm.tag}
                  onChange={(event) =>
                    setMomentForm((currentForm) => ({ ...currentForm, tag: event.target.value }))
                  }
                  placeholder="Mis. Ulang Tahun"
                />

                <label htmlFor="moment-image">Gambar moment</label>
                <input
                  id="moment-image"
                  value={momentForm.image}
                  onChange={(event) =>
                    setMomentForm((currentForm) => ({
                      ...currentForm,
                      image: event.target.value,
                    }))
                  }
                  placeholder="URL gambar opsional"
                />

                <div className="editor-actions">
                  <button type="submit">Simpan moment</button>
                  <button type="button" className="button-secondary" onClick={resetMomentForm}>
                    Reset
                  </button>
                </div>
              </form>

              <div className="editor-list">
                {momentItems.map((item) => (
                  <article key={item.id} className="editor-card">
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.tag || 'Tanpa tag'}</p>
                    </div>
                    <p>{item.caption}</p>
                    <div className="card-actions">
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() => {
                          setMomentEditingId(item.id);
                          setMomentForm({
                            title: item.title,
                            caption: item.caption,
                            tag: item.tag,
                            image: item.image,
                          });
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="button-danger"
                        onClick={() =>
                          setMomentItems((currentItems) =>
                            currentItems.filter((currentItem) => currentItem.id !== item.id),
                          )
                        }
                      >
                        Hapus
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Catatan</p>
              <h2>Aturan data</h2>
            </div>
          </div>

          <ul className="activity-list">
            {[
              'Nama field menu dibuat searah dengan data katalog di landing.',
              'Moment memakai title, caption, tag, dan image agar cocok untuk slider.',
              'Editor saat ini masih lokal, jadi perubahan belum otomatis tersimpan permanen.',
              'Tahap berikutnya tinggal menyambungkan editor ini ke sumber data nyata.',
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Status</p>
              <h2>Langkah berikutnya</h2>
            </div>
          </div>

          <div className="quick-actions">
            <button type="button">Sambungkan ke API konten</button>
            <button type="button">Tambahkan upload gambar</button>
            <button type="button">Sinkronkan ke landing</button>
          </div>
        </article>
      </section>
    </main>
  );
}

export default App;
