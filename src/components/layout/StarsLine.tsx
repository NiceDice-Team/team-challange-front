import Image from "next/image";
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
              <Image src={StarFilledIcon16} alt="filled star" width={16} height={16} className="h-4 w-4" />
            ) : isHalfFilled ? (
              <>
                <Image src={StarEmptyIcon16} alt="half star" width={16} height={16} className="h-4 w-4" />
                <span className="absolute inset-0 block w-1/2 overflow-hidden" aria-hidden="true">
                  <Image src={StarFilledIcon16} alt="" width={16} height={16} className="h-4 w-4 max-w-none" />
                </span>
              </>
            ) : (
              <Image src={StarEmptyIcon16} alt="empty star" width={16} height={16} className="h-4 w-4" />
            )}
          </span>
        );
      })}
    </div>
  );
};

export default StarsLine;
