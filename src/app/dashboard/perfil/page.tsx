'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Shield, Mail, User, Camera, Lock, X, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function PerfilPage() {
  const { user, profile, updateAvatar } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  // Estados para el flujo de cambio de contraseña
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  
  // Estados para nombre y apellido
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  
  // Estados para subir avatar
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar datos del usuario
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        setIsLoadingProfile(true);
        
        // Timeout para evitar loading infinito
        const timeoutId = setTimeout(() => {
          console.warn('Timeout al cargar perfil');
          setIsLoadingProfile(false);
        }, 10000);
        
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        clearTimeout(timeoutId);

        if (profileData) {
          setUserData(profileData);
          setFirstName(profileData.first_name || '');
          setLastName(profileData.last_name || '');
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserData();
  }, [user]);



  // Funciones para el avatar
  const getInitials = (email: string | undefined, name: string | undefined) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.split('@')[0].substring(0, 2).toUpperCase();
    }
    return 'U';
  };
  
  // Color fijo para todos los avatares genéricos
  const getAvatarColor = () => {
    return '#85C1E9';
  };

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 5MB');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsDialogOpen(true);

    if (e.target) {
      e.target.value = '';
    }
  };

  const uploadAvatar = async () => {
    if (!user || !selectedFile) {
      toast.error('No hay usuario autenticado o archivo seleccionado');
      return;
    }

    setIsUploading(true);
    try {
      const timestamp = Date.now();
      const fileName = `avatar-${user.id}-${timestamp}.${selectedFile.name.split('.').pop()}`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, selectedFile, {
          cacheControl: '0',
          upsert: true
        });

      if (error) {
        console.error('Error al subir a Supabase Storage:', error);
        toast.error(`Error al subir la imagen: ${error.message}`);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      if (!urlData || !urlData.publicUrl) {
        toast.error('No se pudo obtener la URL de la imagen');
        return;
      }

      const publicUrlWithTimestamp = `${urlData.publicUrl}?t=${timestamp}`;

      const { error: updateError } = await updateAvatar(publicUrlWithTimestamp);

      if (updateError) {
        console.error('Error al actualizar el perfil:', updateError);
        toast.error(`Error al actualizar el perfil: ${updateError.message}`);
        return;
      }

      setRefreshKey(prevKey => prevKey + 1);
      toast.success('Foto de perfil actualizada correctamente');

      setIsDialogOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);

    } catch (error: any) {
      console.error('Error general al subir avatar:', error);
      toast.error(`Error al subir la imagen: ${error.message || 'Inténtalo de nuevo'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  // Función para actualizar nombre y apellido
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim()) {
      toast.error('El nombre es requerido');
      return;
    }
    
    setIsUpdatingName(true);
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim()
        })
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      // Recargar datos locales
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (profileData) {
        setUserData(profileData);
      }
      
      toast.success('Nombre actualizado correctamente. Recargando...');
      
      // Recargar la página para actualizar el contexto
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(`Error al actualizar: ${error.message}`);
      setIsUpdatingName(false);
    }
  };

  // Función para cambiar la contraseña
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    // Usar la API que funciona
    const response = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: user?.email, 
        newPassword 
      })
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error || 'Error al cambiar la contraseña');
      setIsLoading(false);
      return;
    }

    // Éxito
    toast.success('¡Contraseña actualizada correctamente!');
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  };

  return (
    <div className="min-h-screen p-4 relative overflow-hidden" style={{ background: '#F6F3F3' }}>
      
      <div className="relative z-10">
      <div className="max-w-4xl mx-auto" style={{ contain: 'layout style' }}>
        <h1 className="text-3xl font-bold mb-8" style={{ color: '#111827' }}>Mi Perfil</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Información del Usuario */}
          <Card className="p-6 rounded-3xl border-0 shadow-sm" style={{ background: '#FFFFFF' }}>
            <h2 className="text-xl font-semibold mb-6" style={{ color: '#111827' }}>
              Información Personal
            </h2>

            {isLoadingProfile ? (
              <div className="space-y-4">
                {/* Avatar skeleton */}
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-20 w-20 rounded-full" variant="light" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32 rounded" variant="light" />
                    <Skeleton className="h-4 w-16 rounded-full" variant="light" />
                  </div>
                </div>
                
                {/* Email skeleton */}
                <div className="p-4 rounded-lg" style={{ background: '#F3F3F3' }}>
                  <div className="flex items-center mb-2 gap-2">
                    <Skeleton className="h-7 w-7 rounded-lg" variant="light" />
                    <Skeleton className="h-3 w-24 rounded" variant="light" />
                  </div>
                  <Skeleton className="h-5 w-48 rounded" variant="light" />
                </div>
                
                {/* Estado skeleton */}
                <div className="p-4 rounded-lg" style={{ background: '#F3F3F3' }}>
                  <div className="flex items-center mb-2 gap-2">
                    <Skeleton className="h-7 w-7 rounded-lg" variant="light" />
                    <Skeleton className="h-3 w-28 rounded" variant="light" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded" variant="light" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {/* Avatar con funcionalidad de subida */}
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
                      {profile?.avatar_url ? (
                        <img
                          key={`profile-avatar-${refreshKey}`}
                          src={`${profile.avatar_url}?t=${new Date().getTime()}-${refreshKey}`}
                          alt="Foto de perfil"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div 
                          className="h-full w-full rounded-full flex items-center justify-center text-white font-bold text-xl"
                          style={{ backgroundColor: '#F3F3F3', color: '#111827' }}
                        >
                          {getInitials(user?.email, userData?.name)}
                        </div>
                      )}
                    </div>
                    <button
                      className="absolute bottom-0 right-0 text-white p-2 rounded-full shadow-md transition-opacity duration-300"
                      style={{ background: '#111827' }}
                      onClick={handleSelectFile}
                      aria-label="Cambiar foto de perfil"
                    >
                      <Camera size={14} />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold" style={{ color: '#111827' }}>
                      {userData?.first_name 
                        ? `${userData.first_name} ${userData.last_name || ''}`.trim()
                        : (userData?.name || user?.email?.split('@')[0] || '')}
                    </h3>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full inline-block mt-1">
                      Activo
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Haz clic en la cámara para cambiar tu foto
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg" style={{ background: '#F3F3F3' }}>
                  <div className="flex items-center mb-2 gap-2">
                    <div className="p-1.5 rounded-lg" style={{ background: '#0D50A4' }}>
                      <Mail className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-sm text-gray-500">Correo Electrónico</span>
                  </div>
                  <p className="font-medium" style={{ color: '#111827' }}>
                    {user?.email || 'No especificado'}
                  </p>
                </div>

                <div className="p-4 rounded-lg" style={{ background: '#F3F3F3' }}>
                  <div className="flex items-center mb-2 gap-2">
                    <div className="p-1.5 rounded-lg" style={{ background: '#0D50A4' }}>
                      <Shield className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-sm text-gray-500">Estado de la cuenta</span>
                  </div>
                  <p className="text-green-600 font-medium">Verificada</p>
                </div>
              </div>
            )}
          </Card>

          {/* Cambio de Contraseña */}
          <Card className="p-6 rounded-3xl border-0 shadow-sm" style={{ background: '#FFFFFF' }}>
            <h2 className="text-xl font-semibold mb-6" style={{ color: '#111827' }}>
              Cambiar Contraseña
            </h2>

            {passwordChangeSuccess ? (
              <div className="text-center space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                    <Check className="h-8 w-8" style={{ color: '#10B981' }} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold" style={{ color: '#111827' }}>
                  Tu contraseña ha sido cambiada con éxito
                </h3>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  Ya puedes usar tu nueva contraseña
                </p>
                <Button
                  onClick={() => setPasswordChangeSuccess(false)}
                  className="w-full text-white transition-opacity duration-300"
                  style={{ background: '#0D50A4' }}
                >
                  Listo
                </Button>
              </div>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label htmlFor="newPassword" className="text-sm font-medium block mb-2" style={{ color: '#111827' }}>
                    Nueva contraseña
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-gray-200 focus:ring-1 focus:ring-[#0D50A4]/30 transition-opacity duration-300"
                    style={{ background: '#F3F3F3', color: '#111827' }}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="text-sm font-medium block mb-2" style={{ color: '#111827' }}>
                    Confirmar nueva contraseña
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-gray-200 focus:ring-1 focus:ring-[#0D50A4]/30 transition-opacity duration-300"
                    style={{ background: '#F3F3F3', color: '#111827' }}
                    placeholder="Repite tu contraseña"
                    required
                    minLength={6}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full text-white transition-opacity duration-300"
                  style={{ background: '#0D50A4' }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Actualizando...</span>
                    </div>
                  ) : 'Cambiar contraseña'}
                </Button>
              </form>
            )}

            {!passwordChangeSuccess && (
              <div className="mt-6 p-4 rounded-lg" style={{ background: '#F3F3F3' }}>
                <h3 className="text-sm font-medium mb-2" style={{ color: '#0D50A4' }}>Consejos de seguridad:</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Usa al menos 8 caracteres</li>
                  <li>• Incluye mayúsculas y minúsculas</li>
                  <li>• Agrega números y símbolos</li>
                  <li>• No uses información personal</li>
                </ul>
              </div>
            )}
          </Card>
        </div>

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
          <DialogContent className="sm:max-w-md bg-[#161b22]/95 backdrop-blur-xl border-[#30363d]">
            <DialogHeader>
              <DialogTitle className="text-white">Previsualizar foto de perfil</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center py-4">
              <p className="text-sm text-gray-400 mb-4 text-center">
                Tu foto de perfil se mostrará en formato circular
              </p>
              {previewUrl && (
                <div className="w-[200px] h-[200px] rounded-full overflow-hidden border-2 border-[#30363d]">
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
                className="bg-transparent border-[#30363d] text-[#c9d1d9] transition-opacity duration-300"
              >
                <X size={16} className="mr-2" />
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={uploadAvatar}
                disabled={isUploading}
                className="bg-[#238636] text-white shadow-lg shadow-[#238636]/20 transition-opacity duration-300"
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
      </div>
    </div>
  );
}