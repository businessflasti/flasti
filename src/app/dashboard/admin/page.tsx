'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, CreditCard } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/lib/admin-service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import UsersListCompact from '@/components/admin/UsersListCompact';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      const adminStatus = await adminService.isAdmin(user.id);
      setIsAdmin(adminStatus);
      if (!adminStatus) {
        toast.error('No tienes permisos para acceder a esta página');
        router.push('/dashboard');
      }
      setLoading(false);
    };
    checkAdminStatus();
  }, [user, router]);

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
        <Button onClick={() => router.push('/dashboard')}>Volver al Dashboard</Button>
      </div>
    );
  }

  const menuItems = [
    { icon: CreditCard, label: 'Retiros', href: '/dashboard/admin/withdrawals' },
    { icon: DollarSign, label: 'Precios', href: '/dashboard/admin/country-prices' },
  ];

  return (
    <div className="min-h-screen p-6 bg-[#0A0A0A]">
      <div className="max-w-[1800px] mx-auto space-y-6">
        <Card className="bg-[#121212] border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-6">
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
            </div>
          </CardContent>
        </Card>

        <UsersListCompact />
      </div>
    </div>
  );
}
