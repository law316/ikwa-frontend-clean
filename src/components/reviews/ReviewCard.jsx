import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

const ReviewCard = ({ review }) => {
  const { customerName, rating, date, reviewText, productCategory, verified } = review;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-amber-500 fill-amber-500' : 'text-amber-200'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-amber-200 hover:border-amber-400 transition-colors duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-serif text-amber-900">{customerName}</h3>
          <p className="text-sm text-amber-600 font-mono">{new Date(date).toLocaleDateString()}</p>
        </div>
        {verified && (
          <div className="flex items-center text-amber-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span className="text-xs font-mono">Verified Purchase</span>
          </div>
        )}
      </div>

      <div className="flex items-center mb-4">
        {renderStars(rating)}
        <span className="ml-2 text-sm text-amber-600 font-mono">{rating}/5</span>
      </div>

      <p className="text-amber-800 font-mono mb-4 leading-relaxed">{reviewText}</p>

      <div className="border-t border-amber-200 pt-4">
        <span className="text-sm text-amber-600 font-mono">
          Category: {productCategory}
        </span>
      </div>
    </div>
  );
};

export default ReviewCard; 