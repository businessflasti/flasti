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
import SeasonalGarland from '@/components/themes/SeasonalGarland';

export default function PerfilPage() {
  const { user, profile, updateAvatar } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar datos del usuario
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setUserData(profileData);
          setFirstName(profileData.first_name || '');
          setLastName(profileData.last_name || '');
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
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
  
  const getAvatarColor = (text: string) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
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

  // Función para cambiar la contraseña - VERSIÓN SIMPLE QUE FUNCIONA
  const handlePasswordChange = (e: React.FormEvent) => {
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

    // Activar loading
    setIsLoading(true);

    // Cambiar contraseña y manejar respuesta
    supabase.auth.updateUser({ password: newPassword })
      .then(({ error }) => {
        if (error) {
          toast.error(`Error: ${error.message}`);
          setIsLoading(false);
        } else {
          // ÉXITO - Mostrar notificación inmediatamente
          toast.success('¡Contraseña actualizada correctamente!', {
            duration: 5000,
            position: 'top-center',
            style: { 
              backgroundColor: '#10b981', 
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }
          });
          
          // Limpiar campos
          setNewPassword('');
          setConfirmPassword('');
          setIsLoading(false);
        }
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`);
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-[#0B1017] p-4 relative overflow-hidden">
      <SeasonalGarland />
      
      <div className="relative z-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Mi Perfil</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Información del Usuario */}
          <Card 
            className="p-6 bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-white/20 rounded-3xl transition-all duration-700 relative"
            style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
          >
            {/* Brillo superior glassmorphism */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-[#6E40FF]/20 to-[#6E40FF]/5">
                <User className="h-5 w-5 text-[#6E40FF]" />
              </div>
              Información Personal
            </h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {/* Avatar con funcionalidad de subida */}
                <div className="relative">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-[#30363d] shadow-lg">
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
                        style={{ backgroundColor: getAvatarColor(user?.email || userData?.name || 'default') }}
                      >
                        {getInitials(user?.email, userData?.name)}
                      </div>
                    )}
                  </div>
                  <button
                    className="absolute bottom-0 right-0 bg-[#238636] text-white p-2 rounded-full shadow-md hover:bg-[#2ea043] transition-colors"
                    onClick={handleSelectFile}
                    aria-label="Cambiar foto de perfil"
                  >
                    <Camera size={14} />
                  </button>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {userData?.first_name 
                      ? `${userData.first_name} ${userData.last_name || ''}`.trim()
                      : (userData?.name || user?.email?.split('@')[0] || '')}
                  </h3>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full inline-block mt-1">
                    Activo
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    Haz clic en la cámara para cambiar tu foto
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center mb-2 gap-2">
                  <div className="relative p-1.5 rounded-lg bg-gradient-to-br from-[#2DE2E6]/20 to-[#2DE2E6]/5">
                    <Mail className="h-3.5 w-3.5 text-[#2DE2E6]" />
                  </div>
                  <span className="text-sm text-gray-400">Correo Electrónico</span>
                </div>
                <p className="text-white font-medium">
                  {user?.email || 'No especificado'}
                </p>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center mb-2 gap-2">
                  <div className="relative p-1.5 rounded-lg bg-gradient-to-br from-[#238636]/20 to-[#238636]/5">
                    <Shield className="h-3.5 w-3.5 text-[#3fb950]" />
                  </div>
                  <span className="text-sm text-gray-400">Estado de la cuenta</span>
                </div>
                <p className="text-green-400 font-medium">Verificada</p>
              </div>
            </div>
          </Card>

          {/* Cambio de Contraseña */}
          <Card 
            className="p-6 bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-white/20 rounded-3xl transition-all duration-700 relative"
            style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
          >
            {/* Brillo superior glassmorphism */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-[#2DE2E6]/20 to-[#2DE2E6]/5">
                <Lock className="h-5 w-5 text-[#2DE2E6]" />
              </div>
              Cambiar Contraseña
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="text-sm font-medium text-gray-300 block mb-2">
                  Nueva Contraseña
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] placeholder-[#6e7681] focus:ring-1 focus:ring-[#6e40ff]/30 focus:border-[#6e40ff]/50 hover:border-[#8b949e]"
                  placeholder="Ingresa tu nueva contraseña"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 6 caracteres
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300 block mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] placeholder-[#6e7681] focus:ring-1 focus:ring-[#6e40ff]/30 focus:border-[#6e40ff]/50 hover:border-[#8b949e]"
                  placeholder="Confirma tu nueva contraseña"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#238636] hover:bg-[#2ea043] text-white shadow-lg shadow-[#238636]/20"
                disabled={isLoading}
              >
                {isLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h3 className="text-sm font-medium text-blue-400 mb-2">Consejos de seguridad:</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Usa al menos 8 caracteres</li>
                <li>• Incluye mayúsculas y minúsculas</li>
                <li>• Agrega números y símbolos</li>
                <li>• No uses información personal</li>
              </ul>
            </div>
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
                className="bg-transparent border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] hover:border-[#8b949e]"
              >
                <X size={16} className="mr-2" />
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={uploadAvatar}
                disabled={isUploading}
                className="bg-[#238636] hover:bg-[#2ea043] text-white shadow-lg shadow-[#238636]/20"
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