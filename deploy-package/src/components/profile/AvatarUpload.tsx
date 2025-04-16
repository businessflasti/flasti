'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Camera, Upload, X, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function AvatarUpload() {
  const { user, profile, updateAvatar } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    aspect: 1
  });
  const [completedCrop, setCompletedCrop] = useState<any>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
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

  // Función para generar la imagen recortada
  const generateCroppedImage = useCallback(async () => {
    if (!imgRef.current || !completedCrop) {
      console.error('Error: No hay imagen de referencia o recorte completado');
      return null;
    }

    try {
      const image = imgRef.current;
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Error: No se pudo obtener el contexto del canvas');
        return null;
      }

      // Asegurarse de que las dimensiones sean válidas
      if (completedCrop.width <= 0 || completedCrop.height <= 0) {
        console.error('Error: Dimensiones de recorte inválidas', completedCrop);
        return null;
      }

      // Asegurar que el tamaño del canvas sea adecuado para un avatar (cuadrado y tamaño razonable)
      const size = Math.min(400, Math.max(200, completedCrop.width)); // Entre 200px y 400px
      canvas.width = size;
      canvas.height = size;

      // Limpiar el canvas antes de dibujar
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Asegurar que el fondo sea transparente
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar la imagen recortada en el canvas
      try {
        // Calcular las dimensiones de origen
        const sourceX = completedCrop.x * scaleX;
        const sourceY = completedCrop.y * scaleY;
        const sourceWidth = completedCrop.width * scaleX;
        const sourceHeight = completedCrop.height * scaleY;

        // Dibujar la imagen manteniendo la relación de aspecto 1:1
        ctx.drawImage(
          image,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          size,
          size
        );
      } catch (drawError) {
        console.error('Error al dibujar la imagen en el canvas:', drawError);
        return null;
      }

      // Convertir el canvas a blob con buena calidad
      return new Promise<Blob | null>((resolve) => {
        try {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                console.error('Error: No se pudo generar el blob');
                resolve(null);
                return;
              }
              resolve(blob);
            },
            'image/jpeg',
            0.92 // Calidad ligeramente reducida para mejor rendimiento
          );
        } catch (blobError) {
          console.error('Error al generar el blob:', blobError);
          resolve(null);
        }
      });
    } catch (error) {
      console.error('Error general al procesar la imagen:', error);
      return null;
    }
  }, [completedCrop]);

  // Función para subir la imagen a Supabase Storage
  const uploadAvatar = async () => {
    if (!user || !selectedFile) {
      toast.error('No hay usuario autenticado o archivo seleccionado');
      return;
    }

    setIsUploading(true);
    try {
      // Verificar que el recorte esté completo
      if (!completedCrop || !completedCrop.width || !completedCrop.height) {
        toast.error('Por favor, ajusta la imagen antes de guardar');
        setIsUploading(false);
        return;
      }

      // Generar la imagen recortada
      const croppedBlob = await generateCroppedImage();
      if (!croppedBlob) {
        toast.error('No se pudo procesar la imagen. Por favor, intenta con otra imagen.');
        setIsUploading(false);
        return;
      }

      // Crear un nuevo archivo con el blob recortado
      let croppedFile;
      try {
        // Asegurarse de que el blob tenga un tamaño razonable
        if (croppedBlob.size > 5 * 1024 * 1024) {
          toast.error('La imagen es demasiado grande. Por favor, selecciona una imagen más pequeña.');
          setIsUploading(false);
          return;
        }

        // Verificar que el blob sea válido
        if (croppedBlob.size === 0) {
          toast.error('La imagen procesada está vacía. Por favor, intenta con otra imagen.');
          setIsUploading(false);
          return;
        }

        croppedFile = new File([croppedBlob], `avatar-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });
      } catch (fileError) {
        console.error('Error al crear el archivo:', fileError);
        toast.error('Error al crear el archivo de imagen');
        setIsUploading(false);
        return;
      }

      // Subir a Supabase Storage
      const fileName = `avatar-${user.id}-${Date.now()}.jpg`;
      try {
        const { data, error } = await supabase.storage
          .from('avatars')
          .upload(fileName, croppedFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (error) {
          console.error('Error al subir a Supabase Storage:', error);
          toast.error(`Error al subir la imagen: ${error.message}`);
          setIsUploading(false);
          return;
        }

        // Obtener la URL pública
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        if (!urlData || !urlData.publicUrl) {
          toast.error('No se pudo obtener la URL de la imagen');
          setIsUploading(false);
          return;
        }

        // Actualizar el perfil del usuario
        const { error: updateError } = await updateAvatar(urlData.publicUrl);

        if (updateError) {
          console.error('Error al actualizar el perfil:', updateError);
          toast.error(`Error al actualizar el perfil: ${updateError.message}`);
          setIsUploading(false);
          return;
        }

        toast.success('Foto de perfil actualizada correctamente');
        setIsDialogOpen(false);
      } catch (storageError) {
        console.error('Error en la operación de almacenamiento:', storageError);
        toast.error('Error al guardar la imagen. Por favor, intenta de nuevo.');
      }
    } catch (error: any) {
      console.error('Error general al subir avatar:', error);
      toast.error(`Error al subir la imagen: ${error.message || 'Inténtalo de nuevo'}`);
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  // Función para cancelar la subida
  const handleCancel = () => {
    setIsDialogOpen(false);
    setSelectedFile(null);
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
              <div className="h-full w-full flex items-center justify-center overflow-hidden">
                <img
                  src={profile.avatar_url}
                  alt="Foto de perfil"
                  className="min-h-full min-w-full object-cover"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
            ) : (
              <div className="h-28 w-28 rounded-full bg-gradient-to-r from-[#9333ea] to-[#ec4899] flex items-center justify-center text-white text-3xl font-bold">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#10b981] border border-background shadow-sm translate-x-1/4 translate-y-1/2"></span>
        </div>

        <button
          className="absolute bottom-0 right-0 bg-gradient-to-r from-[#9333ea] to-[#ec4899] text-white p-2 rounded-full shadow-md hover:opacity-90 transition-opacity"
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

      {/* Diálogo para recortar imagen */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            // Limpiar recursos cuando se cierra el diálogo
            handleCancel();
          }
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajustar foto de perfil</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-4">
            {previewUrl && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imgRef}
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-[300px] max-w-full object-contain"
                  onLoad={() => {
                    // Asegurarse de que la imagen esté cargada antes de permitir el recorte
                    if (!completedCrop) {
                      // Establecer un recorte inicial que cubra toda la imagen
                      const initialCrop = {
                        unit: '%',
                        width: 100,
                        height: 100,
                        x: 0,
                        y: 0,
                        aspect: 1
                      };
                      setCrop(initialCrop);
                      setCompletedCrop(initialCrop);
                    }
                  }}
                />
              </ReactCrop>
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
                  Guardar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
