import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/login-form";
import z from "zod";
import { loginFormSchema } from "@/lib/constants";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handlePasswordLogin = async (
    values: z.infer<typeof loginFormSchema>
  ) => {
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) setError(error.message);
    else navigate("/");
  };

  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onPasswordLogin={handlePasswordLogin} />
      </div>
    </div>
  );
}
