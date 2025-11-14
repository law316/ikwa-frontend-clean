import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  ChevronDown,
  ChevronUp,
  Download,
  RefreshCw,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const OrderHistoryPage = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock orders data
  const orders = [
    {
      id: 'ORD-12345',
      date: '2024-03-15',
      status: 'delivered',
      total: 139.98,
      items: [
        {
          id: 1,
          name: 'Vintage 70s Rock Band Tee',
          price: 49.99,
          quantity: 1,
          image: '/images/products/rock-band-tee.jpg',
        },
        {
          id: 2,
          name: 'Retro 80s Neon Jacket',
          price: 89.99,
          quantity: 1,
          image: '/images/products/neon-jacket.jpg',
        },
      ],
      tracking: {
        number: '1Z999AA10123456789',
        status: 'delivered',
        estimatedDelivery: '2024-03-18',
        history: [
          {
            date: '2024-03-15 10:30 AM',
            status: 'Order Confirmed',
            location: 'Warehouse',
          },
          {
            date: '2024-03-16 02:15 PM',
            status: 'Processing',
            location: 'Warehouse',
          },
          {
            date: '2024-03-17 09:45 AM',
            status: 'Shipped',
            location: 'Distribution Center',
          },
          {
            date: '2024-03-18 11:20 AM',
            status: 'Out for Delivery',
            location: 'Local Facility',
          },
          {
            date: '2024-03-18 03:45 PM',
            status: 'Delivered',
            location: 'Your Address',
          },
        ],
      },
    },
    {
      id: 'ORD-12346',
      date: '2024-03-10',
      status: 'processing',
      total: 89.99,
      items: [
        {
          id: 3,
          name: '90s Grunge Flannel',
          price: 89.99,
          quantity: 1,
          image: '/images/products/grunge-flannel.jpg',
        },
      ],
      tracking: {
        number: '1Z999AA10234567890',
        status: 'processing',
        estimatedDelivery: '2024-03-20',
        history: [
          {
            date: '2024-03-10 09:15 AM',
            status: 'Order Confirmed',
            location: 'Warehouse',
          },
          {
            date: '2024-03-11 01:30 PM',
            status: 'Processing',
            location: 'Warehouse',
          },
        ],
      },
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-amber-100 text-amber-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
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
      case 'processing':
        return <RefreshCw className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const handleReorder = async (orderId) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Order added to cart');
    } catch (error) {
      toast.error('Failed to reorder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      toast.error('Failed to download invoice');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-black font-mono mb-6">
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-200 text-black">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-black text-white">
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-300 text-black">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-400 text-white">
                    Order History
                  </span>
                </span>
              </span>
            </span>
          </h1>

          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-medium text-black font-mono">
                        Order {order.id}
                      </h2>
                      <p className="text-sm text-gray-700">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                      <button
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order.id ? null : order.id
                          )
                        }
                        className="p-2 text-gray-700 hover:text-gray-800 transition-colors duration-300"
                      >
                        {expandedOrder === order.id ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t-2 border-gray-200">
                        {/* Order Items */}
                        <div className="p-6 space-y-4">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4"
                            >
                              <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-black font-medium">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-gray-700">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-black font-mono">
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Summary */}
                        <div className="border-t-2 border-gray-200 p-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-black">
                              Order Summary
                            </h3>
                            <p className="text-xl font-bold text-black font-mono">
                              ${order.total.toFixed(2)}
                            </p>
                          </div>

                          {/* Tracking Information */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-700">
                                  Tracking Number
                                </p>
                                <p className="text-black font-mono">
                                  {order.tracking.number}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-700">
                                  Estimated Delivery
                                </p>
                                <p className="text-black">
                                  {new Date(
                                    order.tracking.estimatedDelivery
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            {/* Tracking Timeline */}
                            <div className="mt-6">
                              <h4 className="text-sm font-medium text-black mb-4">
                                Tracking History
                              </h4>
                              <div className="space-y-4">
                                {order.tracking.history.map((event, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-4"
                                  >
                                    <div className="relative">
                                      <div
                                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                                          index ===
                                          order.tracking.history.length - 1
                                            ? 'border-gray-600 bg-gray-600 text-white'
                                            : 'border-gray-300 text-gray-600'
                                        }`}
                                      >
                                        <Package className="h-4 w-4" />
                                      </div>
                                      {index <
                                        order.tracking.history.length - 1 && (
                                        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-300" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-black font-medium">
                                        {event.status}
                                      </p>
                                      <p className="text-sm text-gray-700">
                                        {event.date}
                                      </p>
                                      <p className="text-sm text-gray-700">
                                        {event.location}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-6 flex justify-end gap-4">
                            <button
                              onClick={() => handleDownloadInvoice(order.id)}
                              disabled={isLoading}
                              className="inline-flex items-center px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 hover:border-gray-600 transition-colors duration-300"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Invoice
                            </button>
                            <button
                              onClick={() => handleReorder(order.id)}
                              disabled={isLoading}
                              className="inline-flex items-center px-4 py-2 border-2 border-gray-600 rounded-lg text-gray-900 hover:bg-gray-600 hover:text-white transition-colors duration-300"
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Reorder
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage; 