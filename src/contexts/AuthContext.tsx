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

  // Registrar un nuevo usuario - Solución mejorada
  const signUp = async (email: string, password: string, phone: string = '') => {
    setLoading(true);
    console.log('Iniciando proceso de registro mejorado para:', email);

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
          setLoading(false);
          return { error: { message: 'User already registered' } };
        }
      } catch (e) {
        // Ignorar errores aquí, significa que el usuario no existe o la contraseña es incorrecta
        console.log('Usuario no existe, continuando con registro');
      }

      // Registrar al usuario con opciones mejoradas
      console.log('Registrando usuario con método mejorado');

      // Usar el cliente de Supabase con opciones mejoradas
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { phone }, // Guardar el teléfono en los metadatos del usuario
          emailRedirectTo: window.location.origin + '/dashboard' // Redirección después de verificar email
        }
      });

      // Manejar errores
      if (error) {
        console.error('Error durante el registro:', error);
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
          console.log('Datos del perfil a insertar:', profileData);

          const { error: profileError } = await supabase
            .from('profiles')
            .insert(profileData);

          if (profileError) {
            console.error('Error al crear perfil en profiles:', profileError);

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
        // Continuamos a pesar del error, ya que el usuario se creó correctamente
      }

      // Establecer perfil en el estado
      setProfile(profileData);

      // Iniciar sesión automáticamente
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

  // Iniciar sesión - Versión mejorada
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    console.log('Iniciando proceso de login mejorado para:', email);

    try {
      // Intentar iniciar sesión con manejo mejorado de errores
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
        console.log('Intentando cargar perfil existente');

        // Buscar en profiles primero
        let profileData = null;
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error al buscar perfil en profiles:', profileError);
        }

        if (existingProfile) {
          console.log('Perfil encontrado en profiles');
          profileData = existingProfile;
        } else {
          // Si no se encuentra en profiles, buscar en user_profiles
          console.log('Perfil no encontrado en profiles, buscando en user_profiles');
          const { data: userProfileData, error: userProfileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', data.user.id)
            .maybeSingle();

          if (userProfileError && userProfileError.code !== 'PGRST116') {
            console.error('Error al buscar perfil en user_profiles:', userProfileError);
          }

          if (userProfileData) {
            console.log('Perfil encontrado en user_profiles');
            // Convertir formato de user_profiles a formato de perfil estándar
            profileData = {
              id: data.user.id,
              email: data.user.email || email,
              phone: userProfileData.phone || '',
              level: userProfileData.level || 1,
              balance: userProfileData.balance || 0,
              avatar_url: userProfileData.avatar_url || null,
              created_at: userProfileData.created_at || new Date().toISOString()
            };
          }
        }

        // Si no se encontró perfil en ninguna tabla, crear uno básico
        if (!profileData) {
          console.log('No se encontró perfil, creando uno básico');
          profileData = {
            id: data.user.id,
            email: data.user.email || email,
            phone: '',
            level: 1,
            balance: 0,
            avatar_url: null,
            created_at: new Date().toISOString()
          };

          // Intentar guardar el perfil básico
          try {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert(profileData);

            if (insertError) {
              console.error('Error al crear perfil básico en profiles:', insertError);

              // Intentar en user_profiles como alternativa
              const { error: userProfileInsertError } = await supabase
                .from('user_profiles')
                .insert({
                  user_id: data.user.id,
                  email: data.user.email || email,
                  phone: '',
                  level: 1,
                  balance: 0,
                  avatar_url: null,
                  created_at: new Date().toISOString()
                });

              if (userProfileInsertError) {
                console.error('Error al crear perfil básico en user_profiles:', userProfileInsertError);
              } else {
                console.log('Perfil básico creado en user_profiles');
              }
            } else {
              console.log('Perfil básico creado en profiles');
            }
          } catch (insertErr) {
            console.error('Error inesperado al crear perfil básico:', insertErr);
          }
        }

        // Establecer el perfil en el estado
        setProfile(profileData);

      } catch (profileErr) {
        console.error('Error inesperado al cargar/crear perfil:', profileErr);

        // Crear un perfil básico en memoria aunque haya fallado la carga/creación
        const basicProfile = {
          id: data.user.id,
          email: data.user.email || email,
          phone: '',
          level: 1,
          balance: 0,
          avatar_url: null,
          created_at: new Date().toISOString()
        };

        setProfile(basicProfile);
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
