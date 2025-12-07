import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  CheckCircle2,
  Book,
  FileCheck,
  MessageSquare,
  Building,
  Code,
  Shield,
  X,
  Link,
} from 'lucide-react';
import { RootState } from '../../../store';
import { completeObjective, completeLevel, addNotification } from '../../../features/gameSlice';
import { getLevelById } from '../../../data/levels';
import { LevelObjective } from '../../../types';

// =============================================================================
// TYPES
// =============================================================================

type RequirementType = 'business' | 'functional' | 'non_functional';

interface Requirement {
  id: string;
  text: string;
  type: RequirementType;
  source: string;
  isValid: boolean;
  linkedToObjective: boolean;
}

interface Interview {
  id: string;
  stakeholder: string;
  role: string;
  avatar?: string;
  questions: InterviewQuestion[];
  isCompleted: boolean;
}

interface InterviewQuestion {
  id: string;
  question: string;
  requirement: Requirement;
}

// =============================================================================
// INTERVIEW DATA
// =============================================================================

const INTERVIEWS: Interview[] = [
  {
    id: 'interview_cfo',
    stakeholder: 'CFO Diana Chen',
    role: 'Chief Financial Officer',
    questions: [
      {
        id: 'q_cfo_1',
        question: 'What are your primary business objectives for this migration?',
        requirement: {
          id: 'req_cost_reduction',
          text: 'Reduce infrastructure costs by 30% within 12 months',
          type: 'business',
          source: 'CFO Interview',
          isValid: true,
          linkedToObjective: false,
        },
      },
      {
        id: 'q_cfo_2',
        question: 'What ROI expectations do you have?',
        requirement: {
          id: 'req_roi',
          text: 'Achieve positive ROI within 18 months of go-live',
          type: 'business',
          source: 'CFO Interview',
          isValid: true,
          linkedToObjective: false,
        },
      },
    ],
    isCompleted: false,
  },
  {
    id: 'interview_user',
    stakeholder: 'End User Focus Group',
    role: 'IT Department Users',
    questions: [
      {
        id: 'q_user_1',
        question: 'What functionality do you need from the new system?',
        requirement: {
          id: 'req_access',
          text: 'Users must be able to access files within 2 seconds of request',
          type: 'functional',
          source: 'User Interview',
          isValid: true,
          linkedToObjective: false,
        },
      },
      {
        id: 'q_user_2',
        question: 'What features would make your job easier?',
        requirement: {
          id: 'req_dashboard',
          text: 'Dashboard showing real-time system status',
          type: 'functional',
          source: 'User Interview',
          isValid: true,
          linkedToObjective: false,
        },
      },
      {
        id: 'q_user_3',
        question: 'Any nice-to-have features?',
        requirement: {
          id: 'req_theme',
          text: 'Dark mode theme for the interface',
          type: 'functional',
          source: 'User Interview',
          isValid: false, // This is a "want" not a "need"
          linkedToObjective: false,
        },
      },
    ],
    isCompleted: false,
  },
  {
    id: 'interview_compliance',
    stakeholder: 'Compliance Officer',
    role: 'Data Protection Compliance',
    questions: [
      {
        id: 'q_comp_1',
        question: 'What security requirements must we meet?',
        requirement: {
          id: 'req_encryption',
          text: 'All data must be encrypted at rest and in transit (AES-256)',
          type: 'non_functional',
          source: 'Compliance Interview',
          isValid: true,
          linkedToObjective: false,
        },
      },
      {
        id: 'q_comp_2',
        question: 'What are the data retention requirements?',
        requirement: {
          id: 'req_retention',
          text: 'Financial records must be retained for 7 years minimum',
          type: 'non_functional',
          source: 'Compliance Interview',
          isValid: true,
          linkedToObjective: false,
        },
      },
      {
        id: 'q_comp_3',
        question: 'Any uptime requirements?',
        requirement: {
          id: 'req_uptime',
          text: 'System must maintain 99.9% uptime during business hours',
          type: 'non_functional',
          source: 'Compliance Interview',
          isValid: true,
          linkedToObjective: false,
        },
      },
    ],
    isCompleted: false,
  },
];

