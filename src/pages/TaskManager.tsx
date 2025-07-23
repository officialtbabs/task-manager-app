import { useMemo, useState } from "react";
import AddTaskFormModal from "../components/add-task-form-modal";
import { queryClient } from "@/lib/constants";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  CreateTaskRequestDto,
  TaskTableData,
  UpdateTaskRequestDto,
} from "@/lib/types";
import { toast } from "sonner";

function getTaskTableColumns(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<TaskTableData>[] {
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
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => (
        <div className="capitalize">
          {formatDate(row.getValue("created_at"))}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const taskId = row.original.id;

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

              <DropdownMenuItem onClick={() => onEdit(taskId)}>
                Update
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(taskId)}
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
  const { data, isLoading } = useQuery(fetchTasks());

  const { mutate: createTaskMutation, isPending: isCreatingTask } = useMutation(
    createTask()
  );
  const { mutate: updateTaskMutation, isPending: isUpdatingTask } = useMutation(
    updateTask()
  );
  const { mutate: deleteTaskMutation, isPending: isDeletingTask } = useMutation(
    deleteTask()
  );

  const tasks = useMemo(() => data?.tasks || [], [data]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  const [openAddTaskForm, setOpenAddTaskForm] = useState(false);
  const [openUpdateTaskModal, setOpenUpdateTaskModal] = useState(false);
  const [openDeleteTaskConfirmationModal, setOpenDeleteTaskConfirmationModal] =
    useState(false);

  const selectedTask = useMemo(
    () => tasks?.find((task) => task.id === selectedTaskId),
    [tasks, selectedTaskId]
  );

  const refetchTasks = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  const onTaskCreateHandler = async (values: CreateTaskRequestDto) => {
    createTaskMutation(values, {
      onSuccess: () => {
        setOpenAddTaskForm(false);
        refetchTasks();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const onTaskUpdateHandler = async ({
    id,
    ...values
  }: UpdateTaskRequestDto) => {
    updateTaskMutation(
      { id, ...values },
      {
        onSuccess: () => {
          setOpenUpdateTaskModal(false);
          refetchTasks();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const onTaskDeleteHandler = async (id: string) => {
    deleteTaskMutation(id, {
      onSuccess: () => {
        setOpenDeleteTaskConfirmationModal(false);
        refetchTasks();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const onUpdateTaskRowActionClick = (id: string) => {
    setSelectedTaskId(id);
    setOpenUpdateTaskModal(true);
  };

  const onDeleteTaskRowActionClick = (id: string) => {
    setSelectedTaskId(id);
    setOpenDeleteTaskConfirmationModal(true);
  };

  const columns = getTaskTableColumns(
    onUpdateTaskRowActionClick,
    onDeleteTaskRowActionClick
  );

  return (
    <>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Task Manager</h1>

        <div className="flex justify-end">
          <AddTaskFormModal
            isLoading={isCreatingTask}
            open={openAddTaskForm}
            onOpenChange={setOpenAddTaskForm}
            onTaskCreate={onTaskCreateHandler}
          />
        </div>

        <DataTable
          isLoading={isLoading}
          data={tasks}
          columns={columns}
          filterSearchBy="title"
          filters={taskTableFilters}
        />
      </div>

      <UpdateTaskFormModal
        isLoading={isUpdatingTask}
        initialValues={selectedTask}
        open={openUpdateTaskModal}
        onOpenChange={setOpenUpdateTaskModal}
        onTaskUpdate={onTaskUpdateHandler}
      />

      <DeleteTaskConfirmationModal
        isLoading={isDeletingTask}
        taskId={selectedTaskId}
        open={openDeleteTaskConfirmationModal}
        onOpenChange={setOpenDeleteTaskConfirmationModal}
        onTaskDelete={onTaskDeleteHandler}
      />
    </>
  );
}

export default TaskManager;
