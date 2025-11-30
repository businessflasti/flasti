'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Gift, Save, Eye, EyeOff } from 'lucide-react';

interface CustomOffer {
  id: string;
  title: string;
  description: string;
  amount: number;
  image_url: string;
  modal_title: string;
  modal_subtitle: string;
  audio_url: string;
  video_url: string;
  input_placeholder: string;
  input_label: string;
  help_text: string;
  partner_name: string;
  partner_logo: string;
  objective: string;
  task_type: string;
  block_bg_color: string;
  image_bg_color: string;
  is_active: boolean;
  position: number;
}

export default function CustomOffersAdmin() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [offer1, setOffer1] = useState<CustomOffer>({
    id: '',
    title: 'Transcripción de Audio',
    description: 'Escucha el audio y escribe las palabras que menciona',
    amount: 1.50,
    image_url: '',
    modal_title: '¡Tu primera tarea!',
    modal_subtitle: 'Escucha el audio y escribe las 5 palabras que se mencionan',
    audio_url: '/audios/bienvenida.mp3',
    video_url: '',
    input_placeholder: 'Ejemplo: PALABRA1 PALABRA2 PALABRA3 PALABRA4 PALABRA5',
    input_label: 'Escribe las 5 palabras (separadas por espacios):',
    help_text: 'Las palabras deben estar en el orden mencionado en el audio',
    partner_name: 'AudioLab',
    partner_logo: '',
    objective: 'Ayúdanos a mejorar nuestro sistema de reconocimiento de voz',
    task_type: 'Audio',
    block_bg_color: '#255BA5',
    image_bg_color: '#255BA5',
    is_active: true,
    position: 1
  });

  const [offer2, setOffer2] = useState<CustomOffer>({
    id: '',
    title: 'Control de Calidad de Video',
    description: 'Encuentra el error en el video y gana recompensas',
    amount: 2.00,
    image_url: '',
    modal_title: '¡Encuentra el error!',
    modal_subtitle: 'Mira el video con atención y anota el tiempo exacto donde encuentres el fallo',
    audio_url: '',
    video_url: '/videos/tarea-video.mp4',
    input_placeholder: 'Ejemplo: 00:43 o 43',
    input_label: 'Tiempo del error (en segundos o formato MM:SS):',
    help_text: 'Anota el tiempo exacto donde viste el error en el video',
    partner_name: 'QualityCheck',
    partner_logo: '',
    objective: 'Ayúdanos a identificar errores en nuestros videos para mejorar la calidad',
    task_type: 'Video',
    block_bg_color: '#8B2C9E',
    image_bg_color: '#8B2C9E',
    is_active: true,
    position: 2
  });

  // Verificar si es admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        router.push('/dashboard');
        return;
      }

      const { data } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('user_id', user.id)
        .single();

      if (!data?.is_admin) {
        toast.error('No tienes permisos para acceder a esta página');
        router.push('/dashboard');
        return;
      }

      setIsAdmin(true);
      loadOffers();
    };

    checkAdmin();
  }, [user, router]);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('custom_offers')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        if (data[0]) setOffer1(data[0]);
        if (data[1]) setOffer2(data[1]);
      }
    } catch (error) {
      console.error('Error loading offers:', error);
      toast.error('Error al cargar las ofertas');
    } finally {
      setLoading(false);
    }
  };

  const saveOffer = async (offer: CustomOffer) => {
    try {
      setSaving(true);

      const offerData = {
        title: offer.title,
        description: offer.description,
        amount: offer.amount,
        image_url: offer.image_url,
        modal_title: offer.modal_title,
        modal_subtitle: offer.modal_subtitle,
        audio_url: offer.audio_url,
        video_url: offer.video_url,
        input_placeholder: offer.input_placeholder,
        input_label: offer.input_label,
        help_text: offer.help_text,
        partner_name: offer.partner_name,
        partner_logo: offer.partner_logo,
        objective: offer.objective,
        task_type: offer.task_type,
        block_bg_color: offer.block_bg_color,
        image_bg_color: offer.image_bg_color,
        is_active: offer.is_active,
        position: offer.position
      };

      if (offer.id) {
        // Actualizar
        const { error } = await supabase
          .from('custom_offers')
          .update(offerData)
          .eq('id', offer.id);

        if (error) throw error;
      } else {
        // Insertar
        const { data, error } = await supabase
          .from('custom_offers')
          .insert([offerData])
          .select()
          .single();

        if (error) throw error;
        
        // Actualizar el ID
        if (offer.position === 1) {
          setOffer1({ ...offer, id: data.id });
        } else {
          setOffer2({ ...offer, id: data.id });
        }
      }

      toast.success('Oferta guardada exitosamente');
    } catch (error) {
      console.error('Error saving offer:', error);
      toast.error('Error al guardar la oferta');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (offer: CustomOffer, setOffer: React.Dispatch<React.SetStateAction<CustomOffer>>) => {
    const newActiveState = !offer.is_active;
    setOffer({ ...offer, is_active: newActiveState });

    if (offer.id) {
      try {
        const { error } = await supabase
          .from('custom_offers')
          .update({ is_active: newActiveState })
          .eq('id', offer.id);

        if (error) throw error;
        toast.success(newActiveState ? 'Oferta activada' : 'Oferta desactivada');
      } catch (error) {
        console.error('Error toggling active:', error);
        toast.error('Error al cambiar el estado');
        setOffer({ ...offer, is_active: !newActiveState });
      }
    }
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6 relative z-10">
        <Breadcrumbs />
        
        <div className="flex items-center gap-3 mb-6">
          <Gift className="w-8 h-8 text-white" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">Ofertas Personalizadas</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Oferta 1 */}
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Oferta #1</span>
                <Button
                  size="sm"
                  variant={offer1.is_active ? 'default' : 'outline'}
                  onClick={() => toggleActive(offer1, setOffer1)}
                  className={offer1.is_active ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  {offer1.is_active ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                  {offer1.is_active ? 'Activa' : 'Inactiva'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white/80">Información de la Tarjeta</h3>
                <div className="space-y-3 p-3 bg-[#0a0a0a] rounded-lg">
                  <div>
                    <Label className="text-white text-xs">Título</Label>
                    <Input
                      value={offer1.title}
                      onChange={(e) => setOffer1({ ...offer1, title: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="Título de la oferta"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">Descripción</Label>
                    <Textarea
                      value={offer1.description}
                      onChange={(e) => setOffer1({ ...offer1, description: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="Descripción breve"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">Monto (USD)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={offer1.amount}
                      onChange={(e) => setOffer1({ ...offer1, amount: parseFloat(e.target.value) || 0 })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">URL de Imagen</Label>
                    <Input
                      value={offer1.image_url}
                      onChange={(e) => setOffer1({ ...offer1, image_url: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="/images/offer.png"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white/80">Contenido del Modal</h3>
                <div className="space-y-3 p-3 bg-[#0a0a0a] rounded-lg">
                  <div>
                    <Label className="text-white text-xs">Título del Modal</Label>
                    <Input
                      value={offer1.modal_title}
                      onChange={(e) => setOffer1({ ...offer1, modal_title: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="¡Tu primera tarea!"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">Subtítulo del Modal</Label>
                    <Input
                      value={offer1.modal_subtitle}
                      onChange={(e) => setOffer1({ ...offer1, modal_subtitle: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="Instrucciones de la tarea"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">URL del Audio</Label>
                    <Input
                      value={offer1.audio_url}
                      onChange={(e) => setOffer1({ ...offer1, audio_url: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="/audios/tarea.mp3"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">URL del Video (opcional - para tareas de video)</Label>
                    <Input
                      value={offer1.video_url}
                      onChange={(e) => setOffer1({ ...offer1, video_url: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="/videos/tarea.mp4"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">Etiqueta del Input</Label>
                    <Input
                      value={offer1.input_label}
                      onChange={(e) => setOffer1({ ...offer1, input_label: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="Escribe las palabras:"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">Placeholder del Input</Label>
                    <Input
                      value={offer1.input_placeholder}
                      onChange={(e) => setOffer1({ ...offer1, input_placeholder: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="Ejemplo: palabra1 palabra2"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">Texto de Ayuda</Label>
                    <Input
                      value={offer1.help_text}
                      onChange={(e) => setOffer1({ ...offer1, help_text: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="Instrucciones adicionales"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white/80">Información del Partner</h3>
                <div className="space-y-3 p-3 bg-[#0a0a0a] rounded-lg">
                  <div>
                    <Label className="text-white text-xs">Nombre del Partner</Label>
                    <Input
                      value={offer1.partner_name}
                      onChange={(e) => setOffer1({ ...offer1, partner_name: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="StudioVA"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">URL del Logo del Partner</Label>
                    <Input
                      value={offer1.partner_logo}
                      onChange={(e) => setOffer1({ ...offer1, partner_logo: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="/images/partner-logo.png"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">Objetivo de la Tarea</Label>
                    <Textarea
                      value={offer1.objective}
                      onChange={(e) => setOffer1({ ...offer1, objective: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="Explica el motivo de la tarea"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white/80">Personalización Visual</h3>
                <div className="space-y-3 p-3 bg-[#0a0a0a] rounded-lg">
                  <div>
                    <Label className="text-white text-xs">Tipo de Tarea</Label>
                    <Input
                      value={offer1.task_type}
                      onChange={(e) => setOffer1({ ...offer1, task_type: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="Audio, Video, Texto, etc."
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">Color de Fondo del Bloque (Hex)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={offer1.block_bg_color}
                        onChange={(e) => setOffer1({ ...offer1, block_bg_color: e.target.value })}
                        className="w-16 h-10 bg-[#121212] border-white/10 cursor-pointer"
                      />
                      <Input
                        value={offer1.block_bg_color}
                        onChange={(e) => setOffer1({ ...offer1, block_bg_color: e.target.value })}
                        className="flex-1 bg-[#121212] border-white/10 text-white"
                        placeholder="#255BA5"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white text-xs">Color de Fondo de la Imagen (Hex)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={offer1.image_bg_color}
                        onChange={(e) => setOffer1({ ...offer1, image_bg_color: e.target.value })}
                        className="w-16 h-10 bg-[#121212] border-white/10 cursor-pointer"
                      />
                      <Input
                        value={offer1.image_bg_color}
                        onChange={(e) => setOffer1({ ...offer1, image_bg_color: e.target.value })}
                        className="flex-1 bg-[#121212] border-white/10 text-white"
                        placeholder="#255BA5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => saveOffer(offer1)}
                disabled={saving}
                className="w-full bg-white hover:bg-white/90 text-black"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Guardando...' : 'Guardar Oferta #1'}
              </Button>
            </CardContent>
          </Card>

          {/* Oferta 2 */}
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Oferta #2</span>
                <Button
                  size="sm"
                  variant={offer2.is_active ? 'default' : 'outline'}
                  onClick={() => toggleActive(offer2, setOffer2)}
                  className={offer2.is_active ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  {offer2.is_active ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                  {offer2.is_active ? 'Activa' : 'Inactiva'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white/80">Información de la Tarjeta</h3>
                <div className="space-y-3 p-3 bg-[#0a0a0a] rounded-lg">
                  <div>
                    <Label className="text-white text-xs">Título</Label>
                    <Input
                      value={offer2.title}
                      onChange={(e) => setOffer2({ ...offer2, title: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="Título de la oferta"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">Descripción</Label>
                    <Textarea
                      value={offer2.description}
                      onChange={(e) => setOffer2({ ...offer2, description: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="Descripción breve"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">Monto (USD)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={offer2.amount}
                      onChange={(e) => setOffer2({ ...offer2, amount: parseFloat(e.target.value) })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">URL de Imagen</Label>
                    <Input
                      value={offer2.image_url}
                      onChange={(e) => setOffer2({ ...offer2, image_url: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="/images/offer.png"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white/80">Contenido del Modal</h3>
                <div className="space-y-3 p-3 bg-[#0a0a0a] rounded-lg">
                  <div>
                    <Label className="text-white text-xs">Título del Modal</Label>
                    <Input
                      value={offer2.modal_title}
                      onChange={(e) => setOffer2({ ...offer2, modal_title: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="¡Segunda tarea!"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">Subtítulo del Modal</Label>
                    <Input
                      value={offer2.modal_subtitle}
                      onChange={(e) => setOffer2({ ...offer2, modal_subtitle: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="Instrucciones de la tarea"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">URL del Audio</Label>
                    <Input
                      value={offer2.audio_url}
                      onChange={(e) => setOffer2({ ...offer2, audio_url: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="/audios/tarea.mp3"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">URL del Video (opcional - para tareas de video)</Label>
                    <Input
                      value={offer2.video_url}
                      onChange={(e) => setOffer2({ ...offer2, video_url: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="/videos/tarea.mp4"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">Etiqueta del Input</Label>
                    <Input
                      value={offer2.input_label}
                      onChange={(e) => setOffer2({ ...offer2, input_label: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="Escribe las palabras:"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">Placeholder del Input</Label>
                    <Input
                      value={offer2.input_placeholder}
                      onChange={(e) => setOffer2({ ...offer2, input_placeholder: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="Ejemplo: palabra1 palabra2"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">Texto de Ayuda</Label>
                    <Input
                      value={offer2.help_text}
                      onChange={(e) => setOffer2({ ...offer2, help_text: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="Instrucciones adicionales"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white/80">Información del Partner</h3>
                <div className="space-y-3 p-3 bg-[#0a0a0a] rounded-lg">
                  <div>
                    <Label className="text-white text-xs">Nombre del Partner</Label>
                    <Input
                      value={offer2.partner_name}
                      onChange={(e) => setOffer2({ ...offer2, partner_name: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="StudioVA"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">URL del Logo del Partner</Label>
                    <Input
                      value={offer2.partner_logo}
                      onChange={(e) => setOffer2({ ...offer2, partner_logo: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="/images/partner-logo.png"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">Objetivo de la Tarea</Label>
                    <Textarea
                      value={offer2.objective}
                      onChange={(e) => setOffer2({ ...offer2, objective: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="Explica el motivo de la tarea"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white/80">Personalización Visual</h3>
                <div className="space-y-3 p-3 bg-[#0a0a0a] rounded-lg">
                  <div>
                    <Label className="text-white text-xs">Tipo de Tarea</Label>
                    <Input
                      value={offer2.task_type}
                      onChange={(e) => setOffer2({ ...offer2, task_type: e.target.value })}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="Audio, Video, Texto, etc."
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">Color de Fondo del Bloque (Hex)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={offer2.block_bg_color}
                        onChange={(e) => setOffer2({ ...offer2, block_bg_color: e.target.value })}
                        className="w-16 h-10 bg-[#121212] border-white/10 cursor-pointer"
                      />
                      <Input
                        value={offer2.block_bg_color}
                        onChange={(e) => setOffer2({ ...offer2, block_bg_color: e.target.value })}
                        className="flex-1 bg-[#121212] border-white/10 text-white"
                        placeholder="#255BA5"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white text-xs">Color de Fondo de la Imagen (Hex)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={offer2.image_bg_color}
                        onChange={(e) => setOffer2({ ...offer2, image_bg_color: e.target.value })}
                        className="w-16 h-10 bg-[#121212] border-white/10 cursor-pointer"
                      />
                      <Input
                        value={offer2.image_bg_color}
                        onChange={(e) => setOffer2({ ...offer2, image_bg_color: e.target.value })}
                        className="flex-1 bg-[#121212] border-white/10 text-white"
                        placeholder="#255BA5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => saveOffer(offer2)}
                disabled={saving}
                className="w-full bg-white hover:bg-white/90 text-black"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Guardando...' : 'Guardar Oferta #2'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
