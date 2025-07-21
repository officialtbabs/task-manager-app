import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DialogProps } from "@radix-ui/react-dialog";
import { IconAlertTriangleFilled } from "@tabler/icons-react";

interface DeleteTaskConfirmationModalProps
  extends React.ComponentProps<React.FC<DialogProps>> {
  taskId: string | undefined;
  onTaskDelete: (taskId: string) => void;
}

function DeleteTaskConfirmationModal({
  taskId,
  onTaskDelete,
  ...props
}: DeleteTaskConfirmationModalProps) {
  return (
    <>
      <Dialog {...props}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>

            <DialogDescription>
              Are you sure you want to delete task? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center my-4">
            <IconAlertTriangleFilled
              size={64}
              color="oklch(79.5% 0.184 86.047)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DialogClose asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </DialogClose>

            <Button
              variant="destructive"
              onClick={() => onTaskDelete(taskId!)}
              className="w-full"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DeleteTaskConfirmationModal;
