import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock axios.create used by Dashboard
vi.mock('axios', () => {
  return {
    create: () => ({
      interceptors: { request: { use: vi.fn() } },
      get: vi.fn(() => Promise.resolve({ data: { total: 1, delivered: 0, avgDeliveryMinutes: 5 } })),
      post: vi.fn(() => Promise.resolve({ data: { _id: 'demo-123' } })),
    }),
  };
});

// import after mocking
import Dashboard from '../Dashboard';

describe('Dashboard', () => {
  beforeEach(() => {
    localStorage.setItem('accessToken', 'dummy.' + btoa(JSON.stringify({ tenantId: 'tid' })) + '.sig');
    // stub location.assign to avoid real navigation
    delete window.location;
    window.location = { href: '/', assign: vi.fn() };
  });

  afterEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('creates a demo delivery and navigates to upload page', async () => {
    render(<Dashboard />);

    const btn = screen.getByRole('button', { name: /create demo delivery/i });
    fireEvent.click(btn);

    await waitFor(() => expect(window.location.href).toContain('/upload-pod?deliveryId='));
  });
});
