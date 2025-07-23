import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/login-form";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/services/authService";
import type { LoginFormData } from "@/lib/types";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();

  const { mutate: loginUserMutation, isPending } = useMutation(loginUser());

  const handlePasswordLogin = async (values: LoginFormData) => {
    loginUserMutation(values, {
      onSuccess: () => {
        navigate("/task-manager");
      },

      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          isLoading={isPending}
          onPasswordLogin={handlePasswordLogin}
        />
      </div>
    </div>
  );
}
