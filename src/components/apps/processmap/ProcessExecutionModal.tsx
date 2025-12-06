import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, FileOutput, X, Sparkles } from 'lucide-react';
import { ProcessCard, GeneratedDocument } from '../../../types';

interface ProcessExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  process: ProcessCard | null;
  outputDocument: GeneratedDocument | null;
  quality: number;
}

const ProcessExecutionModal: React.FC<ProcessExecutionModalProps> = ({
  isOpen,
  onClose,
  process,
  outputDocument,
  quality,
}) => {
  const isHighQuality = quality >= 80;
  const isAcceptable = quality >= 50;

  return (
    <AnimatePresence>
      {isOpen && process && outputDocument && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden"
          >
            {/* Header with animation */}
            <div
              className={`p-8 text-center ${
                isHighQuality
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                  : isAcceptable
                  ? 'bg-gradient-to-br from-yellow-400 to-amber-500'
                  : 'bg-gradient-to-br from-red-400 to-rose-500'
              }`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                {isHighQuality ? (
                  <div className="relative inline-block">
                    <CheckCircle size={64} className="text-white" />
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="absolute -top-2 -right-2"
                    >
                      <Sparkles size={24} className="text-yellow-200" />
                    </motion.div>
                  </div>
                ) : isAcceptable ? (
                  <CheckCircle size={64} className="text-white" />
                ) : (
                  <AlertTriangle size={64} className="text-white" />
                )}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white mt-4"
              >
                {isHighQuality
                  ? 'Excellent Work!'
                  : isAcceptable
                  ? 'Process Complete'
                  : 'Warning: Low Quality'}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 mt-2"
              >
                {process.name}
              </motion.p>

              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Output Document */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <FileOutput size={24} className="text-purple-500" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {outputDocument.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Added to Generated Documents
                    </p>
                  </div>
                </div>
              </div>

              {/* Quality Score */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Document Quality</span>
                  <span
                    className={`font-bold ${
                      isHighQuality
                        ? 'text-green-600'
                        : isAcceptable
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {quality}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${quality}%` }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className={`h-full rounded-full ${
                      isHighQuality
                        ? 'bg-green-500'
                        : isAcceptable
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>

              {/* Quality Warning */}
              {!isAcceptable && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={18} className="text-red-500 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-red-800">
                        Quality Warning
                      </h5>
                      <p className="text-sm text-red-700">
                        This low-quality document may cause problems in later
                        project phases. Consider re-running the process with
                        better inputs.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isHighQuality && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-green-700">
                    🎉 High-quality inputs produced an excellent output. This
                    document will serve as a strong foundation for future
                    processes.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 border-t border-gray-100">
              <button
                onClick={onClose}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProcessExecutionModal;
