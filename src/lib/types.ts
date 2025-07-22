import z from "zod";
import type {
    createTaskFormSchema,
    loginFormSchema,
    signupFormSchema,
    taskSchema,
    taskStatus,
    taskTableSchema,
    updateTaskFormSchema,
} from "./constants";

export type SignupFormData = z.infer<typeof signupFormSchema>;

export type LoginFormData = z.infer<typeof loginFormSchema>;

export type TaskStatus = z.infer<typeof taskStatus>;

export type Task = z.infer<typeof taskSchema>;

export type CreateTaskRequestDto = z.infer<typeof createTaskFormSchema>;

export type UpdateTaskRequestDto =
    & { id: string }
    & z.infer<typeof updateTaskFormSchema>;

export type TaskTableData = z.infer<typeof taskTableSchema>;

export type CreateTaskFormData = z.infer<typeof createTaskFormSchema>;

export type UpdateTaskFormData = z.infer<typeof updateTaskFormSchema>;
