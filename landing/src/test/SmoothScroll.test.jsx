import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SmoothScroll from "../components/SmoothScroll";

const { lenisInstance, addTicker, removeTicker, lagSmoothing } = vi.hoisted(
  () => ({
    lenisInstance: {
      raf: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      destroy: vi.fn(),
    },
    addTicker: vi.fn(),
    removeTicker: vi.fn(),
    lagSmoothing: vi.fn(),
  }),
);

vi.mock("@studio-freight/lenis", () => ({
  default: class MockLenis {
    constructor() {
      return lenisInstance;
    }
  },
}));

vi.mock("gsap", () => ({
  gsap: {
    registerPlugin: vi.fn(),
    ticker: {
      add: addTicker,
      remove: removeTicker,
      lagSmoothing,
    },
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    update: vi.fn(),
  },
}));

describe("SmoothScroll", () => {
  it("membersihkan ticker dengan callback yang sama saat unmount", () => {
    const { unmount } = render(
      <SmoothScroll>
        <div>Konten</div>
      </SmoothScroll>,
    );

    const registeredCallback = addTicker.mock.calls[0]?.[0];

    expect(typeof registeredCallback).toBe("function");

    unmount();

    expect(removeTicker).toHaveBeenCalledWith(registeredCallback);
    expect(lenisInstance.destroy).toHaveBeenCalledTimes(1);
  });
});
