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

  // Registrar un nuevo usuario - Solución radical
  const signUp = async (email: string, password: string, phone: string = '') => {
    setLoading(true);
    console.log('Iniciando proceso de registro con solución radical para:', email);

    try {
      // 1. Verificar si el usuario ya existe intentando iniciar sesión
      const loginResult = await supabase.auth.signInWithPassword({
        email,
        password
      }).catch(() => ({ data: null, error: null }));

      // Si el inicio de sesión es exitoso, el usuario ya existe
      if (loginResult.data?.user) {
        console.log('El usuario ya existe y la contraseña es correcta');
        setUser(loginResult.data.user);

        // Cargar o crear perfil
        try {
          const basicProfile = {
            id: loginResult.data.user.id,
            email: email,
            phone: phone || '',
            level: 1,
            balance: 0,
            avatar_url: null,
            created_at: new Date().toISOString()
          };

          setProfile(basicProfile);
        } catch (e) {
          console.log('Error al establecer perfil para usuario existente, pero continuando');
        }

        setLoading(false);
        return { error: { message: 'User already registered' } };
      }

      // 2. Intentar registro con opciones máximas de compatibilidad
      console.log('Intentando registro con opciones de compatibilidad máxima');

      // Usar fetch directamente para evitar problemas con el cliente de Supabase
      const response = await fetch(`${supabase.supabaseUrl}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabase.supabaseKey,
          'X-Client-Info': 'supabase-js/2.x'
        },
        body: JSON.stringify({
          email,
          password,
          data: { phone }
        })
      });

      const result = await response.json();
      console.log('Respuesta directa de registro:', result);

      // Verificar si hubo error
      if (!response.ok || result.error) {
        const errorMsg = result.error?.message || 'Error desconocido en el registro';
        console.error('Error en registro directo:', errorMsg);

        // Si el error indica que el usuario ya existe, intentar iniciar sesión
        if (errorMsg.includes('already') || errorMsg.includes('exists')) {
          console.log('El usuario parece existir, intentando iniciar sesión...');

          // Intentar iniciar sesión
          const { data: signInData } = await supabase.auth.signInWithPassword({ email, password })
            .catch(() => ({ data: null }));

          if (signInData?.user) {
            setUser(signInData.user);
            setProfile({
              id: signInData.user.id,
              email: email,
              phone: phone || '',
              level: 1,
              balance: 0,
              avatar_url: null,
              created_at: new Date().toISOString()
            });
          }

          setLoading(false);
          return { error: { message: 'User already registered' } };
        }

        setLoading(false);
        return { error: new Error(errorMsg) };
      }

      // 3. Verificar que tenemos datos válidos
      if (!result.user || !result.user.id) {
        console.error('No se pudo crear el usuario - datos inválidos');
        setLoading(false);
        return { error: new Error('No se pudo crear el usuario - respuesta inválida') };
      }

      console.log('Usuario creado correctamente:', result.user.id);

      // 4. Establecer el usuario en el estado
      setUser(result.user);

      // 5. Crear un perfil básico
      try {
        const profileData = {
          id: result.user.id,
          email: email,
          phone: phone || '',
          level: 1,
          balance: 0,
          avatar_url: null,
          created_at: new Date().toISOString()
        };

        // Intentar crear el perfil en ambas tablas
        await Promise.allSettled([
          // Intentar en profiles
          fetch(`${supabase.supabaseUrl}/rest/v1/profiles`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabase.supabaseKey,
              'Authorization': `Bearer ${supabase.supabaseKey}`,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify(profileData)
          }),
          // Intentar en user_profiles
          fetch(`${supabase.supabaseUrl}/rest/v1/user_profiles`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabase.supabaseKey,
              'Authorization': `Bearer ${supabase.supabaseKey}`,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              ...profileData,
              user_id: result.user.id
            })
          })
        ]);

        // Establecer el perfil en el estado
        setProfile(profileData);
      } catch (profileErr) {
        console.log('Error al crear perfil, pero continuando:', profileErr);
        // No fallamos por errores de perfil
      }

      // 6. Iniciar sesión automáticamente
      try {
        await supabase.auth.signInWithPassword({ email, password })
          .catch(e => console.log('Error al iniciar sesión automática, pero continuando:', e));
      } catch (e) {
        console.log('Error al iniciar sesión automática, pero continuando');
      }

      // 7. Finalizar proceso
      console.log('Registro completado con éxito');
      setLoading(false);
      return { error: null };

    } catch (err) {
      // Capturar cualquier error inesperado
      console.error('Error inesperado durante el registro:', err);
      setLoading(false);
      return { error: err as Error };
    }
  };

  // Iniciar sesión - Versión simplificada
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    console.log('Iniciando proceso de login simplificado para:', email);

    try {
      // Intentar iniciar sesión directamente
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      // Manejar errores de inicio de sesión
      if (error) {
        console.error('Error durante el inicio de sesión:', error);
        setLoading(false);
        return { error };
      }

      // Verificar que tenemos datos válidos
      if (!data || !data.user) {
        console.error('No se pudo iniciar sesión - datos inválidos');
        setLoading(false);
        return { error: new Error('No se pudo iniciar sesión') };
      }

      console.log('Inicio de sesión exitoso:', data.user.id);

      // Establecer el usuario en el estado
      setUser(data.user);

      // Intentar cargar el perfil del usuario
      try {
        // Primero intentar cargar desde profiles
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
          .catch(() => ({ data: null }));

        if (profileData) {
          console.log('Perfil cargado desde profiles');
          setProfile(profileData);
        } else {
          // Si no existe en profiles, intentar en user_profiles
          const { data: userProfileData } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', data.user.id)
            .single()
            .catch(() => ({ data: null }));

          if (userProfileData) {
            console.log('Perfil cargado desde user_profiles');
            // Convertir formato de user_profiles a profiles
            setProfile({
              id: data.user.id,
              email: data.user.email,
              level: userProfileData.level || 1,
              balance: userProfileData.balance || 0,
              avatar_url: userProfileData.avatar_url || null,
              created_at: userProfileData.created_at || new Date().toISOString()
            });
          } else {
            // Si no existe perfil, crear uno básico
            console.log('Creando perfil básico para usuario existente');
            const basicProfile = {
              id: data.user.id,
              email: data.user.email,
              level: 1,
              balance: 0,
              avatar_url: null,
              created_at: new Date().toISOString()
            };

            // Intentar crear el perfil en ambas tablas
            await supabase.from('profiles').insert(basicProfile)
              .catch(err => console.log('Nota: Error al crear perfil en login, pero continuando:', err));

            await supabase.from('user_profiles').insert({
              ...basicProfile,
              user_id: data.user.id
            }).catch(err => console.log('Nota: Error al crear user_profile en login, pero continuando:', err));

            setProfile(basicProfile);
          }
        }
      } catch (profileErr) {
        console.log('Error al cargar/crear perfil, pero continuando:', profileErr);
        // Establecer un perfil básico en el estado para que la aplicación funcione
        setProfile({
          id: data.user.id,
          email: data.user.email,
          level: 1,
          balance: 0,
          avatar_url: null,
          created_at: new Date().toISOString()
        });
      }

      // Finalizar proceso
      console.log('Inicio de sesión completado con éxito');
      setLoading(false);
      return { error: null };

    } catch (err) {
      // Capturar cualquier error inesperado
      console.error('Error inesperado durante el inicio de sesión:', err);
      setLoading(false);
      return { error: err as Error };
    }
  };

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
