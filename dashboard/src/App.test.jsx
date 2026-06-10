import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('Dashboard App', () => {
  it('menampilkan area kelola menu dan kelola moment', () => {
    render(<App />);

    expect(screen.getByRole('tab', { name: /kelola menu/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /kelola moment/i })).toBeInTheDocument();
    expect(screen.queryByText(/get started/i)).not.toBeInTheDocument();
  });

  it('dapat menambahkan item menu baru secara lokal', () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/nama menu/i), {
      target: { value: 'Lotus Biscoff' },
    });
    fireEvent.change(screen.getByLabelText(/harga menu/i), {
      target: { value: 'Rp 95.000' },
    });
    fireEvent.change(screen.getByLabelText(/deskripsi menu/i), {
      target: { value: 'Buttercream lembut dengan taburan lotus.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /simpan menu/i }));

    expect(screen.getByText(/Lotus Biscoff/i)).toBeInTheDocument();
  });
});
