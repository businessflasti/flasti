'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import analyticsService from '@/lib/analytics-service';

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

        // Intentar obtener la sesión con reintentos
        let sessionData = null;
        let sessionError = null;
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries && !sessionData) {
          try {
            const { data, error } = await supabase.auth.getSession();
            if (!error) {
              sessionData = data;
              break;
            } else {
              sessionError = error;
              console.warn(`AuthContext: Error al obtener sesión (intento ${retryCount + 1}):`, error);
              // Esperar antes de reintentar
              await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
              retryCount++;
            }
          } catch (e) {
            console.error(`AuthContext: Excepción al obtener sesión (intento ${retryCount + 1}):`, e);
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            retryCount++;
          }
        }

        // Si después de los reintentos seguimos sin sesión y hay error
        if (!sessionData && sessionError) {
          console.error('AuthContext: Error persistente al obtener sesión después de reintentos:', sessionError);
          setLoading(false);
          return;
        }

        // Si tenemos datos de sesión y un usuario
        if (sessionData?.session) {
          console.log('AuthContext: Sesión encontrada para usuario:', sessionData.session.user.email);
          setUser(sessionData.session.user);

          try {
            // Intentar cargar el perfil con reintentos
            let profileData = null;
            let profileError = null;
            retryCount = 0;

            while (retryCount < maxRetries && !profileData) {
              try {
                // Obtener el perfil del usuario
                const { data: pData, error: pError } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', sessionData.session.user.id)
                  .single();

                if (!pError) {
                  profileData = pData;
                  break;
                } else if (pError.code === 'PGRST116') {
                  // Si no se encuentra el perfil en 'profiles', buscar en 'user_profiles'
                  console.log('AuthContext: Perfil no encontrado en profiles, buscando en user_profiles');
                  const { data: userProfileData, error: userProfileError } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('user_id', sessionData.session.user.id)
                    .single();

                  if (!userProfileError && userProfileData) {
                    console.log('AuthContext: Perfil encontrado en user_profiles');
                    // Convertir el formato de user_profiles a profiles
                    profileData = {
                      id: sessionData.session.user.id,
                      email: sessionData.session.user.email,
                      level: userProfileData.level || 1,
                      balance: userProfileData.balance || 0,
                      avatar_url: userProfileData.avatar_url || null,
                      created_at: userProfileData.created_at || new Date().toISOString()
                    };
                    break;
                  } else {
                    // Si no se encuentra en ninguna tabla, crear un perfil básico
                    console.log('AuthContext: Perfil no encontrado, creando perfil básico');
                    profileData = {
                      id: sessionData.session.user.id,
                      email: sessionData.session.user.email,
                      level: 1,
                      balance: 0,
                      avatar_url: null,
                      created_at: new Date().toISOString()
                    };

                    // Intentar guardar el perfil básico
                    try {
                      await supabase.from('profiles').insert(profileData);
                      console.log('AuthContext: Perfil básico creado correctamente');
                    } catch (insertErr) {
                      console.warn('AuthContext: No se pudo guardar el perfil básico, pero continuando:', insertErr);
                    }
                    break;
                  }
                } else {
                  profileError = pError;
                  console.warn(`AuthContext: Error al obtener perfil (intento ${retryCount + 1}):`, pError);
                  await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                  retryCount++;
                }
              } catch (e) {
                console.error(`AuthContext: Excepción al obtener perfil (intento ${retryCount + 1}):`, e);
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                retryCount++;
              }
            }

            if (profileData) {
              console.log('AuthContext: Perfil cargado correctamente');
              setProfile(profileData);
            } else if (profileError) {
              console.error('AuthContext: Error persistente al obtener perfil después de reintentos:', profileError);
              // Crear un perfil básico en memoria para que la aplicación pueda funcionar
              const basicProfile = {
                id: sessionData.session.user.id,
                email: sessionData.session.user.email,
                level: 1,
                balance: 0,
                avatar_url: null,
                created_at: new Date().toISOString()
              };
              console.log('AuthContext: Usando perfil básico en memoria');
              setProfile(basicProfile);
            }
          } catch (err) {
            console.error('AuthContext: Error general al cargar perfil:', err);
            // Crear un perfil básico en memoria para que la aplicación pueda funcionar
            const basicProfile = {
              id: sessionData.session.user.id,
              email: sessionData.session.user.email,
              level: 1,
              balance: 0,
              avatar_url: null,
              created_at: new Date().toISOString()
            };
            console.log('AuthContext: Usando perfil básico en memoria debido a error');
            setProfile(basicProfile);
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

  useEffect(() => {
    if (!user) return;
    // Suscripción en tiempo real a cambios en el balance del usuario
    const channel = supabase
      .channel('realtime:user_profiles_balance')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new.balance !== 'undefined') {
            setProfile((prev: any) => ({
              ...prev,
              balance: payload.new.balance,
              level: payload.new.level || prev?.level || 1,
            }));
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Registrar un nuevo usuario - Solución ultra básica
  const signUp = async (email: string, password: string, phone: string = '') => {
    setLoading(true);
    console.log('Iniciando proceso de registro ultra básico para:', email);

    try {
      // Verificar si el usuario ya existe intentando iniciar sesión
      try {
        const { data: signInData } = await supabase.auth.signInWithPassword({ email, password });
        if (signInData?.user) {
          console.log('Usuario ya existe, iniciando sesión directamente');
          setUser(signInData.user);

          // Cargar o crear perfil básico
          const basicProfile = {
            id: signInData.user.id,
            email: email,
            phone: phone || '',
            level: 1,
            balance: 0,
            avatar_url: null,
            created_at: new Date().toISOString()
          };

          setProfile(basicProfile);

          // Tracking: Usuario ya registrado intenta registrarse de nuevo
          analyticsService.trackEvent('duplicate_registration_attempt', {
            user_id: signInData.user.id,
            email: email
          });

          setLoading(false);
          return { error: { message: 'User already registered' } };
        }
      } catch (e) {
        // Ignorar errores aquí, significa que el usuario no existe o la contraseña es incorrecta
        console.log('Usuario no existe, continuando con registro');
      }

      // Registrar al usuario con el método más básico posible
      console.log('Registrando usuario con método ultra básico');

      // Usar el cliente de Supabase con opciones mínimas
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      // Manejar errores
      if (error) {
        console.error('Error durante el registro básico:', error);
        setLoading(false);
        return { error };
      }

      // Verificar datos
      if (!data?.user) {
        console.error('No se pudo crear el usuario - datos inválidos');
        setLoading(false);
        return { error: new Error('No se pudo crear el usuario') };
      }

      console.log('Usuario creado correctamente:', data.user.id);
      setUser(data.user);

      // Crear perfil básico
      const profileData = {
        id: data.user.id,
        email: email,
        phone: phone || '',
        level: 1,
        balance: 0,
        avatar_url: null,
        created_at: new Date().toISOString()
      };

      // Intentar crear perfil, pero no fallar si hay error
      try {
        await supabase.from('profiles').insert(profileData);
        console.log('Perfil creado correctamente');
      } catch (e) {
        console.log('Error al crear perfil, pero continuando');
      }

      // Establecer perfil en el estado
      setProfile(profileData);

      // Tracking: Registro exitoso
      analyticsService.trackUserRegistration('email');
      analyticsService.setUserParams({
        user_id: data.user.id,
        email: email,
        phone: phone || '',
        registration_date: new Date().toISOString()
      });

      // Finalizar proceso
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

  // Iniciar sesión - Versión ultra básica
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    console.log('Iniciando proceso de login ultra básico para:', email);

    try {
      // Intentar iniciar sesión con el método más básico posible
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

      // Intentar cargar el perfil existente
      try {
        // Buscar primero en la tabla profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (!profileError && profileData) {
          console.log('Perfil encontrado en tabla profiles');
          setProfile(profileData);

          // Tracking: Login exitoso
          analyticsService.trackUserLogin('email');
          analyticsService.setUserParams({
            user_id: data.user.id,
            email: data.user.email || email,
            last_login: new Date().toISOString()
          });

          setLoading(false);
          return { error: null };
        }

        // Si no se encuentra en profiles, buscar en user_profiles
        const { data: userProfileData, error: userProfileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (!userProfileError && userProfileData) {
          console.log('Perfil encontrado en tabla user_profiles');
          // Convertir el formato de user_profiles a profiles
          const mappedProfile = {
            id: data.user.id,
            email: data.user.email || email,
            phone: userProfileData.phone || '',
            level: userProfileData.level || 1,
            balance: userProfileData.balance || 0,
            avatar_url: userProfileData.avatar_url || null,
            created_at: userProfileData.created_at || new Date().toISOString()
          };
          setProfile(mappedProfile);

          // Tracking: Login exitoso desde user_profiles
          analyticsService.trackUserLogin('email');
          analyticsService.setUserParams({
            user_id: data.user.id,
            email: data.user.email || email,
            last_login: new Date().toISOString()
          });

          setLoading(false);
          return { error: null };
        }
      } catch (profileErr) {
        console.error('Error al cargar perfil existente:', profileErr);
      }

      // Si no se encuentra perfil, crear uno básico
      console.log('No se encontró perfil existente, creando uno básico');
      const basicProfile = {
        id: data.user.id,
        email: data.user.email || email,
        phone: '',
        level: 1,
        balance: 0,
        avatar_url: null,
        created_at: new Date().toISOString()
      };

      // Establecer el perfil en el estado
      setProfile(basicProfile);

      // Tracking: Login exitoso con perfil básico creado
      analyticsService.trackUserLogin('email');
      analyticsService.setUserParams({
        user_id: data.user.id,
        email: data.user.email || email,
        last_login: new Date().toISOString(),
        profile_created: true
      });

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

      // Implementar reintentos para mayor robustez
      let retryCount = 0;
      const maxRetries = 3;
      let balanceUpdated = false;

      while (retryCount < maxRetries && !balanceUpdated) {
        try {
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
            balanceUpdated = true;
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
              balanceUpdated = true;
            } else if (profileError && profileError.code === 'PGRST116') {
              // Si no existe el perfil, mantener los valores actuales
              console.log('AuthContext: No se encontró perfil para actualizar balance, manteniendo valores actuales');
              balanceUpdated = true; // Consideramos que hemos terminado
            } else {
              // Si hay otro tipo de error, reintentar
              console.warn(`AuthContext: Error al actualizar balance (intento ${retryCount + 1}):`, profileError);
              await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
              retryCount++;
            }
          }
        } catch (e) {
          console.error(`AuthContext: Excepción al actualizar balance (intento ${retryCount + 1}):`, e);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          retryCount++;
        }
      }

      // Si después de todos los reintentos no se pudo actualizar, registrar error pero no fallar
      if (!balanceUpdated) {
        console.error('AuthContext: No se pudo actualizar el balance después de múltiples intentos');
      }
    } catch (error) {
      console.error('AuthContext: Error general al actualizar balance:', error);
      // No fallar completamente, simplemente registrar el error
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
