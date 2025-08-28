'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  Search,
  Filter,
  Download,
  AlertTriangle
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface WebhookLog {
  id: string;
  provider: string;
  event_type: string;
  status: string;
  user_email?: string;
  transaction_id?: string;
  amount?: number;
  premium_activated: boolean;
  processing_time_ms?: number;
  error_message?: string;
  created_at: string;
}

interface WebhookStats {
  provider: string;
  total_webhooks: number;
  successful_webhooks: number;
  failed_webhooks: number;
  premium_activations: number;
  avg_processing_time_ms: number;
  last_webhook_at: string;
}

export default function WebhooksMonitorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [stats, setStats] = useState<WebhookStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Cargar logs de webhooks
  const loadWebhookLogs = async (provider?: string) => {
    try {
      const params = new URLSearchParams();
      if (provider && provider !== 'all') {
        params.append('provider', provider);
      }
      params.append('limit', '100');

      const response = await fetch(`/api/webhook-logs?${params}`);
      const data = await response.json();

      if (data.success) {
        setLogs(data.logs);
      } else {
        toast.error('Error cargando logs de webhooks');
      }
    } catch (error) {
      console.error('Error cargando logs:', error);
      toast.error('Error cargando logs de webhooks');
    }
  };

  // Cargar estadísticas
  const loadWebhookStats = async () => {
    try {
      // Simular estadísticas por ahora
      // En producción, esto vendría de la vista webhook_stats
      const mockStats: WebhookStats[] = [
        {
          provider: 'mercadopago',
          total_webhooks: 15,
          successful_webhooks: 14,
          failed_webhooks: 1,
          premium_activations: 12,
          avg_processing_time_ms: 850,
          last_webhook_at: new Date().toISOString()
        },
        {
          provider: 'paypal',
          total_webhooks: 8,
          successful_webhooks: 8,
          failed_webhooks: 0,
          premium_activations: 7,
          avg_processing_time_ms: 650,
          last_webhook_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          provider: 'hotmart',
          total_webhooks: 3,
          successful_webhooks: 3,
          failed_webhooks: 0,
          premium_activations: 3,
          avg_processing_time_ms: 1200,
          last_webhook_at: new Date(Date.now() - 7200000).toISOString()
        }
      ];
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  // Efecto para cargar datos
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        loadWebhookLogs(selectedProvider),
        loadWebhookStats()
      ]);
      setLoading(false);
    };

    loadData();
  }, [selectedProvider]);

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadWebhookLogs(selectedProvider);
      loadWebhookStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, selectedProvider]);

  // Filtrar logs por búsqueda
  const filteredLogs = logs.filter(log => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      log.user_email?.toLowerCase().includes(searchLower) ||
      log.transaction_id?.toLowerCase().includes(searchLower) ||
      log.provider.toLowerCase().includes(searchLower) ||
      log.event_type.toLowerCase().includes(searchLower)
    );
  });

  // Función para obtener color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'received': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  // Función para obtener ícono del estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed': return <CheckCircle size={16} className="text-green-600" />;
      case 'error': return <XCircle size={16} className="text-red-600" />;
      case 'received': return <Clock size={16} className="text-blue-600" />;
      default: return <AlertTriangle size={16} className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-primary mb-2">⟳</div>
        <p className="ml-2">Cargando logs de webhooks...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl mt-20">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Monitor de Webhooks</h1>
          <p className="text-foreground/70 mt-1">
            Monitorea el estado de los webhooks de pago en tiempo real
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={autoRefresh ? "animate-spin" : ""} />
            Auto-refresh
          </Button>
          <Button
            onClick={() => {
              loadWebhookLogs(selectedProvider);
              loadWebhookStats();
            }}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Estadísticas de webhooks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.provider} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium capitalize">{stat.provider}</h3>
              <Badge variant="outline">{stat.total_webhooks} total</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/60">Exitosos:</span>
                <span className="text-green-600 font-medium">{stat.successful_webhooks}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/60">Fallidos:</span>
                <span className="text-red-600 font-medium">{stat.failed_webhooks}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/60">Premium activados:</span>
                <span className="text-blue-600 font-medium">{stat.premium_activations}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/60">Tiempo promedio:</span>
                <span className="font-medium">{Math.round(stat.avg_processing_time_ms)}ms</span>
              </div>
              
              <div className="pt-2 border-t">
                <span className="text-xs text-foreground/50">
                  Último: {new Date(stat.last_webhook_at).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Buscar por email, transaction ID, proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">Todos los proveedores</option>
            <option value="mercadopago">Mercado Pago</option>
            <option value="paypal">PayPal</option>
            <option value="hotmart">Hotmart</option>
          </select>
        </div>
      </div>

      {/* Tabla de logs */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-foreground/5">
                <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Proveedor</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Evento</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Usuario</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Monto</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Premium</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Tiempo</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-foreground/5">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <Badge className={`text-xs ${getStatusColor(log.status)}`}>
                          {log.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm capitalize">{log.provider}</td>
                    <td className="px-4 py-3 text-sm">{log.event_type}</td>
                    <td className="px-4 py-3 text-sm">{log.user_email || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {log.amount ? `$${log.amount.toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      {log.premium_activated ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <XCircle size={16} className="text-gray-400" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {log.processing_time_ms ? `${log.processing_time_ms}ms` : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/70">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-foreground/60">
                    {searchTerm ? 'No se encontraron logs que coincidan con la búsqueda' : 'No hay logs de webhooks disponibles'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Información adicional */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">URLs de Webhooks</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Mercado Pago:</strong>
              <code className="ml-2 px-2 py-1 bg-foreground/10 rounded">
                https://flasti.com/api/mercadopago/webhook
              </code>
            </div>
            <div>
              <strong>PayPal:</strong>
              <code className="ml-2 px-2 py-1 bg-foreground/10 rounded">
                https://flasti.com/api/paypal-webhook
              </code>
            </div>
            <div>
              <strong>Hotmart:</strong>
              <code className="ml-2 px-2 py-1 bg-foreground/10 rounded">
                https://flasti.com/api/webhooks/hotmart
              </code>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Estado del Sistema</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Webhooks activos:</span>
              <Badge className="bg-green-100 text-green-800">Funcionando</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto-refresh:</span>
              <Badge className={autoRefresh ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                {autoRefresh ? 'Activado' : 'Desactivado'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Última actualización:</span>
              <span className="text-xs text-foreground/60">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}