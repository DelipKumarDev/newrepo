import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadPod from '../UploadPod';

// polyfill fetch for Vitest/jsdom
import 'whatwg-fetch';

describe('UploadPod UI', () => {
  beforeEach(() => {
    // ensure no token required for test UI
    localStorage.removeItem('accessToken');
  });

  it('shows error when missing inputs and displays success after upload', async () => {
    // mock successful upload response
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ podUrl: '/uploads/test/pod.txt' }) }),
    );

    render(<UploadPod />);

    // submit without inputs
    fireEvent.click(screen.getByRole('button', { name: /upload pod/i }));
    expect(await screen.findByText(/provide delivery id \+ file/i)).toBeInTheDocument();

    // provide delivery id and file
    const deliveryInput = screen.getByLabelText(/delivery id/i);
    fireEvent.change(deliveryInput, { target: { value: 'DEL-1' } });

    const file = new File(['hello'], 'pod.txt', { type: 'text/plain' });
    const fileInput = screen.getByLabelText(/file/i);
    Object.defineProperty(fileInput, 'files', { value: [file] });
    fireEvent.change(fileInput);

    fireEvent.click(screen.getByRole('button', { name: /upload pod/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(await screen.findByText(/uploaded — podUrl:/i)).toBeInTheDocument();
  });

  it('prefills delivery id from URL query param', async () => {
    // set URL param before rendering
    const demoId = 'DEMO-URL-1';
    window.history.pushState({}, 'Test', `/upload-pod?deliveryId=${demoId}`);

    render(<UploadPod />);

    const deliveryInput = await screen.findByLabelText(/delivery id/i);
    expect(deliveryInput.value).toBe(demoId);
  });
});