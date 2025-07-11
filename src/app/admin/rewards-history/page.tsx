'use client';
import { useState } from 'react';

export default function AdminRewardsHistoryPage() {
  const [userId, setUserId] = useState('');
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRewards = async () => {
    setLoading(true);
    setError('');
    setRewards([]);
    const res = await fetch(`/api/rewards-history?user_id=${userId}`);
    const data = await res.json();
    if (data.error) setError(data.error);
    else setRewards(data.rewards || []);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Historial de Recompensas (Admin)</h1>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="ID de usuario"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          className="p-2 rounded bg-[#101010] border border-[#333] text-white"
        />
        <button onClick={fetchRewards} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold">Buscar</button>
      </div>
      {error && <div className="mb-4 text-red-400">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Cargando...</div>
      ) : rewards.length === 0 && userId ? (
        <div className="text-gray-400">No hay recompensas para este usuario.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#232323] rounded-xl border border-[#222] text-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Oferta</th>
                <th className="px-4 py-2">Monto</th>
                <th className="px-4 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2 text-xs">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2">{r.program_name || r.goal_name || '-'}</td>
                  <td className="px-4 py-2">{r.payout} {r.currency || 'USD'}</td>
                  <td className="px-4 py-2">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
