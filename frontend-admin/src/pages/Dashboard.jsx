import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const api = axios.create();
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('accessToken');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get((import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/deliveries/stats');
        setStats(res.data);
      } catch (err) {
        // ignore
      }
    })();
  }, []);

  const data = [
    { name: 'Mon', deliveries: 30 },
    { name: 'Tue', deliveries: 45 },
    { name: 'Wed', deliveries: 28 },
    { name: 'Thu', deliveries: 60 },
    { name: 'Fri', deliveries: 50 },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl">Dashboard</h1>
        <div>
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => { localStorage.removeItem('accessToken'); window.location.href = '/login'; }}>Logout</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow">Total: {stats?.total ?? '-'}</div>
        <div className="p-4 bg-white rounded shadow">Delivered: {stats?.delivered ?? '-'}</div>
        <div className="p-4 bg-white rounded shadow">Avg min: {stats?.avgDeliveryMinutes ?? '-'}</div>
      </div>

      <div className="p-4 bg-white rounded shadow" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="deliveries" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <a href="/upload-pod" className="inline-block px-4 py-2 bg-green-600 text-white rounded">Upload POD (test UI)</a>
      </div>
    </div>
  );
}
