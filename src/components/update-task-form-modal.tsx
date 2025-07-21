import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { taskSchema, updateTaskFormSchema } from "@/lib/constants";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DialogProps } from "@radix-ui/react-dialog";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UpdateTaskFormModalProps
  extends React.ComponentProps<React.FC<DialogProps>> {
  initialValues: z.infer<typeof taskSchema> | null;
  onTaskUpdate: (
    taskId: string,
    values: z.infer<typeof updateTaskFormSchema>
  ) => void;
}

function UpdateTaskFormModal({
  initialValues,
  onTaskUpdate,
  ...props
}: UpdateTaskFormModalProps) {
  const { control, handleSubmit, setValue } = useForm<
    z.infer<typeof updateTaskFormSchema>
  >({
    resolver: zodResolver(updateTaskFormSchema),
    defaultValues: {
      title: initialValues?.title,
      description: initialValues?.description,
      status: initialValues?.status,
    },
  });

  const onSubmitHandler: SubmitHandler<z.infer<typeof updateTaskFormSchema>> = (
    values: z.infer<typeof updateTaskFormSchema>
  ) => {
    if (!initialValues) return;
    onTaskUpdate(initialValues.id, values);
  };

  useEffect(() => {
    if (!initialValues) return;
    setValue("title", initialValues.title);
    setValue("description", initialValues.description);
    setValue("status", initialValues.status);
  }, [initialValues, setValue]);

  return (
    <>
      <Dialog {...props}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>

            <DialogDescription>
              Make changes to the task details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="flex flex-col gap-6">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-3">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      disabled
                      id="title"
                      type="text"
                      placeholder="Fix cors issue"
                      {...field}
                    />
                  </div>
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      disabled
                      id="description"
                      placeholder="Describe your task here."
                      {...field}
                    />
                  </div>
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-3">
                    <Label htmlFor="status">Status</Label>

                    <Select onValueChange={field.onChange} {...field}>
                      <SelectTrigger className="w-full capitalize">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In-progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Update
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UpdateTaskFormModal;
