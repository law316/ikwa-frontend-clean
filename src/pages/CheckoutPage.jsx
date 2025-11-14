import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Lock,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const steps = [
  { id: 'shipping', title: 'Shipping' },
  { id: 'billing', title: 'Billing' },
  { id: 'payment', title: 'Payment' },
  { id: 'review', title: 'Review' },
];

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGuest, setIsGuest] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    shipping: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
    },
    billing: {
      sameAsShipping: true,
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
    },
    payment: {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      saveCard: false,
    },
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    // Clear error when user starts typing
    if (errors[`${section}.${field}`]) {
      setErrors((prev) => ({
        ...prev,
        [`${section}.${field}`]: undefined,
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    const currentFormData = formData[steps[step].id];

    switch (step) {
      case 0: // Shipping
        if (!currentFormData.firstName) {
          newErrors['shipping.firstName'] = 'First name is required';
        }
        if (!currentFormData.lastName) {
          newErrors['shipping.lastName'] = 'Last name is required';
        }
        if (!currentFormData.email) {
          newErrors['shipping.email'] = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(currentFormData.email)) {
          newErrors['shipping.email'] = 'Invalid email format';
        }
        if (!currentFormData.address) {
          newErrors['shipping.address'] = 'Address is required';
        }
        if (!currentFormData.city) {
          newErrors['shipping.city'] = 'City is required';
        }
        if (!currentFormData.state) {
          newErrors['shipping.state'] = 'State is required';
        }
        if (!currentFormData.zipCode) {
          newErrors['shipping.zipCode'] = 'Zip code is required';
        }
        break;

      case 1: // Billing
        if (!currentFormData.sameAsShipping) {
          if (!currentFormData.firstName) {
            newErrors['billing.firstName'] = 'First name is required';
          }
          if (!currentFormData.lastName) {
            newErrors['billing.lastName'] = 'Last name is required';
          }
          if (!currentFormData.address) {
            newErrors['billing.address'] = 'Address is required';
          }
          if (!currentFormData.city) {
            newErrors['billing.city'] = 'City is required';
          }
          if (!currentFormData.state) {
            newErrors['billing.state'] = 'State is required';
          }
          if (!currentFormData.zipCode) {
            newErrors['billing.zipCode'] = 'Zip code is required';
          }
        }
        break;

      case 2: // Payment
        if (!currentFormData.cardNumber) {
          newErrors['payment.cardNumber'] = 'Card number is required';
        } else if (!/^\d{16}$/.test(currentFormData.cardNumber.replace(/\s/g, ''))) {
          newErrors['payment.cardNumber'] = 'Invalid card number';
        }
        if (!currentFormData.cardName) {
          newErrors['payment.cardName'] = 'Name on card is required';
        }
        if (!currentFormData.expiryDate) {
          newErrors['payment.expiryDate'] = 'Expiry date is required';
        } else if (!/^\d{2}\/\d{2}$/.test(currentFormData.expiryDate)) {
          newErrors['payment.expiryDate'] = 'Invalid expiry date (MM/YY)';
        }
        if (!currentFormData.cvv) {
          newErrors['payment.cvv'] = 'CVV is required';
        } else if (!/^\d{3,4}$/.test(currentFormData.cvv)) {
          newErrors['payment.cvv'] = 'Invalid CVV';
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success('Order placed successfully!');
      // TODO: Redirect to order confirmation page
      navigate('/payment');
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black font-mono">
                Shipping Information
              </h2>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="guest"
                  checked={isGuest}
                  onChange={(e) => setIsGuest(e.target.checked)}
                  className="rounded border-gray-300 text-gray-700 focus:ring-black"
                />
                <label htmlFor="guest" className="text-sm text-black">
                  Checkout as Guest
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-black mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.shipping.firstName}
                  onChange={(e) =>
                    handleInputChange('shipping', 'firstName', e.target.value)
                  }
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none text-black placeholder-gray-400 ${
                    errors['shipping.firstName']
                      ? 'border-red-300'
                      : 'border-gray-300 focus:border-black'
                  }`}
                />
                {errors['shipping.firstName'] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors['shipping.firstName']}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.shipping.lastName}
                  onChange={(e) =>
                    handleInputChange('shipping', 'lastName', e.target.value)
                  }
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none text-black placeholder-gray-400 ${
                    errors['shipping.lastName']
                      ? 'border-red-300'
                      : 'border-gray-300 focus:border-black'
                  }`}
                />
                {errors['shipping.lastName'] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors['shipping.lastName']}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.shipping.email}
                  onChange={(e) =>
                    handleInputChange('shipping', 'email', e.target.value)
                  }
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none text-black placeholder-gray-400 ${
                    errors['shipping.email']
                      ? 'border-red-300'
                      : 'border-gray-300 focus:border-black'
                  }`}
                />
                {errors['shipping.email'] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors['shipping.email']}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.shipping.phone}
                  onChange={(e) =>
                    handleInputChange('shipping', 'phone', e.target.value)
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black text-black placeholder-gray-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.shipping.address}
                  onChange={(e) =>
                    handleInputChange('shipping', 'address', e.target.value)
                  }
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none text-black placeholder-gray-400 ${
                    errors['shipping.address']
                      ? 'border-red-300'
                      : 'border-gray-300 focus:border-black'
                  }`}
                />
                {errors['shipping.address'] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors['shipping.address']}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-black mb-2"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={formData.shipping.city}
                  onChange={(e) =>
                    handleInputChange('shipping', 'city', e.target.value)
                  }
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none text-black placeholder-gray-400 ${
                    errors['shipping.city']
                      ? 'border-red-300'
                      : 'border-gray-300 focus:border-black'
                  }`}
                />
                {errors['shipping.city'] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors['shipping.city']}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-black mb-2"
                >
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  value={formData.shipping.state}
                  onChange={(e) =>
                    handleInputChange('shipping', 'state', e.target.value)
                  }
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none text-black placeholder-gray-400 ${
                    errors['shipping.state']
                      ? 'border-red-300'
                      : 'border-gray-300 focus:border-black'
                  }`}
                />
                {errors['shipping.state'] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors['shipping.state']}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Zip Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  value={formData.shipping.zipCode}
                  onChange={(e) =>
                    handleInputChange('shipping', 'zipCode', e.target.value)
                  }
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none text-black placeholder-gray-400 ${
                    errors['shipping.zipCode']
                      ? 'border-red-300'
                      : 'border-gray-300 focus:border-black'
                  }`}
                />
                {errors['shipping.zipCode'] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors['shipping.zipCode']}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Country
                </label>
                <select
                  id="country"
                  value={formData.shipping.country}
                  onChange={(e) =>
                    handleInputChange('shipping', 'country', e.target.value)
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black text-black"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black font-mono">
              Billing Information
            </h2>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sameAsShipping"
                checked={formData.billing.sameAsShipping}
                onChange={(e) =>
                  handleInputChange('billing', 'sameAsShipping', e.target.checked)
                }
                className="rounded border-gray-300 text-gray-700 focus:ring-black"
              />
              <label htmlFor="sameAsShipping" className="text-sm text-black">
                Same as shipping address
              </label>
            </div>

            {!formData.billing.sameAsShipping && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.billing.firstName}
                    onChange={(e) =>
                      handleInputChange('billing', 'firstName', e.target.value)
                    }
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none text-black placeholder-gray-400 ${
                      errors['billing.firstName']
                        ? 'border-red-300'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />
                  {errors['billing.firstName'] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors['billing.firstName']}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.billing.lastName}
                    onChange={(e) =>
                      handleInputChange('billing', 'lastName', e.target.value)
                    }
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none text-black placeholder-gray-400 ${
                      errors['billing.lastName']
                        ? 'border-red-300'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />
                  {errors['billing.lastName'] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors['billing.lastName']}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={formData.billing.address}
                    onChange={(e) =>
                      handleInputChange('billing', 'address', e.target.value)
                    }
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none text-black placeholder-gray-400 ${
                      errors['billing.address']
                        ? 'border-red-300'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />
                  {errors['billing.address'] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors['billing.address']}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={formData.billing.city}
                    onChange={(e) =>
                      handleInputChange('billing', 'city', e.target.value)
                    }
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none text-black placeholder-gray-400 ${
                      errors['billing.city']
                        ? 'border-red-300'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />
                  {errors['billing.city'] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors['billing.city']}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={formData.billing.state}
                    onChange={(e) =>
                      handleInputChange('billing', 'state', e.target.value)
                    }
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none text-black placeholder-gray-400 ${
                      errors['billing.state']
                        ? 'border-red-300'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />
                  {errors['billing.state'] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors['billing.state']}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Zip Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    value={formData.billing.zipCode}
                    onChange={(e) =>
                      handleInputChange('billing', 'zipCode', e.target.value)
                    }
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none text-black placeholder-gray-400 ${
                      errors['billing.zipCode']
                        ? 'border-red-300'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />
                  {errors['billing.zipCode'] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors['billing.zipCode']}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    value={formData.billing.country}
                    onChange={(e) =>
                      handleInputChange('billing', 'country', e.target.value)
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black text-black"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black font-mono">
              Payment Information
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="cardNumber"
                    value={formData.payment.cardNumber}
                    onChange={(e) =>
                      handleInputChange(
                        'payment',
                        'cardNumber',
                        e.target.value.replace(/\D/g, '').slice(0, 16)
                      )
                    }
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none text-black placeholder-gray-400 ${
                      errors['payment.cardNumber']
                        ? 'border-red-300'
                        : 'border-gray-300 focus:border-black'
                    }`}
                    placeholder="1234 5678 9012 3456"
                  />
                  <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-700" />
                </div>
                {errors['payment.cardNumber'] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors['payment.cardNumber']}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="cardName"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Name on Card
                </label>
                <input
                  type="text"
                  id="cardName"
                  value={formData.payment.cardName}
                  onChange={(e) =>
                    handleInputChange('payment', 'cardName', e.target.value)
                  }
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none text-black placeholder-gray-400 ${
                    errors['payment.cardName']
                      ? 'border-red-300'
                      : 'border-gray-300 focus:border-black'
                  }`}
                />
                {errors['payment.cardName'] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors['payment.cardName']}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="expiryDate"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    value={formData.payment.expiryDate}
                    onChange={(e) =>
                      handleInputChange(
                        'payment',
                        'expiryDate',
                        e.target.value
                          .replace(/\D/g, '')
                          .replace(/^(\d{2})/, '$1/')
                          .slice(0, 5)
                      )
                    }
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none text-black placeholder-gray-400 ${
                      errors['payment.expiryDate']
                        ? 'border-red-300'
                        : 'border-gray-300 focus:border-black'
                    }`}
                    placeholder="MM/YY"
                  />
                  {errors['payment.expiryDate'] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors['payment.expiryDate']}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    value={formData.payment.cvv}
                    onChange={(e) =>
                      handleInputChange(
                        'payment',
                        'cvv',
                        e.target.value.replace(/\D/g, '').slice(0, 4)
                      )
                    }
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none text-black placeholder-gray-400 ${
                      errors['payment.cvv']
                        ? 'border-red-300'
                        : 'border-gray-300 focus:border-black'
                    }`}
                    placeholder="123"
                  />
                  {errors['payment.cvv'] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors['payment.cvv']}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="saveCard"
                  checked={formData.payment.saveCard}
                  onChange={(e) =>
                    handleInputChange('payment', 'saveCard', e.target.checked)
                  }
                  className="rounded border-gray-300 text-gray-700 focus:ring-black"
                />
                <label htmlFor="saveCard" className="text-sm text-black">
                  Save card for future purchases
                </label>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Lock className="h-4 w-4" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black font-mono">
              Review Order
            </h2>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-black mb-4">
                  Shipping Address
                </h3>
                <div className="text-gray-600">
                  <p>{formData.shipping.firstName} {formData.shipping.lastName}</p>
                  <p>{formData.shipping.address}</p>
                  <p>
                    {formData.shipping.city}, {formData.shipping.state}{' '}
                    {formData.shipping.zipCode}
                  </p>
                  <p>{formData.shipping.country}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-black mb-4">
                  Payment Method
                </h3>
                <div className="text-gray-600">
                  <p>Card ending in {formData.payment.cardNumber.slice(-4)}</p>
                  <p>Expires {formData.payment.expiryDate}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-black mb-4">
                  Order Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-black">
                    <span>Subtotal</span>
                    <span className="font-mono">$139.98</span>
                  </div>
                  <div className="flex justify-between text-black">
                    <span>Tax (10%)</span>
                    <span className="font-mono">$14.00</span>
                  </div>
                  <div className="flex justify-between text-black">
                    <span>Shipping</span>
                    <span className="font-mono">Free</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-black">
                      <span>Total</span>
                      <span className="font-mono">$153.98</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 rounded border-gray-300 text-gray-700 focus:ring-black"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the terms and conditions and confirm that all
                  information provided is accurate.
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      index <= currentStep
                        ? 'border-gray-600 bg-gray-600 text-white'
                        : 'border-gray-300 text-gray-600'
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      index <= currentStep
                        ? 'text-gray-900'
                        : 'text-gray-600'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      index < currentStep
                        ? 'bg-gray-600'
                        : 'bg-gray-300'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {currentStep > 0 ? (
              <button
                onClick={handleBack}
                className="inline-flex items-center px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-900 hover:border-gray-600 transition-colors duration-300"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Back
              </button>
            ) : (
              <Link
                to="/cart"
                className="inline-flex items-center px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-900 hover:border-gray-600 transition-colors duration-300"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Back to Cart
              </Link>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="inline-flex items-center px-6 py-3 border-2 border-gray-600 rounded-lg text-gray-900 hover:bg-gray-600 hover:text-white transition-colors duration-300"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="inline-flex items-center px-6 py-3 border-2 border-gray-600 rounded-lg text-gray-900 hover:bg-gray-600 hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Place Order'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;