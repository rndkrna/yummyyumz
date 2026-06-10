import "./App.css";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEYS = {
  menu: "yummyyumz-dashboard-menu",
  moments: "yummyyumz-dashboard-moments",
  auth: "yummyyumz-dashboard-auth",
};

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "yummyadmin";

const initialMenuItems = [
  {
    id: 1,
    name: "Velvet Rose",
    price: "Rp 150.000",
    desc: "Bento cake dengan rose buttercream aesthetic.",
    img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600",
  },
  {
    id: 2,
    name: "Matcha Dream",
    price: "Rp 135.000",
    desc: "Classic matcha bento dengan cream cheese.",
    img: "https://images.unsplash.com/photo-1557925923-33b251dc3296?q=80&w=600",
  },
];

const initialMomentItems = [
  {
    id: 1,
    title: "Birthday Surprise",
    caption:
      "Bento cake kecil untuk kejutan ulang tahun yang terasa personal dan hangat.",
    tag: "Ulang Tahun",
    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Sweet Anniversary",
    caption:
      "Pilihan manis untuk merayakan momen intim dengan desain yang bisa disesuaikan.",
    tag: "Anniversary",
    image:
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=1200&auto=format&fit=crop",
  },
];

const readStoredData = (key, fallback) => {
  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch {
    return fallback;
  }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => window.localStorage.getItem(STORAGE_KEYS.auth) === "true",
  );
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activePanel, setActivePanel] = useState("menu");
  const [menuItems, setMenuItems] = useState(() =>
    readStoredData(STORAGE_KEYS.menu, initialMenuItems),
  );
  const [momentItems, setMomentItems] = useState(() =>
    readStoredData(STORAGE_KEYS.moments, initialMomentItems),
  );
  const [menuForm, setMenuForm] = useState({
    name: "",
    price: "",
    desc: "",
    img: "",
  });
  const [momentForm, setMomentForm] = useState({
    title: "",
    caption: "",
    tag: "",
    image: "",
  });
  const [menuEditingId, setMenuEditingId] = useState(null);
  const [momentEditingId, setMomentEditingId] = useState(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.menu, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.moments,
      JSON.stringify(momentItems),
    );
  }, [momentItems]);

  const summaryCards = useMemo(
    () => [
      {
        label: "Menu aktif",
        value: String(menuItems.length),
        trend: "Tersimpan di localStorage",
      },
      {
        label: "Moment aktif",
        value: String(momentItems.length),
        trend: "Tersimpan di localStorage",
      },
      {
        label: "Mode kerja",
        value: "Lokal",
        trend: "Struktur data selaras landing",
      },
      {
        label: "Status editor",
        value: "Aman",
        trend: "Dilindungi login sederhana",
      },
    ],
    [menuItems.length, momentItems.length],
  );

  const resetMenuForm = () => {
    setMenuForm({ name: "", price: "", desc: "", img: "" });
    setMenuEditingId(null);
  };

  const resetMomentForm = () => {
    setMomentForm({ title: "", caption: "", tag: "", image: "" });
    setMomentEditingId(null);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (password !== ADMIN_PASSWORD) {
      setLoginError("Password admin salah. Coba lagi.");
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.auth, "true");
    setIsAuthenticated(true);
    setLoginError("");
  };

  const handleLogout = () => {
    window.localStorage.removeItem(STORAGE_KEYS.auth);
    setIsAuthenticated(false);
    setPassword("");
  };

  const handleMenuSubmit = (event) => {
    event.preventDefault();

    const nextItem = {
      id: menuEditingId ?? Date.now(),
      name: menuForm.name.trim(),
      price: menuForm.price.trim(),
      desc: menuForm.desc.trim(),
      img:
        menuForm.img.trim() ||
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=600",
    };

    if (!nextItem.name || !nextItem.price || !nextItem.desc) {
      return;
    }

    setMenuItems((currentItems) =>
      menuEditingId
        ? currentItems.map((item) =>
            item.id === menuEditingId ? nextItem : item,
          )
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
        "https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?q=80&w=1200&auto=format&fit=crop",
    };

    if (!nextItem.title || !nextItem.caption) {
      return;
    }

    setMomentItems((currentItems) =>
      momentEditingId
        ? currentItems.map((item) =>
            item.id === momentEditingId ? nextItem : item,
          )
        : [nextItem, ...currentItems],
    );
    resetMomentForm();
  };

  const handleResetStorage = () => {
    setMenuItems(initialMenuItems);
    setMomentItems(initialMomentItems);
    resetMenuForm();
    resetMomentForm();
  };

  if (!isAuthenticated) {
    return (
      <main className="login-shell">
        <form className="login-card" onSubmit={handleLogin}>
          <p className="eyebrow">YummyYumz admin</p>
          <h1>Masuk dashboard</h1>
          <p>
            Dashboard dilindungi password sederhana untuk mencegah akses publik.
            Ganti password melalui environment variable{" "}
            <code>VITE_ADMIN_PASSWORD</code> saat deploy.
          </p>
          <label htmlFor="admin-password">Password admin</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Masukkan password"
          />
          {loginError ? (
            <strong className="login-error">{loginError}</strong>
          ) : null}
          <button type="submit">Masuk</button>
          <span className="login-hint">Default demo: yummyadmin</span>
        </form>
      </main>
    );
  }

  return (
    <main className="dashboard-shell">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">YummyYumz content admin</p>
          <h1>Kelola menu dan moment</h1>
          <p className="hero-copy">
            Dashboard ini menyimpan konten secara lokal di browser. Struktur
            menu memakai <code>name</code>, <code>desc</code>,{" "}
            <code>price</code>, dan <code>img</code>
            agar selaras dengan data katalog landing.
          </p>
        </div>

        <aside className="hero-panel" aria-label="status operasional">
          <span className="status-dot"></span>
          <div>
            <strong>Editor lokal aktif</strong>
            <p>
              Perubahan tersimpan di localStorage browser ini. Untuk produksi,
              sambungkan ke API/database.
            </p>
            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Keluar
            </button>
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
            <span className="pill">Persisten lokal</span>
          </div>

          <div
            className="panel-switcher"
            role="tablist"
            aria-label="Pilih panel admin"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activePanel === "menu"}
              className={
                activePanel === "menu" ? "tab-button is-active" : "tab-button"
              }
              onClick={() => setActivePanel("menu")}
            >
              Kelola Menu
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activePanel === "moment"}
              className={
                activePanel === "moment" ? "tab-button is-active" : "tab-button"
              }
              onClick={() => setActivePanel("moment")}
            >
              Kelola Moment
            </button>
          </div>

          {activePanel === "menu" ? (
            <div className="editor-grid">
              <form className="editor-form" onSubmit={handleMenuSubmit}>
                <label htmlFor="menu-title">Nama menu</label>
                <input
                  id="menu-title"
                  value={menuForm.name}
                  onChange={(event) =>
                    setMenuForm((currentForm) => ({
                      ...currentForm,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Mis. Choco Berry"
                />

                <label htmlFor="menu-price">Harga menu</label>
                <input
                  id="menu-price"
                  value={menuForm.price}
                  onChange={(event) =>
                    setMenuForm((currentForm) => ({
                      ...currentForm,
                      price: event.target.value,
                    }))
                  }
                  placeholder="Rp 95.000"
                />

                <label htmlFor="menu-desc">Deskripsi menu</label>
                <textarea
                  id="menu-desc"
                  rows="4"
                  value={menuForm.desc}
                  onChange={(event) =>
                    setMenuForm((currentForm) => ({
                      ...currentForm,
                      desc: event.target.value,
                    }))
                  }
                  placeholder="Tulis deskripsi singkat menu"
                />

                <label htmlFor="menu-image">Gambar menu</label>
                <input
                  id="menu-image"
                  value={menuForm.img}
                  onChange={(event) =>
                    setMenuForm((currentForm) => ({
                      ...currentForm,
                      img: event.target.value,
                    }))
                  }
                  placeholder="URL gambar opsional"
                />

                <div className="editor-actions">
                  <button type="submit">Simpan menu</button>
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={resetMenuForm}
                  >
                    Reset
                  </button>
                </div>
              </form>

              <div className="editor-list">
                {menuItems.map((item) => (
                  <article key={item.id} className="editor-card">
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.price}</p>
                    </div>
                    <p>{item.desc}</p>
                    <small className="field-note">
                      Field: name, desc, price, img
                    </small>
                    <div className="card-actions">
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() => {
                          setMenuEditingId(item.id);
                          setMenuForm({
                            name: item.name,
                            price: item.price,
                            desc: item.desc,
                            img: item.img,
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
                            currentItems.filter(
                              (currentItem) => currentItem.id !== item.id,
                            ),
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
                    setMomentForm((currentForm) => ({
                      ...currentForm,
                      title: event.target.value,
                    }))
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
                    setMomentForm((currentForm) => ({
                      ...currentForm,
                      tag: event.target.value,
                    }))
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
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={resetMomentForm}
                  >
                    Reset
                  </button>
                </div>
              </form>

              <div className="editor-list">
                {momentItems.map((item) => (
                  <article key={item.id} className="editor-card">
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.tag || "Tanpa tag"}</p>
                    </div>
                    <p>{item.caption}</p>
                    <small className="field-note">
                      Field: title, caption, tag, image
                    </small>
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
                            currentItems.filter(
                              (currentItem) => currentItem.id !== item.id,
                            ),
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
              "Menu sekarang memakai field name, desc, price, dan img seperti catalogProducts landing.",
              "Moment memakai title, caption, tag, dan image agar cocok untuk slider homepage.",
              "Perubahan tersimpan permanen di browser ini melalui localStorage.",
              "Untuk sinkron real ke landing publik, tahap berikutnya adalah API atau database.",
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
            <button type="button" onClick={handleResetStorage}>
              Reset data demo
            </button>
            <button type="button">Tambahkan upload gambar</button>
            <button type="button">Sambungkan ke API konten</button>
          </div>
        </article>
      </section>
    </main>
  );
}

export default App;
