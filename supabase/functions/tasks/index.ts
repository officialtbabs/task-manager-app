// import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient, SupabaseClient } from "@supabase";
// import { createCorsHeaders } from "./../_shared/cors.ts";
import { z } from "@zod";

const TaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["pending", "inprogress", "done"]),
  extras: z.object({
    tags: z.string(),
    dueDate: z.date(),
    priority: z.string(),
  }).optional(),
});

type Task = z.infer<typeof TaskSchema>;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

async function getTask(supabaseClient: SupabaseClient, id: string) {
  const { data: task, error } = await supabaseClient.from("tasks").select("*")
    .eq("id", id);
  if (error) throw error;

  return new Response(JSON.stringify({ task }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function getAllTasks(supabaseClient: SupabaseClient) {
  const { data: tasks, error } = await supabaseClient.from("tasks").select("*");
  if (error) throw error;

  return new Response(JSON.stringify({ tasks }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function deleteTask(supabaseClient: SupabaseClient, id: string) {
  const { error } = await supabaseClient.from("tasks").delete().eq("id", id);
  if (error) throw error;

  return new Response(JSON.stringify({}), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function updateTask(
  supabaseClient: SupabaseClient,
  id: string,
  task: Task,
) {
  console.log("Updating task:", task);

  const { error } = await supabaseClient.from("tasks").update(task).eq(
    "id",
    id,
  );
  if (error) throw error;

  return new Response(JSON.stringify({ task }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function createTask(supabaseClient: SupabaseClient, task: Task) {
  const { data } = await supabaseClient.auth.getUser();
  const user = data.user;

  if (user?.id) {
    const { error } = await supabaseClient.from("tasks").insert({
      user_id: user.id,
      ...task,
      status: "pending",
    });

    if (error) throw error;

    return new Response(JSON.stringify({ task }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }

  throw new Error("Not Authenticated");
}

Deno.serve(async (req) => {
  const { url, method } = req;

  const urlObj = new URL(url);
  const id = urlObj.searchParams.get("id");

  // This is needed if you're planning to invoke your function from a browser.
  if (method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    let task = null;
    if (method === "POST" || method === "PUT") {
      const body = await req.json();
      task = body;
    }

    // call relevant method based on method and id
    switch (true) {
      case id && method === "GET":
        return getTask(supabaseClient, id as string);
      case id && method === "PUT":
        return updateTask(supabaseClient, id as string, task);
      case id && method === "DELETE":
        return deleteTask(supabaseClient, id as string);
      case method === "POST":
        return createTask(supabaseClient, task);
      case method === "GET":
        return getAllTasks(supabaseClient);
      default:
        return getAllTasks(supabaseClient);
    }
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: error }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
