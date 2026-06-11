import { describe, expect, it } from "vitest";
import * as siteData from "../data/siteData";

describe("siteData", () => {
  it("menyediakan struktur data momentSlides untuk slider homepage", () => {
    expect(Array.isArray(siteData.momentSlides)).toBe(true);
  });

  it("menyediakan struktur data faqItems untuk halaman FAQ", () => {
    expect(Array.isArray(siteData.faqItems)).toBe(true);
  });
});
