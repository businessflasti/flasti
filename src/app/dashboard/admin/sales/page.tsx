'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart2, DollarSign, Users, AlertTriangle, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';
import { salesService } from '@/lib/sales-service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdminSalesPage() {
  const [salesSummary, setSalesSummary] = useState({
    totalSales: 0,
    totalAmount: 0,
    totalCommissions: 0,
    topAffiliates: []
  });
  
  const [fraudActivity, setFraudActivity] = useState({
    suspiciousIps: [],
    suspiciousUsers: []
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Obtener resumen de ventas
        const summary = await salesService.getSalesSummary();
        setSalesSummary(summary);
        
        // Obtener actividad sospechosa
        const fraudData = await salesService.detectFraudulentActivity();
        setFraudActivity(fraudData);
      } catch (error) {
        console.error('Error al cargar datos del panel de administración:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filtrar afiliados por término de búsqueda
  const filteredAffiliates = salesSummary.topAffiliates.filter(affiliate => 
    affiliate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8">
      {/* Elementos decorativos futuristas */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-[#9333ea]/10 blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#facc15]/10 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-8">Panel de Administración - Ventas</h1>

        {/* KPIs principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total de Ventas */}
          <Card className="glass-card p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-[#9333ea]/5 to-[#ec4899]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-1">Total de Ventas</p>
                <h3 className="text-2xl font-bold mb-2">{salesSummary.totalSales}</h3>
                <div className="flex items-center text-[#10b981] text-sm">
                  <ArrowUpRight size={16} className="mr-1" />
                  <span>Actualizado</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#9333ea]/10 flex items-center justify-center">
                <BarChart2 className="text-[#9333ea]" size={24} />
              </div>
            </div>
          </Card>

          {/* Monto Total */}
          <Card className="glass-card p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f97316]/5 to-[#facc15]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-1">Monto Total</p>
                <h3 className="text-2xl font-bold mb-2">${salesSummary.totalAmount.toFixed(2)}</h3>
                <div className="flex items-center text-[#10b981] text-sm">
                  <ArrowUpRight size={16} className="mr-1" />
                  <span>Actualizado</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#f97316]/10 flex items-center justify-center">
                <DollarSign className="text-[#f97316]" size={24} />
              </div>
            </div>
          </Card>

          {/* Comisiones Pagadas */}
          <Card className="glass-card p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-[#0ea5e9]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-1">Comisiones Pagadas</p>
                <h3 className="text-2xl font-bold mb-2">${salesSummary.totalCommissions.toFixed(2)}</h3>
                <div className="flex items-center text-[#10b981] text-sm">
                  <ArrowUpRight size={16} className="mr-1" />
                  <span>Actualizado</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center">
                <Users className="text-[#10b981]" size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Top Afiliados */}
        <Card className="glass-card p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Top Afiliados</h2>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar afiliado..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-3 px-4 font-medium">Afiliado</th>
                  <th className="text-center py-3 px-4 font-medium">Ventas</th>
                  <th className="text-center py-3 px-4 font-medium">Comisiones</th>
                  <th className="text-right py-3 px-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">Cargando datos...</td>
                  </tr>
                ) : filteredAffiliates.length > 0 ? (
                  filteredAffiliates.map((affiliate) => (
                    <tr key={affiliate.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">{affiliate.name}</td>
                      <td className="py-3 px-4 text-center">{affiliate.sales}</td>
                      <td className="py-3 px-4 text-center">${affiliate.commissions.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">Ver detalles</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4">No se encontraron afiliados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Detección de Fraude */}
        <Card className="glass-card p-6">
          <div className="flex items-center mb-6">
            <AlertTriangle className="text-[#f97316] mr-2" size={20} />
            <h2 className="text-xl font-bold">Detección de Fraude</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* IPs Sospechosas */}
            <div>
              <h3 className="text-lg font-medium mb-4">IPs Sospechosas</h3>
              {fraudActivity.suspiciousIps.length > 0 ? (
                <div className="space-y-3">
                  {fraudActivity.suspiciousIps.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-md">
                      <span>{item.ip}</span>
                      <span className="text-[#f97316] font-medium">{item.count} ventas</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No se detectaron IPs sospechosas</p>
              )}
            </div>
            
            {/* Usuarios Sospechosos */}
            <div>
              <h3 className="text-lg font-medium mb-4">Usuarios Sospechosos</h3>
              {fraudActivity.suspiciousUsers.length > 0 ? (
                <div className="space-y-3">
                  {fraudActivity.suspiciousUsers.map((user) => (
                    <div key={user.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-md">
                      <span>{user.name}</span>
                      <span className="text-[#f97316] font-medium">{user.count} ventas</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No se detectaron usuarios sospechosos</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}