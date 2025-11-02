// lib/supabase.ts
import {createClient} from "@supabase/supabase-js";
import {auth} from "@clerk/nextjs/server";

// Client for regular operations (client-side with RLS)
export const createSupabaseClient = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                async getSession() {
                    return { data: { session: null }, error: null };
                }
            }
        }
    );
}

// Server client for server actions (bypasses RLS)
export const createSupabaseServerClient = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
}