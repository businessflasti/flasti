-- Agregar usuario flasti.finanzas@gmail.com como super admin

-- Obtener el user_id del email y agregarlo como super_admin
INSERT INTO user_roles (user_id, role)
SELECT id, 'super_admin'
FROM auth.users
WHERE email = 'flasti.finanzas@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET 
  role = 'super_admin', 
  updated_at = NOW();

-- Verificar que se agregó correctamente
SELECT 
  ur.role,
  au.email,
  ur.created_at,
  ur.updated_at
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE au.email = 'flasti.finanzas@gmail.com';
