import React from 'react';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-black mb-8">About Lace and Legacy</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-black mb-4">Our Story</h2>
        <p className="text-black leading-relaxed">
          Lace and Legacy is your premier destination for vintage-inspired t-shirts that capture the essence of bygone eras. 
          We believe in the power of nostalgia and the timeless appeal of classic designs.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-black mb-4">Our Mission</h2>
        <p className="text-black leading-relaxed">
          We're dedicated to bringing you high-quality, comfortable t-shirts that celebrate the iconic styles and 
          cultural moments that have shaped our collective memory. Each design is carefully crafted to ensure 
          authenticity and lasting quality.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-black mb-4">Quality Promise</h2>
        <p className="text-black leading-relaxed">
          We use premium materials and sustainable manufacturing processes to create t-shirts that not only look great 
          but also stand the test of time. Our commitment to quality ensures that each Lace and Legacy becomes a 
          cherished part of your wardrobe.
        </p>
      </section>
    </div>
  );
};

export default AboutPage; 