'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Camera, X, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AvatarUpload() {
  const { user, profile, updateAvatar } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // Añadir un estado para forzar la actualización del componente
  const [refreshKey, setRefreshKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para abrir el selector de archivos
  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Función para manejar el cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 5MB');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsDialogOpen(true);

    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    if (e.target) {
      e.target.value = '';
    }
  };

  // Función simplificada para subir la imagen a Supabase Storage
  const uploadAvatar = async () => {
    if (!user || !selectedFile) {
      toast.error('No hay usuario autenticado o archivo seleccionado');
      return;
    }

    setIsUploading(true);
    try {
      // Crear un timestamp único para evitar problemas de caché
      const timestamp = Date.now();
      // Subir directamente el archivo seleccionado sin recorte
      const fileName = `avatar-${user.id}-${timestamp}.${selectedFile.name.split('.').pop()}`;

      // Subir a Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, selectedFile, {
          cacheControl: '0', // Sin caché para asegurar que se cargue la nueva imagen
          upsert: true
        });

      if (error) {
        console.error('Error al subir a Supabase Storage:', error);
        toast.error(`Error al subir la imagen: ${error.message}`);
        return;
      }

      // Obtener la URL pública con el timestamp para evitar caché
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      if (!urlData || !urlData.publicUrl) {
        toast.error('No se pudo obtener la URL de la imagen');
        return;
      }

      // Añadir timestamp a la URL para evitar caché
      const publicUrlWithTimestamp = `${urlData.publicUrl}?t=${timestamp}`;

      // Actualizar el perfil del usuario
      const { error: updateError } = await updateAvatar(publicUrlWithTimestamp);

      if (updateError) {
        console.error('Error al actualizar el perfil:', updateError);
        toast.error(`Error al actualizar el perfil: ${updateError.message}`);
        return;
      }

      // Actualizar la imagen mostrada en la interfaz inmediatamente
      // Esto evita tener que recargar la página
      try {
        // 1. Actualizar todas las imágenes de avatar en la página
        const avatarImg = document.querySelectorAll('img[src*="avatar"]');
        avatarImg.forEach(img => {
          img.src = publicUrlWithTimestamp;
        });

        // 2. Actualizar específicamente la imagen en la página de perfil
        // Usar el ID específico que hemos añadido
        const profileMainAvatar = document.getElementById('profile-main-avatar');
        if (profileMainAvatar instanceof HTMLImageElement) {
          profileMainAvatar.src = publicUrlWithTimestamp;
        }

        // También buscar por clase para mayor seguridad
        const profileAvatarByClass = document.querySelector('.profile-avatar-image');
        if (profileAvatarByClass instanceof HTMLImageElement) {
          profileAvatarByClass.src = publicUrlWithTimestamp;
        }

        // Y también por selector más específico
        const profileAvatarBySelector = document.querySelector('.h-28.w-28.rounded-full.overflow-hidden img');
        if (profileAvatarBySelector instanceof HTMLImageElement) {
          profileAvatarBySelector.src = publicUrlWithTimestamp;
        }

        // 3. Actualizar cualquier otra imagen de perfil que pueda estar en la página
        const allProfileImages = document.querySelectorAll('img[alt="Foto de perfil"]');
        allProfileImages.forEach(img => {
          img.src = publicUrlWithTimestamp;
        });
      } catch (updateError) {
        console.error('Error al actualizar imágenes en la interfaz:', updateError);
        // No fallar completamente si hay un error al actualizar la interfaz
      }

      // Forzar la actualización del componente
      setRefreshKey(prevKey => prevKey + 1);

      toast.success('Foto de perfil actualizada correctamente');

      // Cerrar el diálogo y limpiar
      setIsDialogOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);

      // Forzar una actualización adicional después de un breve retraso
      setTimeout(() => {
        setRefreshKey(prevKey => prevKey + 1);
      }, 100);

    } catch (error: any) {
      console.error('Error general al subir avatar:', error);
      toast.error(`Error al subir la imagen: ${error.message || 'Inténtalo de nuevo'}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Función para cancelar la subida
  const handleCancel = () => {
    setIsDialogOpen(false);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Avatar actual con botón de cambio */}
      <div className="relative mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#9333ea]/30 via-[#ec4899]/30 to-[#facc15]/30 rounded-full blur-md animate-pulse-slow"></div>
          <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-background shadow-lg relative">
            {profile?.avatar_url ? (
              <div className="h-full w-full flex items-center justify-center">
                <img
                  key={`profile-avatar-${refreshKey}`}
                  src={`${profile.avatar_url}?t=${new Date().getTime()}-${refreshKey}`}
                  alt="Foto de perfil"
                  className="h-full w-full object-cover profile-avatar-image"
                  id="profile-main-avatar"
                />
              </div>
            ) : (
              <div className="h-28 w-28 rounded-full overflow-hidden">
                <img src="/images/default-avatar.png" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <button
          className="absolute bottom-0 right-0 bg-[#ec3f7c] text-white p-2 rounded-full shadow-md hover:opacity-90 transition-opacity"
          onClick={handleSelectFile}
          aria-label="Cambiar foto de perfil"
        >
          <Camera size={18} />
        </button>
      </div>

      {/* Texto informativo */}
      <h3 className="text-lg font-semibold mt-2 mb-1">
        {profile?.name || user?.email?.split('@')[0] || 'Usuario'}
      </h3>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          Nivel {profile?.level || 1}
        </span>
        <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
          Activo
        </span>
      </div>
      <p className="text-sm text-foreground/70 mb-4 text-center">
        Haz clic en el ícono de cámara para cambiar tu foto de perfil
      </p>

      {/* Input oculto para seleccionar archivo */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Diálogo para previsualizar imagen */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCancel();
          }
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Previsualizar foto de perfil</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-4">
            <p className="text-sm text-foreground/70 mb-4 text-center">
              Tu foto de perfil se mostrará en formato circular
            </p>
            {previewUrl && (
              <div className="w-[200px] h-[200px] rounded-full overflow-hidden border-2 border-primary/20">
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isUploading}
            >
              <X size={16} className="mr-2" />
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={uploadAvatar}
              disabled={isUploading}
              className="bg-gradient-to-r from-[#9333ea] to-[#ec4899] hover:opacity-90 transition-opacity"
            >
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Subiendo...
                </>
              ) : (
                <>
                  <Check size={16} className="mr-2" />
                  Usar esta foto
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
