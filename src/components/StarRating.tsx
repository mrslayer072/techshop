import { Star } from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

export default function StarRating({
  rating,
  reviewCount,
  size = 14,
  showCount = true,
}: {
  rating: number;
  reviewCount?: number;
  size?: number;
  showCount?: boolean;
}) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-1.5 text-fg-secondary">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={
              i < filled ? "fill-[#FACC15] text-[#FACC15]" : "text-fg-muted"
            }
          />
        ))}
      </div>
      <span className="text-xs tabular">
        {toPersianDigits(rating.toFixed(1))}
      </span>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-fg-muted">
          ({toPersianDigits(reviewCount)})
        </span>
      )}
    </div>
  );
}
