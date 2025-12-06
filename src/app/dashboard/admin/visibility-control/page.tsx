'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Eye, EyeOff, Save, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ElementVisibility {
  id: string;
  page_name: string;
  element_key: string;
  element_name: string;
  is_visible: boolean;
  display_order: number;
}

export default function VisibilityControlPage() {
  const router = useRouter();
  const [headerElements, setHeaderElements] = useState<ElementVisibility[]>([]);
  const [dashboardElements, setDashboardElements] = useState<ElementVisibility[]>([]);
  const [premiumElements, setPremiumElements] = useState<ElementVisibility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchElements();
    checkTableExists();
  }, []);

  const checkTableExists = async () => {
    try {
      const { data, error } = await supabase
        .from('element_visibility')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('❌ La tabla element_visibility no existe o no tienes permisos:', error);
        toast.error('La tabla no existe. Ejecuta la migración primero.');
      } else {
        console.log('✅ Tabla element_visibility existe y es accesible');
      }
    } catch (error) {
      console.error('❌ Error verificando tabla:', error);
    }
  };

  const fetchElements = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('element_visibility')
        .select('*')
        .order('page_name', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;

      const header = data?.filter(el => el.page_name === 'header') || [];
      const dashboard = data?.filter(el => el.page_name === 'dashboard') || [];
      const premium = data?.filter(el => el.page_name === 'premium') || [];

      setHeaderElements(header);
      setDashboardElements(dashboard);
      setPremiumElements(premium);
    } catch (error) {
      console.error('Error fetching elements:', error);
      toast.error('Error al cargar elementos');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = (id: string, pageName: string) => {
    const updateElements = (elements: ElementVisibility[]) =>
      elements.map(el =>
        el.id === id ? { ...el, is_visible: !el.is_visible } : el
      );

    if (pageName === 'header') {
      setHeaderElements(updateElements);
    } else if (pageName === 'dashboard') {
      setDashboardElements(updateElements);
    } else {
      setPremiumElements(updateElements);
    }
    setHasChanges(true);
  };

  const saveChanges = async () => {
    try {
      setIsSaving(true);
      
      const allElements = [...headerElements, ...dashboardElements, ...premiumElements];
      
      console.log('💾 Guardando cambios para', allElements.length, 'elementos...');
      
      for (const element of allElements) {
        console.log(`Actualizando ${element.element_key}:`, element.is_visible);
        
        const { data, error } = await supabase
          .from('element_visibility')
          .update({ 
            is_visible: element.is_visible,
            display_order: element.display_order 
          })
          .eq('id', element.id)
          .select();

        if (error) {
          console.error('❌ Error en elemento:', element.element_key, error);
          throw error;
        }
        
        console.log('✅ Actualizado:', element.element_key, data);
      }

      toast.success('Cambios guardados exitosamente');
      setHasChanges(false);
    } catch (error: any) {
      console.error('❌ Error saving changes:', error);
      toast.error(`Error al guardar cambios: ${error.message || 'Desconocido'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const resetChanges = () => {
    fetchElements();
    setHasChanges(false);
    toast.info('Cambios descartados');
  };

  const ElementCard = ({ 
    element, 
    onToggle 
  }: { 
    element: ElementVisibility; 
    onToggle: () => void;
  }) => (
    <div className="flex items-center justify-between p-4 bg-card/40 rounded-lg border border-white/10 hover:border-white/20 transition-all">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${element.is_visible ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
          {element.is_visible ? (
            <Eye className="w-5 h-5 text-green-400" />
          ) : (
            <EyeOff className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <div>
          <p className="font-medium text-white">{element.element_name}</p>
          <p className="text-xs text-gray-400">{element.element_key}</p>
        </div>
      </div>
      <Switch
        checked={element.is_visible}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-green-500"
      />
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard/admin')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Control de Visibilidad</h1>
              <p className="text-gray-400 mt-1">Gestiona qué elementos se muestran en cada página</p>
            </div>
          </div>

          {hasChanges && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={resetChanges}
                disabled={isSaving}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Descartar
              </Button>
              <Button
                onClick={saveChanges}
                disabled={isSaving}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          )}
        </div>

        {/* Header Elements */}
        <Card className="bg-card/60 backdrop-blur-md border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Header (Todas las páginas)
            </CardTitle>
            <CardDescription>
              Controla la visibilidad de elementos en el header global de la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {headerElements.map(element => (
              <ElementCard
                key={element.id}
                element={element}
                onToggle={() => toggleVisibility(element.id, 'header')}
              />
            ))}
          </CardContent>
        </Card>

        {/* Dashboard Elements */}
        <Card className="bg-card/60 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Página: Dashboard</CardTitle>
            <CardDescription>
              Controla la visibilidad de elementos en la página principal del dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardElements.map(element => (
              <ElementCard
                key={element.id}
                element={element}
                onToggle={() => toggleVisibility(element.id, 'dashboard')}
              />
            ))}
          </CardContent>
        </Card>

        {/* Premium Elements */}
        <Card className="bg-card/60 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Página: Premium</CardTitle>
            <CardDescription>
              Controla la visibilidad de elementos en la página premium
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {premiumElements.map(element => (
              <ElementCard
                key={element.id}
                element={element}
                onToggle={() => toggleVisibility(element.id, 'premium')}
              />
            ))}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="text-blue-400 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm text-blue-200">
                <p className="font-medium mb-1">Los cambios se aplican en tiempo real</p>
                <p className="text-blue-300/80">
                  Cuando desactivas un elemento, desaparece automáticamente de la página para todos los usuarios. 
                  Los elementos restantes se reacomodan automáticamente para mantener el diseño limpio.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
