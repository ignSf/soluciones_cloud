import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showNumber?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 16,
  showNumber = false,
  reviewCount,
  interactive = false,
  onRatingChange,
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="rating-stars-container">
      <div className="stars-row">
        {Array.from({ length: maxRating }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = displayRating >= starValue;
          const isHalf = displayRating > index && displayRating < starValue;

          return (
            <button
              type="button"
              key={index}
              disabled={!interactive}
              className={`star-btn ${interactive ? 'star-interactive' : ''}`}
              onClick={() => interactive && onRatingChange?.(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              aria-label={`Calificar con ${starValue} estrellas`}
            >
              <Star
                size={size}
                className={
                  isFilled
                    ? 'star-filled'
                    : isHalf
                    ? 'star-half'
                    : 'star-empty'
                }
              />
            </button>
          );
        })}
      </div>
      {showNumber && (
        <span className="rating-number">{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className="review-count">({reviewCount})</span>
      )}
    </div>
  );
};
