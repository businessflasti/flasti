'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, TrendingUp, Edit2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

interface RankingUser {
  id?: number;
  rank: number;
  name: string;
  earnings: number;
  country_code: string;
  avatar_url: string;
}

interface RankingSettings {
  title: string;
  subtitle: string;
}

export default function WeeklyRankingAdmin() {
  const [users, setUsers] = useState<RankingUser[]>([]);
  const [settings, setSettings] = useState<RankingSettings>({
    title: 'Top 3 semanal',
    subtitle: 'Los que más ganaron'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_top_ranking')
        .select('*')
        .order('rank', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setUsers(data);
        // Tomar título y subtítulo del primer registro
        if (data[0].title) setSettings({ title: data[0].title, subtitle: data[0].subtitle });
      }
    } catch (error) {
      console.error('Error fetching ranking:', error);
      showMessage('error', 'Error al cargar el ranking');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const addUser = () => {
    const newRank = users.length > 0 ? Math.max(...users.map(u => u.rank)) + 1 : 1;
    setUsers([...users, {
      rank: newRank,
      name: '',
      earnings: 0,
      country_code: 'US',
      avatar_url: '/images/ranking-avatars/default.jpg'
    }]);
  };

  const removeUser = async (index: number) => {
    const user = users[index];
    if (user.id) {
      try {
        const { error } = await supabase
          .from('weekly_top_ranking')
          .delete()
          .eq('id', user.id);

        if (error) throw error;
        showMessage('success', 'Usuario eliminado');
      } catch (error) {
        console.error('Error deleting user:', error);
        showMessage('error', 'Error al eliminar usuario');
        return;
      }
    }
    setUsers(users.filter((_, i) => i !== index));
  };

  const updateUser = (index: number, field: keyof RankingUser, value: any) => {
    const newUsers = [...users];
    newUsers[index] = { ...newUsers[index], [field]: value };
    setUsers(newUsers);
  };

  const saveRanking = async () => {
    setIsSaving(true);
    try {
      // Validar que todos los usuarios tengan nombre
      if (users.some(u => !u.name.trim())) {
        showMessage('error', 'Todos los usuarios deben tener un nombre');
        setIsSaving(false);
        return;
      }

      // Primero, obtener todos los IDs existentes
      const { data: existingData } = await supabase
        .from('weekly_top_ranking')
        .select('id');

      // Eliminar todos los registros existentes uno por uno
      if (existingData && existingData.length > 0) {
        for (const record of existingData) {
          await supabase
            .from('weekly_top_ranking')
            .delete()
            .eq('id', record.id);
        }
      }

      // Insertar nuevos registros con título y subtítulo
      const usersToInsert = users.map(user => ({
        rank: user.rank,
        name: user.name.trim(),
        earnings: user.earnings,
        country_code: user.country_code.toUpperCase(),
        avatar_url: user.avatar_url,
        title: settings.title,
        subtitle: settings.subtitle
      }));

      const { error } = await supabase
        .from('weekly_top_ranking')
        .insert(usersToInsert);

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      showMessage('success', 'Ranking guardado exitosamente');
      await fetchRanking();
    } catch (error: any) {
      console.error('Error saving ranking:', error);
      showMessage('error', `Error al guardar: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Gestión de Ranking Semanal</h1>
          <p className="text-white/60">Administra el top de usuarios que más ganaron esta semana</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-500/10 border border-0 text-green-400' : 'bg-red-500/10 border border-0 text-red-400'}`}>
            {message.text}
          </div>
        )}

        {/* Settings */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Edit2 className="w-5 h-5" />
            Configuración de Títulos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Título</label>
              <input
                type="text"
                value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/20"
                placeholder="Top 3 semanal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Subtítulo</label>
              <input
                type="text"
                value={settings.subtitle}
                onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-0 focus:border-white/20"
                placeholder="Los que más ganaron"
              />
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Usuarios del Ranking
            </h2>
            <Button
              onClick={addUser}
              className="bg-white/[0.05] hover:bg-white/[0.08] text-white border border-white/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Usuario
            </Button>
          </div>

          <div className="space-y-4">
            {users.map((user, index) => (
              <div key={index} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  {/* Rank */}
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-2">Posición</label>
                    <input
                      type="number"
                      value={user.rank}
                      onChange={(e) => updateUser(index, 'rank', parseInt(e.target.value))}
                      className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/20"
                      min="1"
                    />
                  </div>

                  {/* Name */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-white/70 mb-2">Nombre</label>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) => updateUser(index, 'name', e.target.value)}
                      className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/20"
                      placeholder="Nombre del usuario"
                    />
                  </div>

                  {/* Earnings */}
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-2">Ganancias (USD)</label>
                    <input
                      type="number"
                      value={user.earnings}
                      onChange={(e) => updateUser(index, 'earnings', parseFloat(e.target.value))}
                      className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/20"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  {/* Country Code */}
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-2">País (código)</label>
                    <input
                      type="text"
                      value={user.country_code}
                      onChange={(e) => updateUser(index, 'country_code', e.target.value.toUpperCase())}
                      className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/20 uppercase"
                      placeholder="MX"
                      maxLength={2}
                    />
                  </div>

                  {/* Avatar URL */}
                  <div className="md:col-span-1 flex items-end">
                    <Button
                      onClick={() => removeUser(index)}
                      variant="destructive"
                      size="sm"
                      className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Avatar Path Info */}
                <div className="mt-3 pt-3 border-t border-white/10">
                  <label className="block text-xs font-medium text-white/70 mb-2">
                    Ruta del Avatar
                    <span className="ml-2 text-white/40">(Coloca la imagen en: public/images/ranking-avatars/)</span>
                  </label>
                  <input
                    type="text"
                    value={user.avatar_url}
                    onChange={(e) => updateUser(index, 'avatar_url', e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/20 text-sm"
                    placeholder="/images/ranking-avatars/usuario1.jpg"
                  />
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <div className="text-center py-12 text-white/40">
                No hay usuarios en el ranking. Haz clic en "Agregar Usuario" para comenzar.
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={saveRanking}
            disabled={isSaving}
            className="bg-white hover:bg-white/90 text-black font-semibold px-8"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Ranking
              </>
            )}
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <h3 className="text-sm font-bold text-blue-400 mb-2">📝 Instrucciones</h3>
          <ul className="text-xs text-blue-300/80 space-y-1">
            <li>• Coloca las imágenes de los avatares en: <code className="bg-black/20 px-1 rounded">public/images/ranking-avatars/</code></li>
            <li>• Usa la ruta: <code className="bg-black/20 px-1 rounded">/images/ranking-avatars/nombre-archivo.jpg</code></li>
            <li>• El código de país debe ser de 2 letras (ej: MX, ES, AR, US)</li>
            <li>• Los cambios se reflejan en tiempo real en el dashboard y página premium</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
