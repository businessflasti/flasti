/**
 * Script de ayuda para configurar administradores
 * Este script te ayuda a encontrar tu ID de usuario y configurar administradores
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function findUserByEmail(email: string) {
  try {
    console.log(`🔍 Buscando usuario con email: ${email}`);
    
    // Nota: En producción necesitarías usar el service role key para acceder a auth.users
    // Por ahora, este script es solo para referencia
    
    console.log(`
📋 INSTRUCCIONES PARA CONFIGURAR ADMINISTRADOR:

1. Ve al SQL Editor de Supabase
2. Ejecuta esta consulta para encontrar tu ID de usuario:
   
   SELECT id, email, created_at 
   FROM auth.users 
   WHERE email = '${email}'
   ORDER BY created_at DESC;

3. Copia el ID que aparece en los resultados

4. Ejecuta esta consulta para hacer al usuario administrador:
   
   INSERT INTO public.user_roles (user_id, role) 
   VALUES ('TU_ID_AQUI', 'super_admin')
   ON CONFLICT (user_id, role) DO NOTHING;

5. Verifica que se creó correctamente:
   
   SELECT 
       ur.id,
       ur.user_id,
       ur.role,
       ur.created_at,
       au.email
   FROM public.user_roles ur
   JOIN auth.users au ON ur.user_id = au.id
   WHERE ur.role IN ('admin', 'super_admin')
   ORDER BY ur.created_at DESC;

6. (Opcional) Agrega el ID a tu .env.local:
   
   ADMIN_USER_IDS=tu_id_aqui

🎯 Una vez configurado, podrás acceder al panel admin en:
   https://tu-dominio.com/dashboard/admin
    `);

  } catch (error) {
    console.error('Error:', error);
  }
}

export async function checkAdminStatus(userId: string) {
  try {
    console.log(`🔍 Verificando estado de admin para: ${userId}`);
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();

    if (error) {
      console.log('❌ Usuario no es administrador o tabla no existe');
      return false;
    }

    console.log('✅ Usuario es administrador');
    return true;
  } catch (error) {
    console.error('Error verificando admin:', error);
    return false;
  }
}

// Función para usar en el navegador
if (typeof window !== 'undefined') {
  (window as any).setupAdmin = {
    findUserByEmail,
    checkAdminStatus
  };
}