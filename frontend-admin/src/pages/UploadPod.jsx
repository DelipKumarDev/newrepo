import React, { useState } from 'react';

export default function UploadPod() {
  const [deliveryId, setDeliveryId] = useState('');
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');

  // Pre-fill deliveryId from URL query param (so dashboard/demo can redirect here)
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('deliveryId');
      if (id) setDeliveryId(id);
    } catch (err) {
      // ignore
    }
  }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!deliveryId || !file) return setMsg('provide delivery id + file');
    const token = localStorage.getItem('accessToken');
    const form = new FormData();
    form.append('file', file);

    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3001') + `/api/deliveries/${deliveryId}/pod`, {
      method: 'POST',
      body: form,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (res.ok) {
      const body = await res.json();
      setMsg(`Uploaded — podUrl: ${body.podUrl}`);
    } else {
      const text = await res.text();
      setMsg(`Upload failed: ${res.status} ${text}`);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Upload POD (test UI)</h2>
      <form onSubmit={upload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Delivery ID</label>
          <input value={deliveryId} onChange={e => setDeliveryId(e.target.value)} className="mt-1 block w-full border px-2 py-1" />
        </div>
        <div>
          <label className="block text-sm font-medium">File</label>
          <input type="file" onChange={e => setFile(e.target.files[0])} className="mt-1" />
        </div>
        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Upload POD</button>
        </div>
      </form>
      <div className="mt-4 text-sm text-gray-700">{msg}</div>
    </div>
  );
}
