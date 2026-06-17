import "./App.css";

import { useEffect, useMemo, useState } from "react";
import {
  dashboardRemoteEnabled,
  deleteOrder,
  deleteProduct,
  fetchDashboardData,
  insertFinanceRecord,
  insertMoment,
  insertOrder,
  insertProduct,
  updateOrderStatus,
} from "./services/dashboardData";
import {
  createEmployeeAccount,
  fetchAccounts,
  fetchCurrentRole,
} from "./services/accounts";
import { supabase } from "./lib/supabase";

const todayLabel = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date());

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const parseAmount = (value) => {
  const match = String(value).match(/\d[\d.]*/);
  return match ? Number(match[0].replace(/[^0-9]/g, "")) || 0 : 0;
};
const getNumericPrice = (price) => parseAmount(price);

const formatShortDate = (value = new Date()) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const toMenuItem = (item) => ({
  id: item.id,
  name: item.name,
  price: typeof item.price === "number" || (typeof item.price === "string" && /^\d+$/.test(item.price))
    ? formatCurrency(item.price)
    : item.price,
  desc: item.description || "",
  img: item.image_url || "",
  isFeatured: item.is_featured,
  isAvailable: item.is_available,
});

const toMomentItem = (item) => ({
  id: item.id,
  title: item.title,
  caption: item.caption || "",
  tag: item.tag || "PROMO",
  date: item.event_date ? formatShortDate(item.event_date) : "",
  target: Number(item.target || 0),
  actual: Number(item.actual || 0),
  image: item.image_url || "",
});

const toOrderItem = (item) => ({
  id: item.id,
  time: formatShortDate(item.created_at),
  customer: item.customer,
  product: item.product,
  items: Number(item.items || 1),
  status: item.status,
  total: Number(item.total || 0),
  note: item.note || "",
});

const toFinanceItem = (item) => ({
  id: item.id,
  type: item.type,
  category: item.category,
  label: item.label,
  amount: Number(item.amount || 0),
  date: item.transaction_date
    ? formatShortDate(item.transaction_date)
    : formatShortDate(item.created_at),
});

