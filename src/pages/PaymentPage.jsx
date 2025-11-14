import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/cards/Card';
import Input from '../components/forms/Input';
import Button from '../components/buttons/Button';
import Spinner from '../components/loaders/Spinner';
import { CreditCard, Lock } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const PaymentPage = () => {
  const [form, setForm] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { items } = useCart();

  const subtotal = items?.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    return sum + price * qty;
  }, 0) || 0;
  const shipping = 0;
  const grandTotal = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    if (!/^\d{16}$/.test(form.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    if (!form.cardName.trim()) {
      newErrors.cardName = 'Name on card is required';
    }
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
      newErrors.expiry = 'Expiry must be MM/YY';
    }
    if (!/^\d{3,4}$/.test(form.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      navigate('/order-confirmation');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-repeat py-12" style={{ backgroundImage: "url('/laces.png')" }}>
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <Card className="w-full p-6 rounded-xl shadow-lg border-2 border-black bg-white/95 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-black font-mono">Order Summary</h2>
            <Button variant="secondary" onClick={() => navigate('/cart')}>Edit Cart</Button>
          </div>
          {items && items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id || item._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded-md border" />
                    )}
                    <div>
                      <p className="text-black font-medium">{item.name}</p>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                  <p className="text-black font-medium">${((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-black font-bold text-lg">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-700">Your cart is empty.</p>
          )}
        </Card>

        {/* Payment Form */}
        <Card className="w-full p-8 rounded-xl shadow-lg border-2 border-black bg-white/95 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-black font-mono mb-6 flex items-center gap-2">
            <CreditCard className="h-7 w-7" /> Payment
          </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Card Number"
            name="cardNumber"
            type="text"
            maxLength={16}
            value={form.cardNumber}
            onChange={handleChange}
            error={errors.cardNumber}
            placeholder="1234 5678 9012 3456"
            autoComplete="cc-number"
          />
          <Input
            label="Name on Card"
            name="cardName"
            type="text"
            value={form.cardName}
            onChange={handleChange}
            error={errors.cardName}
            placeholder="Full Name"
            autoComplete="cc-name"
          />
          <div className="flex gap-4">
            <Input
              label="Expiry (MM/YY)"
              name="expiry"
              type="text"
              maxLength={5}
              value={form.expiry}
              onChange={handleChange}
              error={errors.expiry}
              placeholder="MM/YY"
              autoComplete="cc-exp"
            />
            <Input
              label="CVV"
              name="cvv"
              type="password"
              maxLength={4}
              value={form.cvv}
              onChange={handleChange}
              error={errors.cvv}
              placeholder="123"
              autoComplete="cc-csc"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-700 mt-2">
            <Lock className="h-4 w-4" />
            <span>Your payment is secure and encrypted</span>
          </div>
          <Button type="submit" className="w-full mt-4" disabled={processing}>
            {processing ? <Spinner size="sm" color="black" /> : 'Pay Now'}
          </Button>
          <div className="mt-3">
            <Button type="button" variant="secondary" className="w-full">Pay with Paystack (coming soon)</Button>
          </div>
        </form>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;