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
import { signupFormSchema } from "@/lib/constants";
import type { SignupFormData } from "@/lib/types";
import { useEffect } from "react";

interface SignupFormProps extends React.ComponentProps<"div"> {
  onPasswordSignup: (values: SignupFormData) => void;
  isLoading?: boolean;
}

function SignupForm({
  className,
  onPasswordSignup,
  isLoading,
  ...props
}: SignupFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmitHandler: SubmitHandler<SignupFormData> = (
    values: SignupFormData
  ) => {
    onPasswordSignup(values);
  };

  useEffect(() => {
    displayFormErrors(errors);
  }, [errors]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Signup</CardTitle>

          <CardDescription>
            Enter information below to create an account
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
                    <Label htmlFor="password">Password</Label>
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
                    <span className="animate-pulse">Signing up...</span>
                  ) : (
                    "Signup"
                  )}
                </Button>

                <Button
                  disabled
                  type="button"
                  variant="outline"
                  className="w-full"
                >
                  Signup with Google
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Sign in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignupForm;
