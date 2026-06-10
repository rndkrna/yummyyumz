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
      screen.getByRole("tab", { name: /kelola menu/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /kelola moment/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/get started/i)).not.toBeInTheDocument();
  });

  it("dapat menambahkan item menu baru secara lokal", () => {
    login();

    fireEvent.change(screen.getByLabelText(/nama menu/i), {
      target: { value: "Lotus Biscoff" },
    });
    fireEvent.change(screen.getByLabelText(/harga menu/i), {
      target: { value: "Rp 95.000" },
    });
    fireEvent.change(screen.getByLabelText(/deskripsi menu/i), {
      target: { value: "Buttercream lembut dengan taburan lotus." },
    });
    fireEvent.click(screen.getByRole("button", { name: /simpan menu/i }));

    expect(screen.getByText(/Lotus Biscoff/i)).toBeInTheDocument();
    expect(window.localStorage.getItem("yummyyumz-dashboard-menu")).toContain(
      "Lotus Biscoff",
    );
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
