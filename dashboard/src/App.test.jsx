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
    expect(window.localStorage.getItem("yummyyumz-dashboard-menu")).toContain(
      "Lotus Biscoff",
    );
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
    expect(window.localStorage.getItem("yummyyumz-dashboard-orders")).toContain(
      "Salsa",
    );
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
    expect(
      window.localStorage.getItem("yummyyumz-dashboard-finances"),
    ).toContain("Order Salsa");
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
});
