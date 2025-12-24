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
import { Gift, Save, Eye, EyeOff, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

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
  instructions: string;
}

const emptyOffer: Omit<CustomOffer, 'id' | 'position'> = {
  title: '',
  description: '',
  amount: 1.00,
  image_url: '',
  modal_title: '',
  modal_subtitle: '',
  audio_url: '',
  video_url: '',
  input_placeholder: '',
  input_label: '',
  help_text: '',
  instructions: '',
  partner_name: '',
  partner_logo: '',
  objective: '',
  task_type: 'Texto',
  block_bg_color: '#255BA5',
  image_bg_color: '#255BA5',
  is_active: true,
};

export default function CustomOffersAdmin() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [offers, setOffers] = useState<CustomOffer[]>([]);
  const [expandedOffers, setExpandedOffers] = useState<Set<string>>(new Set());

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
      setOffers(data || []);
    } catch (error) {
      console.error('Error loading offers:', error);
      toast.error('Error al cargar las ofertas');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (offerId: string) => {
    setExpandedOffers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(offerId)) {
        newSet.delete(offerId);
      } else {
        newSet.add(offerId);
      }
      return newSet;
    });
  };

  const updateOffer = (index: number, field: keyof CustomOffer, value: any) => {
    setOffers(prev => {
      const newOffers = [...prev];
      newOffers[index] = { ...newOffers[index], [field]: value };
      return newOffers;
    });
  };

  const saveOffer = async (offer: CustomOffer, index: number) => {
    try {
      setSaving(offer.id || `new-${index}`);

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
        instructions: offer.instructions,
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
        const { error } = await supabase
          .from('custom_offers')
          .update(offerData)
          .eq('id', offer.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('custom_offers')
          .insert([offerData])
          .select()
          .single();
        if (error) throw error;
        
        setOffers(prev => {
          const newOffers = [...prev];
          newOffers[index] = { ...newOffers[index], id: data.id };
          return newOffers;
        });
      }

      toast.success('Oferta guardada exitosamente');
    } catch (error) {
      console.error('Error saving offer:', error);
      toast.error('Error al guardar la oferta');
    } finally {
      setSaving(null);
    }
  };

  const toggleActive = async (index: number) => {
    const offer = offers[index];
    const newActiveState = !offer.is_active;
    
    updateOffer(index, 'is_active', newActiveState);

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
        updateOffer(index, 'is_active', !newActiveState);
      }
    }
  };

  const addNewOffer = () => {
    const maxPosition = offers.length > 0 ? Math.max(...offers.map(o => o.position)) : 0;
    const newOffer: CustomOffer = {
      ...emptyOffer,
      id: '',
      position: maxPosition + 1,
    };
    setOffers(prev => [...prev, newOffer]);
    setExpandedOffers(prev => new Set(prev).add(''));
  };

  const deleteOffer = async (index: number) => {
    const offer = offers[index];
    
    if (!confirm(`¿Estás seguro de eliminar la oferta "${offer.title || 'Sin título'}"?`)) {
      return;
    }

    if (offer.id) {
      try {
        const { error } = await supabase
          .from('custom_offers')
          .delete()
          .eq('id', offer.id);

        if (error) throw error;
        toast.success('Oferta eliminada');
      } catch (error) {
        console.error('Error deleting offer:', error);
        toast.error('Error al eliminar la oferta');
        return;
      }
    }

    setOffers(prev => prev.filter((_, i) => i !== index));
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  const renderOfferForm = (offer: CustomOffer, index: number) => {
    const isExpanded = expandedOffers.has(offer.id || '');
    const isSaving = saving === (offer.id || `new-${index}`);

    return (
      <Card key={offer.id || `new-${index}`} className="bg-[#121212] border-white/10">
        <CardHeader className="cursor-pointer" onClick={() => toggleExpanded(offer.id || '')}>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm bg-white/10 px-2 py-1 rounded">#{offer.position}</span>
              <span className="truncate max-w-[200px]">{offer.title || 'Nueva Oferta'}</span>
              <span className="text-xs text-gray-400">({offer.task_type || 'Sin tipo'})</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={offer.is_active ? 'default' : 'outline'}
                onClick={(e) => { e.stopPropagation(); toggleActive(index); }}
                className={offer.is_active ? 'bg-green-500 hover:bg-green-600' : ''}
              >
                {offer.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </CardTitle>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="space-y-4">
            {/* Información de la Tarjeta */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white/80">Información de la Tarjeta</h3>
              <div className="space-y-3 p-3 bg-[#0a0a0a] rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white text-xs">Título</Label>
                    <Input
                      value={offer.title}
                      onChange={(e) => updateOffer(index, 'title', e.target.value)}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="Título de la oferta"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-xs">Monto (USD)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={offer.amount}
                      onChange={(e) => updateOffer(index, 'amount', parseFloat(e.target.value) || 0)}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white text-xs">Descripción</Label>
                  <Textarea
                    value={offer.description}
                    onChange={(e) => updateOffer(index, 'description', e.target.value)}
                    className="bg-[#121212] border-white/10 text-white"
                    placeholder="Descripción breve"
                    rows={2}
                  />
                </div>
                <div>
                  <Label className="text-white text-xs">URL de Imagen</Label>
                  <Input
                    value={offer.image_url}
                    onChange={(e) => updateOffer(index, 'image_url', e.target.value)}
                    className="bg-[#121212] border-white/10 text-white"
                    placeholder="/images/offer.png"
                  />
                </div>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white/80">Contenido del Modal</h3>
              <div className="space-y-3 p-3 bg-[#0a0a0a] rounded-lg">
                <div>
                  <Label className="text-white text-xs">Título del Modal</Label>
                  <Input
                    value={offer.modal_title}
                    onChange={(e) => updateOffer(index, 'modal_title', e.target.value)}
                    className="bg-[#121212] border-white/10 text-white"
                    placeholder="¡Tu tarea!"
                  />
                </div>
                <div>
                  <Label className="text-white text-xs">Subtítulo/Contenido del Modal</Label>
                  <Textarea
                    value={offer.modal_subtitle}
                    onChange={(e) => updateOffer(index, 'modal_subtitle', e.target.value)}
                    className="bg-[#121212] border-white/10 text-white"
                    placeholder="Instrucciones o contenido de la tarea"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white text-xs">URL del Audio</Label>
                    <Input
                      value={offer.audio_url}
                      onChange={(e) => updateOffer(index, 'audio_url', e.target.value)}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="/audios/tarea.mp3"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-xs">URL del Video</Label>
                    <Input
                      value={offer.video_url}
                      onChange={(e) => updateOffer(index, 'video_url', e.target.value)}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="/videos/tarea.mp4"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white text-xs">Etiqueta del Input</Label>
                  <Input
                    value={offer.input_label}
                    onChange={(e) => updateOffer(index, 'input_label', e.target.value)}
                    className="bg-[#121212] border-white/10 text-white"
                    placeholder="Escribe tu respuesta:"
                  />
                </div>
                <div>
                  <Label className="text-white text-xs">Placeholder del Input</Label>
                  <Input
                    value={offer.input_placeholder}
                    onChange={(e) => updateOffer(index, 'input_placeholder', e.target.value)}
                    className="bg-[#121212] border-white/10 text-white"
                    placeholder="Ejemplo: respuesta"
                  />
                </div>
                <div>
                  <Label className="text-white text-xs">Texto de Ayuda</Label>
                  <Input
                    value={offer.help_text}
                    onChange={(e) => updateOffer(index, 'help_text', e.target.value)}
                    className="bg-[#121212] border-white/10 text-white"
                    placeholder="Instrucciones adicionales"
                  />
                </div>
                <div>
                  <Label className="text-white text-xs">Instrucciones (4 pasos, separados por |)</Label>
                  <Textarea
                    value={offer.instructions || ''}
                    onChange={(e) => updateOffer(index, 'instructions', e.target.value)}
                    className="bg-[#121212] border-white/10 text-white"
                    placeholder="Paso 1|Paso 2|Paso 3|Paso 4"
                    rows={2}
                  />
                  <p className="text-xs text-gray-500 mt-1">Ejemplo: Lee el contenido|Analiza la información|Escribe tu respuesta|Presiona Confirmar</p>
                </div>
              </div>
            </div>

            {/* Información del Partner */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white/80">Información del Partner</h3>
              <div className="space-y-3 p-3 bg-[#0a0a0a] rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white text-xs">Nombre del Partner</Label>
                    <Input
                      value={offer.partner_name}
                      onChange={(e) => updateOffer(index, 'partner_name', e.target.value)}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="Nombre de la empresa"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-xs">URL del Logo</Label>
                    <Input
                      value={offer.partner_logo}
                      onChange={(e) => updateOffer(index, 'partner_logo', e.target.value)}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="/images/partner-logo.png"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white text-xs">Objetivo de la Tarea</Label>
                  <Textarea
                    value={offer.objective}
                    onChange={(e) => updateOffer(index, 'objective', e.target.value)}
                    className="bg-[#121212] border-white/10 text-white"
                    placeholder="Explica el motivo de la tarea"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Personalización Visual */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white/80">Personalización Visual</h3>
              <div className="space-y-3 p-3 bg-[#0a0a0a] rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white text-xs">Tipo de Tarea</Label>
                    <select
                      value={offer.task_type}
                      onChange={(e) => updateOffer(index, 'task_type', e.target.value)}
                      className="w-full h-10 px-3 bg-[#121212] border border-white/10 text-white rounded-md"
                    >
                      <option value="Audio">Audio</option>
                      <option value="Video">Video</option>
                      <option value="Texto">Texto</option>
                      <option value="Encuesta">Encuesta</option>
                      <option value="Formulario">Formulario</option>
                      <option value="Reseña">Reseña</option>
                      <option value="Juego">Juego</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-white text-xs">Posición</Label>
                    <Input
                      type="number"
                      value={offer.position}
                      onChange={(e) => updateOffer(index, 'position', parseInt(e.target.value) || 1)}
                      className="bg-[#121212] border-white/10 text-white"
                      placeholder="1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white text-xs">Color de Fondo del Bloque</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={offer.block_bg_color}
                        onChange={(e) => updateOffer(index, 'block_bg_color', e.target.value)}
                        className="w-16 h-10 bg-[#121212] border-white/10 cursor-pointer"
                      />
                      <Input
                        value={offer.block_bg_color}
                        onChange={(e) => updateOffer(index, 'block_bg_color', e.target.value)}
                        className="flex-1 bg-[#121212] border-white/10 text-white"
                        placeholder="#255BA5"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white text-xs">Color de Fondo de la Imagen</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={offer.image_bg_color}
                        onChange={(e) => updateOffer(index, 'image_bg_color', e.target.value)}
                        className="w-16 h-10 bg-[#121212] border-white/10 cursor-pointer"
                      />
                      <Input
                        value={offer.image_bg_color}
                        onChange={(e) => updateOffer(index, 'image_bg_color', e.target.value)}
                        className="flex-1 bg-[#121212] border-white/10 text-white"
                        placeholder="#255BA5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <Button
                onClick={() => saveOffer(offer, index)}
                disabled={isSaving}
                className="flex-1 bg-white hover:bg-white/90 text-black"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Button>
              <Button
                onClick={() => deleteOffer(index)}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-white" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Ofertas Personalizadas</h1>
          </div>
          <Button onClick={addNewOffer} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Oferta
          </Button>
        </div>

        <p className="text-gray-400 text-sm mb-4">
          Total: {offers.length} ofertas | Activas: {offers.filter(o => o.is_active).length}
        </p>

        <div className="space-y-4">
          {offers.map((offer, index) => renderOfferForm(offer, index))}
        </div>

        {offers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No hay ofertas personalizadas</p>
            <Button onClick={addNewOffer} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Crear primera oferta
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