// =============================================================================
// INTERVIEW MODAL
// =============================================================================

interface InterviewModalProps {
  interview: Interview;
  currentQuestionIndex: number;
  onAnswer: () => void;
  onClose: () => void;
}

const InterviewModal: React.FC<InterviewModalProps> = ({
  interview,
  currentQuestionIndex,
  onAnswer,
  onClose: _onClose,
}) => {
  // Note: _onClose is available if needed for a close button
  const question = interview.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === interview.questions.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <MessageSquare size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{interview.stakeholder}</h3>
              <p className="text-sm text-slate-500">{interview.role}</p>
            </div>
          </div>
          <span className="text-sm text-slate-400">
            {currentQuestionIndex + 1} / {interview.questions.length}
          </span>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 mb-4">
          <p className="text-slate-700 font-medium">{question.question}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              question.requirement.type === 'business'
                ? 'bg-amber-100 text-amber-700'
                : question.requirement.type === 'functional'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-purple-100 text-purple-700'
            }`}>
              {question.requirement.type.replace('_', '-')}
            </span>
            {!question.requirement.isValid && (
              <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-medium">
                Nice-to-have
              </span>
            )}
          </div>
          <p className="text-slate-700">"{question.requirement.text}"</p>
        </div>

        <button
          onClick={onAnswer}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
        >
          {isLastQuestion ? 'Complete Interview' : 'Next Question'}
        </button>
      </motion.div>
    </motion.div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const RequirementsCollector: React.FC = () => {
  const dispatch = useDispatch();
  const { currentLevelId, levelProgress } = useSelector((state: RootState) => state.game);

  const [interviews, setInterviews] = useState<Interview[]>(INTERVIEWS);
  const [activeInterview, setActiveInterview] = useState<Interview | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [collectedRequirements, setCollectedRequirements] = useState<Requirement[]>([]);
  const [rtmBuilt, setRtmBuilt] = useState(false);
  const [invalidRejected, setInvalidRejected] = useState(false);

  // Get current level data
  const currentLevel = getLevelById(currentLevelId);
  const currentProgress = levelProgress[currentLevelId];

  // Get level objectives
  const objectives: LevelObjective[] = useMemo(() => {
    if (!currentLevel || currentLevelId !== 5) return [];
    return currentLevel.objectives.map(obj => ({
      ...obj,
      isCompleted: currentProgress?.objectivesCompleted[obj.id] ?? false,
    }));
  }, [currentLevel, currentLevelId, currentProgress]);

  // Track objective completion
  useEffect(() => {
    if (currentLevelId !== 5 || !currentProgress) return;

    // Objective: interview_cfo
    const cfoComplete = interviews.find(i => i.id === 'interview_cfo')?.isCompleted;
    if (cfoComplete && !currentProgress.objectivesCompleted['interview_cfo']) {
      dispatch(completeObjective({ levelId: 5, objectiveId: 'interview_cfo' }));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'CFO Interview Complete',
        message: 'Business requirements collected from CFO.',
        type: 'success',
        duration: 3000,
      }));
    }

    // Objective: interview_end_user
    const userComplete = interviews.find(i => i.id === 'interview_user')?.isCompleted;
    if (userComplete && !currentProgress.objectivesCompleted['interview_end_user']) {
      dispatch(completeObjective({ levelId: 5, objectiveId: 'interview_end_user' }));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'User Interview Complete',
        message: 'Functional requirements collected from end users.',
        type: 'success',
        duration: 3000,
      }));
    }

    // Objective: interview_compliance
    const complianceComplete = interviews.find(i => i.id === 'interview_compliance')?.isCompleted;
    if (complianceComplete && !currentProgress.objectivesCompleted['interview_compliance']) {
      dispatch(completeObjective({ levelId: 5, objectiveId: 'interview_compliance' }));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Compliance Interview Complete',
        message: 'Non-functional requirements collected from Compliance.',
        type: 'success',
        duration: 3000,
      }));
    }

    // Objective: build_rtm
    if (rtmBuilt && !currentProgress.objectivesCompleted['build_rtm']) {
      dispatch(completeObjective({ levelId: 5, objectiveId: 'build_rtm' }));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'RTM Built',
        message: 'Requirements Traceability Matrix created.',
        type: 'success',
        duration: 3000,
      }));
    }

    // Objective: reject_invalid_requirement
    if (invalidRejected && !currentProgress.objectivesCompleted['reject_invalid_requirement']) {
      dispatch(completeObjective({ levelId: 5, objectiveId: 'reject_invalid_requirement' }));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Nice-to-have Rejected',
        message: 'You correctly identified a requirement with no business value.',
        type: 'success',
        duration: 3000,
      }));
    }
  }, [interviews, rtmBuilt, invalidRejected, currentLevelId, currentProgress, dispatch]);

  // Handle interview answer
  const handleAnswer = () => {
    if (!activeInterview) return;

    const question = activeInterview.questions[currentQuestionIndex];
    setCollectedRequirements(prev => [...prev, question.requirement]);

    if (currentQuestionIndex < activeInterview.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Complete interview
      setInterviews(prev =>
        prev.map(i =>
          i.id === activeInterview.id ? { ...i, isCompleted: true } : i
        )
      );
      setActiveInterview(null);
      setCurrentQuestionIndex(0);
    }
  };

  // Start interview
  const startInterview = (interview: Interview) => {
    setActiveInterview(interview);
    setCurrentQuestionIndex(0);
  };

  // Reject invalid requirement
  const handleRejectRequirement = (reqId: string) => {
    const req = collectedRequirements.find(r => r.id === reqId);
    if (req && !req.isValid) {
      setInvalidRejected(true);
      setCollectedRequirements(prev => prev.filter(r => r.id !== reqId));
    }
  };

  // Build RTM
  const handleBuildRTM = () => {
    setRtmBuilt(true);
    setCollectedRequirements(prev =>
      prev.map(r => ({ ...r, linkedToObjective: true }))
    );
  };

  // Check if level can be completed
  const allInterviewsComplete = interviews.every(i => i.isCompleted);
  const canComplete = allInterviewsComplete && rtmBuilt;

  const handleFinalize = () => {
    if (canComplete) {
      dispatch(completeLevel(5));
    }
  };

  // Group requirements by type
  const businessReqs = collectedRequirements.filter(r => r.type === 'business');
  const functionalReqs = collectedRequirements.filter(r => r.type === 'functional');
  const nonFunctionalReqs = collectedRequirements.filter(r => r.type === 'non_functional');

  return (
    <div className="flex h-full">
      {/* Sidebar - Objectives */}
      {currentLevelId === 5 && objectives.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-72 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto shrink-0"
        >
          <div className="mb-4">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <Book size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Level {currentLevelId}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {currentLevel?.narrativeTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {currentLevel?.processCode} - {currentLevel?.knowledgeArea}
            </p>
          </div>

          <div className="space-y-2 mb-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Target size={12} />
              Objectives
            </h4>
            {objectives.map(obj => (
              <motion.div
                key={obj.id}
                className={`flex items-start gap-2 p-2 rounded-lg text-xs transition-colors ${
                  obj.isCompleted
                    ? 'bg-green-50 text-green-700'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {obj.isCompleted ? (
                  <CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 shrink-0 mt-0.5" />
                )}
                <span className={obj.isCompleted ? 'line-through opacity-75' : ''}>
                  {obj.description}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-500">Progress</span>
              <span className="font-semibold text-slate-700">
                {objectives.filter(o => o.isCompleted).length} / {objectives.length}
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-purple-500"
                animate={{
                  width: `${(objectives.filter(o => o.isCompleted).length / objectives.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <h5 className="text-xs font-semibold text-purple-700 mb-1">PMBOK Tip</h5>
            <p className="text-xs text-purple-600">
              Requirements must be traceable to business objectives. Use the RTM to link each
              requirement to project goals.
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Requirements Collection</h2>
              <p className="text-sm text-slate-500">Interview stakeholders and build the RTM</p>
            </div>
            <button
              onClick={handleFinalize}
              disabled={!canComplete}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                canComplete
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <FileCheck size={16} />
              Finalize Requirements
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Interviews Section */}
          <div className="mb-8">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <MessageSquare size={18} />
              Stakeholder Interviews
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {interviews.map(interview => (
                <div
                  key={interview.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    interview.isCompleted
                      ? 'border-green-300 bg-green-50'
                      : 'border-slate-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      interview.id === 'interview_cfo'
                        ? 'bg-amber-100'
                        : interview.id === 'interview_user'
                        ? 'bg-blue-100'
                        : 'bg-purple-100'
                    }`}>
                      {interview.id === 'interview_cfo' ? (
                        <Building size={20} className="text-amber-600" />
                      ) : interview.id === 'interview_user' ? (
                        <Code size={20} className="text-blue-600" />
                      ) : (
                        <Shield size={20} className="text-purple-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{interview.stakeholder}</p>
                      <p className="text-xs text-slate-500">{interview.role}</p>
                    </div>
                  </div>
                  {interview.isCompleted ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <CheckCircle2 size={16} />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => startInterview(interview)}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Start Interview
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Collected Requirements */}
          {collectedRequirements.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Target size={18} />
                  Collected Requirements ({collectedRequirements.length})
                </h3>
                {allInterviewsComplete && !rtmBuilt && (
                  <button
                    onClick={handleBuildRTM}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Link size={14} />
                    Build RTM
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Business Requirements */}
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <h4 className="font-medium text-amber-800 mb-3 flex items-center gap-2">
                    <Building size={16} />
                    Business ({businessReqs.length})
                  </h4>
                  <div className="space-y-2">
                    {businessReqs.map(req => (
                      <div key={req.id} className="p-2 bg-white rounded-lg text-sm">
                        <p className="text-slate-700">{req.text}</p>
                        {rtmBuilt && (
                          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <Link size={10} /> Linked to ROI objective
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Functional Requirements */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                    <Code size={16} />
                    Functional ({functionalReqs.length})
                  </h4>
                  <div className="space-y-2">
                    {functionalReqs.map(req => (
                      <div key={req.id} className={`p-2 rounded-lg text-sm ${
                        req.isValid ? 'bg-white' : 'bg-orange-100 border border-orange-300'
                      }`}>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-slate-700">{req.text}</p>
                          {!req.isValid && !invalidRejected && (
                            <button
                              onClick={() => handleRejectRequirement(req.id)}
                              className="p-1 text-red-500 hover:bg-red-100 rounded"
                              title="Reject - No business value"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                        {!req.isValid && (
                          <p className="text-xs text-orange-600 mt-1">⚠️ Nice-to-have, no business value</p>
                        )}
                        {rtmBuilt && req.isValid && (
                          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <Link size={10} /> Linked to user productivity
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Non-Functional Requirements */}
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-3 flex items-center gap-2">
                    <Shield size={16} />
                    Non-Functional ({nonFunctionalReqs.length})
                  </h4>
                  <div className="space-y-2">
                    {nonFunctionalReqs.map(req => (
                      <div key={req.id} className="p-2 bg-white rounded-lg text-sm">
                        <p className="text-slate-700">{req.text}</p>
                        {rtmBuilt && (
                          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <Link size={10} /> Linked to compliance
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RTM Status */}
          {rtmBuilt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-50 rounded-xl border border-green-200"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} className="text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800">Requirements Traceability Matrix Built</h4>
                  <p className="text-sm text-green-600">
                    All valid requirements are now linked to business objectives.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Interview Modal */}
      <AnimatePresence>
        {activeInterview && (
          <InterviewModal
            interview={activeInterview}
            currentQuestionIndex={currentQuestionIndex}
            onAnswer={handleAnswer}
            onClose={() => setActiveInterview(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RequirementsCollector;
