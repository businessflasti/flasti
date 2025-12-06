'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export default function TutorialVideoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);

  // Formulario con valores por defecto
  const [form, setForm] = useState({
    slider_video_url: '/video/tutorial-slider.mp4',
    player_video_url: '/video/tutorial-player.mp4',
    title: 'Tutorial de Bienvenida',
    description: 'Aprende cómo ganar dinero en Flasti',
    is_clickable: true
  });

  useEffect(() => {
    loadVideo();
  }, []);

  const loadVideo = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tutorial_video')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error al cargar video:', error);
      } else if (data) {
        setVideoId(data.id);
        setForm({
          slider_video_url: data.slider_video_url,
          player_video_url: data.player_video_url,
          title: data.title,
          description: data.description,
          is_clickable: data.is_clickable
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!videoId) {
      toast.error('No se encontró el video');
      return;
    }

    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('tutorial_video')
        .update({
          slider_video_url: form.slider_video_url,
          player_video_url: form.player_video_url,
          title: form.title,
          description: form.description,
          is_clickable: form.is_clickable,
          updated_at: new Date().toISOString()
        })
        .eq('id', videoId);

      if (error) {
        console.error('Error al guardar:', error);
        toast.error('Error al guardar cambios');
      } else {
        toast.success('Cambios guardados correctamente');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⟳</div>
          <p className="text-white">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Video Tutorial</h1>
        </div>

        {/* Editor Compacto */}
        <div>(
          <Card className="bg-[#121212] border-0">
            <CardContent className="p-6 space-y-4">
              
              {/* Videos lado a lado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Video Slider (Bucle) */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block font-medium">
                    Video Slider (Bucle)
                  </label>
                  <div className="relative h-[180px] bg-black rounded-lg overflow-hidden mb-2">
                    <video
                      key={form.slider_video_url}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source src={form.slider_video_url} type="video/mp4" />
                    </video>
                  </div>
                  <Input
                    value={form.slider_video_url}
                    onChange={(e) => setForm(prev => ({ ...prev, slider_video_url: e.target.value }))}
                    className="bg-[#0a0a0a] border-white/10 text-white text-xs"
                    placeholder="/video/tutorial-slider.mp4"
                  />
                </div>

                {/* Video Reproductor */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block font-medium">
                    Video Reproductor
                  </label>
                  <div className="relative h-[180px] bg-black rounded-lg overflow-hidden mb-2">
                    <video
                      key={form.player_video_url}
                      className="w-full h-full object-cover"
                      controls
                    >
                      <source src={form.player_video_url} type="video/mp4" />
                    </video>
                  </div>
                  <Input
                    value={form.player_video_url}
                    onChange={(e) => setForm(prev => ({ ...prev, player_video_url: e.target.value }))}
                    className="bg-[#0a0a0a] border-white/10 text-white text-xs"
                    placeholder="/video/tutorial-player.mp4"
                  />
                </div>
              </div>

              {/* Título y Descripción */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Título</label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-[#0a0a0a] border-white/10 text-white"
                    placeholder="Tutorial de Bienvenida"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Descripción</label>
                  <Input
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-[#0a0a0a] border-white/10 text-white"
                    placeholder="Aprende cómo ganar dinero"
                  />
                </div>
              </div>

              {/* Interruptor de Click */}
              <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg border border-white/10">
                <div>
                  <h3 className="text-white font-medium text-sm">Permitir Click en el Video</h3>
                  <p className="text-gray-400 text-xs mt-1">
                    {form.is_clickable 
                      ? 'Los usuarios pueden hacer click para ver el video completo' 
                      : 'El video solo se reproduce en bucle, sin interacción'}
                  </p>
                </div>
                <Switch
                  checked={form.is_clickable}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, is_clickable: checked }))}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>

              {/* Botón Guardar */}
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>

            </CardContent>
          </Card>
        </div>

        {/* Info */}
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="text-blue-400 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm text-blue-200">
                <p className="font-medium mb-1">Instrucciones</p>
                <ul className="text-blue-300/80 space-y-1 text-xs">
                  <li>• Sube tus videos a la carpeta <code className="bg-black/30 px-1 rounded">public/video/</code></li>
                  <li>• Usa rutas como: <code className="bg-black/30 px-1 rounded">/video/tutorial-slider.mp4</code></li>
                  <li>• <strong>Video Slider:</strong> Se reproduce en bucle en el dashboard</li>
                  <li>• <strong>Video Reproductor:</strong> Se abre al hacer click (si está activado)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
