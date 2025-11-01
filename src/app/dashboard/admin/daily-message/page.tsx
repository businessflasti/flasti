'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/lib/admin-service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Bell, Save, Info } from 'lucide-react';

export default function DailyMessageManagement() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      const adminStatus = await adminService.isAdmin(user.id);
      setIsAdmin(adminStatus);

      if (!adminStatus) {
        toast.error('No tienes permisos para acceder a esta página');
        router.push('/dashboard');
      } else {
        loadMessage();
      }

      setLoading(false);
    };

    checkAdminStatus();
  }, [user, router]);

  const loadMessage = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_message')
        .select('message')
        .eq('is_active', true)
        .single();

      if (error) throw error;

      setMessage(data?.message || '');
    } catch (error) {
      console.error('Error loading message:', error);
      toast.error('Error al cargar mensaje');
    }
  };

  const saveMessage = async () => {
    if (!message.trim()) {
      toast.error('El mensaje no puede estar vacío');
      return;
    }

    setSaving(true);
    try {
      // Actualizar el mensaje activo
      const { error } = await supabase
        .from('daily_message')
        .update({ message: message.trim() })
        .eq('is_active', true);

      if (error) throw error;

      toast.success('Mensaje actualizado correctamente');
    } catch (error) {
      console.error('Error saving message:', error);
      toast.error('Error al guardar mensaje');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-black">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⟳</div>
          <p className="text-white">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-black">
        <h1 className="text-3xl font-bold mb-4 text-white">Acceso Restringido</h1>
        <Button onClick={() => router.push('/dashboard')}>Volver al Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/admin')}
            className="mb-4 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Panel Admin
          </Button>
          
          <h1 className="text-4xl font-bold text-white mb-2">Mensaje del Día</h1>
          <p className="text-gray-400">
            Gestiona el mensaje que verán todos los usuarios en su dashboard
          </p>
        </div>

        {/* Editor de Mensaje */}
        <Card className="bg-[#1a1a1a] border-blue-500/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-500" />
              Editor de Mensaje
            </CardTitle>
            <CardDescription className="text-gray-300">
              Escribe el mensaje que quieres mostrar a todos los usuarios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">
                Mensaje
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
                className="bg-gray-800 border-gray-700 text-white min-h-[150px] resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  {message.length}/500 caracteres
                </p>
              </div>
            </div>

            <Button
              onClick={saveMessage}
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Mensaje
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Información */}
        <Card className="bg-[#1a1a1a] border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-yellow-500" />
              Información Importante
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-3">
            <div className="space-y-2 text-sm">
              <p>• Los cambios se aplican <strong className="text-white">inmediatamente</strong> para todos los usuarios</p>
              <p>• El mensaje se actualiza en <strong className="text-white">tiempo real</strong> sin necesidad de recargar</p>
              <p>• Máximo 500 caracteres para mantener el mensaje conciso</p>
              <p>• El mensaje se muestra en el bloque de la asesora en el dashboard</p>
            </div>

            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg mt-4">
              <p className="font-semibold text-green-400 mb-1">Vista Previa:</p>
              <div className="bg-gray-800 p-3 rounded-lg mt-2">
                <p className="text-white text-sm">
                  {message.replace(/{nombre}/g, 'Juan') || 'Tu mensaje aparecerá aquí...'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
