import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Heart,
  Settings,

  ChevronRight,
  ChevronDown,
  ShoppingBag,
  Star,
  Clock,
  LogOut,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const menuItems = [
  {
    title: 'Account',
    icon: User,
    items: [
      { title: 'Personal Information', path: '/account/personal-info' },
      { title: 'Order History', path: '/account/orders' },
      { title: 'Order Tracking', path: '/account/tracking' },
    ],
  },
  {
    title: 'Shipping',
    icon: MapPin,
    items: [
      { title: 'Addresses', path: '/account/addresses' },
      { title: 'Shipping Methods', path: '/account/shipping-methods' },
    ],
  },
  {
    title: 'Payment',
    icon: CreditCard,
    items: [
      { title: 'Payment Methods', path: '/account/payment-methods' },
      { title: 'Billing History', path: '/account/billing' },
    ],
  },
  {
    title: 'Wishlist',
    icon: Heart,
    path: '/account/wishlist',
  },
  {
    title: 'Preferences',
    icon: Settings,
    items: [
      { title: 'Language & Currency', path: '/account/preferences' },
      { title: 'Notifications', path: '/account/notifications' },
    ],
  },
];

const DashboardPage = () => {
  const [expandedMenu, setExpandedMenu] = useState('Account');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Mock user data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/images/avatars/default.jpg',
    stats: {
      orders: 12,
      wishlist: 8,
      reviews: 5,
    },
    profileCompletion: 85,
  };

  const handleMenuClick = (title) => {
    setExpandedMenu(expandedMenu === title ? null : title);
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-full flex items-center justify-between px-4 py-2 bg-white rounded-xl border-2 border-amber-200 text-amber-900 font-mono"
            >
              <span>Menu</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  isMobileMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Sidebar Menu */}
            <div
              className={`${
                isMobileMenuOpen ? 'block' : 'hidden'
              } lg:block mt-4 lg:mt-0`}
            >
              <div className="bg-white rounded-xl border-2 border-amber-200 p-4 space-y-2">
                {menuItems.map((item) => (
                  <div key={item.title}>
                    {item.items ? (
                      <div>
                        <button
                          onClick={() => handleMenuClick(item.title)}
                          className="w-full flex items-center justify-between px-4 py-2 text-amber-900 hover:bg-amber-50 rounded-lg transition-colors duration-300"
                        >
                          <div className="flex items-center">
                            <item.icon className="h-5 w-5 mr-3" />
                            <span className="font-mono">{item.title}</span>
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 transition-transform ${
                              expandedMenu === item.title ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {expandedMenu === item.title && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-12 space-y-1">
                                {item.items.map((subItem) => (
                                  <Link
                                    key={subItem.title}
                                    to={subItem.path}
                                    className={`block px-4 py-2 text-sm rounded-lg transition-colors duration-300 ${
                                      location.pathname === subItem.path
                                        ? 'bg-amber-100 text-amber-900'
                                        : 'text-amber-600 hover:bg-amber-50'
                                    }`}
                                  >
                                    {subItem.title}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-2 text-amber-900 hover:bg-amber-50 rounded-lg transition-colors duration-300 ${
                          location.pathname === item.path
                            ? 'bg-amber-100'
                            : ''
                        }`}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span className="font-mono">{item.title}</span>
                      </Link>
                    )}
                  </div>
                ))}

                <div className="border-t-2 border-amber-200 my-2" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span className="font-mono">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-xl border-2 border-amber-200 p-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-amber-200">
                    <img
                      src={userData.avatar}
                      alt={userData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-amber-600 text-white text-xs font-mono px-2 py-1 rounded-full">
                    {userData.profileCompletion}%
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-amber-900 font-mono">
                    Welcome back, {userData.name}!
                  </h1>
                  <p className="text-amber-600 mt-1">
                    Manage your account and track your orders
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border-2 border-amber-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-amber-600">Total Orders</p>
                    <p className="text-2xl font-bold text-amber-900 font-mono">
                      {userData.stats.orders}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-amber-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Heart className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-amber-600">Wishlist Items</p>
                    <p className="text-2xl font-bold text-amber-900 font-mono">
                      {userData.stats.wishlist}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-amber-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Star className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-amber-600">Reviews</p>
                    <p className="text-2xl font-bold text-amber-900 font-mono">
                      {userData.stats.reviews}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border-2 border-amber-200 p-6">
              <h2 className="text-xl font-bold text-amber-900 font-mono mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  to="/account/orders"
                  className="flex items-center gap-3 px-4 py-3 border-2 border-amber-200 rounded-lg text-amber-900 hover:border-amber-600 transition-colors duration-300"
                >
                  <Package className="h-5 w-5" />
                  <span>View Orders</span>
                </Link>
                <Link
                  to="/account/tracking"
                  className="flex items-center gap-3 px-4 py-3 border-2 border-amber-200 rounded-lg text-amber-900 hover:border-amber-600 transition-colors duration-300"
                >
                  <Clock className="h-5 w-5" />
                  <span>Track Order</span>
                </Link>
                <Link
                  to="/account/wishlist"
                  className="flex items-center gap-3 px-4 py-3 border-2 border-amber-200 rounded-lg text-amber-900 hover:border-amber-600 transition-colors duration-300"
                >
                  <Heart className="h-5 w-5" />
                  <span>Wishlist</span>
                </Link>
                <Link
                  to="/account/settings"
                  className="flex items-center gap-3 px-4 py-3 border-2 border-amber-200 rounded-lg text-amber-900 hover:border-amber-600 transition-colors duration-300"
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border-2 border-amber-200 p-6">
              <h2 className="text-xl font-bold text-amber-900 font-mono mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {/* Mock activity items */}
                <div className="flex items-center gap-4 p-4 border-2 border-amber-100 rounded-lg">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Package className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-amber-900">Order #12345 shipped</p>
                    <p className="text-sm text-amber-600">2 days ago</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-amber-600" />
                </div>

                <div className="flex items-center gap-4 p-4 border-2 border-amber-100 rounded-lg">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Star className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-amber-900">Review posted for Vintage Tee</p>
                    <p className="text-sm text-amber-600">5 days ago</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-amber-600" />
                </div>

                <div className="flex items-center gap-4 p-4 border-2 border-amber-100 rounded-lg">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Heart className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-amber-900">Added Retro Jacket to wishlist</p>
                    <p className="text-sm text-amber-600">1 week ago</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;