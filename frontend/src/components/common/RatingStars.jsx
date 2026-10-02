import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({
  rating = 0,
  numReviews,
  size = 'md',
  showNumber = true,
  interactive = false,
  onRate,
  className = '',
}) => {
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  const currentSize = iconSizes[size] || iconSizes.md;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= Math.round(rating);
          return (
            <button
              key={starIndex}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRate && onRate(starIndex)}
              className={`${
                interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
              } p-0.5 focus:outline-none`}
            >
              <Star
                className={`${currentSize} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-100 text-slate-300'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showNumber && (
        <span className="font-semibold text-slate-900 text-xs sm:text-sm">
          {rating ? rating.toFixed(1) : 'New'}
        </span>
      )}

      {numReviews !== undefined && (
        <span className="text-slate-400 text-xs sm:text-sm font-normal">
          ({numReviews})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
