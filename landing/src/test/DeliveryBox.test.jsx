import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DeliveryBox from "../components/sections/DeliveryBox";

vi.mock("gsap", () => ({
  gsap: {
    registerPlugin: vi.fn(),
    from: vi.fn(),
    to: vi.fn(),
    context: (callback) => {
      callback();
      return { revert: vi.fn() };
    },
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

describe("DeliveryBox", () => {
  it("menampilkan section Moment dengan kontrol slider", () => {
    render(<DeliveryBox />);

    expect(
      screen.getByText((content) => content.trim() === "✨ Moment ✨"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /slide sebelumnya/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /slide berikutnya/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/packaging & delivery/i)).not.toBeInTheDocument();
  });
});
