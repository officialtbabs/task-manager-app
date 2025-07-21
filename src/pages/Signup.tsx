import { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import SignupForm from "@/components/signup-form";
import type z from "zod";
import type { signupFormSchema } from "@/lib/constants";

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handlePasswordSignup = async (
    values: z.infer<typeof signupFormSchema>
  ) => {
    const { data, error } = await supabase.auth.signUp(values);
    if (error) setError(error.message);
    else navigate("/login");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm onPasswordSignup={handlePasswordSignup} />
      </div>
    </div>
  );
}
