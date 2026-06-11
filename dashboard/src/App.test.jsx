import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

const login = () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText(/password admin/i), {
    target: { value: "yummyadmin" },
  });
  fireEvent.click(screen.getByRole("button", { name: /masuk/i }));
};

describe("Dashboard App", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("menampilkan area kelola menu dan kelola moment setelah login", () => {
    login();

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

  it("dapat menambahkan item menu baru secara lokal", () => {
    login();

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

  it("dapat menambahkan order baru", () => {
    login();
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

  it("dapat menambahkan transaksi keuangan", () => {
    login();
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

  it("menolak password admin yang salah", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/password admin/i), {
      target: { value: "salah" },
    });
    fireEvent.click(screen.getByRole("button", { name: /masuk/i }));

    expect(screen.getByText(/password admin salah/i)).toBeInTheDocument();
  });
});
