'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/lib/admin-service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Sparkles, Ghost, TreePine, ArrowLeft } from 'lucide-react';

interface Theme {
  id: number;
  theme_name: string;
  is_active: boolean;
  logo_url: string | null;
  background_url: string | null;
}

export default function ThemesManagement() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      const adminStatus = await adminService.isAdmin(user.id);
      setIsAdmin(adminStatus);

      if (!adminStatus) {
        toast.error('No tienes permisos para acceder a esta página');
        router.push('/dashboard');
      } else {
        loadThemes();
      }

      setLoading(false);
    };

    checkAdminStatus();
  }, [user, router]);

  const loadThemes = async () => {
    try {
      const { data, error } = await supabase
        .from('seasonal_themes')
        .select('*')
        .order('id');

      if (error) throw error;

      setThemes(data || []);
    } catch (error) {
      console.error('Error loading themes:', error);
      toast.error('Error al cargar temas');
    }
  };

  const activateTheme = async (themeName: string) => {
    setUpdating(themeName);
    try {
      // Desactivar todos los temas
      await supabase
        .from('seasonal_themes')
        .update({ is_active: false })
        .neq('theme_name', '');

      // Activar el tema seleccionado
      const { error } = await supabase
        .from('seasonal_themes')
        .update({ is_active: true })
        .eq('theme_name', themeName);

      if (error) throw error;

      toast.success(`Tema "${getThemeDisplayName(themeName)}" activado`);
      loadThemes();
    } catch (error) {
      console.error('Error activating theme:', error);
      toast.error('Error al activar tema');
    } finally {
      setUpdating(null);
    }
  };



  const getThemeDisplayName = (themeName: string) => {
    const names: Record<string, string> = {
      default: 'Predeterminado',
      halloween: 'Halloween',
      christmas: 'Navidad',
    };
    return names[themeName] || themeName;
  };

  const getThemeDescription = (themeName: string) => {
    const descriptions: Record<string, string> = {
      default: 'Tema estándar de Flasti sin decoraciones especiales',
      halloween: 'Tema oscuro con calabazas, murciélagos y telarañas. Perfecto para octubre',
      christmas: 'Tema festivo con copos de nieve, luces navideñas y decoraciones. Ideal para diciembre',
    };
    return descriptions[themeName] || '';
  };

  const getThemeIcon = (themeName: string) => {
    switch (themeName) {
      case 'halloween':
        return <Ghost className="w-8 h-8 text-orange-500" />;
      case 'christmas':
        return <TreePine className="w-8 h-8 text-green-500" />;
      default:
        return <Sparkles className="w-8 h-8 text-blue-500" />;
    }
  };

  const getThemeColors = (themeName: string) => {
    switch (themeName) {
      case 'halloween':
        return 'from-orange-500/20 to-purple-500/20 border-orange-500/30';
      case 'christmas':
        return 'from-red-500/20 to-green-500/20 border-green-500/30';
      default:
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-black">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⟳</div>
          <p className="text-white">Cargando temas...</p>
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
      <div className="max-w-6xl mx-auto">
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
          
          <h1 className="text-4xl font-bold text-white mb-2">Temas Estacionales</h1>
          <p className="text-gray-400">
            Gestiona los temas visuales de la plataforma para fechas especiales
          </p>
        </div>

        {/* Grid de Temas */}
        <div className="grid md:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <Card
              key={theme.id}
              className={`bg-gradient-to-br ${getThemeColors(theme.theme_name)} backdrop-blur-md transition-all duration-300 ${
                theme.is_active ? 'ring-2 ring-white/50 scale-105' : 'hover:scale-102'
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  {getThemeIcon(theme.theme_name)}
                  {theme.is_active && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
                      ACTIVO
                    </span>
                  )}
                </div>
                <CardTitle className="text-white text-2xl">
                  {getThemeDisplayName(theme.theme_name)}
                </CardTitle>
                <CardDescription className="text-gray-300 mt-2">
                  {getThemeDescription(theme.theme_name)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => activateTheme(theme.theme_name)}
                  disabled={theme.is_active || updating === theme.theme_name}
                  className={`w-full ${
                    theme.is_active
                      ? 'bg-green-600 hover:bg-green-600 cursor-default'
                      : 'bg-white hover:bg-gray-100 text-black'
                  }`}
                >
                  {updating === theme.theme_name ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Activando...
                    </>
                  ) : theme.is_active ? (
                    'Tema Activo'
                  ) : (
                    'Activar Tema'
                  )}
                </Button>

                {/* Información de rutas de archivos */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <div className="text-xs text-gray-400">
                    <p className="font-semibold mb-2">Archivos del tema:</p>
                    <div className="space-y-2 bg-black/30 p-3 rounded">
                      <div>
                        <span className="text-blue-400">Logo:</span>
                        <code className="block text-[10px] text-gray-300 mt-1 break-all">
                          {theme.logo_url || 'No configurado'}
                        </code>
                      </div>
                      <div>
                        <span className="text-blue-400">Fondo:</span>
                        <code className="block text-[10px] text-gray-300 mt-1 break-all">
                          {theme.background_url || 'No configurado'}
                        </code>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2">
                      Coloca los archivos manualmente en las rutas indicadas en <code className="text-yellow-400">public/</code>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Información adicional */}
        <Card className="mt-8 bg-[#1a1a1a] border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              Información sobre Temas
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-3">
            <div className="space-y-2">
              <p>• Los temas se aplican automáticamente en el Dashboard y la Página Principal</p>
              <p>• Los cambios son visibles inmediatamente para todos los usuarios</p>
              <p>• Solo un tema puede estar activo a la vez</p>
              <p>• Los temas incluyen animaciones, colores y decoraciones especiales</p>
            </div>
            
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mt-4">
              <p className="font-semibold text-yellow-400 mb-2">📁 Gestión de Archivos:</p>
              <div className="text-sm space-y-1">
                <p>1. Coloca los archivos en <code className="bg-gray-800 px-2 py-1 rounded text-yellow-400">public/images/themes/</code></p>
                <p>2. Usa los nombres exactos mostrados en cada tema</p>
                <p>3. Formatos recomendados: PNG para logos, JPG para fondos</p>
                <p>4. Los cambios se aplican automáticamente al activar el tema</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
