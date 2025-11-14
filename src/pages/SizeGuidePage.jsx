import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Download,
  Printer,
  Info,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

const SizeGuidePage = () => {
  const [activeTab, setActiveTab] = useState('measurements');
  const [expandedSection, setExpandedSection] = useState(null);

  const sizeCharts = {
    tops: {
      title: 'Tops & T-Shirts',
      measurements: [
        { size: 'XS', chest: '34-36"', waist: '28-30"', hip: '34-36"' },
        { size: 'S', chest: '36-38"', waist: '30-32"', hip: '36-38"' },
        { size: 'M', chest: '38-40"', waist: '32-34"', hip: '38-40"' },
        { size: 'L', chest: '40-42"', waist: '34-36"', hip: '40-42"' },
        { size: 'XL', chest: '42-44"', waist: '36-38"', hip: '42-44"' },
      ],
    },
    bottoms: {
      title: 'Bottoms & Jeans',
      measurements: [
        { size: 'XS', waist: '28-30"', hip: '34-36"', inseam: '30"' },
        { size: 'S', waist: '30-32"', hip: '36-38"', inseam: '30"' },
        { size: 'M', waist: '32-34"', hip: '38-40"', inseam: '30"' },
        { size: 'L', waist: '34-36"', hip: '40-42"', inseam: '30"' },
        { size: 'XL', waist: '36-38"', hip: '42-44"', inseam: '30"' },
      ],
    },
  };

  const eraSizing = [
    {
      era: '70s',
      description: 'Relaxed, loose-fitting styles with a focus on comfort. Sizes tend to run slightly larger than modern standards.',
      characteristics: [
        'Wide lapels and collars',
        'Loose, flowing silhouettes',
        'Natural waistlines',
        'Fuller cuts in pants and tops',
      ],
    },
    {
      era: '80s',
      description: 'Bold, structured styles with defined shoulders. Sizes are more fitted and true to modern measurements.',
      characteristics: [
        'Strong shoulder lines',
        'Fitted waistlines',
        'Tapered legs in pants',
        'Cropped tops and jackets',
      ],
    },
    {
      era: '90s',
      description: 'Mix of oversized and fitted styles. Sizes vary between relaxed and body-conscious fits.',
      characteristics: [
        'Oversized silhouettes',
        'High-waisted bottoms',
        'Crop tops and fitted tees',
        'Baggy jeans and cargo pants',
      ],
    },
  ];

  const measuringInstructions = [
    {
      title: 'Chest',
      steps: [
        'Stand straight with arms at your sides',
        'Measure around the fullest part of your chest',
        'Keep the tape measure parallel to the floor',
      ],
    },
    {
      title: 'Waist',
      steps: [
        'Find your natural waistline (usually above your belly button)',
        'Measure around your waist while standing straight',
        'Keep the tape measure snug but not tight',
      ],
    },
    {
      title: 'Hips',
      steps: [
        'Stand with feet together',
        'Measure around the fullest part of your hips',
        'Keep the tape measure parallel to the floor',
      ],
    },
    {
      title: 'Inseam',
      steps: [
        'Stand straight with feet slightly apart',
        'Measure from the crotch to the desired length',
        'For full length, measure to the floor',
      ],
    },
  ];

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black font-mono mb-4">
            Size Guide
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Find your perfect vintage fit with our comprehensive size guide and
            measurement instructions.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-gray-200 mb-8">
          {['measurements', 'eras', 'instructions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-lg font-medium border-b-2 -mb-0.5 transition-colors duration-300 ${
                activeTab === tab
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-700 hover:text-black'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Measurements Tab */}
          {activeTab === 'measurements' && (
            <div className="space-y-8">
              {Object.entries(sizeCharts).map(([key, chart]) => (
                <div
                  key={key}
                  className="bg-white rounded-xl border-2 border-gray-200 p-8"
                >
                  <h2 className="text-2xl font-bold text-black font-mono mb-6">
                    {chart.title}
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="px-4 py-3 text-left text-black font-medium">
                            Size
                          </th>
                          {Object.keys(chart.measurements[0])
                            .filter((key) => key !== 'size')
                            .map((header) => (
                              <th
                                key={header}
                                className="px-4 py-3 text-left text-black font-medium"
                              >
                                {header.charAt(0).toUpperCase() + header.slice(1)}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {chart.measurements.map((row, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-100 last:border-0"
                          >
                            <td className="px-4 py-3 text-black font-medium">
                              {row.size}
                            </td>
                            {Object.entries(row)
                              .filter(([key]) => key !== 'size')
                              .map(([key, value]) => (
                                <td
                                  key={key}
                                  className="px-4 py-3 text-gray-700"
                                >
                                  {value}
                                </td>
                              ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Eras Tab */}
          {activeTab === 'eras' && (
            <div className="space-y-8">
              {eraSizing.map((era) => (
                <div
                  key={era.era}
                  className="bg-white rounded-xl border-2 border-gray-200 p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-black font-mono">
                      {era.era} Style Guide
                    </h2>
                    <button
                      onClick={() => toggleSection(era.era)}
                      className="p-2 text-gray-700 hover:text-black transition-colors duration-300"
                    >
                      {expandedSection === era.era ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-gray-700 mb-4">{era.description}</p>
                  {expandedSection === era.era && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4">
                        <h3 className="text-lg font-medium text-black mb-3">
                          Key Characteristics:
                        </h3>
                        <ul className="space-y-2">
                          {era.characteristics.map((char, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-gray-700"
                            >
                              <ArrowRight className="h-5 w-5 text-gray-700 mt-0.5" />
                              {char}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Instructions Tab */}
          {activeTab === 'instructions' && (
            <div className="space-y-8">
              {measuringInstructions.map((instruction) => (
                <div
                  key={instruction.title}
                  className="bg-white rounded-xl border-2 border-gray-200 p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-black font-mono">
                      How to Measure {instruction.title}
                    </h2>
                    <button
                      onClick={() => toggleSection(instruction.title)}
                      className="p-2 text-gray-700 hover:text-black transition-colors duration-300"
                    >
                      {expandedSection === instruction.title ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {expandedSection === instruction.title && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4">
                        <ul className="space-y-3">
                          {instruction.steps.map((step, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-gray-700"
                            >
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-black font-medium text-sm">
                                {index + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border-2 border-gray-300 rounded-lg text-black hover:border-black transition-colors duration-300"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Guide
          </button>
          <button className="inline-flex items-center px-4 py-2 border-2 border-gray-300 rounded-lg text-black hover:border-black transition-colors duration-300">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </button>
          <a
            href="/support/contact"
            className="inline-flex items-center px-4 py-2 border-2 border-gray-300 rounded-lg text-black hover:border-black transition-colors duration-300"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Need Help?
          </a>
        </div>

        {/* Tips */}
        <div className="mt-12 bg-white rounded-xl border-2 border-gray-200 p-8">
          <div className="flex items-start gap-4">
            <Info className="h-6 w-6 text-gray-700 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-black mb-2">
                Pro Tips
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  • Always measure yourself while wearing lightweight clothing
                </li>
                <li>
                  • For the most accurate measurements, have someone else measure
                  you
                </li>
                <li>
                  • Keep the measuring tape snug but not tight against your body
                </li>
                <li>
                  • If you're between sizes, we recommend sizing up for a more
                  comfortable fit
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuidePage;