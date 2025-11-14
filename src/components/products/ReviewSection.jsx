import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { reviewService } from '../../services/api';

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await reviewService.getReviews(productId);
      setReviews(response.data);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load reviews';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingChange = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newReview.rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error('Please write a review');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await reviewService.addReview(productId, newReview);
      setReviews((prev) => [response.data, ...prev]);
      setNewReview({ rating: 0, comment: '' });
      toast.success('Review submitted successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit review';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-amber-900 font-mono">
          Customer Reviews
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(averageRating)
                    ? 'text-amber-500 fill-current'
                    : 'text-amber-300'
                }`}
              />
            ))}
          </div>
          <span className="text-amber-900 font-medium">
            ({reviews.length} reviews)
          </span>
        </div>
      </div>

      {isLoading && (
        <div className="text-amber-700">Loading reviews...</div>
      )}

      {/* Review Form */}
      <div className="bg-white rounded-xl border-2 border-amber-200 p-6">
        <h3 className="text-lg font-medium text-amber-900 mb-4">
          Write a Review
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 transition-colors duration-300 ${
                      star <= (hoveredRating || newReview.rating)
                        ? 'text-amber-500 fill-current'
                        : 'text-amber-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-amber-900 mb-2"
            >
              Your Review
            </label>
            <textarea
              id="comment"
              value={newReview.comment}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, comment: e.target.value }))
              }
              rows={4}
              className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-600 text-amber-900 placeholder-amber-400"
              placeholder="Share your thoughts about this vintage piece..."
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-amber-600 rounded-lg text-amber-900 hover:bg-amber-600 hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Submit Review
              </>
            )}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border-2 border-amber-200 p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-medium text-amber-900">
                  {review.user}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'text-amber-500 fill-current'
                            : 'text-amber-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-amber-600">
                    {new Date(review.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-amber-600">{review.comment}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;