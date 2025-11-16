'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  CreditCard,
  BarChart2,
  Settings,
  Mail,
  Eye,
  Bell,
  Save
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/lib/admin-service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import UsersListCompact from '@/components/admin/UsersListCompact';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dailyMessage, setDailyMessage] = useState('');
  const [savingMessage, setSavingMessage] = useState(false);

  // Verificar si el usuario es administrador
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      const adminStatus = await adminService.isAdmin(user.id);
      setIsAdmin(adminStatus);

      if (!adminStatus) {
        toast.error('No tienes permisos para acceder a esta página');
        router.push('/dashboard');
      } else {
        loadDailyMessage();
      }

      setLoading(false);
    };

    checkAdminStatus();
  }, [user, router]);

  // Cargar mensaje del día
  const loadDailyMessage = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_message')
        .select('message')
        .eq('is_active', true)
        .single();

      if (!error && data) {
        setDailyMessage(data.message);
      }
    } catch (error) {
      console.error('Error loading message:', error);
    }
  };

  // Guardar mensaje del día
  const saveDailyMessage = async () => {
    if (!dailyMessage.trim()) {
      toast.error('El mensaje no puede estar vacío');
      return;
    }

    setSavingMessage(true);
    try {
      const { error } = await supabase
        .from('daily_message')
        .update({ message: dailyMessage.trim() })
        .eq('is_active', true);

      if (error) throw error;

      toast.success('Mensaje actualizado correctamente');
    } catch (error) {
      console.error('Error saving message:', error);
      toast.error('Error al guardar mensaje');
    } finally {
      setSavingMessage(false);
    }
  };

  if (loading) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen bg-[#0B1017]"
      >
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⟳</div>
          <p className="text-white">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div 
        className="flex flex-col items-center justify-center min-h-screen bg-[#0B1017]"
      >
        <h1 className="text-3xl font-bold mb-4 text-white">Acceso Restringido</h1>
        <p className="text-gray-400 mb-6">No tienes permisos para acceder a esta página</p>
        <Button onClick={() => router.push('/dashboard')}>
          Volver al Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-6 bg-[#0B1017]"
    >
      <div className="max-w-[1800px] mx-auto">
        <div className="space-y-6">
          {/* Acciones Rápidas */}
          <Card className="bg-[#1a1a1a] border-[#3B82F6]/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#3B82F6]" />
                Menú
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Button 
                  className="bg-white hover:bg-gray-100 text-black font-bold"
                  onClick={() => window.location.href = '/dashboard/admin/withdrawals'}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Retiros
                </Button>
                <Button 
                  className="bg-white hover:bg-gray-100 text-black font-bold"
                  onClick={() => window.location.href = '/dashboard/admin/country-prices'}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Precios
                </Button>
                <Button 
                  className="bg-white hover:bg-gray-100 text-black font-bold"
                  onClick={() => window.location.href = '/dashboard/admin/country-assignments'}
                >
                  <BarChart2 className="w-4 h-4 mr-2" />
                  Asignaciones
                </Button>
                <Button 
                  className="bg-white hover:bg-gray-100 text-black font-bold"
                  onClick={() => window.location.href = '/dashboard/admin/email-templates'}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Correos
                </Button>
                <Button 
                  className="bg-white hover:bg-gray-100 text-black font-bold"
                  onClick={() => window.location.href = '/dashboard/admin/visibility-control'}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Visibilidad
                </Button>
                <Button 
                  className="bg-white hover:bg-gray-100 text-black font-bold"
                  onClick={() => window.location.href = '/dashboard/admin/tutorial-video'}
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Video
                </Button>
                <Button 
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold"
                  onClick={() => window.location.href = '/dashboard/admin/weekly-ranking'}
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11V3H8v6H2v12h20V11h-6zm-6-6h4v14h-4V5zm-6 6h4v8H4v-8zm16 8h-4v-6h4v6z"/>
                  </svg>
                  Ranking
                </Button>
                <Button 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold"
                  onClick={() => window.location.href = '/dashboard/admin/banner-config'}
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/>
                  </svg>
                  Banner
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Editor de Mensaje del Día */}
          <Card className="bg-[#1a1a1a] border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-500" />
                Mensaje del Día
              </CardTitle>
              <CardDescription className="text-gray-300">
                Escribe el mensaje que verán todos los usuarios en el dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Textarea
                  value={dailyMessage}
                  onChange={(e) => setDailyMessage(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px] resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    {dailyMessage.length}/500 caracteres
                  </p>
                </div>
              </div>

              <Button
                onClick={saveDailyMessage}
                disabled={savingMessage}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {savingMessage ? (
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

          {/* Lista de Usuarios */}
          <UsersListCompact />
        </div>
      </div>
    </div>
  );
}
