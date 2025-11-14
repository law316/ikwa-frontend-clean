import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  Send,

  AlertCircle,

} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { contactService } from '../services/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await contactService.sendMessage(formData);
      toast.success('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email Us',
      details: ['support@lace-legacy.com', 'sales@lace-legacy.com'],
      response: 'Within 24 hours',
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', 'Mon-Fri, 9am-6pm EST'],
      response: 'Immediate response',
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: 'Live Chat',
      details: ['Available 24/7', 'Click the chat icon below'],
      response: 'Instant response',
    },
  ];



  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black font-mono mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Have questions about our vintage collection? We're here to help!
            Choose your preferred way to reach us below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border-2 border-amber-200 p-8"
          >
            <h2 className="text-2xl font-bold text-amber-900 font-mono mb-6">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-amber-900 mb-1"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-amber-600 text-amber-900 placeholder-amber-400 ${
                    errors.name
                      ? 'border-red-300'
                      : 'border-amber-300'
                  }`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-amber-900 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-amber-600 text-amber-900 placeholder-amber-400 ${
                    errors.email
                      ? 'border-red-300'
                      : 'border-amber-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-amber-900 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-amber-600 text-amber-900 placeholder-amber-400 ${
                    errors.subject
                      ? 'border-red-300'
                      : 'border-amber-300'
                  }`}
                  placeholder="What's this about?"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.subject}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-amber-900 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-amber-600 text-amber-900 placeholder-amber-400 ${
                    errors.message
                      ? 'border-red-300'
                      : 'border-amber-300'
                  }`}
                  placeholder="Tell us how we can help..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-amber-600 rounded-lg text-amber-900 hover:bg-amber-600 hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-5 w-5 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="bg-white rounded-xl border-2 border-amber-200 p-8">
              <h2 className="text-2xl font-bold text-amber-900 font-mono mb-6">
                Other Ways to Reach Us
              </h2>
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 border-2 border-amber-100 rounded-lg hover:border-amber-300 transition-colors duration-300"
                  >
                    <div className="p-3 bg-amber-100 rounded-full">
                      {method.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-amber-900">
                        {method.title}
                      </h3>
                      {method.details.map((detail, i) => (
                        <p
                          key={i}
                          className="text-amber-600"
                        >
                          {detail}
                        </p>
                      ))}
                      <p className="text-sm text-amber-500 mt-1">
                        Response time: {method.response}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-white rounded-xl border-2 border-amber-200 p-8">
              <h2 className="text-2xl font-bold text-amber-900 font-mono mb-6">
                Office Hours
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Clock className="h-6 w-6 text-amber-600" />
                  <div>
                    <p className="text-amber-900 font-medium">
                      Customer Support
                    </p>
                    <p className="text-amber-600">
                      Monday - Friday: 9:00 AM - 6:00 PM EST
                    </p>
                    <p className="text-amber-600">
                      Saturday: 10:00 AM - 4:00 PM EST
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="h-6 w-6 text-amber-600" />
                  <div>
                    <p className="text-amber-900 font-medium">
                      Our Location
                    </p>
                    <p className="text-amber-600">
                      123 Retro Street, Vintage City, VC 12345
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 bg-white rounded-xl border-2 border-amber-200 p-8">
          <h2 className="text-2xl font-bold text-amber-900 font-mono mb-6">
            Find Us
          </h2>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border-2 border-amber-200">
            {/* Replace with actual map integration */}
            <div className="w-full h-96 bg-amber-100 flex items-center justify-center">
              <p className="text-amber-600">Map Integration Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;