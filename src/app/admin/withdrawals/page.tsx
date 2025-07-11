'use client';

import { useEffect, useState } from 'react';

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/withdrawals')
      .then(res => res.json())
      .then(data => {
        setWithdrawals(data.withdrawals || []);
        setLoading(false);
      });
  }, []);

  const handleAction = async (id: string, status: string) => {
    setMessage('');
    const res = await fetch('/api/admin/withdrawals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    const data = await res.json();
    if (data.success) {
      setWithdrawals(w => w.map(x => x.id === id ? { ...x, status } : x));
      setMessage('Actualizado correctamente');
    } else {
      setMessage(data.error || 'Error al actualizar');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Panel de Retiros (Admin)</h1>
      {message && <div className="mb-4 text-green-400">{message}</div>}
      {loading ? (
        <div className="text-gray-400">Cargando...</div>
      ) : (
        <table className="min-w-full bg-[#232323] rounded-xl border border-[#222] text-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Usuario</th>
              <th className="px-4 py-2">Monto</th>
              <th className="px-4 py-2">Método</th>
              <th className="px-4 py-2">Destino</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map(w => (
              <tr key={w.id}>
                <td className="px-4 py-2">{w.user_id}</td>
                <td className="px-4 py-2">{w.amount} {w.currency || 'USD'}</td>
                <td className="px-4 py-2">{w.method}</td>
                <td className="px-4 py-2">{w.destination}</td>
                <td className="px-4 py-2">{w.status}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleAction(w.id, 'aprobado')} className="mr-2 text-green-400">Aprobar</button>
                  <button onClick={() => handleAction(w.id, 'rechazado')} className="text-red-400">Rechazar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
