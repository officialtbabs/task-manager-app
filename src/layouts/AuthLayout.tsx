import { useSession } from "@/hooks/useSession";
import type { Session } from "@supabase/supabase-js";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function AuthLayout() {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session && typeof session === "object" && "access_token" in session)
      navigate("/");
  }, [session, navigate]);

  if (
    session &&
    typeof session === "object" &&
    typeof (session as Promise<Session | null>).then === "function"
  )
    return null;

  if (session && typeof session === "object" && "access_token" in session)
    return null;

  return <Outlet />;
}

export default AuthLayout;
