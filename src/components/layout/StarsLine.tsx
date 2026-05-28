import { StarFilledIcon16, StarEmptyIcon16 } from "@/svgs/icons";

interface StarsLineProps {
  rating?: number;
}

const StarsLine = ({ rating = 0 }: StarsLineProps) => {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, index) => {
        const starPosition = index + 1;
        const isFilled = starPosition <= rating;
        const isHalfFilled = !isFilled && starPosition - 0.5 === rating;

        return (
          <span key={index} className="relative block h-4 w-4">
            {isFilled ? (
              <img src={StarFilledIcon16} alt="filled star" className="h-4 w-4" />
            ) : isHalfFilled ? (
              <>
                <img src={StarEmptyIcon16} alt="half star" className="h-4 w-4" />
                <span className="absolute inset-0 block w-1/2 overflow-hidden" aria-hidden="true">
                  <img src={StarFilledIcon16} alt="" className="h-4 w-4 max-w-none" />
                </span>
              </>
            ) : (
              <img src={StarEmptyIcon16} alt="empty star" className="h-4 w-4" />
            )}
          </span>
        );
      })}
    </div>
  );
};

export default StarsLine;
