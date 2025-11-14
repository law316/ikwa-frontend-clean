import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Package,
  Truck,

  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  Printer,
  Bell,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const OrderTrackingPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  // Mock tracking data
  const trackingData = {
    orderNumber: 'THB-2024-1234',
    status: 'in_transit',
    carrier: 'Vintage Express',
    trackingNumber: '1Z999AA10123456789',
    estimatedDelivery: '2024-03-25',
    currentLocation: 'Distribution Center, Vintage City',
    lastUpdate: '2024-03-22 14:30',
    timeline: [
      {
        date: '2024-03-20 10:30 AM',
        status: 'Order Confirmed',
        location: 'Warehouse',
        description: 'Your order has been received and confirmed',
      },
      {
        date: '2024-03-21 02:15 PM',
        status: 'Processing',
        location: 'Warehouse',
        description: 'Your order is being prepared for shipment',
      },
      {
        date: '2024-03-22 09:45 AM',
        status: 'Shipped',
        location: 'Distribution Center',
        description: 'Your order has been shipped',
      },
      {
        date: '2024-03-22 14:30 PM',
        status: 'In Transit',
        location: 'Distribution Center',
        description: 'Your order is on its way',
      },
    ],
    deliveryAttempts: [],
    notifications: [
      {
        type: 'email',
        date: '2024-03-20 10:35 AM',
        status: 'Sent',
        content: 'Order confirmation email sent',
      },
      {
        type: 'sms',
        date: '2024-03-22 09:50 AM',
        status: 'Sent',
        content: 'Your order has been shipped',
      },
    ],
    items: [
      {
        id: 1,
        name: 'Vintage 70s Rock Band Tee',
        quantity: 2,
        image: '/images/products/rock-band-tee.jpg',
      },
      {
        id: 2,
        name: 'Retro 80s Neon Jacket',
        quantity: 1,
        image: '/images/products/neon-jacket.jpg',
      },
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Retro Street',
      city: 'Vintage City',
      state: 'VC',
      zip: '12345',
      country: 'United States',
      phone: '+1 (555) 123-4567',
    },
    specialInstructions: 'Please leave package at the front door',
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Order found');
    } catch (error) {
      toast.error('Order not found');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-amber-100 text-amber-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'in_transit':
        return <Truck className="h-5 w-5" />;
      case 'processing':
        return <Package className="h-5 w-5" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tracking Header */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-8">
          <h1 className="text-2xl font-bold text-black font-mono mb-6">
            Track Your Order
          </h1>
          <form onSubmit={handleTrackOrder} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Enter order number"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-gray-900 placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-6 py-2 border-2 border-gray-600 rounded-lg text-gray-900 hover:bg-gray-600 hover:text-white transition-colors duration-300"
            >
              {isLoading ? (
                <Clock className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>
          </form>
        </div>

        {/* Tracking Information */}
        <div className="space-y-8">
          {/* Status Overview */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-black font-mono">
                  Order Status
                </h2>
                <p className="text-gray-600">Order #{trackingData.orderNumber}</p>
              </div>
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  trackingData.status
                )}`}
              >
                {getStatusIcon(trackingData.status)}
                {trackingData.status
                  .split('_')
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                  )
                  .join(' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-black mb-2">
                  Tracking Details
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Carrier: {trackingData.carrier}
                  </p>
                  <p className="text-gray-600">
                    Tracking Number: {trackingData.trackingNumber}
                  </p>
                  <p className="text-gray-600">
                    Estimated Delivery:{' '}
                    {new Date(
                      trackingData.estimatedDelivery
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-black mb-2">
                  Current Location
                </h3>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-gray-600 mt-1" />
                  <p className="text-gray-600">
                    {trackingData.currentLocation}
                  </p>
                </div>
                <p className="text-sm text-amber-500 mt-1">
                  Last updated: {trackingData.lastUpdate}
                </p>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="bg-white rounded-xl border-2 border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 font-mono mb-6">
              Tracking Timeline
            </h2>
            <div className="space-y-6">
              {trackingData.timeline.map((event, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="relative">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        index === trackingData.timeline.length - 1
                          ? 'border-amber-600 bg-amber-600 text-white'
                          : 'border-amber-300 text-amber-600'
                      }`}
                    >
                      <Package className="h-4 w-4" />
                    </div>
                    {index < trackingData.timeline.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-amber-300" />
                    )}
                  </div>
                  <div>
                    <p className="text-amber-900 font-medium">
                      {event.status}
                    </p>
                    <p className="text-sm text-amber-600">{event.date}</p>
                    <p className="text-sm text-amber-600">
                      {event.location}
                    </p>
                    <p className="text-sm text-amber-600 mt-1">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-xl border-2 border-amber-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-amber-900 font-mono">
                Order Details
              </h2>
              <button
                onClick={() =>
                  setExpandedSection(
                    expandedSection === 'details' ? null : 'details'
                  )
                }
                className="p-2 text-amber-600 hover:text-amber-700 transition-colors duration-300"
              >
                {expandedSection === 'details' ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </div>

            <AnimatePresence>
              {expandedSection === 'details' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-6">
                    {/* Items */}
                    <div>
                      <h3 className="text-lg font-medium text-amber-900 mb-4">
                        Items
                      </h3>
                      <div className="space-y-4">
                        {trackingData.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4"
                          >
                            <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-amber-200">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-amber-900 font-medium">
                                {item.name}
                              </p>
                              <p className="text-sm text-amber-600">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="text-lg font-medium text-amber-900 mb-4">
                        Shipping Address
                      </h3>
                      <div className="space-y-2">
                        <p className="text-amber-900">
                          {trackingData.shippingAddress.name}
                        </p>
                        <p className="text-amber-600">
                          {trackingData.shippingAddress.address}
                        </p>
                        <p className="text-amber-600">
                          {trackingData.shippingAddress.city},{' '}
                          {trackingData.shippingAddress.state}{' '}
                          {trackingData.shippingAddress.zip}
                        </p>
                        <p className="text-amber-600">
                          {trackingData.shippingAddress.country}
                        </p>
                        <p className="text-amber-600">
                          {trackingData.shippingAddress.phone}
                        </p>
                      </div>
                    </div>

                    {/* Special Instructions */}
                    {trackingData.specialInstructions && (
                      <div>
                        <h3 className="text-lg font-medium text-amber-900 mb-4">
                          Special Instructions
                        </h3>
                        <p className="text-amber-600">
                          {trackingData.specialInstructions}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border-2 border-amber-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-amber-900 font-mono">
                Notifications
              </h2>
              <button
                onClick={() =>
                  setExpandedSection(
                    expandedSection === 'notifications'
                      ? null
                      : 'notifications'
                  )
                }
                className="p-2 text-amber-600 hover:text-amber-700 transition-colors duration-300"
              >
                {expandedSection === 'notifications' ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </div>

            <AnimatePresence>
              {expandedSection === 'notifications' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4">
                    {trackingData.notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 border-2 border-amber-100 rounded-lg"
                      >
                        <div className="p-2 bg-amber-100 rounded-full">
                          {notification.type === 'email' ? (
                            <Mail className="h-5 w-5 text-amber-600" />
                          ) : (
                            <Phone className="h-5 w-5 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-amber-900">
                            {notification.content}
                          </p>
                          <p className="text-sm text-amber-600">
                            {notification.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 border-2 border-amber-300 rounded-lg text-amber-900 hover:border-amber-600 transition-colors duration-300"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Tracking
            </button>
            <button
              className="inline-flex items-center px-4 py-2 border-2 border-amber-300 rounded-lg text-amber-900 hover:border-amber-600 transition-colors duration-300"
            >
              <Bell className="h-4 w-4 mr-2" />
              Update Notifications
            </button>
            <a
              href="/support/contact"
              className="inline-flex items-center px-4 py-2 border-2 border-amber-300 rounded-lg text-amber-900 hover:border-amber-600 transition-colors duration-300"
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;