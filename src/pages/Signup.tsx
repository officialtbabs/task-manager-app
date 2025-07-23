import { useNavigate } from "react-router-dom";
import SignupForm from "@/components/signup-form";
import { useMutation } from "@tanstack/react-query";
import { signupUser } from "@/services/authService";
import type { SignupFormData } from "@/lib/types";
import { toast } from "sonner";

export default function Signup() {
  const navigate = useNavigate();

  const { mutate: signupUserMutation, isPending } = useMutation(signupUser());

  const handlePasswordSignup = async (values: SignupFormData) => {
    signupUserMutation(values, {
      onSuccess: () => {
        navigate("/login");
      },

      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm
          isLoading={isPending}
          onPasswordSignup={handlePasswordSignup}
        />
      </div>
    </div>
  );
}
