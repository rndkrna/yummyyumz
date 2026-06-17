import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const VALID_EMAIL = "admin@yummyyumz.com";
const VALID_PASSWORD = "rahasia-supabase";

let currentSession = null;
let authCallback = null;

const signInWithPassword = vi.fn(async ({ email, password }) => {
  if (email === VALID_EMAIL && password === VALID_PASSWORD) {
    currentSession = { user: { email } };
    authCallback?.("SIGNED_IN", currentSession);
    return { data: { session: currentSession }, error: null };
  }
  return {
    data: { session: null },
    error: { message: "Invalid login credentials" },
  };
});

const signOut = vi.fn(async () => {
  currentSession = null;
  authCallback?.("SIGNED_OUT", null);
  return { error: null };
});

vi.mock("./lib/supabase", () => ({
  isSupabaseConfigured: true,
  supabase: {
    auth: {
      getSession: vi.fn(async () => ({ data: { session: currentSession } })),
      onAuthStateChange: vi.fn((callback) => {
        authCallback = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      }),
      signInWithPassword,
      signOut,
    },
  },
}));

vi.mock("./services/dashboardData", () => ({
  dashboardRemoteEnabled: false,
  fetchDashboardData: vi.fn(),
  insertProduct: vi.fn(),
  insertMoment: vi.fn(),
  insertOrder: vi.fn(),
  insertFinanceRecord: vi.fn(),
  updateOrderStatus: vi.fn(),
  deleteProduct: vi.fn(),
  deleteOrder: vi.fn(),
}));

const fetchCurrentRole = vi.fn(async () => "karyawan");
const fetchAccounts = vi.fn(async () => []);
const createEmployeeAccount = vi.fn(async ({ email, role }) => ({
  id: "new-user-id",
  email,
  role,
}));

vi.mock("./services/accounts", () => ({
  fetchCurrentRole: (...args) => fetchCurrentRole(...args),
  fetchAccounts: (...args) => fetchAccounts(...args),
  createEmployeeAccount: (...args) => createEmployeeAccount(...args),
}));

const { default: App } = await import("./App");

const login = async () => {
  render(<App />);
  fireEvent.change(await screen.findByLabelText(/email admin/i), {
    target: { value: VALID_EMAIL },
  });
  fireEvent.change(screen.getByLabelText(/password admin/i), {
    target: { value: VALID_PASSWORD },
  });
  fireEvent.click(screen.getByRole("button", { name: /masuk/i }));
  await screen.findByRole("button", { name: /orderan masuk/i });
};