function App() {
  const [session, setSession] = useState(null);
  const [authChecked, setAuthChecked] = useState(() => !supabase);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const isAuthenticated = Boolean(session);
  const [currentRole, setCurrentRole] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [accountForm, setAccountForm] = useState({
    email: "",
    password: "",
    role: "karyawan",
  });
  const [accountError, setAccountError] = useState("");
  const [accountMessage, setAccountMessage] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const isAdmin = currentRole === "admin";
  const [activePanel, setActivePanel] = useState("overview");
  const [menuItems, setMenuItems] = useState([]);
  const [momentItems, setMomentItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [financeRecords, setFinanceRecords] = useState([]);
  const [menuForm, setMenuForm] = useState({
    name: "",
    price: "",
    desc: "",
    img: "",
  });
  const [momentForm, setMomentForm] = useState({
    title: "",
    caption: "",
    tag: "PROMO",
    date: "",
    target: "",
    actual: "",
    image: "",
  });
  const [orderForm, setOrderForm] = useState({
    customer: "",
    product: "",
    items: "1",
    status: "Menunggu",
    total: "",
    note: "",
  });
  const [financeForm, setFinanceForm] = useState({
    type: "income",
    category: "Penjualan",
    label: "",
    amount: "",
    date: "",
  });
  const [remoteStatus, setRemoteStatus] = useState(
    dashboardRemoteEnabled
      ? "Menghubungkan database..."
      : "Database belum terhubung",
  );

  useEffect(() => {
    if (!supabase) return;

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session);
      setAuthChecked(true);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
      },
    );

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || !session?.user) return;

    let isMounted = true;
    fetchCurrentRole(session.user.id)
      .then((role) => {
        if (isMounted) setCurrentRole(role);
      })
      .catch(() => {
        if (isMounted) setCurrentRole("karyawan");
      });

    return () => {
      isMounted = false;
    };
  }, [session]);

  useEffect(() => {
    if (currentRole !== "admin" || !dashboardRemoteEnabled) return;

    let isMounted = true;
    fetchAccounts()
      .then((data) => {
        if (isMounted) setAccounts(data);
      })
      .catch((error) => {
        if (isMounted) setAccountError(error.message);
      });

    return () => {
      isMounted = false;
    };
  }, [currentRole]);

  useEffect(() => {
    if (!isAuthenticated || !dashboardRemoteEnabled) return;

    let isMounted = true;

    fetchDashboardData()
      .then((data) => {
        if (!isMounted) return;
        setMenuItems(data.products.map(toMenuItem));
        setMomentItems(data.moments.map(toMomentItem));
        setOrders(data.orders.map(toOrderItem));
        setFinanceRecords(data.finances.map(toFinanceItem));
        setRemoteStatus("Data tersinkron");
      })
      .catch((error) => {
        if (!isMounted) return;
        setRemoteStatus(`Gagal sinkronisasi: ${error.message}`);
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !dashboardRemoteEnabled || !supabase) return;

    const channel = supabase
      .channel("dashboard-orders-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const incomingOrder = toOrderItem(payload.new);
          setOrders((current) => {
            if (current.some((order) => order.id === incomingOrder.id)) {
              return current;
            }
            return [incomingOrder, ...current];
          });
          setRemoteStatus("Order baru masuk");
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  const financeSummary = useMemo(() => {
    const income = financeRecords
      .filter((item) => item.type === "income")
      .reduce((total, item) => total + Number(item.amount || 0), 0);
    const expense = financeRecords
      .filter((item) => item.type === "expense")
      .reduce((total, item) => total + Number(item.amount || 0), 0);
    return { income, expense, profit: income - expense };
  }, [financeRecords]);

  const topMenu = useMemo(
    () =>
      [...menuItems]
        .sort((a, b) => getNumericPrice(b.price) - getNumericPrice(a.price))
        .slice(0, 5),
    [menuItems],
  );

  const averageOrder = orders.length
    ? orders.reduce((total, order) => total + Number(order.total || 0), 0) /
      orders.length
    : 0;

  const revenueBars = useMemo(() => {
    const latestOrders = orders
      .filter((order) => Number(order.total || 0) > 0)
      .slice(0, 7)
      .reverse();
    const maxValue = Math.max(
      ...latestOrders.map((order) => Number(order.total || 0)),
      0,
    );

    return latestOrders.map((order, index) => ({
      id: order.id,
      label: order.product || `Order ${index + 1}`,
      amount: Number(order.total || 0),
      height: maxValue
        ? Math.max(12, Math.round((Number(order.total || 0) / maxValue) * 100))
        : 0,
    }));
  }, [orders]);

  const cashFlowBars = useMemo(() => {
    const latestRecords = financeRecords
      .filter((record) => Number(record.amount || 0) > 0)
      .slice(0, 7)
      .reverse();
    const maxValue = Math.max(
      ...latestRecords.map((record) => Number(record.amount || 0)),
      0,
    );

    return latestRecords.map((record, index) => ({
      id: record.id,
      label: record.category || `Transaksi ${index + 1}`,
      amount: Number(record.amount || 0),
      height: maxValue
        ? Math.max(
            12,
            Math.round((Number(record.amount || 0) / maxValue) * 100),
          )
        : 0,
    }));
  }, [financeRecords]);

  const revenueDistribution = useMemo(() => {
    const colorPalette = [
      "#a61c3c",
      "#4a3e3d",
      "#d65d33",
      "#e8b800",
      "#c86f24",
    ];
    const groupedRevenue = orders.reduce((accumulator, order) => {
      const amount = Number(order.total || 0);
      if (!order.product || amount <= 0) return accumulator;
      accumulator[order.product] = (accumulator[order.product] || 0) + amount;
      return accumulator;
    }, {});

    const source = Object.entries(groupedRevenue).length
      ? Object.entries(groupedRevenue).map(([name, amount]) => ({
          name,
          amount,
        }))
      : topMenu.map((item) => ({
          name: item.name,
          amount: getNumericPrice(item.price),
        }));

    const topRevenue = source
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    const totalRevenue = topRevenue.reduce(
      (total, item) => total + item.amount,
      0,
    );
    const rawSegments = topRevenue.map((item) => ({
      ...item,
      rawPercentage: totalRevenue ? (item.amount / totalRevenue) * 100 : 0,
    }));

    const segments = rawSegments.map((item, index) => {
      const start = rawSegments
        .slice(0, index)
        .reduce((total, segment) => total + segment.rawPercentage, 0);
      const end =
        index === rawSegments.length - 1 ? 100 : start + item.rawPercentage;

      return {
        ...item,
        percentage: Math.round(item.rawPercentage),
        color: colorPalette[index % colorPalette.length],
        start,
        end,
      };
    });

    return {
      total: totalRevenue,
      segments,
      gradient: segments.length
        ? `conic-gradient(${segments
            .map((item) => `${item.color} ${item.start}% ${item.end}%`)
            .join(", ")})`
        : "conic-gradient(#e6ded4 0 100%)",
    };
  }, [orders, topMenu]);

  const handleOrderStatusChange = async (orderId, status) => {
    if (dashboardRemoteEnabled) {
      try {
        const updatedOrder = await updateOrderStatus(orderId, status);
        setOrders((current) =>
          current.map((order) =>
            order.id === orderId ? toOrderItem(updatedOrder) : order,
          ),
        );
        setRemoteStatus(`Order ditandai ${status}`);
      } catch (error) {
        setRemoteStatus(`Gagal update order: ${error.message}`);
      }
      return;
    }

    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    );
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!supabase) {
      setLoginError(
        "Database belum dikonfigurasi. Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.",
      );
      return;
    }
    setIsLoggingIn(true);
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setIsLoggingIn(false);
    if (error) {
      setLoginError("Email atau password salah. Coba lagi.");
      return;
    }
    setPassword("");
    setLoginError("");
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setCurrentRole(null);
    setAccounts([]);
    setActivePanel("overview");
  };

  const handleCreateAccount = async (event) => {
    event.preventDefault();
    const accountEmail = accountForm.email.trim();
    if (!accountEmail || !accountForm.password) {
      setAccountError("Email dan password wajib diisi.");
      setAccountMessage("");
      return;
    }
    setIsCreatingAccount(true);
    setAccountError("");
    setAccountMessage("");
    try {
      const created = await createEmployeeAccount({
        email: accountEmail,
        password: accountForm.password,
        role: accountForm.role,
      });
      setAccountMessage(
        `Akun ${created?.email || accountEmail} berhasil dibuat.`,
      );
      setAccountForm({ email: "", password: "", role: "karyawan" });
      if (created) {
        setAccounts((current) => [
          {
            id: created.id,
            email: created.email,
            role: created.role,
            created_at: new Date().toISOString(),
          },
          ...current.filter((account) => account.id !== created.id),
        ]);
      }
    } catch (error) {
      setAccountError(error.message || "Gagal membuat akun.");
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const addOrder = async (event) => {
    event.preventDefault();
    const nextOrder = {
      id: Date.now(),
      time: formatShortDate(),
      customer: orderForm.customer.trim(),
      product: orderForm.product.trim(),
      items: Number(orderForm.items) || 1,
      status: orderForm.status,
      total: parseAmount(orderForm.total),
      note: orderForm.note.trim(),
    };
    if (!nextOrder.customer || !nextOrder.product || !nextOrder.total) return;

    if (dashboardRemoteEnabled) {
      try {
        const savedOrder = await insertOrder({
          customer: nextOrder.customer,
          product: nextOrder.product,
          items: nextOrder.items,
          status: nextOrder.status,
          total: nextOrder.total,
          note: nextOrder.note,
        });
        setOrders((current) => [toOrderItem(savedOrder), ...current]);
        setRemoteStatus("Order tersimpan");
      } catch (error) {
        setRemoteStatus(`Gagal simpan order: ${error.message}`);
        return;
      }
    } else {
      setOrders((current) => [nextOrder, ...current]);
    }

    setOrderForm({
      customer: "",
      product: "",
      items: "1",
      status: "Menunggu",
      total: "",
      note: "",
    });
  };

  const addFinanceRecord = async (event) => {
    event.preventDefault();
    const nextRecord = {
      id: Date.now(),
      type: financeForm.type,
      category:
        financeForm.category.trim() ||
        (financeForm.type === "income" ? "Penjualan" : "Operasional"),
      label: financeForm.label.trim(),
      amount: parseAmount(financeForm.amount),
      date: financeForm.date || formatShortDate(),
    };
    if (!nextRecord.label || !nextRecord.amount) return;

    if (dashboardRemoteEnabled) {
      try {
        const savedRecord = await insertFinanceRecord({
          type: nextRecord.type,
          category: nextRecord.category,
          label: nextRecord.label,
          amount: nextRecord.amount,
          transaction_date: new Date().toISOString().slice(0, 10),
        });
        setFinanceRecords((current) => [
          toFinanceItem(savedRecord),
          ...current,
        ]);
        setRemoteStatus("Transaksi tersimpan");
      } catch (error) {
        setRemoteStatus(`Gagal simpan transaksi: ${error.message}`);
        return;
      }
    } else {
      setFinanceRecords((current) => [nextRecord, ...current]);
    }

    setFinanceForm({
      type: "income",
      category: "Penjualan",
      label: "",
      amount: "",
      date: "",
    });
  };

  const handleMenuImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setRemoteStatus("File menu harus berupa gambar.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setMenuForm((form) => ({ ...form, img: String(reader.result || "") }));
      setRemoteStatus("Gambar menu siap dipreview.");
    };
    reader.onerror = () => {
      setRemoteStatus("Gagal membaca file gambar menu.");
    };
    reader.readAsDataURL(file);
  };

  const addMenu = async (event) => {
    event.preventDefault();
    const nextMenu = {
      id: Date.now(),
      name: menuForm.name.trim(),
      price: menuForm.price.trim(),
      desc: menuForm.desc.trim(),
      img: menuForm.img.trim(),
    };
    if (!nextMenu.name || !nextMenu.price) {
      setRemoteStatus("Nama dan harga menu wajib diisi sebelum ditampilkan.");
      return;
    }

    if (dashboardRemoteEnabled) {
      try {
        const savedProduct = await insertProduct({
          name: nextMenu.name,
          description: nextMenu.desc,
          price: nextMenu.price,
          image_url: nextMenu.img || null,
          is_featured: true,
          is_available: true,
        });
        setMenuItems((current) => [toMenuItem(savedProduct), ...current]);
        setRemoteStatus("Menu tersimpan dan siap tampil");
      } catch (error) {
        setRemoteStatus(`Gagal simpan menu: ${error.message}`);
        return;
      }
    } else {
      setMenuItems((current) => [nextMenu, ...current]);
      setRemoteStatus("Menu tersimpan di perangkat ini.");
    }

    setMenuForm({ name: "", price: "", desc: "", img: "" });
  };

  const handleMomentImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setRemoteStatus("File moment harus berupa gambar.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setMomentForm((form) => ({
        ...form,
        image: String(reader.result || ""),
      }));
      setRemoteStatus("Gambar moment siap dipreview.");
    };
    reader.onerror = () => {
      setRemoteStatus("Gagal membaca file gambar moment.");
    };
    reader.readAsDataURL(file);
  };

  const addMoment = async (event) => {
    event.preventDefault();
    const nextMoment = {
      id: Date.now(),
      title: momentForm.title.trim(),
      caption: momentForm.caption.trim(),
      tag: momentForm.tag,
      date: momentForm.date,
      target: parseAmount(momentForm.target),
      actual: parseAmount(momentForm.actual),
      image: momentForm.image.trim(),
    };
    if (!nextMoment.title || !nextMoment.caption || !nextMoment.image) return;

    if (dashboardRemoteEnabled) {
      try {
        const savedMoment = await insertMoment({
          title: nextMoment.title,
          caption: nextMoment.caption,
          tag: nextMoment.tag,
          event_date: nextMoment.date || null,
          target: nextMoment.target,
          actual: nextMoment.actual,
          image_url: nextMoment.image || null,
          is_published: true,
        });
        setMomentItems((current) => [toMomentItem(savedMoment), ...current]);
        setRemoteStatus("Moment tersimpan dan siap tampil");
      } catch (error) {
        setRemoteStatus(`Gagal simpan moment: ${error.message}`);
        return;
      }
    } else {
      setMomentItems((current) => [nextMoment, ...current]);
    }

    setMomentForm({
      title: "",
      caption: "",
      tag: "PROMO",
      date: "",
      target: "",
      actual: "",
      image: "",
    });
  };

  const navItems = [
    ["overview", "▦", "Dashboard Utama"],
    ["orders", "▣", "Orderan Masuk"],
    ["finance", "▤", "Pembukuan"],
    ["menu", "♨", "Menu"],
    ["moment", "▧", "Moment Publik"],
    ["reports", "▥", "Laporan"],
    ...(isAdmin ? [["accounts", "◉", "Kelola Akun"]] : []),
  ];

  if (!authChecked) {
    return (
      <main className="login-shell">
        <div className="login-card">
          <p className="eyebrow">YummyYumz admin</p>
          <h1>Memuat...</h1>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="login-shell">
        <form className="login-card" onSubmit={handleLogin}>
          <p className="eyebrow">YummyYumz admin</p>
          <h1>Masuk dashboard</h1>
          <p>
            Masukkan email dan password admin untuk mengakses dashboard order
            dan keuangan.
          </p>
          <label htmlFor="admin-email">Email admin</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email@yummyyumz.com"
          />
          <label htmlFor="admin-password">Password admin</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Masukkan password"
          />
          {loginError ? (
            <strong className="login-error">{loginError}</strong>
          ) : null}
          <button type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </main>
    );
  }

  const renderOverview = () => (
    <>
      <section className="stats-grid">
        <article className="stat-card stat-card-primary">
          <span>Total Pemasukan</span>
          <strong>{formatCurrency(financeSummary.income)}</strong>
        </article>
        <article className="stat-card">
          <span>Laba Bersih</span>
          <strong className="green-text">
            {formatCurrency(financeSummary.profit)}
          </strong>
          <small>Margin bisnis berjalan</small>
        </article>
        <article className="stat-card">
          <span>Total Orderan</span>
          <strong>{orders.length}</strong>
          <small>
            {orders.filter((order) => order.status === "Menunggu").length}{" "}
            pending
          </small>
        </article>
        <article className="stat-card">
          <span>Rata-rata Order</span>
          <strong>{formatCurrency(averageOrder)}</strong>
        </article>
      </section>

      <section className="overview-grid">
        <article className="chart-card wide-card">
          <h2>Grafik Pendapatan dari Order</h2>
          {revenueBars.length ? (
            <>
              <div className="bar-chart">
                {revenueBars.map((item) => (
                  <span
                    key={item.id}
                    style={{ height: `${item.height}%` }}
                    aria-label={`${item.label} ${formatCurrency(item.amount)}`}
                  >
                    <b>{item.height}%</b>
                  </span>
                ))}
              </div>
              <div className="chart-labels dynamic-labels">
                {revenueBars.map((item) => (
                  <span key={item.id}>{item.label}</span>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-chart">
              Belum ada order bernilai. Grafik akan muncul setelah data order
              ditambahkan.
            </div>
          )}
        </article>
        <article className="chart-card">
          <h2>Menu Terlaris</h2>
          <div className="top-list">
            {topMenu.map((item, index) => (
              <div key={item.id} className="top-item">
                <b>#{index + 1}</b>
                <span>
                  {item.name}
                  <small>{index + 2} terjual</small>
                </span>
                <strong>{item.price}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );

  const renderOrders = () => (
    <section className="page-section">
      <div className="section-head">
        <div>
          <h1>Orderan Masuk</h1>
          <p>Kelola pesanan pelanggan YummyYumz.</p>
        </div>
      </div>
      <div className="badge-row">
        <span>
          ● {orders.filter((order) => order.status === "Menunggu").length}{" "}
          Menunggu
        </span>
        <span>
          ● {orders.filter((order) => order.status === "Diproses").length}{" "}
          Diproses
        </span>
      </div>
      <article className="table-card">
        <form className="inline-form" onSubmit={addOrder}>
          <input
            aria-label="Nama pelanggan"
            value={orderForm.customer}
            onChange={(event) =>
              setOrderForm((form) => ({
                ...form,
                customer: event.target.value,
              }))
            }
            placeholder="Nama pelanggan"
          />
          <input
            aria-label="Produk request"
            value={orderForm.product}
            onChange={(event) =>
              setOrderForm((form) => ({ ...form, product: event.target.value }))
            }
            placeholder="Produk/request"
          />
          <input
            aria-label="Total order"
            value={orderForm.total}
            onChange={(event) =>
              setOrderForm((form) => ({ ...form, total: event.target.value }))
            }
            placeholder="Rp 150.000"
          />
          <select
            aria-label="Status order"
            value={orderForm.status}
            onChange={(event) =>
              setOrderForm((form) => ({ ...form, status: event.target.value }))
            }
          >
            <option>Menunggu</option>
            <option>Diproses</option>
            <option>Selesai</option>
            <option>Batal</option>
          </select>
          <button type="submit">+ Buat Pesanan</button>
        </form>
        <div className="data-table">
          <div className="table-row table-head">
            <span>#</span>
            <span>Waktu</span>
            <span>Pelanggan</span>
            <span>Item</span>
            <span>Total</span>
            <span>Status</span>
            <span>Aksi</span>
          </div>
          {orders.map((order) => (
            <div key={order.id} className="table-row">
              <span>#{order.id}</span>
              <span>{order.time}</span>
              <span>
                {order.customer}
                <small>{order.product}</small>
              </span>
              <span>{order.items} item</span>
              <strong>{formatCurrency(order.total)}</strong>
              <span className={`status-pill ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
              <div className="action-group">
                {order.status !== "Selesai" ? (
                  <button
                    type="button"
                    className="action-button action-success"
                    onClick={() => handleOrderStatusChange(order.id, "Selesai")}
                  >
                    Selesai
                  </button>
                ) : null}
                <button
                  type="button"
                  className="action-button action-danger"
                  onClick={() =>
                    dashboardRemoteEnabled
                      ? deleteOrder(order.id)
                          .then(() => {
                            setOrders((current) =>
                              current.filter((item) => item.id !== order.id),
                            );
                            setRemoteStatus("Order dihapus");
                          })
                          .catch((error) =>
                            setRemoteStatus(
                              `Gagal hapus order: ${error.message}`,
                            ),
                          )
                      : setOrders((current) =>
                          current.filter((item) => item.id !== order.id),
                        )
                  }
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );

  const renderFinance = () => (
    <section className="page-section">
      <div className="section-head">
        <div>
          <h1>Buku Kas</h1>
          <p>Catat semua pemasukan dan pengeluaran toko.</p>
        </div>
      </div>
      <article className="table-card">
        <form className="inline-form" onSubmit={addFinanceRecord}>
          <select
            aria-label="Jenis transaksi"
            value={financeForm.type}
            onChange={(event) =>
              setFinanceForm((form) => ({ ...form, type: event.target.value }))
            }
          >
            <option value="income">Pemasukan</option>
            <option value="expense">Pengeluaran</option>
          </select>
          <input
            aria-label="Kategori"
            value={financeForm.category}
            onChange={(event) =>
              setFinanceForm((form) => ({
                ...form,
                category: event.target.value,
              }))
            }
            placeholder="Kategori"
          />
          <input
            aria-label="Keterangan"
            value={financeForm.label}
            onChange={(event) =>
              setFinanceForm((form) => ({ ...form, label: event.target.value }))
            }
            placeholder="Keterangan"
          />
          <input
            aria-label="Nominal"
            value={financeForm.amount}
            onChange={(event) =>
              setFinanceForm((form) => ({
                ...form,
                amount: event.target.value,
              }))
            }
            placeholder="Rp 150.000"
          />
          <button type="submit">+ Tambah Transaksi</button>
        </form>
        <div className="cash-tabs">
          <span>Semua</span>
          <span>Pemasukan</span>
          <span>Pengeluaran</span>
        </div>
        <div className="data-table cash-table">
          <div className="table-row table-head">
            <span>Tanggal</span>
            <span>Kategori</span>
            <span>Keterangan</span>
            <span>Jumlah</span>
          </div>
          {financeRecords.map((record) => (
            <div key={record.id} className="table-row">
              <span>{record.date}</span>
              <span className="category-pill">{record.category}</span>
              <span>{record.label}</span>
              <strong
                className={record.type === "income" ? "green-text" : "red-text"}
              >
                {record.type === "income" ? "↗" : "↘"}{" "}
                {formatCurrency(record.amount)}
              </strong>
            </div>
          ))}
        </div>
      </article>
    </section>
  );

  const renderMenu = () => (
    <section className="page-section">
      <div className="section-head">
        <div>
          <h1>Daftar Menu</h1>
          <p>Kelola produk yang tersedia.</p>
        </div>
      </div>
      {!dashboardRemoteEnabled ? (
        <div className="sync-warning">
          Database belum terhubung. Sambungkan konfigurasi penyimpanan sebelum
          publikasi agar data produk tersinkron di semua halaman.
        </div>
      ) : null}
      <form className="inline-form menu-form" onSubmit={addMenu}>
        <input
          aria-label="Nama menu"
          value={menuForm.name}
          onChange={(event) =>
            setMenuForm((form) => ({ ...form, name: event.target.value }))
          }
          placeholder="Nama menu"
        />
        <input
          aria-label="Harga menu"
          value={menuForm.price}
          onChange={(event) =>
            setMenuForm((form) => ({ ...form, price: event.target.value }))
          }
          placeholder="Rp 95.000"
        />
        <input
          aria-label="Deskripsi menu"
          value={menuForm.desc}
          onChange={(event) =>
            setMenuForm((form) => ({ ...form, desc: event.target.value }))
          }
          placeholder="Deskripsi"
        />
        <label className="file-field">
          <span>Gambar Menu</span>
          <input
            aria-label="Upload gambar menu"
            type="file"
            accept="image/*"
            onChange={handleMenuImageChange}
          />
        </label>
        <button type="submit">+ Tambah Menu</button>
      </form>
      {menuForm.img ? (
        <div className="upload-preview">
          <img src={menuForm.img} alt="Preview gambar menu" />
          <span>Preview gambar menu yang akan tampil di halaman publik</span>
        </div>
      ) : null}
      <div className="menu-grid">
        {menuItems.map((item) => (
          <article key={item.id} className="menu-card">
            <div className="menu-image">
              {item.img ? <img src={item.img} alt={item.name} /> : "▧"}
              <span>{item.isAvailable === false ? "Draft" : "Tersedia"}</span>
            </div>
            <div>
              <h2>{item.name}</h2>
              <p>{item.desc}</p>
              <strong>{item.price}</strong>
              <button
                type="button"
                onClick={() =>
                  dashboardRemoteEnabled
                    ? deleteProduct(item.id)
                        .then(() => {
                          setMenuItems((current) =>
                            current.filter((menu) => menu.id !== item.id),
                          );
                          setRemoteStatus("Menu dihapus");
                        })
                        .catch((error) =>
                          setRemoteStatus(`Gagal hapus menu: ${error.message}`),
                        )
                    : setMenuItems((current) =>
                        current.filter((menu) => menu.id !== item.id),
                      )
                }
              >
                Hapus
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  const renderMoment = () => (
    <section className="page-section">
      <div className="section-head">
        <div>
          <h1>Moment Publik</h1>
          <p>Kelola slide moment yang tampil di halaman publik.</p>
        </div>
      </div>
      <form className="inline-form moment-form" onSubmit={addMoment}>
        <input
          aria-label="Judul moment"
          value={momentForm.title}
          onChange={(event) =>
            setMomentForm((form) => ({ ...form, title: event.target.value }))
          }
          placeholder="Birthday Surprise"
        />
        <input
          aria-label="Tag moment"
          value={momentForm.tag}
          onChange={(event) =>
            setMomentForm((form) => ({ ...form, tag: event.target.value }))
          }
          placeholder="Ulang Tahun"
        />
        <input
          aria-label="Caption moment"
          value={momentForm.caption}
          onChange={(event) =>
            setMomentForm((form) => ({ ...form, caption: event.target.value }))
          }
          placeholder="Caption yang tampil di halaman publik"
        />
        <label className="file-field">
          <span>Gambar Moment</span>
          <input
            aria-label="Upload gambar moment"
            type="file"
            accept="image/*"
            onChange={handleMomentImageChange}
          />
        </label>
        <input
          aria-label="Target moment"
          value={momentForm.target}
          onChange={(event) =>
            setMomentForm((form) => ({ ...form, target: event.target.value }))
          }
          placeholder="Target opsional"
        />
        <button type="submit">+ Publikasikan Moment</button>
      </form>
      {momentForm.image ? (
        <div className="upload-preview">
          <img src={momentForm.image} alt="Preview gambar moment" />
          <span>Preview gambar yang akan tampil di halaman publik</span>
        </div>
      ) : null}
      <div className="moment-grid">
        {momentItems.map((item) => {
          const percent = item.target
            ? Math.min(
                100,
                Math.round(
                  (Number(item.actual || 0) / Number(item.target)) * 100,
                ),
              )
            : 0;
          return (
            <article key={item.id} className="moment-card">
              {item.image ? (
                <img
                  className="moment-preview"
                  src={item.image}
                  alt={item.title}
                />
              ) : null}
              <div>
                <span>{item.tag}</span>
                <small>{item.date || "Tampil di halaman publik"}</small>
              </div>
              <h2>{item.title}</h2>
              <p>{item.caption}</p>
              <div className="target-row">
                <span>
                  Target <b>{formatCurrency(item.target)}</b>
                </span>
                <span>
                  Aktual <b>{formatCurrency(item.actual)}</b>
                </span>
              </div>
              <div className="progress">
                <i style={{ width: `${percent}%` }} />
              </div>
              <small>Pencapaian {percent}%</small>
            </article>
          );
        })}
      </div>
    </section>
  );

  const renderReports = () => (
    <section className="page-section">
      <div className="section-head">
        <div>
          <h1>Laporan Keuangan</h1>
          <p>Analisis performa bisnis YummyYumz.</p>
        </div>
      </div>
      <section className="stats-grid report-stats">
        <article className="stat-card">
          <span>Total Pemasukan</span>
          <strong className="green-text">
            {formatCurrency(financeSummary.income)}
          </strong>
        </article>
        <article className="stat-card">
          <span>Total Pengeluaran</span>
          <strong className="red-text">
            {formatCurrency(financeSummary.expense)}
          </strong>
        </article>
        <article className="stat-card stat-card-primary">
          <span>Laba Bersih</span>
          <strong>{formatCurrency(financeSummary.profit)}</strong>
        </article>
      </section>
      <section className="overview-grid">
        <article className="chart-card">
          <h2>Arus Kas</h2>
          {cashFlowBars.length ? (
            <>
              <div className="bar-chart compact">
                {cashFlowBars.map((item) => (
                  <span
                    key={item.id}
                    style={{ height: `${item.height}%` }}
                    aria-label={`${item.label} ${formatCurrency(item.amount)}`}
                  >
                    <b>{item.height}%</b>
                  </span>
                ))}
              </div>
              <div className="chart-labels dynamic-labels">
                {cashFlowBars.map((item) => (
                  <span key={item.id}>{item.label}</span>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-chart compact-empty">
              Belum ada transaksi pembukuan.
            </div>
          )}
        </article>
        <article className="chart-card">
          <h2>Distribusi Pendapatan per Menu</h2>
          <div
            className="donut-chart"
            style={{ background: revenueDistribution.gradient }}
          >
            <strong>{formatCurrency(revenueDistribution.total)}</strong>
            <small>Total</small>
          </div>
          <div className="legend distribution-legend">
            {revenueDistribution.segments.map((item) => (
              <div key={item.name} className="legend-item">
                <i style={{ background: item.color }} />
                <span>{item.name}</span>
                <b>{item.percentage}%</b>
                <small>{formatCurrency(item.amount)}</small>
              </div>
            ))}
          </div>
        </article>
      </section>
    </section>
  );

  const renderAccounts = () => (
    <section className="page-section">
      <div className="section-head">
        <div>
          <h1>Kelola Akun</h1>
          <p>Tambah akun karyawan atau admin dan atur perannya.</p>
        </div>
      </div>
      {!dashboardRemoteEnabled ? (
        <div className="sync-warning">
          Database belum terhubung. Sambungkan Supabase untuk mengelola akun.
        </div>
      ) : null}
      <form className="inline-form" onSubmit={handleCreateAccount}>
        <input
          aria-label="Email akun"
          type="email"
          value={accountForm.email}
          onChange={(event) =>
            setAccountForm((form) => ({ ...form, email: event.target.value }))
          }
          placeholder="karyawan@yummyyumz.com"
        />
        <input
          aria-label="Password akun"
          type="password"
          value={accountForm.password}
          onChange={(event) =>
            setAccountForm((form) => ({
              ...form,
              password: event.target.value,
            }))
          }
          placeholder="Password (min. 6 karakter)"
        />
        <select
          aria-label="Role akun"
          value={accountForm.role}
          onChange={(event) =>
            setAccountForm((form) => ({ ...form, role: event.target.value }))
          }
        >
          <option value="karyawan">Karyawan</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" disabled={isCreatingAccount}>
          {isCreatingAccount ? "Menyimpan..." : "+ Tambah Akun"}
        </button>
      </form>
      {accountError ? (
        <strong className="login-error">{accountError}</strong>
      ) : null}
      {accountMessage ? <p className="login-hint">{accountMessage}</p> : null}
      <div className="data-table">
        <div className="table-row table-head">
          <span>Email</span>
          <span>Role</span>
          <span>Dibuat</span>
        </div>
        {accounts.map((account) => (
          <div key={account.id} className="table-row">
            <span>{account.email}</span>
            <span className="status-pill">{account.role}</span>
            <span>
              {account.created_at ? formatShortDate(account.created_at) : "-"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );

  const pageTitle =
    navItems.find(([key]) => key === activePanel)?.[2] || "Dashboard Utama";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div>Ψ</div>
          <strong>
            Dashboard
            <br />
            Keuangan
          </strong>
        </div>
        <nav>
          {navItems.map(([key, icon, label]) => (
            <button
              key={key}
              type="button"
              className={activePanel === key ? "active" : ""}
              onClick={() => setActivePanel(key)}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </nav>
        <div className="profile">
          <b>B</b>
          <span>
            Budi Santoso<small>Pemilik YummyYumz</small>
          </span>
        </div>
      </aside>
      <main className="main-panel">
        <header className="topbar">
          <h1>{pageTitle}</h1>
          <div className="topbar-meta">
            <small>{remoteStatus}</small>
            <span>{todayLabel}</span>
          </div>
        </header>
        <div className="content-area">
          {activePanel === "overview" ? renderOverview() : null}
          {activePanel === "orders" ? renderOrders() : null}
          {activePanel === "finance" ? renderFinance() : null}
          {activePanel === "menu" ? renderMenu() : null}
          {activePanel === "moment" ? renderMoment() : null}
          {activePanel === "reports" ? renderReports() : null}
          {activePanel === "accounts" && isAdmin ? renderAccounts() : null}

          <button
            type="button"
            className="logout-floating"
            onClick={handleLogout}
          >
            Keluar
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
