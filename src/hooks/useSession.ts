// src/hooks/useSession.ts
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import type { Session } from "@supabase/supabase-js";

export function useSession() {
  const [session, setSession] = useState<
    Promise<Session | null> | Session | null
  >(() => supabase.auth.getSession().then(({ data }) => data.session));

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return session;
}
