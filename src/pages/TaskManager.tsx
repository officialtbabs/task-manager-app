import { useEffect, useState } from "react";
import AddTaskForm from "../components/add-task-form-modal";
import { addTaskFormSchema, taskManagerTableSchema } from "@/lib/constants";
import z from "zod";
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
} from "@/services/taskService";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconCircleCheckFilled,
  IconProgressAlert,
  IconLoader,
} from "@tabler/icons-react";
import { MoreHorizontal } from "lucide-react";
import { formatDate } from "@/lib/utils";
import UpdateTaskFormModal from "@/components/update-task-form-modal";
import DeleteTaskConfirmationModal from "@/components/delete-task-confirmation-modal";

export type Task = z.infer<typeof taskManagerTableSchema>;

function getTaskTableColumns(
  onEdit: (task: Task) => void,
  onDelete: (task: Task) => void
): ColumnDef<Task>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.status === "done" ? (
            <IconCircleCheckFilled color="oklch(72.3% 0.219 149.579)" />
          ) : row.original.status === "in-progress" ? (
            <IconLoader color="oklch(79.5% 0.184 86.047)" />
          ) : (
            <IconProgressAlert color="oklch(55.1% 0.027 264.364)" />
          )}
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "inserted_at",
      header: "Created At",
      cell: ({ row }) => (
        <div className="capitalize">
          {formatDate(row.getValue("inserted_at"))}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const task = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-xs font-medium">
                Actions
              </DropdownMenuLabel>

              <DropdownMenuItem onClick={() => onEdit(task)}>
                Update
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(task)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

const taskTableFilters: { name: string; options: string[] }[] = [
  { name: "status", options: ["", "pending", "in-progress", "done"] },
];

function TaskManager() {
  const [tasks, setTasks] = useState<z.infer<typeof taskManagerTableSchema>[]>(
    []
  );
  const [openAddTaskForm, setOpenAddTaskForm] = useState(false);
  const [openUpdateTaskModal, setOpenUpdateTaskModal] = useState(false);
  const [openDeleteTaskConfirmationModal, setOpenDeleteTaskConfirmationModal] =
    useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const loadTasks = async () => {
    const { data } = await fetchTasks();
    if (data) setTasks(data.tasks);
  };

  const onTaskCreateHandler = async (
    values: z.infer<typeof addTaskFormSchema>
  ) => {
    const { data, error } = await createTask({
      ...values,
    });

    if (error) {
      console.error("Error creating task:", error);
      return;
    }

    setOpenAddTaskForm(false);
  };

  const onTaskUpdateHandler = async (
    taskId: string,
    values: z.infer<typeof addTaskFormSchema>
  ) => {
    const { data, error } = await updateTask(taskId, {
      ...values,
    });

    if (error) {
      console.error("Error creating task:", error);
      return;
    }

    setOpenUpdateTaskModal(false);
  };

  const onTaskDeleteHandler = async (taskId: string) => {
    const { data, error } = await deleteTask(taskId);

    if (error) {
      console.error("Error creating task:", error);
      return;
    }

    setOpenDeleteTaskConfirmationModal(false);
  };

  const handleUpdateTask = (task: Task) => {
    setSelectedTask(task);
    setOpenUpdateTaskModal(true);
  };

  // ✅ Action: Delete task
  const handleDeleteTask = (task: Task) => {
    setSelectedTask(task);
    setOpenDeleteTaskConfirmationModal(true);
  };

  const columns = getTaskTableColumns(handleUpdateTask, handleDeleteTask);

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Task Manager</h1>

        <div className="flex justify-end">
          <AddTaskForm
            open={openAddTaskForm}
            onOpenChange={setOpenAddTaskForm}
            onTaskCreate={onTaskCreateHandler}
          />
        </div>

        <DataTable
          data={tasks}
          columns={columns}
          filterSearchBy="title"
          filters={taskTableFilters}
        />
      </div>

      <DeleteTaskConfirmationModal
        taskId={selectedTask?.id}
        open={openDeleteTaskConfirmationModal}
        onOpenChange={setOpenDeleteTaskConfirmationModal}
        onTaskDelete={onTaskDeleteHandler}
      />

      <UpdateTaskFormModal
        initialValues={selectedTask}
        open={openUpdateTaskModal}
        onOpenChange={setOpenUpdateTaskModal}
        onTaskUpdate={onTaskUpdateHandler}
      />
    </>
  );
}

export default TaskManager;