describe("Dashboard App", () => {
  beforeEach(() => {
    window.localStorage.clear();
    currentSession = null;
    authCallback = null;
    signInWithPassword.mockClear();
    signOut.mockClear();
    fetchCurrentRole.mockClear();
    fetchCurrentRole.mockResolvedValue("karyawan");
    fetchAccounts.mockClear();
    fetchAccounts.mockResolvedValue([]);
    createEmployeeAccount.mockClear();
    createEmployeeAccount.mockImplementation(async ({ email, role }) => ({
      id: "new-user-id",
      email,
      role,
    }));
  });

  it("menampilkan area kelola menu dan kelola moment setelah login", async () => {
    await login();

    expect(
      screen.getByRole("button", { name: /orderan masuk/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /pembukuan/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /menu/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /moment/i })).toBeInTheDocument();
    expect(screen.queryByText(/get started/i)).not.toBeInTheDocument();
  });

  it("dapat menambahkan item menu baru", async () => {
    await login();

    fireEvent.click(screen.getByRole("button", { name: /menu/i }));

    fireEvent.change(screen.getByLabelText(/nama menu/i), {
      target: { value: "Lotus Biscoff" },
    });
    fireEvent.change(screen.getByLabelText(/harga menu/i), {
      target: { value: "Rp 95.000" },
    });
    fireEvent.change(screen.getByLabelText(/deskripsi menu/i), {
      target: { value: "Buttercream lembut dengan taburan lotus." },
    });
    fireEvent.click(screen.getByRole("button", { name: /tambah menu/i }));

    expect(screen.getByText(/Lotus Biscoff/i)).toBeInTheDocument();
  });

  it("mengabaikan data lama di localStorage", async () => {
    window.localStorage.setItem(
      "yummyyumz-dashboard-menu",
      JSON.stringify([{ id: 1, name: "Bolu Ketan Hitam", price: "Rp 85.000" }]),
    );

    await login();
    fireEvent.click(screen.getByRole("button", { name: /menu/i }));

    expect(screen.queryByText(/Bolu Ketan Hitam/i)).not.toBeInTheDocument();
  });

  it("dapat menambahkan order baru", async () => {
    await login();
    fireEvent.click(screen.getByRole("button", { name: /orderan masuk/i }));

    fireEvent.change(screen.getByLabelText(/nama pelanggan/i), {
      target: { value: "Salsa" },
    });
    fireEvent.change(screen.getByLabelText(/produk request/i), {
      target: { value: "Custom Graduation" },
    });
    fireEvent.change(screen.getByLabelText(/total order/i), {
      target: { value: "Rp 180.000" },
    });
    fireEvent.click(screen.getByRole("button", { name: /buat pesanan/i }));

    expect(screen.getByText(/Salsa/i)).toBeInTheDocument();
  });

  it("dapat menambahkan transaksi keuangan", async () => {
    await login();
    fireEvent.click(screen.getByRole("button", { name: /pembukuan/i }));

    fireEvent.change(screen.getByLabelText(/keterangan/i), {
      target: { value: "Order Salsa" },
    });
    fireEvent.change(screen.getByLabelText(/nominal/i), {
      target: { value: "Rp 180.000" },
    });
    fireEvent.click(screen.getByRole("button", { name: /tambah transaksi/i }));

    expect(screen.getByText(/Order Salsa/i)).toBeInTheDocument();
  });

  it("memanggil Supabase auth saat login", async () => {
    await login();

    expect(signInWithPassword).toHaveBeenCalledWith({
      email: VALID_EMAIL,
      password: VALID_PASSWORD,
    });
  });

  it("menolak kredensial yang salah", async () => {
    render(<App />);

    fireEvent.change(await screen.findByLabelText(/email admin/i), {
      target: { value: VALID_EMAIL },
    });
    fireEvent.change(screen.getByLabelText(/password admin/i), {
      target: { value: "salah" },
    });
    fireEvent.click(screen.getByRole("button", { name: /masuk/i }));

    expect(
      await screen.findByText(/email atau password salah/i),
    ).toBeInTheDocument();
  });

  it("dapat keluar lewat Supabase signOut", async () => {
    await login();

    fireEvent.click(screen.getByRole("button", { name: /keluar/i }));

    await waitFor(() => expect(signOut).toHaveBeenCalled());
    expect(
      await screen.findByRole("button", { name: /masuk/i }),
    ).toBeInTheDocument();
  });

  it("menyembunyikan menu Kelola Akun untuk karyawan", async () => {
    fetchCurrentRole.mockResolvedValue("karyawan");
    await login();

    await waitFor(() => expect(fetchCurrentRole).toHaveBeenCalled());
    expect(
      screen.queryByRole("button", { name: /kelola akun/i }),
    ).not.toBeInTheDocument();
  });

  it("menampilkan menu Kelola Akun untuk admin", async () => {
    fetchCurrentRole.mockResolvedValue("admin");
    await login();

    expect(
      await screen.findByRole("button", { name: /kelola akun/i }),
    ).toBeInTheDocument();
  });

  it("admin dapat menambah akun karyawan", async () => {
    fetchCurrentRole.mockResolvedValue("admin");
    await login();

    fireEvent.click(
      await screen.findByRole("button", { name: /kelola akun/i }),
    );

    fireEvent.change(screen.getByLabelText(/email akun/i), {
      target: { value: "karyawan@yummyyumz.com" },
    });
    fireEvent.change(screen.getByLabelText(/password akun/i), {
      target: { value: "rahasia123" },
    });
    fireEvent.change(screen.getByLabelText(/role akun/i), {
      target: { value: "karyawan" },
    });
    fireEvent.click(screen.getByRole("button", { name: /tambah akun/i }));

    await waitFor(() =>
      expect(createEmployeeAccount).toHaveBeenCalledWith({
        email: "karyawan@yummyyumz.com",
        password: "rahasia123",
        role: "karyawan",
      }),
    );
    expect(
      await screen.findByText(/berhasil dibuat/i),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/karyawan@yummyyumz\.com/i).length,
    ).toBeGreaterThanOrEqual(2);
  });

  it("menampilkan pesan error saat gagal menambah akun", async () => {
    fetchCurrentRole.mockResolvedValue("admin");
    createEmployeeAccount.mockRejectedValue(new Error("Email sudah dipakai."));
    await login();

    fireEvent.click(
      await screen.findByRole("button", { name: /kelola akun/i }),
    );
    fireEvent.change(screen.getByLabelText(/email akun/i), {
      target: { value: "dobel@yummyyumz.com" },
    });
    fireEvent.change(screen.getByLabelText(/password akun/i), {
      target: { value: "rahasia123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /tambah akun/i }));

    expect(
      await screen.findByText(/email sudah dipakai/i),
    ).toBeInTheDocument();
  });
});
