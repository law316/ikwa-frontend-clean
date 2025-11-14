import React from 'react';
import { Star } from 'lucide-react';

const ReviewStats = ({ reviews }) => {
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
  
  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-2 border-amber-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Overall Rating */}
        <div className="text-center">
          <h2 className="text-2xl font-serif text-amber-900 mb-2">Overall Rating</h2>
          <div className="flex items-center justify-center mb-2">
            <span className="text-4xl font-bold text-amber-900">{averageRating.toFixed(1)}</span>
            <div className="ml-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-5 h-5 ${
                    index < Math.round(averageRating)
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-amber-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-amber-600 font-mono">{totalReviews} reviews</p>
        </div>

        {/* Rating Distribution */}
        <div>
          <h2 className="text-2xl font-serif text-amber-900 mb-2">Rating Distribution</h2>
          <p className="text-sm text-amber-600 mb-4 font-mono">Number of reviews for each star rating</p>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <span className="w-8 text-amber-900 font-mono">{rating}★</span>
                <div className="flex-1 h-4 bg-amber-100 rounded-full mx-2">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: `${((ratingDistribution[rating] || 0) / totalReviews) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-16 text-amber-600 font-mono text-sm">
                  {ratingDistribution[rating] || 0} reviews
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStats; 