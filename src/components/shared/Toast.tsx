import { CircleCheck, CircleX, Info, X } from "lucide-react";
import { ReactElement } from "react";
import { toast } from "sonner";

type ToastType = "success" | "error" | "info";

interface CustomToastProps {
  type?: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

const statusMap: Record<ToastType, { icon: ReactElement }> = {
  success: {
    icon: <CircleCheck className="w-6 h-6" />,
  },
  error: {
    icon: <CircleX className="w-6 h-6" />,
  },
  info: {
    icon: <Info className="w-6 h-6" />,
  },
};

export const showCustomToast = ({
  type = "success",
  title,
  description,
  duration = 4000,
}: CustomToastProps) => {
  // Only run on client-side to prevent SSR issues
  if (typeof window === 'undefined') {
    return;
  }

  const { icon } = statusMap[type];

  toast.custom((t) => (
    <div className="flex w-[min(calc(100vw-1rem),400px)] items-start gap-3 rounded-none bg-[linear-gradient(90deg,#494791_7.69%,#b23b30_99.52%),linear-gradient(106.44deg,rgba(104,102,167,0.9)_-1.37%,#494791_48.83%,rgba(125,123,184,0.9)_95.22%)] px-3 py-3.5 text-white shadow-[0px_13px_28px_rgba(0,0,0,0.1)] sm:min-h-[100px] sm:w-[calc(100vw-2rem)] sm:max-w-[400px] sm:gap-4 sm:p-6">
      <div className="mt-0.5 h-5 w-5 shrink-0 sm:mt-1 sm:h-6 sm:w-6">{icon}</div>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium leading-5 break-words sm:text-lg sm:leading-7">{title}</p>
        {description && <p className="mt-1 text-sm leading-5 font-normal sm:text-base">{description}</p>}
      </div>
      <button 
        onClick={() => toast.dismiss(t)} 
        className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center self-start sm:mr-0 sm:mt-0"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  ), { duration });
};
