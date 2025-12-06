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
  Mail,
  Eye,
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
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A]">
        <h1 className="text-3xl font-bold mb-4 text-white">Acceso Restringido</h1>
        <p className="text-gray-400 mb-6">No tienes permisos para acceder a esta página</p>
        <Button onClick={() => router.push('/dashboard')}>
          Volver al Dashboard
        </Button>
      </div>
    );
  }

  const menuItems = [
    { icon: CreditCard, label: 'Retiros', href: '/dashboard/admin/withdrawals' },
    { icon: DollarSign, label: 'Precios', href: '/dashboard/admin/country-prices' },
    { icon: BarChart2, label: 'Asignaciones', href: '/dashboard/admin/country-assignments' },
    { icon: Mail, label: 'Correos', href: '/dashboard/admin/email-templates' },
    { icon: Eye, label: 'Visibilidad', href: '/dashboard/admin/visibility-control' },
  ];

  return (
    <div className="min-h-screen p-6 bg-[#0A0A0A]">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Barra Superior - Menú + Mensaje del Día */}
        <Card className="bg-[#121212] border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-6">
              {/* Botones de Menú */}
              <div className="flex gap-2">
                {menuItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => window.location.href = item.href}
                    className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#252525] flex items-center justify-center transition-colors group relative"
                    title={item.label}
                  >
                    <item.icon className="w-4 h-4 text-gray-400 group-hover:text-white" />
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Separador Vertical */}
              <div className="w-px h-8 bg-white/10"></div>

              {/* Mensaje del Día Compacto */}
              <div className="flex-1 flex items-center gap-3">
                <p className="text-xs text-gray-500 whitespace-nowrap">Mensaje del día:</p>
                <Input
                  value={dailyMessage}
                  onChange={(e) => setDailyMessage(e.target.value)}
                  placeholder="Mensaje para usuarios..."
                  className="bg-[#1a1a1a] border-0 text-white text-sm flex-1"
                  maxLength={500}
                />
                <Button
                  onClick={saveDailyMessage}
                  disabled={savingMessage}
                  size="sm"
                  className="bg-white text-black text-xs px-4 hover:bg-white"
                >
                  {savingMessage ? '...' : 'Guardar'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Usuarios */}
        <UsersListCompact />
      </div>
    </div>
  );
}
