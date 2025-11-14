import React from 'react';

const ShippingReturnsPage = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold text-black mb-6" style={{ fontFamily: 'Times New Roman, Times, serif' }}>Shipping & Returns</h1>
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-black mb-2" style={{ fontFamily: 'Times New Roman, Times, serif' }}>Shipping Policy</h2>
      <p className="text-gray-700 mb-2">We ship worldwide from our vintage warehouse. All orders are processed within 1-2 business days. Shipping times vary by location:</p>
      <ul className="list-disc list-inside text-gray-700 mb-2">
        <li>USA & Canada: 3-7 business days</li>
        <li>Europe: 5-10 business days</li>
        <li>Rest of World: 7-14 business days</li>
      </ul>
      <p className="text-gray-700">You will receive a tracking number once your order ships.</p>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-black mb-2" style={{ fontFamily: 'Times New Roman, Times, serif' }}>Return Policy</h2>
      <p className="text-gray-700 mb-2">We want you to love your vintage find! If you are not satisfied, you may return unworn items within 14 days of delivery for a full refund or exchange.</p>
      <ul className="list-disc list-inside text-gray-700 mb-2">
        <li>Items must be in original condition with tags attached.</li>
        <li>Return shipping is the responsibility of the customer unless the item is defective.</li>
      </ul>
      <p className="text-gray-700">To start a return, email us at <a href="mailto:returns@lace-legacy.com" className="text-black underline">returns@lace-legacy.com</a> with your order number.</p>
    </section>
  </div>
);

export default ShippingReturnsPage; 