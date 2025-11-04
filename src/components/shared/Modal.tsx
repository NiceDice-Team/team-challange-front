import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomButton } from "./CustomButton";
import { CloseIcon } from "@/svgs/icons";

const Modal = ({
  title,
  description,
  children,
  open,
  onConfirm,
  onCancel,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
}) => {
  const handleCancel = () => {
    onCancel();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent
        aria-describedby={undefined}
        aria-labelledby="dialog-content"
        className="z-50 bg-white p-6"
      >
        <DialogClose
          className="top-24 right-24 absolute focus-visible:outline-none focus:outline-none pointer"
          onClick={onCancel}
        ></DialogClose>
        <DialogHeader>
          <DialogTitle className="flex justify-start text-black text-lg">
            {title}
          </DialogTitle>
          <p className="mb-4 text-gray-2 text-base">{description}</p>
        </DialogHeader>
        {children}
        <DialogFooter>
          <CustomButton
            onClick={handleCancel}
            styleType="whiteButton"
            className="w-fit"
          >
            {cancelButtonText}
          </CustomButton>
          <CustomButton onClick={handleConfirm} className="w-fit">
            {confirmButtonText}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
