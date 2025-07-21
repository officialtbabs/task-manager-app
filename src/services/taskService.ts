import { supabase } from "./supabase";
import type z from "zod";
import type { addTaskFormSchema, updateTaskFormSchema } from "@/lib/constants";

export async function fetchTasks() {
  return await supabase.functions.invoke("tasks", {
    method: "GET",
  });
}

export async function createTask(task: z.infer<typeof addTaskFormSchema>) {
  return await supabase.functions.invoke("tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export async function updateTask(
  id: string,
  task: z.infer<typeof updateTaskFormSchema>,
) {
  return await supabase.functions.invoke(`tasks?id=${id}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });
}

export async function deleteTask(id: string) {
  return await supabase.functions.invoke(`tasks?id=${id}`, {
    method: "DELETE",
  });
}
