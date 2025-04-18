'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signUp: (email: string, password: string, phone: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ error: any }>;
  updateBalance: () => Promise<void>;
  updateAvatar: (avatarUrl: string) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay una sesión activa
    const getSession = async () => {
      try {
        console.log('AuthContext: Verificando sesión...');
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('AuthContext: Error al obtener sesión:', error);
          setLoading(false);
          return;
        }

        if (data.session) {
          console.log('AuthContext: Sesión encontrada para usuario:', data.session.user.email);
          setUser(data.session.user);

          try {
            // Obtener el perfil del usuario
            let { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.session.user.id)
              .single();

            // Si no se encuentra el perfil en 'profiles', buscar en 'user_profiles'
            if (profileError && profileError.code === 'PGRST116') {
              console.log('AuthContext: Perfil no encontrado en profiles, buscando en user_profiles');
              const { data: userProfileData, error: userProfileError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', data.session.user.id)
                .single();

              if (!userProfileError && userProfileData) {
                console.log('AuthContext: Perfil encontrado en user_profiles');
                // Convertir el formato de user_profiles a profiles
                profileData = {
                  id: data.session.user.id,
                  email: data.session.user.email,
                  level: userProfileData.level || 1,
                  balance: userProfileData.balance || 0,
                  avatar_url: userProfileData.avatar_url || null,
                  created_at: userProfileData.created_at || new Date().toISOString()
                };
                profileError = null;
              }
            }

            if (profileError) {
              console.error('AuthContext: Error al obtener perfil:', profileError);
            } else if (profileData) {
              console.log('AuthContext: Perfil cargado correctamente');
              setProfile(profileData);
            }
          } catch (err) {
            console.error('AuthContext: Error al cargar perfil:', err);
          }
        } else {
          console.log('AuthContext: No hay sesión activa');
        }
      } catch (err) {
        console.error('AuthContext: Error general al verificar sesión:', err);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Nota: No podemos usar hooks aquí, los moveremos al componente principal

    // Escuchar cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (eventType, session) => {
        console.log(`AuthContext: Evento de autenticación: ${eventType}`);

        if (session?.user) {
          console.log(`AuthContext: Usuario autenticado: ${session.user.email}`);
          setUser(session.user);

          try {
            // Obtener el perfil del usuario
            let { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            // Si no se encuentra el perfil en 'profiles', buscar en 'user_profiles'
            if (profileError && profileError.code === 'PGRST116') {
              console.log('AuthContext: Perfil no encontrado en profiles, buscando en user_profiles');
              const { data: userProfileData, error: userProfileError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .single();

              if (!userProfileError && userProfileData) {
                console.log('AuthContext: Perfil encontrado en user_profiles');
                // Convertir el formato de user_profiles a profiles
                profileData = {
                  id: session.user.id,
                  email: session.user.email,
                  level: userProfileData.level || 1,
                  balance: userProfileData.balance || 0,
                  avatar_url: userProfileData.avatar_url || null,
                  created_at: userProfileData.created_at || new Date().toISOString()
                };
                profileError = null;
              }
            }

            if (profileError) {
              console.error('AuthContext: Error al obtener perfil en evento:', profileError);

              // Si el perfil no existe, intentar crearlo
              if (profileError.code === 'PGRST116') {
                console.log('AuthContext: Perfil no encontrado, intentando crear uno nuevo');
                const { error: insertError } = await supabase
                  .from('profiles')
                  .insert({
                    id: session.user.id,
                    email: session.user.email,
                    level: 1,
                    balance: 0,
                    avatar_url: null,
                    created_at: new Date().toISOString()
                  });

                if (insertError) {
                  console.error('AuthContext: Error al crear perfil:', insertError);
                } else {
                  console.log('AuthContext: Perfil creado correctamente');
                  // Cargar el perfil recién creado
                  const { data: newProfileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                  if (newProfileData) {
                    setProfile(newProfileData);
                  }
                }
              }
            } else if (profileData) {
              console.log('AuthContext: Perfil cargado correctamente en evento');
              setProfile(profileData);
            }
          } catch (err) {
            console.error('AuthContext: Error al cargar perfil en evento:', err);
          }
        } else {
          console.log('AuthContext: Usuario desconectado');
          setUser(null);
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Registrar un nuevo usuario
  const signUp = async (email: string, password: string, phone: string = '') => {
    setLoading(true);

    // Implementar sistema de reintentos
    let attempts = 0;
    const maxAttempts = 3;
    let lastError = null;

    while (attempts < maxAttempts) {
      try {
        console.log(`Intento de registro ${attempts + 1} de ${maxAttempts}`);

        // Usar Promise.race para implementar un timeout más largo
        const signUpPromise = supabase.auth.signUp({
          email,
          password,
        });

        // Timeout de 15 segundos
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout al conectar con el servidor')), 15000);
        });

        // @ts-ignore - Ignorar error de tipo para Promise.race
        const { data, error } = await Promise.race([signUpPromise, timeoutPromise]);

        console.log('Respuesta de signUp:', { data, error });

        if (error) {
          console.error(`Error al registrar el usuario (intento ${attempts + 1}):`, error);
          lastError = error;
          attempts++;
          // Esperar antes de reintentar (backoff exponencial)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
          continue;
        }

      if (!data.user) {
        console.error('No se pudo crear el usuario');
        setLoading(false);
        return { error: new Error('No se pudo crear el usuario') };
      }

      // Intentar crear el perfil manualmente para incluir el teléfono
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            phone: phone, // Guardar el teléfono en el perfil
            level: 1,
            balance: 0,
            avatar_url: null,
            created_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Error al crear perfil durante registro:', profileError);
          // No fallamos el registro si no se puede crear el perfil
        } else {
          console.log('Perfil creado correctamente durante registro');
        }
      } catch (profileErr) {
        console.error('Error al crear perfil durante registro:', profileErr);
      }

      // Iniciar sesión inmediatamente después del registro
      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          console.error('Error al iniciar sesión después del registro:', signInError);
          // Continuamos a pesar del error, ya que el usuario se creó correctamente
        }
      } catch (err) {
        console.error('Error al iniciar sesión después del registro:', err);
        // Continuamos a pesar del error, ya que el usuario se creó correctamente
      }

        // Si llegamos aquí, el registro fue exitoso
        setLoading(false);
        return { error: null };
      } catch (err) {
        console.error(`Error inesperado durante el registro (intento ${attempts + 1}):`, err);
        lastError = err as Error;
        attempts++;
        // Esperar antes de reintentar
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }

    // Si llegamos aquí, todos los intentos fallaron
    console.error('Todos los intentos de registro fallaron');
    setLoading(false);
    return { error: lastError || new Error('No se pudo conectar al servidor') };
  }
  };

  // Iniciar sesión
  const signIn = async (email: string, password: string) => {
    setLoading(true);

    // Implementar sistema de reintentos
    let attempts = 0;
    const maxAttempts = 3;
    let lastError = null;

    while (attempts < maxAttempts) {
      try {
        console.log(`Intento de inicio de sesión ${attempts + 1} de ${maxAttempts}`);

        // Usar Promise.race para implementar un timeout más largo
        const loginPromise = supabase.auth.signInWithPassword({
          email,
          password,
        });

        // Timeout de 15 segundos
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout al conectar con el servidor')), 15000);
        });

        // @ts-ignore - Ignorar error de tipo para Promise.race
        const { data, error } = await Promise.race([loginPromise, timeoutPromise]);

        console.log('Respuesta de signIn:', { data, error });

        if (error) {
          console.error(`Error al iniciar sesión (intento ${attempts + 1}):`, error);
          lastError = error;
          attempts++;
          // Esperar antes de reintentar (backoff exponencial)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
          continue;
        }

      // Asegurarse de que el usuario se establezca correctamente
      if (data && data.user) {
        setUser(data.user);

        try {
          // Cargar el perfil del usuario
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            console.error('Error al cargar perfil:', profileError);
            // Intentar crear el perfil si no existe
            if (profileError.code === 'PGRST116') {
              console.log('Perfil no encontrado, intentando crear uno nuevo');
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: data.user.id,
                  email: data.user.email,
                  level: 1,
                  balance: 0,
                  avatar_url: null,
                  created_at: new Date().toISOString()
                });

              if (insertError) {
                console.error('Error al crear perfil:', insertError);
              } else {
                // Cargar el perfil recién creado
                const { data: newProfileData } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', data.user.id)
                  .single();

                if (newProfileData) {
                  setProfile(newProfileData);
                }
              }
            }
          } else if (profileData) {
            setProfile(profileData);
          }
        } catch (profileError) {
          console.error('Error al cargar perfil:', profileError);
          // No fallamos el inicio de sesión si no se puede cargar el perfil
        }
      }

        // Si llegamos aquí, el inicio de sesión fue exitoso
        setLoading(false);
        return { error: null };
      } catch (err) {
        console.error(`Error inesperado durante el inicio de sesión (intento ${attempts + 1}):`, err);
        lastError = err as Error;
        attempts++;
        // Esperar antes de reintentar
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }

    // Si llegamos aquí, todos los intentos fallaron
    console.error('Todos los intentos de inicio de sesión fallaron');
    setLoading(false);
    return { error: lastError || new Error('No se pudo conectar al servidor') };
  }

  // Cerrar sesión
  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Actualizar el perfil del usuario
  const updateProfile = async (data: any) => {
    if (!user) return { error: new Error('No hay usuario autenticado') };

    try {
      // Intentar actualizar en la tabla profiles
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) {
        console.error('Error al actualizar perfil en profiles:', error);

        // Si falla, intentar actualizar en user_profiles
        const { error: userProfileError } = await supabase
          .from('user_profiles')
          .update({
            ...data,
            // Mapear campos si es necesario
            user_id: user.id
          })
          .eq('user_id', user.id);

        if (userProfileError) {
          console.error('Error al actualizar perfil en user_profiles:', userProfileError);
          return { error: userProfileError };
        }
      }

      // Actualizar el perfil en el estado
      setProfile({ ...profile, ...data });
      return { error: null };
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return { error };
    }
  };

  // Función específica para actualizar el balance
  const updateBalance = async () => {
    if (!user) return;

    try {
      console.log('AuthContext: Actualizando balance del usuario');

      // Buscar en user_profiles primero
      const { data: userProfileData, error: userProfileError } = await supabase
        .from('user_profiles')
        .select('balance, level')
        .eq('user_id', user.id)
        .single();

      if (!userProfileError && userProfileData) {
        console.log('AuthContext: Balance actualizado desde user_profiles:', userProfileData.balance);
        // Actualizar tanto el balance como el nivel
        setProfile(prev => ({
          ...prev,
          balance: userProfileData.balance || 0,
          level: userProfileData.level || 1
        }));
      } else {
        // Si no se encuentra en user_profiles, buscar en profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('balance, level')
          .eq('id', user.id)
          .single();

        if (!profileError && profileData) {
          console.log('AuthContext: Balance actualizado desde profiles:', profileData.balance);
          // Actualizar tanto el balance como el nivel
          setProfile(prev => ({
            ...prev,
            balance: profileData.balance || 0,
            level: profileData.level || 1
          }));
        }
      }
    } catch (error) {
      console.error('AuthContext: Error al actualizar balance:', error);
    }
  };

  // Función específica para actualizar el avatar
  const updateAvatar = async (avatarUrl: string) => {
    if (!user) return { error: new Error('No hay usuario autenticado') };

    try {
      console.log('AuthContext: Actualizando avatar del usuario');

      // Intentar actualizar usando la función RPC
      const { error: rpcError } = await supabase
        .rpc('update_avatar_url', {
          user_id_param: user.id,
          avatar_url_param: avatarUrl
        });

      if (rpcError) {
        console.error('Error al actualizar avatar con RPC:', rpcError);

        // Intentar actualizar en user_profiles
        const { error: userProfileError } = await supabase
          .from('user_profiles')
          .update({ avatar_url: avatarUrl })
          .eq('user_id', user.id);

        // Si hay error o no existe, intentar con profiles
        if (userProfileError) {
          console.error('Error al actualizar avatar en user_profiles:', userProfileError);

          const { error: profileError } = await supabase
            .from('profiles')
            .update({ avatar_url: avatarUrl })
            .eq('id', user.id);

          if (profileError) {
            console.error('Error al actualizar avatar en profiles:', profileError);
            return { error: profileError };
          }
        }
      }

      // Actualizar el avatar en el estado local inmediatamente
      setProfile(prev => ({
        ...prev,
        avatar_url: avatarUrl
      }));

      console.log('AuthContext: Avatar actualizado correctamente');
      return { error: null };
    } catch (error) {
      console.error('AuthContext: Error al actualizar avatar:', error);
      return { error };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updateBalance,
    updateAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
