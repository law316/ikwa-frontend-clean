import React from 'react';

const CareGuidePage = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold text-black mb-6" style={{ fontFamily: 'Times New Roman, Times, serif' }}>Care Guide</h1>
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-black mb-2" style={{ fontFamily: 'Times New Roman, Times, serif' }}>Washing</h2>
      <p className="text-gray-700 mb-2">Wash your vintage tees inside out in cold water with a gentle detergent. Avoid bleach and harsh chemicals to preserve the fabric and print.</p>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-black mb-2" style={{ fontFamily: 'Times New Roman, Times, serif' }}>Drying</h2>
      <p className="text-gray-700 mb-2">Air dry your tees flat or hang them to dry. Avoid using a dryer, as heat can cause shrinkage and fading.</p>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-black mb-2" style={{ fontFamily: 'Times New Roman, Times, serif' }}>Storing</h2>
      <p className="text-gray-700">Store your vintage shirts in a cool, dry place away from direct sunlight. Fold them neatly to avoid stretching the fabric.</p>
    </section>
  </div>
);

export default CareGuidePage; 