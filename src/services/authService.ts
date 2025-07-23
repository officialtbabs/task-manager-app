import type { LoginFormData, SignupFormData } from "@/lib/types";
import { supabase } from "./supabase";

export function signupUser() {
    return {
        mutationFn: async function (
            values: SignupFormData,
        ) {
            const { data, error } = await supabase.auth.signUp(values);

            if (error) {
                throw new Error(error.message);
            }

            return data;
        },
    };
}

export function loginUser() {
    return {
        mutationFn: async function (
            values: LoginFormData,
        ) {
            const { data, error } = await supabase.auth.signInWithPassword(
                values,
            );

            if (error) {
                throw new Error(error.message);
            }

            return data;
        },
    };
}
