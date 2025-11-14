import React from 'react';

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Evolution of T-Shirt Design",
      excerpt: "Exploring how t-shirt designs have evolved over the decades...",
      date: "March 15, 2024",
      category: "Design History"
    },
    {
      id: 2,
      title: "Sustainable Fashion: Our Commitment",
      excerpt: "How we're making our t-shirts more eco-friendly...",
      date: "March 10, 2024",
      category: "Sustainability"
    },
    {
      id: 3,
      title: "Vintage Trends Making a Comeback",
      excerpt: "The hottest vintage styles that are trending in 2024...",
      date: "March 5, 2024",
      category: "Fashion Trends"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-black mb-8">Blog</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map(post => (
          <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <span className="text-sm text-gray-700 font-medium">{post.category}</span>
              <h2 className="text-xl font-semibold text-gray-800 mt-2 mb-3">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{post.date}</span>
                <button className="text-gray-700 hover:text-black font-medium">
                  Read More →
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogPage; 