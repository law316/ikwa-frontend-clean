import React from 'react';
import { PenLine } from 'lucide-react';

const WriteReviewButton = () => {
  return (
    <button
      className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-300 font-mono shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform duration-300"
    >
      <PenLine className="w-5 h-5 mr-2" />
      Write a Review
    </button>
  );
};

export default WriteReviewButton; 