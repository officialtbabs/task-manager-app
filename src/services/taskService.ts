import { supabase } from "./supabase";
import type {
  CreateTaskRequestDto,
  Task,
  UpdateTaskRequestDto,
} from "@/lib/types";

export function fetchTasks() {
  return {
    queryKey: ["tasks"],
    queryFn: async function (): Promise<{
      tasks: Task[];
    }> {
      const { data, error } = await supabase.functions.invoke("tasks", {
        method: "GET",
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  };
}

export function createTask() {
  return {
    mutationFn: async function (value: CreateTaskRequestDto) {
      const { data, error } = await supabase.functions.invoke("tasks", {
        method: "POST",
        body: JSON.stringify(value),
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  };
}

export function updateTask() {
  return {
    mutationFn: async function (
      { id, ...values }: UpdateTaskRequestDto,
    ) {
      const { data, error } = await supabase.functions.invoke(
        `tasks?id=${id}`,
        {
          method: "PUT",
          body: JSON.stringify(values),
        },
      );

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  };
}

export function deleteTask() {
  return {
    mutationFn: async function (id: string) {
      const { data, error } = await supabase.functions.invoke(
        `tasks?id=${id}`,
        {
          method: "DELETE",
        },
      );

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  };
}
