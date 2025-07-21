import { createClient } from "@supabase";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
