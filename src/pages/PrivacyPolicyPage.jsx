import React from 'react';

const PrivacyPolicyPage = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold text-black mb-6" style={{ fontFamily: 'Times New Roman, Times, serif' }}>Privacy Policy</h1>
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-black mb-2" style={{ fontFamily: 'Times New Roman, Times, serif' }}>What Data We Collect</h2>
      <p className="text-gray-700 mb-2">We collect information you provide when you create an account, place an order, or contact us. This may include your name, email, shipping address, and payment details.</p>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-black mb-2" style={{ fontFamily: 'Times New Roman, Times, serif' }}>How We Use Your Data</h2>
      <p className="text-gray-700 mb-2">Your data is used to process orders, provide customer support, and improve your shopping experience. We do not sell your data to third parties.</p>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-black mb-2" style={{ fontFamily: 'Times New Roman, Times, serif' }}>Your Rights</h2>
      <p className="text-gray-700">You have the right to access, update, or delete your personal information. Contact us at <a href="mailto:privacy@lace-legacy.com" className="text-black underline">privacy@lace-legacy.com</a> for any privacy-related requests.</p>
    </section>
  </div>
);

export default PrivacyPolicyPage; 