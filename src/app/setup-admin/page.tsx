'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, User, Shield, Database } from 'lucide-react';
import { toast } from 'sonner';

export default function SetupAdminPage() {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado al portapapeles');
  };

  const findUserQuery = `SELECT id, email, created_at 
FROM auth.users 
WHERE email = '${email}'
ORDER BY created_at DESC;`;

  const createAdminQuery = `-- Insertar primer administrador
INSERT INTO public.user_roles (user_id, role) 
VALUES ('${userId}', 'super_admin')
ON CONFLICT (user_id, role) DO NOTHING;`;

  const verifyAdminQuery = `SELECT 
    ur.id,
    ur.user_id,
    ur.role,
    ur.created_at,
    au.email
FROM public.user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE ur.role IN ('admin', 'super_admin')
ORDER BY ur.created_at DESC;`;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          Configurar Administrador
        </h1>
        <p className="text-foreground/70">
          Sigue estos pasos para configurar el primer administrador del sistema
        </p>
      </div>

      <div className="grid gap-6">
        {/* Paso 1: Crear tabla de roles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Paso 1: Crear tabla de roles (si no existe)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Ejecuta este SQL en Supabase para crear la tabla de roles:
            </p>
            <div className="bg-muted p-4 rounded-lg relative">
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(`-- Crear tabla de roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, role)
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- Configurar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;`)}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <pre className="text-sm overflow-x-auto pr-12">
{`-- Crear tabla de roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, role)
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- Configurar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Paso 2: Encontrar ID de usuario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Paso 2: Encontrar tu ID de usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tu email de usuario:
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu-email@ejemplo.com"
                />
              </div>
              
              {email && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Ejecuta esta consulta en Supabase SQL Editor:
                  </p>
                  <div className="bg-muted p-4 rounded-lg relative">
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(findUserQuery)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <pre className="text-sm overflow-x-auto pr-12">
                      {findUserQuery}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Paso 3: Configurar como admin */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Paso 3: Configurar como administrador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tu ID de usuario (obtenido del paso anterior):
                </label>
                <Input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                />
              </div>
              
              {userId && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Opción A:</strong> Ejecuta esta consulta para hacer al usuario administrador:
                    </p>
                    <div className="bg-muted p-4 rounded-lg relative">
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(createAdminQuery)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre className="text-sm overflow-x-auto pr-12">
                        {createAdminQuery}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Opción B:</strong> Si la anterior falla, usa esta versión simple:
                    </p>
                    <div className="bg-muted p-4 rounded-lg relative">
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`-- Versión simple (sin ON CONFLICT)
INSERT INTO public.user_roles (user_id, role) 
VALUES ('${userId}', 'super_admin');`)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre className="text-sm overflow-x-auto pr-12">
{`-- Versión simple (sin ON CONFLICT)
INSERT INTO public.user_roles (user_id, role) 
VALUES ('${userId}', 'super_admin');`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Paso 4: Verificar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Paso 4: Verificar configuración
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Ejecuta esta consulta para verificar que el administrador se creó correctamente:
            </p>
            <div className="bg-muted p-4 rounded-lg relative">
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(verifyAdminQuery)}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <pre className="text-sm overflow-x-auto pr-12">
                {verifyAdminQuery}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-6">
            <h3 className="font-medium text-blue-400 mb-4">📋 Información Importante</h3>
            <ul className="text-sm text-blue-300 space-y-2">
              <li>• Una vez configurado, podrás acceder al panel admin en <code>/dashboard/admin</code></li>
              <li>• El rol <code>super_admin</code> tiene permisos completos sobre el sistema</li>
              <li>• Puedes crear más administradores desde el panel una vez configurado el primero</li>
              <li>• Los cambios son inmediatos, no necesitas reiniciar la aplicación</li>
              <li>• Guarda tu ID de usuario en un lugar seguro para futuras referencias</li>
            </ul>
          </CardContent>
        </Card>

        {/* Acceso al panel */}
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="p-6">
            <h3 className="font-medium text-green-400 mb-4">🎯 Acceder al Panel Admin</h3>
            <p className="text-sm text-green-300 mb-4">
              Una vez configurado el administrador, puedes acceder al panel:
            </p>
            <Button asChild className="w-full">
              <a href="/dashboard/admin" target="_blank" rel="noopener noreferrer">
                Ir al Panel de Administración
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}