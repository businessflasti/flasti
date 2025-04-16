// Configuración de Supabase
import { createClient } from '@supabase/supabase-js';

// Estas variables deberían estar en variables de entorno en un entorno de producción
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'TU_URL_DE_SUPABASE';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'TU_CLAVE_ANONIMA_DE_SUPABASE';

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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