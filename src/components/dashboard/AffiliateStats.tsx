'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Copy, Link, TrendingUp, DollarSign, Users, Percent } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AffiliateStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkSlug, setNewLinkSlug] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [creatingLink, setCreatingLink] = useState(false);

  useEffect(() => {
    fetchAffiliateStats();
  }, []);

  const fetchAffiliateStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/affiliate/stats');
      
      if (!response.ok) {
        throw new Error('Error al obtener estadísticas');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas de afiliado:', error);
      toast.error('No se pudieron cargar las estadísticas de afiliado');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, message: string = 'Copiado al portapapeles') => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error('Error al copiar'));
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLinkName || !newLinkSlug || !newLinkUrl) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    
    try {
      setCreatingLink(true);
      
      const response = await fetch('/api/affiliate/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newLinkName,
          slug: newLinkSlug,
          targetUrl: newLinkUrl
        })
      });
      
      if (!response.ok) {
        throw new Error('Error al crear enlace');
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Enlace creado correctamente');
        setNewLinkName('');
        setNewLinkSlug('');
        setNewLinkUrl('');
        fetchAffiliateStats(); // Recargar estadísticas
      } else {
        throw new Error(data.error || 'Error al crear enlace');
      }
    } catch (error: any) {
      console.error('Error al crear enlace:', error);
      toast.error(error.message || 'Error al crear enlace');
    } finally {
      setCreatingLink(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Programa de Afiliados</CardTitle>
          <CardDescription>Cargando estadísticas...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Programa de Afiliados</CardTitle>
          <CardDescription>No se pudieron cargar las estadísticas</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchAffiliateStats}>Reintentar</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Programa de Afiliados</CardTitle>
        <CardDescription>
          Gana comisiones por cada venta que generes con tu enlace de afiliado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stats">
          <TabsList className="mb-4">
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
            <TabsTrigger value="links">Enlaces</TabsTrigger>
            <TabsTrigger value="sales">Ventas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clics Totales</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.stats.total_clicks || 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ventas</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.stats.total_sales || 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Comisiones</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.stats.total_commission || 0)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
                  <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(stats.stats.conversion_rate || 0).toFixed(2)}%</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Tu Enlace de Afiliado</h3>
              <div className="flex items-center gap-2">
                <Input 
                  value={stats.affiliateUrl} 
                  readOnly 
                  className="font-mono text-sm"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => copyToClipboard(stats.affiliateUrl, 'Enlace copiado al portapapeles')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Comparte este enlace para ganar comisiones por cada venta que generes.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="links">
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Crear Nuevo Enlace</h3>
                <form onSubmit={handleCreateLink} className="space-y-3">
                  <div>
                    <label htmlFor="linkName" className="text-sm font-medium block mb-1">
                      Nombre del Enlace
                    </label>
                    <Input
                      id="linkName"
                      placeholder="Ej: Promoción Instagram"
                      value={newLinkName}
                      onChange={(e) => setNewLinkName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="linkSlug" className="text-sm font-medium block mb-1">
                      Slug Personalizado
                    </label>
                    <Input
                      id="linkSlug"
                      placeholder="Ej: promo-instagram"
                      value={newLinkSlug}
                      onChange={(e) => setNewLinkSlug(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="linkUrl" className="text-sm font-medium block mb-1">
                      URL de Destino
                    </label>
                    <Input
                      id="linkUrl"
                      placeholder="https://flasti.co/producto"
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" disabled={creatingLink}>
                    {creatingLink ? 'Creando...' : 'Crear Enlace'}
                  </Button>
                </form>
              </div>
              
              <h3 className="text-lg font-medium">Tus Enlaces</h3>
              {stats.links && stats.links.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Enlace</TableHead>
                        <TableHead className="text-right">Clics</TableHead>
                        <TableHead className="text-right">Conversiones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.links.map((link: any) => {
                        const fullUrl = `${window.location.origin}/${link.slug}?ref=${stats.affiliateCode}`;
                        return (
                          <TableRow key={link.id}>
                            <TableCell className="font-medium">{link.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="truncate max-w-[200px]">{fullUrl}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => copyToClipboard(fullUrl)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{link.clicks}</TableCell>
                            <TableCell className="text-right">{link.conversions}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/30 rounded-lg">
                  <Link className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No tienes enlaces</h3>
                  <p className="text-sm text-muted-foreground">
                    Crea tu primer enlace personalizado para hacer seguimiento de tus campañas.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="sales">
            <h3 className="text-lg font-medium mb-4">Ventas Recientes</h3>
            {stats.recentSales && stats.recentSales.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                      <TableHead className="text-right">Comisión</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.recentSales.map((sale: any) => (
                      <TableRow key={sale.id}>
                        <TableCell>
                          {new Date(sale.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{sale.product_id}</TableCell>
                        <TableCell>{sale.customer_email.split('@')[0]}***</TableCell>
                        <TableCell className="text-right">{formatCurrency(sale.amount)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(sale.commission_amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/30 rounded-lg">
                <DollarSign className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No tienes ventas</h3>
                <p className="text-sm text-muted-foreground">
                  Comparte tu enlace de afiliado para empezar a generar ventas.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
