'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { createClient } from '@supabase/supabase-js';

// Crear un cliente de Supabase directamente en este archivo
const supabaseUrl = 'https://ewfvfvkhqftbvldvjnrk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3ZnZmdmtocWZ0YnZsZHZqbnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MTczMDgsImV4cCI6MjA1ODk5MzMwOH0.6AuPXHtii0dCrVrZg2whHa5ZyO_4VVN9dDNKIjN7pMo';
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

export default function RegisterSimple() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]}: ${info}`]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setDebugInfo([]);

    // Validaciones básicas
    if (!email || !password || !phone) {
      toast.error('Por favor, completa todos los campos');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    // Mostrar mensaje de carga
    const toastId = toast.loading('Procesando registro...');
    addDebugInfo(`Iniciando registro para: ${email}`);

    try {
      // Paso 1: Registrar al usuario
      addDebugInfo('Paso 1: Registrando usuario en Supabase Auth');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { phone }
        }
      });

      if (authError) {
        addDebugInfo(`Error en registro: ${authError.message}`);
        toast.dismiss(toastId);
        
        // Si el usuario ya existe, intentar iniciar sesión
        if (authError.message && (authError.message.includes('already') || authError.message.includes('exists'))) {
          addDebugInfo('Usuario ya existe, intentando iniciar sesión');
          toast.info('Este correo ya está registrado. Intentando iniciar sesión...');
          
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (signInError) {
            addDebugInfo(`Error en inicio de sesión: ${signInError.message}`);
            toast.error('Este correo ya está registrado. Por favor, inicia sesión con tu contraseña');
            setTimeout(() => router.push('/login'), 2000);
          } else if (signInData?.user) {
            addDebugInfo('Inicio de sesión exitoso');
            toast.success('Inicio de sesión exitoso');
            router.push('/dashboard');
          }
        } else {
          toast.error(`Error al registrarse: ${authError.message}`);
        }
        
        setIsLoading(false);
        return;
      }

      if (!authData?.user) {
        addDebugInfo('No se pudo crear el usuario - datos inválidos');
        toast.dismiss(toastId);
        toast.error('No se pudo crear el usuario');
        setIsLoading(false);
        return;
      }

      addDebugInfo(`Usuario creado correctamente: ${authData.user.id}`);
      
      // Paso 2: Verificar si el perfil ya existe
      addDebugInfo('Paso 2: Verificando si el perfil ya existe');
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authData.user.id)
        .maybeSingle();
        
      if (profileCheckError) {
        addDebugInfo(`Error al verificar perfil: ${profileCheckError.message}`);
      }
      
      // Paso 3: Crear perfil si no existe
      if (!existingProfile) {
        addDebugInfo('Paso 3: Creando perfil nuevo');
        const profileData = {
          id: authData.user.id,
          email,
          phone,
          level: 1,
          balance: 0,
          avatar_url: null,
          created_at: new Date().toISOString()
        };
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (profileError) {
          addDebugInfo(`Error al crear perfil: ${profileError.message}`);
          
          // Intentar crear en user_profiles como alternativa
          addDebugInfo('Intentando crear en user_profiles como alternativa');
          const { error: userProfileError } = await supabase
            .from('user_profiles')
            .insert({
              user_id: authData.user.id,
              email,
              phone,
              level: 1,
              balance: 0,
              avatar_url: null,
              created_at: new Date().toISOString()
            });
            
          if (userProfileError) {
            addDebugInfo(`Error al crear en user_profiles: ${userProfileError.message}`);
          } else {
            addDebugInfo('Perfil creado correctamente en user_profiles');
          }
        } else {
          addDebugInfo('Perfil creado correctamente en profiles');
        }
      } else {
        addDebugInfo('El perfil ya existe, no es necesario crearlo');
      }

      // Paso 4: Iniciar sesión automáticamente
      addDebugInfo('Paso 4: Iniciando sesión automáticamente');
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) {
        addDebugInfo(`Error al iniciar sesión automática: ${signInError.message}`);
      } else {
        addDebugInfo('Inicio de sesión automático exitoso');
      }

      // Registro exitoso
      toast.dismiss(toastId);
      toast.success('Registro exitoso. ¡Bienvenido a Flasti!');
      
      // Redirigir al dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
    } catch (error: any) {
      addDebugInfo(`Error inesperado: ${error?.message || 'Error desconocido'}`);
      console.error('Error inesperado durante el registro:', error);
      toast.dismiss(toastId);
      toast.error(`Error al registrarse: ${error?.message || 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md relative">
        <div className="bg-card rounded-lg shadow-xl p-6 space-y-6 border border-border">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Registro Simple</h1>
            <p className="text-muted-foreground">Crea una cuenta para comenzar</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Teléfono
              </label>
              <input
                id="phone"
                type="tel"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="+1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Procesando...' : 'Registrarse'}
            </button>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="underline text-primary">
              Iniciar sesión
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            <Link href="/register" className="underline text-muted-foreground">
              Volver al registro normal
            </Link>
          </div>
        </div>
      </div>
      
      {/* Sección de depuración */}
      {debugInfo.length > 0 && (
        <div className="w-full max-w-md mt-8 bg-card rounded-lg shadow-xl p-4 border border-border">
          <h2 className="text-lg font-bold mb-2">Información de depuración</h2>
          <div className="bg-background p-2 rounded text-xs font-mono h-48 overflow-y-auto">
            {debugInfo.map((info, index) => (
              <div key={index} className="mb-1">{info}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
