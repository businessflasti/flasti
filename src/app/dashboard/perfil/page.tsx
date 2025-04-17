'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import BackButton from '@/components/ui/back-button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Shield, Mail, Phone, Calendar, User } from 'lucide-react';
import AvatarUpload from '@/components/profile/AvatarUpload';

export default function PerfilPage() {
  // Estados y contextos
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Cargar datos del usuario
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        // Intentar obtener el perfil de user_profiles
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setUserData(profileData);
          return;
        }

        // Si no se encuentra, intentar con profiles
        const { data: legacyProfileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (legacyProfileData) {
          setUserData(legacyProfileData);
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      }
    };

    loadUserData();
  }, [user]);

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

    // Cambiar contraseña
    setIsLoading(true);

    // Usar setTimeout para asegurar que el estado de carga se aplique visualmente
    setTimeout(async () => {
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });

        // Desactivar el estado de carga inmediatamente
        setIsLoading(false);

        if (error) {
          toast.error(error.message || 'Error al cambiar la contraseña');
        } else {
          // Mostrar notificación de éxito
          toast.success('Contraseña actualizada correctamente', {
            duration: 4000,
            position: 'top-center',
            icon: '🔐',
            style: { backgroundColor: '#10b981', color: 'white' }
          });

          // Limpiar campos
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }
      } catch (error: any) {
        // Desactivar el estado de carga en caso de error
        setIsLoading(false);
        toast.error(error.message || 'Error al cambiar la contraseña');
      }
    }, 100); // Pequeño retraso para asegurar que el estado de carga se aplique visualmente
  };

  // Función para obtener el nivel con porcentaje
  const getLevelWithPercentage = (level: number | undefined) => {
    if (!level) return 'Nivel 1 (50%)';

    switch(level) {
      case 1: return 'Nivel 1 (50%)';
      case 2: return 'Nivel 2 (60%)';
      case 3: return 'Nivel 3 (70%)';
      default: return 'Nivel 1 (50%)';
    }
  };

  // Renderizar la página
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <BackButton />
      <h1 className="text-2xl font-bold mb-6 mt-20 sm:mt-0">Mi Perfil</h1>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Foto de Perfil */}
        <Card className="p-6 bg-card/60 backdrop-blur-md border-border/40 md:col-span-1">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="bg-primary/10 p-2 rounded-full mr-2">
              <User className="h-5 w-5 text-primary" />
            </span>
            Perfil
          </h2>
          <div className="flex flex-col items-center justify-center py-4">
            <AvatarUpload />
          </div>

          <div className="mt-6 pt-6 border-t border-border/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-foreground/70">Miembro desde</h3>
              <span className="text-sm">
                {userData?.created_at
                  ? format(new Date(userData.created_at), 'dd/MM/yyyy')
                  : 'No disponible'}
              </span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-foreground/70">Estado</h3>
              <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
                Activo
              </span>
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-foreground/70">Comisión actual</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {getLevelWithPercentage(userData?.level)}
              </span>
            </div>
          </div>
        </Card>

        {/* Información del Usuario */}
        <Card className="p-6 bg-card/60 backdrop-blur-md border-border/40 md:col-span-2">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="bg-primary/10 p-2 rounded-full mr-2">
              <Shield className="h-5 w-5 text-primary" />
            </span>
            Información Personal
          </h2>

          <div className="space-y-5">
            {/* Correo Electrónico */}
            <div className="p-4 bg-foreground/5 rounded-lg flex items-start">
              <Mail className="h-5 w-5 text-primary mt-0.5 mr-3" />
              <div>
                <label className="text-sm text-muted-foreground font-medium block mb-1">
                  Correo Electrónico
                </label>
                <p className="font-medium text-lg">
                  {user?.email || 'No especificado'}
                </p>
              </div>
            </div>

            {/* Teléfono */}
            <div className="p-4 bg-foreground/5 rounded-lg flex items-start">
              <Phone className="h-5 w-5 text-primary mt-0.5 mr-3" />
              <div>
                <label className="text-sm text-muted-foreground font-medium block mb-1">
                  Teléfono
                </label>
                <p className="font-medium text-lg">
                  {userData?.phone || 'No especificado'}
                </p>
              </div>
            </div>

            {/* Nivel */}
            <div className="p-4 bg-foreground/5 rounded-lg flex items-start">
              <Shield className="h-5 w-5 text-primary mt-0.5 mr-3" />
              <div>
                <label className="text-sm text-muted-foreground font-medium block mb-1">
                  Nivel
                </label>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-primary mr-2"></span>
                  <p className="font-medium text-lg">
                    {getLevelWithPercentage(userData?.level)}
                  </p>
                </div>
              </div>
            </div>

            {/* Fecha de Registro */}
            <div className="p-4 bg-foreground/5 rounded-lg flex items-start">
              <Calendar className="h-5 w-5 text-primary mt-0.5 mr-3" />
              <div>
                <label className="text-sm text-muted-foreground font-medium block mb-1">
                  Fecha de Registro
                </label>
                <p className="font-medium text-lg">
                  {userData?.created_at
                    ? format(new Date(userData.created_at), 'dd/MM/yyyy')
                    : 'No disponible'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Cambio de Contraseña */}
        <Card className="p-6 bg-card/60 backdrop-blur-md border-border/40 md:col-span-3">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="bg-primary/10 p-2 rounded-full mr-2">
              <Shield className="h-5 w-5 text-primary" />
            </span>
            Cambiar Contraseña
          </h2>

          <form onSubmit={handlePasswordChange} className="space-y-5">
            <div>
              <label htmlFor="currentPassword" className="text-sm font-medium block mb-2">
                Contraseña Actual
              </label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-background/50 h-11"
                required
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="text-sm font-medium block mb-2">
                Nueva Contraseña
              </label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-background/50 h-11"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Mínimo 6 caracteres
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-sm font-medium block mb-2">
                Confirmar Nueva Contraseña
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-background/50 h-11"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#9333ea] via-[#ec4899] to-[#facc15] hover:opacity-90 transition-opacity h-11 mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
