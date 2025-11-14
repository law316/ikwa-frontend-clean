import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, Info } from 'lucide-react';

const SizeGuideModal = ({ onClose }) => {
  const sizeChart = [
    { size: 'XS', chest: '34-36"', waist: '28-30"', hip: '34-36"' },
    { size: 'S', chest: '36-38"', waist: '30-32"', hip: '36-38"' },
    { size: 'M', chest: '38-40"', waist: '32-34"', hip: '38-40"' },
    { size: 'L', chest: '40-42"', waist: '34-36"', hip: '40-42"' },
    { size: 'XL', chest: '42-44"', waist: '36-38"', hip: '42-44"' },
    { size: 'XXL', chest: '44-46"', waist: '38-40"', hip: '44-46"' },
  ];

  const careInstructions = [
    'Hand wash cold or machine wash gentle cycle',
    'Use mild detergent',
    'Do not bleach',
    'Line dry in shade',
    'Iron on reverse side if needed',
    'Dry clean if necessary',
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border-2 border-amber-200 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b-2 border-amber-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-amber-900 font-mono">
                Size Guide
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-amber-600 hover:text-amber-700 transition-colors duration-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Size Chart */}
            <div>
              <h3 className="text-lg font-medium text-amber-900 mb-4 flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Measurements
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-amber-50">
                      <th className="px-4 py-2 text-left text-sm font-medium text-amber-900 border-2 border-amber-200">
                        Size
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-amber-900 border-2 border-amber-200">
                        Chest
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-amber-900 border-2 border-amber-200">
                        Waist
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-amber-900 border-2 border-amber-200">
                        Hip
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChart.map((row) => (
                      <tr key={row.size}>
                        <td className="px-4 py-2 text-sm text-amber-900 border-2 border-amber-200 font-medium">
                          {row.size}
                        </td>
                        <td className="px-4 py-2 text-sm text-amber-600 border-2 border-amber-200">
                          {row.chest}
                        </td>
                        <td className="px-4 py-2 text-sm text-amber-600 border-2 border-amber-200">
                          {row.waist}
                        </td>
                        <td className="px-4 py-2 text-sm text-amber-600 border-2 border-amber-200">
                          {row.hip}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Care Instructions */}
            <div>
              <h3 className="text-lg font-medium text-amber-900 mb-4 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Care Instructions
              </h3>
              <ul className="space-y-2">
                {careInstructions.map((instruction, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-amber-600"
                  >
                    <span className="mt-1">•</span>
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>

            {/* How to Measure */}
            <div>
              <h3 className="text-lg font-medium text-amber-900 mb-4">
                How to Measure
              </h3>
              <div className="space-y-4 text-sm text-amber-600">
                <p>
                  <strong className="text-amber-900">Chest:</strong> Measure around
                  the fullest part of your chest, keeping the tape measure
                  horizontal.
                </p>
                <p>
                  <strong className="text-amber-900">Waist:</strong> Measure around
                  your natural waistline, keeping the tape measure horizontal.
                </p>
                <p>
                  <strong className="text-amber-900">Hip:</strong> Measure around
                  the fullest part of your hips, keeping the tape measure
                  horizontal.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t-2 border-amber-200">
            <button
              onClick={onClose}
              className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-amber-600 rounded-lg text-amber-900 hover:bg-amber-600 hover:text-white transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SizeGuideModal; 