import React from 'react';

const CareersPage = () => {
  const jobOpenings = [
    {
      id: 1,
      title: "Graphic Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time"
    },
    {
      id: 2,
      title: "Customer Service Representative",
      department: "Customer Support",
      location: "Remote",
      type: "Full-time"
    },
    {
      id: 3,
      title: "Social Media Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-black mb-8">Join Our Team</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-black mb-4">Why Work With Us?</h2>
        <p className="text-black leading-relaxed mb-6">
          At Lace and Legacy, we're passionate about creating high-quality vintage-inspired clothing while 
          maintaining a positive and inclusive work environment. We value creativity, innovation, and 
          a strong work ethic.
        </p>
        <ul className="list-disc list-inside text-black space-y-2">
          <li>Competitive compensation and benefits</li>
          <li>Remote work opportunities</li>
          <li>Professional development support</li>
          <li>Collaborative and inclusive culture</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Current Openings</h2>
        <div className="space-y-4">
          {jobOpenings.map(job => (
            <div key={job.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>{job.department}</span>
                <span>•</span>
                <span>{job.location}</span>
                <span>•</span>
                <span>{job.type}</span>
              </div>
              <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CareersPage; 