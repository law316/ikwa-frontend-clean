import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Package,
  Truck,
  RefreshCw,
  Ruler,
  BookOpen,
  ExternalLink,
} from 'lucide-react';

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const [filteredFaqs, setFilteredFaqs] = useState([]);

  const categories = [
    { id: 'all', name: 'All Questions', icon: <HelpCircle className="h-5 w-5" /> },
    { id: 'orders', name: 'Orders', icon: <Package className="h-5 w-5" /> },
    { id: 'shipping', name: 'Shipping', icon: <Truck className="h-5 w-5" /> },
    { id: 'returns', name: 'Returns', icon: <RefreshCw className="h-5 w-5" /> },
    { id: 'sizing', name: 'Sizing', icon: <Ruler className="h-5 w-5" /> },
  ];

  const faqs = useMemo(() => [
    {
      id: 1,
      category: 'orders',
      question: 'How do I place an order?',
      answer: 'To place an order, simply browse our collection, select your desired items, choose your size and quantity, and proceed to checkout. You can pay using various methods including credit cards, PayPal, or Apple Pay.',
    },
    {
      id: 2,
      category: 'orders',
      question: 'Can I modify my order after placing it?',
      answer: 'Orders can be modified within 1 hour of placement. Please contact our customer service team immediately if you need to make changes to your order.',
    },
    {
      id: 3,
      category: 'shipping',
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-5 business days within the continental US. International shipping may take 7-14 business days depending on the destination.',
    },
    {
      id: 4,
      category: 'shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can view shipping options during checkout.',
    },
    {
      id: 5,
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original packaging with all tags attached. Please visit our Returns page for detailed instructions.',
    },
    {
      id: 6,
      category: 'returns',
      question: 'How do I initiate a return?',
      answer: 'To initiate a return, log into your account, go to your order history, and select the order you wish to return. Follow the prompts to generate a return label and instructions.',
    },
    {
      id: 7,
      category: 'sizing',
      question: 'How do I find my correct size?',
      answer: 'We recommend using our size guide, which includes detailed measurements for each size. You can find the size guide on each product page or visit our dedicated Size Guide page.',
    },
    {
      id: 8,
      category: 'sizing',
      question: 'Do your sizes run true to size?',
      answer: 'Our vintage-inspired pieces are designed to fit true to size. However, we recommend checking the specific measurements for each item as some styles may have a more relaxed or fitted silhouette.',
    },
  ], []);

  const relatedArticles = [
    {
      title: 'Understanding Vintage Sizing',
      link: '/support/size-guide',
      description: 'Learn about the differences between modern and vintage sizing standards.',
    },
    {
      title: 'Care Instructions',
      link: '/support/care-guide',
      description: 'How to properly care for your vintage-inspired clothing.',
    },
    {
      title: 'Shipping & Delivery',
      link: '/support/shipping',
      description: 'Detailed information about our shipping methods and delivery times.',
    },
  ];

  useEffect(() => {
    let filtered = faqs;
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter((faq) => faq.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      );
    }
    
    setFilteredFaqs(filtered);
  }, [searchQuery, activeCategory, faqs]);

  const toggleFaq = (id) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black font-mono mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Find answers to common questions about our vintage collection,
            ordering process, and more.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs..."
              className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black text-black placeholder-gray-400"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors duration-300 ${
                activeCategory === category.id
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 text-black hover:border-black'
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="space-y-4 mb-12">
          <AnimatePresence>
            {filteredFaqs.map((faq) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-100 transition-colors duration-300"
                >
                  <span className="text-lg font-medium text-black">
                    {faq.question}
                  </span>
                  {expandedFaqs[faq.id] ? (
                    <ChevronUp className="h-5 w-5 text-black" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-black" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedFaqs[faq.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 border-t-2 border-gray-100">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Related Articles */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-black font-mono mb-6">
            Related Articles
          </h2>
          <div className="space-y-4">
            {relatedArticles.map((article, index) => (
              <a
                key={index}
                href={article.link}
                className="block p-4 border-2 border-gray-100 rounded-lg hover:border-gray-300 transition-colors duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-black mb-1">
                      {article.title}
                    </h3>
                    <p className="text-gray-600">{article.description}</p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-gray-600" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-black font-mono mb-4">
            Still Need Help?
          </h2>
          <p className="text-gray-700 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <a
            href="/support/contact"
            className="inline-flex items-center px-6 py-3 border-2 border-black rounded-lg text-black hover:bg-black hover:text-white transition-colors duration-300"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage; 