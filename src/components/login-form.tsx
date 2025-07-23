import { cn, displayFormErrors } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { loginFormSchema } from "@/lib/constants";
import type { LoginFormData } from "@/lib/types";
import { useEffect } from "react";

interface LoginFormProps extends React.ComponentProps<"div"> {
  onPasswordLogin: (values: LoginFormData) => void;
  isLoading?: boolean;
}

function LoginForm({
  className,
  onPasswordLogin,
  isLoading,
  ...props
}: LoginFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmitHandler: SubmitHandler<LoginFormData> = (
    values: LoginFormData
  ) => {
    onPasswordLogin(values);
  };

  useEffect(() => {
    displayFormErrors(errors);
  }, [errors]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>

          <CardDescription>
            Enter information below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="flex flex-col gap-6">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...field}
                    />
                  </div>
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      {...field}
                    />
                  </div>
                )}
              />
              <div className="flex flex-col gap-3">
                <Button disabled={isLoading} type="submit" className="w-full">
                  {isLoading ? (
                    <span className="animate-pulse">Logining in...</span>
                  ) : (
                    "Login"
                  )}
                </Button>

                <Button
                  disabled
                  type="button"
                  variant="outline"
                  className="w-full"
                >
                  Login with Google
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;
