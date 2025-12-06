import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, BookOpen } from 'lucide-react';
import { ProcessInput } from '../../../types';

interface MissingDataFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  missingInputs: ProcessInput[];
  processName: string;
}

// Educational messages for missing inputs
const MISSING_INPUT_EDUCATION: Record<string, string> = {
  BusinessCase:
    'The Business Case provides the economic justification for the project. Without it, how can the Sponsor authorize spending organizational resources?',
  ProjectCharter:
    'You cannot begin detailed planning without an authorized Charter. The Charter gives you the formal authority to proceed and apply resources.',
  StakeholderRegister:
    'How can you plan communications or engagement strategies without knowing who your stakeholders are and what they need?',
  ScopeManagementPlan:
    'Without defining how scope will be managed, you risk scope creep (uncontrolled expansion) or gold plating (adding unrequested features).',
  RequirementsDoc:
    'Requirements define what the project must achieve. Without clear requirements, how can you know if the project is successful?',
  Agreement:
    'Agreements with external parties define contractual obligations. Missing these could lead to disputes or unmet expectations.',
  AssumptionLog:
    'Assumptions are factors considered true for planning. If not documented and tracked, they can become unexpected risks.',
  RiskRegister:
    'Risk identification requires understanding what could go wrong. Without inputs, you cannot properly identify and plan for risks.',
};

const MissingDataFeedback: React.FC<MissingDataFeedbackProps> = ({
  isOpen,
  onClose,
  missingInputs,
  processName,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-red-50 p-6 border-b border-red-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-800">
                      Missing Required Inputs
                    </h3>
                    <p className="text-sm text-red-600">
                      Cannot execute "{processName}"
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <p className="text-gray-600 mb-4">
                The following required inputs have not been assigned:
              </p>

              <div className="space-y-4">
                {missingInputs.map((input) => (
                  <div
                    key={input.id}
                    className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-amber-800 mb-2">
                      {input.name}
                    </h4>
                    <p className="text-sm text-amber-700 mb-3">
                      {MISSING_INPUT_EDUCATION[input.documentType] ||
                        input.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-amber-600">
                      <BookOpen size={14} />
                      <span>Type: {input.documentType}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* PMBOK Reference */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen size={16} />
                  PMBOK Reference
                </h4>
                <p className="text-sm text-blue-700">
                  Every PMBOK process has defined Inputs, Tools & Techniques,
                  and Outputs (ITTOs). Without the correct inputs, the process
                  cannot produce reliable outputs. This is a fundamental
                  principle tested on the PMP exam.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 border-t border-gray-100">
              <button
                onClick={onClose}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
              >
                Understood - Assign Missing Inputs
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MissingDataFeedback;
