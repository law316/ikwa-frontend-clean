import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReviewCard from '../components/reviews/ReviewCard';
import ReviewStats from '../components/reviews/ReviewStats';
import WriteReviewButton from '../components/reviews/WriteReviewButton';

const CustomerReviews = () => {
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Sample reviews data - replace with actual data from your backend
  const reviews = [
    {
      id: 1,
      customerName: "John D.",
      rating: 5,
      date: "2024-12-15",
      reviewText: "Amazing vintage band tee! The quality is exactly as described.",
      productCategory: "Band Tees",
      verified: true
    },
    {
      id: 2,
      customerName: "Sarah M.",
      rating: 4,
      date: "2024-12-10",
      reviewText: "Love the retro design and the fabric is so comfortable.",
      productCategory: "Retro Tees",
      verified: true
    },
    // Add more sample reviews as needed
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-center mb-4"
          >
            Customer Reviews
          </motion.h1>
          <p className="text-center text-gray-200 font-mono max-w-2xl mx-auto">
            Discover what our community says about their vintage fashion journey with Lace and Legacy
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Review Stats */}
        <ReviewStats reviews={reviews} />

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-2 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-black font-mono mb-2">Rating</label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black text-black"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div>
              <label className="block text-black font-mono mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black text-black"
              >
                <option value="all">All Categories</option>
                <option value="Band Tees">Band Tees</option>
                <option value="Retro Tees">Retro Tees</option>
                <option value="Vintage Sports">Vintage Sports</option>
              </select>
            </div>
            <div>
              <label className="block text-black font-mono mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black text-black"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Write Review Button */}
        <div className="mt-12 text-center">
          <WriteReviewButton />
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 border-2 border-gray-300 rounded-lg text-black hover:bg-gray-100 transition-colors duration-300">
              Previous
            </button>
            <button className="px-3 py-2 border-2 border-gray-300 rounded-lg text-black hover:bg-gray-100 transition-colors duration-300">
              1
            </button>
            <button className="px-3 py-2 border-2 border-gray-300 rounded-lg text-black hover:bg-gray-100 transition-colors duration-300">
              2
            </button>
            <button className="px-3 py-2 border-2 border-gray-300 rounded-lg text-black hover:bg-gray-100 transition-colors duration-300">
              3
            </button>
            <button className="px-3 py-2 border-2 border-gray-300 rounded-lg text-black hover:bg-gray-100 transition-colors duration-300">
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews; 