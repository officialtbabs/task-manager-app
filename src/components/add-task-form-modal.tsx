import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { createTaskFormSchema } from "@/lib/constants";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { DialogProps } from "@radix-ui/react-dialog";
import { Textarea } from "./ui/textarea";
import type { CreateTaskFormData } from "@/lib/types";

interface AddTaskFormModalProps
  extends React.ComponentProps<React.FC<DialogProps>> {
  onTaskCreate: (values: CreateTaskFormData) => void;
}

function AddTaskFormModal({ onTaskCreate, ...props }: AddTaskFormModalProps) {
  const { control, handleSubmit } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmitHandler: SubmitHandler<CreateTaskFormData> = (
    values: CreateTaskFormData
  ) => {
    onTaskCreate(values);
  };

  return (
    <>
      <Dialog {...props}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Task</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>

            <DialogDescription>
              Enter information below to create a task
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
                      id="description"
                      placeholder="Describe your task here."
                      {...field}
                    />
                  </div>
                )}
              />

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Create
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddTaskFormModal;
