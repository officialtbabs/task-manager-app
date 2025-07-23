import { QueryClient } from "@tanstack/react-query";
import z from "zod";

export const emailPattern =
    /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com|aol\.com|protonmail\.com|zoho\.com|mail\.com|gmx\.com|tutanota\.com|fastmail\.com|startmail\.com|posteo\.de|hey\.com|secureemail\.com|tiscali\.com|rediffmail\.com|cox\.net|excite\.com|bluemail\.me)$/;

export const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=-])[A-Za-z0-9!@#$%^&*()_+=-]{8,64}$/;
export const passwordText =
    "Password must be 8-64 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character";

export const loginFormSchema = z.object({
    email: z.string().min(1, {
        message: "Email is required.",
    }).regex(emailPattern, {
        message: "Email must be a valid email address.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }).regex(passwordPattern, {
        message: passwordText,
    }),
});

export const signupFormSchema = loginFormSchema;

export const taskStatus = z.enum(["pending", "in-progress", "done"]);

export const taskSchema = z.object({
    id: z.uuid(),
    title: z.string().min(1, {
        message: "Title is required.",
    }),
    description: z.string().optional(),
    status: taskStatus,
    extras: z.object({
        tags: z.string(),
        dueDate: z.date(),
        priority: z.string(),
    }).optional(),
    created_at: z.date(),
    updated_at: z.date(),
});

export const createTaskFormSchema = taskSchema.omit({
    id: true,
    status: true,
    created_at: true,
    updated_at: true,
});

export const updateTaskFormSchema = taskSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
});

export const taskTableSchema = taskSchema.omit({
    description: true,
    extras: true,
    updated_at: true,
});

export const queryClient = new QueryClient();
