import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, BookOpen, X } from 'lucide-react';
import { HighlightFeedback } from '../../../types';
import { EDUCATIONAL_CONTENT } from '../../../data/documentTasks';

interface HighlightFeedbackModalProps {
  feedback: HighlightFeedback | null;
  taskType?: string;
  onClose: () => void;
}

const HighlightFeedbackModal: React.FC<HighlightFeedbackModalProps> = ({
  feedback,
  taskType,
  onClose,
}) => {
  if (!feedback) return null;

  const isCorrect = feedback.type === 'correct';
  const educationalContent =
    feedback.educationalContent ||
    (taskType ? EDUCATIONAL_CONTENT[taskType] : null);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-slate-700"
        >
          {/* Header */}
          <div
            className={`p-6 ${
              isCorrect
                ? 'bg-gradient-to-br from-green-600 to-emerald-700'
                : 'bg-gradient-to-br from-red-600 to-rose-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                >
                  {isCorrect ? (
                    <CheckCircle size={32} className="text-white" />
                  ) : (
                    <XCircle size={32} className="text-white" />
                  )}
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {feedback.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Main feedback message */}
            <p className="text-slate-200 mb-4">{feedback.message}</p>

            {/* Educational content for correct answers */}
            {isCorrect && educationalContent && (
              <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-2">
                  <BookOpen size={18} className="text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-1">
                      PMBOK Reference
                    </h4>
                    <p className="text-sm text-blue-200/80">
                      {educationalContent}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Encouragement for incorrect */}
            {!isCorrect && (
              <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-4 mt-4">
                <p className="text-sm text-amber-200/80">
                  💡 Take another look at the document. The correct answer
                  relates to the specific requirement mentioned in the prompt.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-900 p-4 border-t border-slate-700">
            <button
              onClick={onClose}
              className={`w-full py-3 font-semibold rounded-lg transition-colors ${
                isCorrect
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
            >
              {isCorrect ? 'Continue' : 'Try Again'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HighlightFeedbackModal;
