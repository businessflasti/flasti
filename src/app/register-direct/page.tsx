'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { createClient } from '@supabase/supabase-js';

// Crear un cliente de Supabase directamente en este archivo
const supabaseUrl = 'https://ewfvfvkhqftbvldvjnrk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3ZnZmdmtocWZ0YnZsZHZqbnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MTczMDgsImV4cCI6MjA1ODk5MzMwOH0.6AuPXHtii0dCrVrZg2whHa5ZyO_4VVN9dDNKIjN7pMo';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function RegisterDirect() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
    console.log('Iniciando registro directo para:', email);

    try {
      // Intentar registro directo con Supabase con opciones mejoradas
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { phone }, // Guardar el teléfono en los metadatos del usuario
          emailRedirectTo: window.location.origin + '/dashboard' // Redirección después de verificar email
        }
      });

      if (error) {
        console.error('Error en registro:', error);
        toast.dismiss(toastId);

        // Si el error indica que el usuario ya existe, intentar iniciar sesión
        if (error.message && (error.message.includes('already') || error.message.includes('exists'))) {
          toast.info('Este correo ya está registrado. Intentando iniciar sesión...');

          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (signInError) {
            toast.error('Este correo ya está registrado. Por favor, inicia sesión con tu contraseña');
            setTimeout(() => router.push('/login'), 2000);
          } else if (signInData?.user) {
            toast.success('Inicio de sesión exitoso');
            router.push('/dashboard');
          }
        } else {
          toast.error(`Error al registrarse: ${error.message}`);
        }

        setIsLoading(false);
        return;
      }

      if (!data?.user) {
        console.error('No se pudo crear el usuario - datos inválidos');
        toast.dismiss(toastId);
        toast.error('No se pudo crear el usuario');
        setIsLoading(false);
        return;
      }

      console.log('Usuario creado correctamente:', data.user.id);

      // Intentar crear perfil con manejo mejorado de errores
      try {
        console.log('Intentando crear perfil para usuario:', data.user.id);

        // Primero, verificar si el perfil ya existe
        const { data: existingProfile, error: checkError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .maybeSingle();

        if (checkError) {
          console.error('Error al verificar si el perfil existe:', checkError);
        }

        if (existingProfile) {
          console.log('El perfil ya existe, no es necesario crearlo');
        } else {
          // Crear el perfil con manejo detallado de errores
          const profileData = {
            id: data.user.id,
            email,
            phone,
            level: 1,
            balance: 0,
            avatar_url: null,
            created_at: new Date().toISOString()
          };

          console.log('Datos del perfil a insertar:', profileData);

          const { error: profileError } = await supabase
            .from('profiles')
            .insert(profileData);

          if (profileError) {
            console.error('Error al crear perfil:', profileError);
            toast.error(`Error al guardar datos de usuario: ${profileError.message}`);

            // Intentar crear en user_profiles como alternativa
            console.log('Intentando crear en user_profiles como alternativa');
            const { error: userProfileError } = await supabase
              .from('user_profiles')
              .insert({
                user_id: data.user.id,
                email,
                phone,
                level: 1,
                balance: 0,
                avatar_url: null,
                created_at: new Date().toISOString()
              });

            if (userProfileError) {
              console.error('Error al crear en user_profiles:', userProfileError);
            } else {
              console.log('Perfil creado correctamente en user_profiles');
            }
          } else {
            console.log('Perfil creado correctamente en profiles');
          }
        }
      } catch (profileErr) {
        console.error('Error inesperado al crear perfil:', profileErr);
        toast.error('Error al guardar datos de usuario. Por favor, contacta a soporte.');
      }

      // Registro exitoso - Iniciar sesión automáticamente
      try {
        console.log('Intentando iniciar sesión automáticamente');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          console.error('Error al iniciar sesión automática:', signInError);
          // Continuamos a pesar del error, ya que el usuario se creó correctamente
        } else if (signInData?.user) {
          console.log('Inicio de sesión automático exitoso');
        }
      } catch (signInErr) {
        console.error('Error inesperado al iniciar sesión automática:', signInErr);
        // Continuamos a pesar del error, ya que el usuario se creó correctamente
      }

      // Mostrar mensaje de éxito y redirigir
      toast.dismiss(toastId);
      toast.success('Registro exitoso. ¡Bienvenido a Flasti!');

      // Redirigir al dashboard con un pequeño delay para asegurar que todo esté listo
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (error: any) {
      console.error('Error inesperado durante el registro:', error);
      toast.dismiss(toastId);
      toast.error(`Error al registrarse: ${error?.message || 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md relative">
        <div className="bg-card rounded-lg shadow-xl p-6 space-y-6 border border-border">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Registro Directo</h1>
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
    </div>
  );
}
