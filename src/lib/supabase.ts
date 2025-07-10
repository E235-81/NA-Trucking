import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface FreightQuote {
  id?: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  from_city: string;
  to_city: string;
  cargo_specialization: string;
  other_cargo_description?: string;
  truck_qty: number;
  gross_weight: number; // Weight in pounds (lbs)
  cargo_length: number; // Length in feet or inches (see dimension_unit)
  cargo_width: number; // Width in feet or inches (see dimension_unit)
  cargo_height: number; // Height in feet or inches (see dimension_unit)
  cargo_volume?: number; // Volume in cubic feet or cubic inches (see dimension_unit)
  dimension_unit: 'inches' | 'feet'; // Unit for all dimensions
  loading_date: string;
  loading_hour: number;
  loading_minute: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}