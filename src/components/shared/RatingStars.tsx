import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: number;
  showCount?: boolean;
}

export default function RatingStars({ rating, count, size = 14, showCount = true }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}
          style={{ width: size, height: size }}
        />
      ))}
      {showCount && count !== undefined && (
        <span className="text-xs text-muted-foreground ms-1">({count})</span>
      )}
    </div>
  );
}
