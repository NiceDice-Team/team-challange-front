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
}: CustomToastProps) => {
  // Only run on client-side to prevent SSR issues
  if (typeof window === 'undefined') {
    return;
  }

  const { icon } = statusMap[type];

  toast.custom((t) => (
    <div className="flex items-center gap-4 bg-[linear-gradient(90deg,#494791_7.69%,#b23b30_99.52%),linear-gradient(106.44deg,rgba(104,102,167,0.9)_-1.37%,#494791_48.83%,rgba(125,123,184,0.9)_95.22%)] p-6 rounded-none w-[400px] h-[100px] text-white">
      <div className="w-6 h-6">{icon}</div>
      <div className="flex-1 text-left">
        <p className="font-medium text-lg">{title}</p>
        {description && <p className="font-normal text-base">{description}</p>}
      </div>
      <button 
        onClick={() => toast.dismiss(t)} 
        className="self-start"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  ));
};
