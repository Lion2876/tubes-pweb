import { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ value = 0, onChange, readonly = false, size = 'md' }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const iconSize = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverValue || value);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => !readonly && setHoverValue(star)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            className={`transition-all duration-150 ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-90'
            }`}
          >
            <Star
              className={`${iconSize} transition-colors duration-150 ${
                isFilled
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-200'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
