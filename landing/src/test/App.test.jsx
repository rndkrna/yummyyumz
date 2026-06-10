import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from '../App';

const MockSmoothScrollContext = React.createContext(null);
function MockSmoothScrollProvider({ children }) {
  return (
    <MockSmoothScrollContext.Provider value={{ scrollTo: vi.fn() }}>
      {children}
    </MockSmoothScrollContext.Provider>
  );
}

function NavbarMock() {
  const lenis = React.useContext(MockSmoothScrollContext);

  return (
    <div data-testid="navbar-context">
      {lenis ? 'with-context' : 'without-context'}
    </div>
  );
}

vi.mock('../components/SmoothScroll', () => ({
  default: MockSmoothScrollProvider,
  useSmoothScroll: () => React.useContext(MockSmoothScrollContext),
}));

vi.mock('../components/Preloader', () => ({
  default: () => null,
}));

vi.mock('../components/CustomCursor', () => ({
  default: () => null,
}));

vi.mock('../components/Navbar', () => ({
  default: NavbarMock,
}));

vi.mock('../pages/Home', () => ({
  default: () => <main>Home</main>,
}));

vi.mock('../pages/FullCatalog', () => ({
  default: () => <main>Katalog</main>,
}));

vi.mock('../pages/About', () => ({
  default: () => <main>Tentang Kami</main>,
}));

vi.mock('../pages/Contact', () => ({
  default: () => <main>Hubungi Kami</main>,
}));

vi.mock('../pages/FAQ', () => ({
  default: () => <main>FAQ</main>,
}));

vi.mock('../pages/AboutContact', () => ({
  default: () => <main>Tentang & Kontak Lama</main>,
}));

describe('App', () => {
  it('menempatkan Navbar di dalam provider SmoothScroll', () => {
    render(<App />);

    expect(screen.getByTestId('navbar-context')).toHaveTextContent('with-context');
  });

  it.each([
    ['/about', 'Tentang Kami'],
    ['/contact', 'Hubungi Kami'],
    ['/faq', 'FAQ'],
  ])('menyediakan route %s', (path, expectedText) => {
    window.history.pushState({}, '', path);

    render(<App />);

    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });
});
