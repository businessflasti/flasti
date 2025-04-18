// Configuración de Supabase
import { createClient } from '@supabase/supabase-js';

// Estas variables deberían estar en variables de entorno en un entorno de producción
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ewfvfvkhqftbvldvjnrk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3ZnZmdmtocWZ0YnZsZHZqbnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MTczMDgsImV4cCI6MjA1ODk5MzMwOH0.6AuPXHtii0dCrVrZg2whHa5ZyO_4VVN9dDNKIjN7pMo';

// Crear cliente de Supabase con opciones mínimas para mayor compatibilidad
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

// Exportar URL y clave para uso directo en API
export const SUPABASE_URL = supabaseUrl;
export const SUPABASE_ANON_KEY = supabaseAnonKey;

// Tipos para las tablas de Supabase
export type User = {
  id: string;
  email: string;
  name: string;
  hotmart_id: string;
  level: 1 | 2 | 3;
  balance: number;
  created_at: string;
};

export type AffiliateLink = {
  id: string;
  user_id: string;
  app_id: number;
  url: string;
  created_at: string;
};

export type Sale = {
  id: string;
  hotmart_transaction_id: string;
  affiliate_id: string;
  app_id: number;
  amount: number;
  commission: number;
  created_at: string;
  ip_address: string;
};

export type App = {
  id: number;
  name: string;
  description: string;
  price: number;
  icon: string;
  bg_gradient: string;
  icon_bg: string;
  icon_color: string;
};