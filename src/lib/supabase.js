import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Agrega estos logs para ver si las variables llegan o no
console.log("URL de Supabase detectada:", supabaseUrl);
console.log(
  "Key de Supabase detectada:",
  supabaseAnonKey ? "Existe (OK)" : "No existe (Error)",
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
