import { describe, expect, it } from 'vitest';
import * as siteData from '../data/siteData';

describe('siteData', () => {
  it('menyediakan data momentSlides yang siap dipakai slider homepage', () => {
    expect(Array.isArray(siteData.momentSlides)).toBe(true);
    expect(siteData.momentSlides?.length).toBeGreaterThan(0);
    expect(siteData.momentSlides?.[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        caption: expect.any(String),
        image: expect.any(String),
      }),
    );
  });

  it('menyediakan data faqItems untuk halaman FAQ', () => {
    expect(Array.isArray(siteData.faqItems)).toBe(true);
    expect(siteData.faqItems?.length).toBeGreaterThan(0);
    expect(siteData.faqItems?.[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        question: expect.any(String),
        answer: expect.any(String),
      }),
    );
  });
});
