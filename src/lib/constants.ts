import z from "zod";
import { id } from "zod/v4/locales";

export const emailPattern =
    /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com|aol\.com|protonmail\.com|zoho\.com|mail\.com|gmx\.com|tutanota\.com|fastmail\.com|startmail\.com|posteo\.de|hey\.com|secureemail\.com|tiscali\.com|rediffmail\.com|cox\.net|excite\.com|bluemail\.me)$/;

export const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=-])[A-Za-z0-9!@#$%^&*()_+=-]{8,64}$/;
export const passwordText =
    "Password must be 8-64 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character";

export const loginFormSchema = z.object({
    email: z.string().regex(emailPattern, {
        message: "Email must be a valid email address.",
    }),
    password: z.string().regex(passwordPattern, {
        message: passwordText,
    }),
});

export const signupFormSchema = z.object({
    email: z.string().regex(emailPattern, {
        message: "Email must be a valid email address.",
    }),
    password: z.string().regex(passwordPattern, {
        message: passwordText,
    }),
});

export const taskSchema = z.object({
    id: z.uuid(),
    title: z.string().min(1),
    description: z.string().optional(),
    extras: z.object({
        tags: z.string(),
        dueDate: z.date(),
        priority: z.string(),
    }).optional(),
    status: z.enum(["pending", "in-progress", "done"]).optional(),
    inserted_at: z.date(),
});

export const addTaskFormSchema = taskSchema.omit({
    id: true,
    inserted_at: true,
    // description: z.string().optional(),
    // extras: z.object({
    //     tags: z.string(),
    //     dueDate: z.date(),
    //     priority: z.string(),
    // }).optional(),
    // status: z.enum(["pending", "in-progress", "done"]).optional(),
});

export const updateTaskFormSchema = addTaskFormSchema;

export const taskManagerTableSchema = taskSchema.omit({
    extras: true,
    description: true,
});
