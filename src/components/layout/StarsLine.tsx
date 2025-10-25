import { StarFilledIcon16, StarEmptyIcon16 } from "@/svgs/icons";

interface StarsLineProps {
  rating?: number;
}

const StarsLine = ({ rating = 0 }: StarsLineProps) => {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index}>
          {index < rating ? (
            <img src={StarFilledIcon16} alt="filled star" className="h-4 w-4" />
          ) : (
            <img src={StarEmptyIcon16} alt="empty star" className="h-4 w-4" />
          )}
        </span>
      ))}
    </div>
  );
};

export default StarsLine;
