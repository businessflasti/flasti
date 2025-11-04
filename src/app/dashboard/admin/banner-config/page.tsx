'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Save, Eye, Upload } from 'lucide-react';
import Image from 'next/image';

export default function BannerConfigPage() {
  const [bannerText, setBannerText] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [backgroundGradient, setBackgroundGradient] = useState('from-[#FF1493] via-[#2DE2E6] to-[#8B5CF6]');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [showSeparator, setShowSeparator] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    loadBannerConfig();
  }, []);

  const loadBannerConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('banner_config')
        .select('*')
        .single();

      if (!error && data) {
        setBannerText(data.banner_text);
        setLogoUrl(data.logo_url);
        setBackgroundGradient(data.background_gradient || 'from-[#FF1493] via-[#2DE2E6] to-[#8B5CF6]');
        setBackgroundImage(data.background_image || '');
        setShowSeparator(data.show_separator !== false);
        setIsActive(data.is_active);
      }
    } catch (error) {
      console.error('Error loading banner config:', error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleSave = async () => {
    if (!bannerText.trim()) {
      toast.error('El texto del banner no puede estar vacío');
      return;
    }

    if (!logoUrl.trim()) {
      toast.error('La URL del logo no puede estar vacía');
      return;
    }

    setLoading(true);

    try {
      // Usar upsert para crear o actualizar
      const { error } = await supabase
        .from('banner_config')
        .upsert({
          id: 1,
          banner_text: bannerText,
          logo_url: logoUrl,
          background_gradient: backgroundGradient,
          background_image: backgroundImage || null,
          show_separator: showSeparator,
          is_active: isActive,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Error updating banner config:', error);
        throw error;
      }

      toast.success('Configuración del banner actualizada correctamente');
    } catch (error: any) {
      console.error('Error updating banner config:', error);
      toast.error(`Error al actualizar la configuración: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#0B1017] relative overflow-hidden">
        <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6 relative z-10">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1017] relative overflow-hidden">
      <div className="w-full max-w-4xl mx-auto px-4 py-8 pb-16 md:pb-8 space-y-6 relative z-10">
        <Breadcrumbs />

        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Configuración del Banner</h1>
        </div>

        <Card className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <CardHeader>
            <CardTitle className="text-white">Editar Banner Superior</CardTitle>
            <p className="text-sm text-white/60 mt-2">
              Personaliza el texto y logo del banner que aparece en la parte superior de la página principal
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Vista previa */}
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Vista Previa
              </Label>
              <div 
                className={`rounded-lg p-3 relative ${backgroundImage ? '' : `bg-gradient-to-r ${backgroundGradient}`}`}
                style={backgroundImage ? {
                  backgroundImage: `url(${backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                } : {}}
              >
                <div className="flex items-center justify-start gap-2 sm:gap-3">
                  {logoUrl && (
                    <>
                      <div className="flex-shrink-0">
                        <Image
                          src={logoUrl}
                          alt="Logo Preview"
                          width={20}
                          height={20}
                          className="w-4 h-4 sm:w-5 sm:h-5"
                        />
                      </div>
                      {showSeparator && (
                        <div className="h-4 sm:h-5 w-px bg-white/30"></div>
                      )}
                    </>
                  )}
                  <span 
                    className="text-white text-[11px] sm:text-xs drop-shadow-lg"
                    dangerouslySetInnerHTML={{ __html: bannerText || 'Texto del banner...' }}
                  />
                </div>
              </div>
            </div>

            {/* Texto del banner */}
            <div className="space-y-2">
              <Label htmlFor="bannerText" className="text-white">
                Texto del Banner
              </Label>
              <div className="space-y-2">
                <textarea
                  id="bannerText"
                  value={bannerText}
                  onChange={(e) => setBannerText(e.target.value)}
                  placeholder="Ej: ¡Bienvenido a Flasti! Gana dinero completando microtareas"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 py-2 min-h-[80px] resize-none"
                  maxLength={250}
                />
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {/* Botón Negrita */}
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById('bannerText') as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const selectedText = bannerText.substring(start, end);
                        if (selectedText) {
                          const newText = bannerText.substring(0, start) + `<strong>${selectedText}</strong>` + bannerText.substring(end);
                          setBannerText(newText);
                        }
                      }}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded border border-white/20 font-bold"
                    >
                      <strong>B</strong> Negrita
                    </button>

                    {/* Selector de Color */}
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="textColor"
                        defaultValue="#ffffff"
                        className="w-8 h-8 rounded border border-white/20 cursor-pointer bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('bannerText') as HTMLTextAreaElement;
                          const colorInput = document.getElementById('textColor') as HTMLInputElement;
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const selectedText = bannerText.substring(start, end);
                          if (selectedText) {
                            const color = colorInput.value;
                            const newText = bannerText.substring(0, start) + `<span style="color:${color}">${selectedText}</span>` + bannerText.substring(end);
                            setBannerText(newText);
                          }
                        }}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded border border-white/20"
                      >
                        🎨 Color
                      </button>
                    </div>

                    {/* Colores Rápidos */}
                    <div className="flex gap-1">
                      {[
                        { name: 'Amarillo', color: '#FFD700' },
                        { name: 'Naranja', color: '#FF6B35' },
                        { name: 'Rosa', color: '#FF1493' },
                        { name: 'Cyan', color: '#2DE2E6' },
                        { name: 'Verde', color: '#10B981' }
                      ].map((preset) => (
                        <button
                          key={preset.color}
                          type="button"
                          onClick={() => {
                            const textarea = document.getElementById('bannerText') as HTMLTextAreaElement;
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const selectedText = bannerText.substring(start, end);
                            if (selectedText) {
                              const newText = bannerText.substring(0, start) + `<span style="color:${preset.color}">${selectedText}</span>` + bannerText.substring(end);
                              setBannerText(newText);
                            }
                          }}
                          className="w-6 h-6 rounded border border-white/20 hover:scale-110 transition-transform"
                          style={{ backgroundColor: preset.color }}
                          title={preset.name}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-white/40">
                    {bannerText.length}/250 caracteres
                  </p>
                </div>
              </div>
              <p className="text-xs text-white/40">
                Selecciona texto y usa los botones para aplicar formato. Negrita: &lt;strong&gt;texto&lt;/strong&gt; | Color: &lt;span style="color:#COLOR"&gt;texto&lt;/span&gt;
              </p>
            </div>

            {/* URL del logo */}
            <div className="space-y-2">
              <Label htmlFor="logoUrl" className="text-white flex items-center gap-2">
                <Upload className="w-4 h-4" />
                URL del Logo
              </Label>
              <Input
                id="logoUrl"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="/logo.svg"
                className="bg-white/5 border-white/10 text-white"
              />
              <p className="text-xs text-white/40">
                Ruta del logo (ej: /logo.svg o /images/logo.png). Solo visible en tema predeterminado.
              </p>
            </div>

            {/* Imagen de fondo */}
            <div className="space-y-2">
              <Label htmlFor="backgroundImage" className="text-white flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Imagen de Fondo (Opcional)
              </Label>
              <Input
                id="backgroundImage"
                value={backgroundImage}
                onChange={(e) => setBackgroundImage(e.target.value)}
                placeholder="/images/banner-bg.jpg"
                className="bg-white/5 border-white/10 text-white"
              />
              <p className="text-xs text-white/40">
                URL de la imagen de fondo. Si hay imagen, el degradado se anula. Deja vacío para usar degradado.
              </p>
            </div>

            {/* Gradiente de fondo */}
            <div className="space-y-2">
              <Label htmlFor="backgroundGradient" className="text-white">
                Gradiente de Fondo (Tailwind)
              </Label>
              <Input
                id="backgroundGradient"
                value={backgroundGradient}
                onChange={(e) => setBackgroundGradient(e.target.value)}
                placeholder="from-[#FF1493] via-[#2DE2E6] to-[#8B5CF6]"
                className="bg-white/5 border-white/10 text-white"
                disabled={!!backgroundImage}
              />
              <p className="text-xs text-white/40">
                {backgroundImage 
                  ? 'Desactivado porque hay una imagen de fondo configurada'
                  : 'Clases de Tailwind para el degradado. Ej: from-[#FF1493] via-[#2DE2E6] to-[#8B5CF6]'
                }
              </p>
            </div>

            {/* Mostrar separador */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showSeparator"
                checked={showSeparator}
                onChange={(e) => setShowSeparator(e.target.checked)}
                className="w-4 h-4 rounded border-white/10"
              />
              <Label htmlFor="showSeparator" className="text-white cursor-pointer">
                Mostrar separador entre logo y texto
              </Label>
            </div>

            {/* Estado activo */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-white/10"
              />
              <Label htmlFor="isActive" className="text-white cursor-pointer">
                Banner activo (visible en la página principal)
              </Label>
            </div>

            {/* Botón guardar */}
            <Button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-white hover:bg-white/90 text-black"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></span>
                  Guardando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Guardar Cambios
                </span>
              )}
            </Button>

            {/* Información adicional */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="font-medium text-blue-400 mb-2">Información</h4>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• Los cambios se reflejan en tiempo real sin necesidad de recargar</li>
                <li>• El logo debe estar en la carpeta /public del proyecto</li>
                <li>• El logo solo se muestra cuando el tema es el predeterminado (no Halloween, no Navidad)</li>
                <li>• Si configuras una imagen de fondo, el degradado se anula automáticamente</li>
                <li>• Deja vacío el campo de imagen para usar el degradado</li>
                <li>• El usuario puede cerrar el banner con el botón X en la esquina derecha</li>
                <li>• Mantén el texto conciso para mejor visualización en móviles</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Nueva sección: Bloques CTA Bento Grid */}
        <CTANewsBlocksEditor />
      </div>
    </div>
  );
}

// Componente para editar los bloques CTA
function CTANewsBlocksEditor() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = async () => {
    try {
      const { data, error } = await supabase
        .from('cta_news_blocks')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data) {
        setBlocks(data);
      }
    } catch (error) {
      console.error('Error loading CTA blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBlock = async (blockId: number) => {
    setSaving(true);
    try {
      const block = blocks.find(b => b.id === blockId);
      if (!block) return;

      const { error } = await supabase
        .from('cta_news_blocks')
        .update({
          title: block.title,
          description: block.description,
          image_url: block.image_url,
          is_active: block.is_active
        })
        .eq('id', blockId);

      if (error) throw error;

      toast.success('Bloque actualizado correctamente');
    } catch (error) {
      console.error('Error updating block:', error);
      toast.error('Error al actualizar el bloque');
    } finally {
      setSaving(false);
    }
  };

  const updateBlock = (blockId: number, field: string, value: any) => {
    setBlocks(blocks.map(b => 
      b.id === blockId ? { ...b, [field]: value } : b
    ));
  };

  if (loading) {
    return (
      <Card className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl relative">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      <CardHeader>
        <CardTitle className="text-white">Bloques CTA Bento Grid</CardTitle>
        <p className="text-sm text-white/60 mt-2">
          Edita los 3 bloques de noticias que aparecen al final de la página principal
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {blocks.map((block, index) => (
          <div key={block.id} className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Bloque {index + 1}</h3>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={block.is_active}
                  onChange={(e) => updateBlock(block.id, 'is_active', e.target.checked)}
                  className="w-4 h-4 rounded border-white/10"
                />
                <Label className="text-white text-sm">Activo</Label>
              </div>
            </div>

            {/* Vista previa de la imagen */}
            {block.image_url && (
              <div className="relative w-full h-20 rounded-lg overflow-hidden bg-black/20">
                <img 
                  src={block.image_url} 
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover object-left"
                />
              </div>
            )}

            {/* URL de la imagen */}
            <div className="space-y-2">
              <Label className="text-white text-sm">URL de la Imagen</Label>
              <Input
                value={block.image_url}
                onChange={(e) => updateBlock(block.id, 'image_url', e.target.value)}
                placeholder="/images/principal/banner1.png"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            {/* Título */}
            <div className="space-y-2">
              <Label className="text-white text-sm">Título</Label>
              <Input
                value={block.title}
                onChange={(e) => updateBlock(block.id, 'title', e.target.value)}
                placeholder="Título del bloque"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label className="text-white text-sm">Descripción</Label>
              <textarea
                value={block.description}
                onChange={(e) => updateBlock(block.id, 'description', e.target.value)}
                placeholder="Descripción del bloque"
                className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 py-2 min-h-[80px] resize-none"
              />
            </div>

            {/* Botón guardar individual */}
            <Button
              onClick={() => handleSaveBlock(block.id)}
              disabled={saving}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Guardando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Guardar Bloque {index + 1}
                </span>
              )}
            </Button>
          </div>
        ))}

        {/* Información adicional */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="font-medium text-blue-400 mb-2">Información</h4>
          <ul className="text-sm text-blue-300 space-y-1">
            <li>• Estos bloques aparecen al final de la página principal (sección CTA)</li>
            <li>• Las imágenes deben estar en la carpeta /public/images/principal/</li>
            <li>• Los cambios se reflejan inmediatamente en la página</li>
            <li>• Puedes desactivar bloques individuales sin eliminarlos</li>
            <li>• El orden de los bloques es: Bloque 1, Bloque 2, Bloque 3</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
