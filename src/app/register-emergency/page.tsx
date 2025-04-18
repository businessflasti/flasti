'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

// Constantes de Supabase
const SUPABASE_URL = 'https://ewfvfvkhqftbvldvjnrk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3ZnZmdmtocWZ0YnZsZHZqbnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MTczMDgsImV4cCI6MjA1ODk5MzMwOH0.6AuPXHtii0dCrVrZg2whHa5ZyO_4VVN9dDNKIjN7pMo';

export default function RegisterEmergency() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]} - ${message}`]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLogs([]);

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
    addLog(`Iniciando registro de emergencia para: ${email}`);

    try {
      // Paso 1: Intentar registrar usando la función RPC
      addLog('Paso 1: Registrando usuario usando función RPC');
      
      const registerResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/register_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        },
        body: JSON.stringify({
          email,
          password,
          phone
        })
      });
      
      if (!registerResponse.ok) {
        const errorText = await registerResponse.text();
        addLog(`Error en respuesta RPC: ${errorText}`);
        
        // Si falla, intentar con el método de registro normal
        addLog('Intentando con método de registro normal');
        
        const signUpResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
          },
          body: JSON.stringify({
            email,
            password,
            data: { phone }
          })
        });
        
        const signUpData = await signUpResponse.json();
        
        if (!signUpResponse.ok) {
          addLog(`Error en registro normal: ${JSON.stringify(signUpData)}`);
          toast.dismiss(toastId);
          toast.error(`Error al registrarse: ${signUpData.error?.message || signUpData.msg || 'Error desconocido'}`);
          setIsLoading(false);
          return;
        }
        
        addLog(`Usuario creado correctamente con método normal: ${signUpData.user?.id}`);
        
        // Guardar información en localStorage para simular sesión
        localStorage.setItem('emergency_user', JSON.stringify({
          id: signUpData.user?.id,
          email,
          phone,
          created_at: new Date().toISOString()
        }));
      } else {
        const registerData = await registerResponse.json();
        
        if (!registerData.success) {
          addLog(`Error en registro RPC: ${registerData.message}`);
          toast.dismiss(toastId);
          toast.error(`Error al registrarse: ${registerData.message}`);
          setIsLoading(false);
          return;
        }
        
        addLog(`Usuario creado correctamente con RPC: ${registerData.user_id}`);
        
        // Guardar información en localStorage para simular sesión
        localStorage.setItem('emergency_user', JSON.stringify({
          id: registerData.user_id,
          email,
          phone,
          created_at: new Date().toISOString()
        }));
      }
      
      // Registro exitoso
      toast.dismiss(toastId);
      toast.success('Registro exitoso. ¡Bienvenido a Flasti!');
      
      // Redirigir al dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
    } catch (error: any) {
      addLog(`Error inesperado: ${error?.message || 'Error desconocido'}`);
      console.error('Error inesperado durante el registro:', error);
      toast.dismiss(toastId);
      toast.error(`Error al registrarse: ${error?.message || 'Error desconocido'}`);
      
      // Último recurso: crear usuario local
      addLog('Creando usuario local como último recurso');
      localStorage.setItem('emergency_user', JSON.stringify({
        id: crypto.randomUUID(),
        email,
        phone,
        created_at: new Date().toISOString()
      }));
      
      toast.success('Se ha creado un usuario local. Puedes continuar usando la aplicación.');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md relative">
        <div className="bg-card rounded-lg shadow-xl p-6 space-y-6 border border-border">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Registro de Emergencia</h1>
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
      
      {/* Sección de logs */}
      {logs.length > 0 && (
        <div className="w-full max-w-md mt-8 bg-card rounded-lg shadow-xl p-4 border border-border">
          <h2 className="text-lg font-bold mb-2">Logs de registro</h2>
          <div className="bg-background p-2 rounded text-xs font-mono h-48 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
