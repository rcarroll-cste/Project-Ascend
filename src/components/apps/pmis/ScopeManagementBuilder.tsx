import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  CheckCircle2,
  Book,
  FileCheck,
  Settings,
  Users,
  GitBranch,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { RootState } from '../../../store';
import { completeObjective, completeLevel, addNotification } from '../../../features/gameSlice';
import { getLevelById } from '../../../data/levels';
import { LevelObjective } from '../../../types';

// =============================================================================
// TYPES
// =============================================================================

type WBSMethod = 'top_down' | 'bottom_up' | 'analogy' | null;
type ApprovalAuthority = 'pm_only' | 'sponsor' | 'ccb' | null;
type ChangeHandling = 'informal' | 'documented' | 'ccb_required' | null;

interface ScopeConfig {
  wbsMethod: WBSMethod;
  approvalAuthority: ApprovalAuthority;
  changeHandling: ChangeHandling;
}

// =============================================================================
// OPTION CARDS
// =============================================================================

interface OptionCardProps {
  id: string;
  title: string;
  description: string;
  isSelected: boolean;
  isCorrect: boolean;
  showFeedback: boolean;
  onSelect: () => void;
  disabled: boolean;
}

const OptionCard: React.FC<OptionCardProps> = ({
  title,
  description,
  isSelected,
  isCorrect,
  showFeedback,
  onSelect,
  disabled,
}) => {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`p-4 rounded-xl border-2 text-left transition-all ${
        isSelected
          ? showFeedback
            ? isCorrect
              ? 'border-green-500 bg-green-50'
              : 'border-red-500 bg-red-50'
            : 'border-purple-500 bg-purple-50'
          : disabled
          ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
          : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 cursor-pointer'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
            isSelected
              ? showFeedback
                ? isCorrect
                  ? 'border-green-500 bg-green-500'
                  : 'border-red-500 bg-red-500'
                : 'border-purple-500 bg-purple-500'
              : 'border-slate-300'
          }`}
        >
          {isSelected && <CheckCircle2 size={12} className="text-white" />}
        </div>
        <div>
          <p className="font-medium text-slate-800">{title}</p>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
      </div>
    </button>
  );
};

// =============================================================================
// GOLD PLATING MODAL
// =============================================================================

interface GoldPlatingModalProps {
  isOpen: boolean;
  onChoice: (accepted: boolean) => void;
}

const GoldPlatingModal: React.FC<GoldPlatingModalProps> = ({ isOpen, onChoice }) => {
  if (!isOpen) return null;

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
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-100 rounded-full">
            <Sparkles size={24} className="text-yellow-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Gold Plating Request</h3>
            <p className="text-sm text-slate-500">From: Sarah (Marketing)</p>
          </div>
        </div>
        <p className="text-slate-700 mb-4">
          "Hey! I was thinking - since we're already migrating the servers, why don't we also add
          a new analytics dashboard? The users would love it! It's just a small addition..."
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-amber-800">
            <strong>Warning:</strong> This request is outside the approved scope and has not gone
            through change control.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onChoice(false)}
            className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Reject (Use Change Control)
          </button>
          <button
            onClick={() => onChoice(true)}
            className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            Accept Addition
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-3 text-center">
          PMBOK: Gold Plating adds features without formal change control approval.
        </p>
      </motion.div>
    </motion.div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ScopeManagementBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const { currentLevelId, levelProgress } = useSelector((state: RootState) => state.game);

  const [config, setConfig] = useState<ScopeConfig>({
    wbsMethod: null,
    approvalAuthority: null,
    changeHandling: null,
  });
  const [showGoldPlatingModal, setShowGoldPlatingModal] = useState(false);
  const [goldPlatingHandled, setGoldPlatingHandled] = useState(false);
  const [goldPlatingRejected, setGoldPlatingRejected] = useState(false);

  // Get current level data
  const currentLevel = getLevelById(currentLevelId);
  const currentProgress = levelProgress[currentLevelId];

  // Get level objectives
  const objectives: LevelObjective[] = useMemo(() => {
    if (!currentLevel || currentLevelId !== 4) return [];
    return currentLevel.objectives.map(obj => ({
      ...obj,
      isCompleted: currentProgress?.objectivesCompleted[obj.id] ?? false,
    }));
  }, [currentLevel, currentLevelId, currentProgress]);

  // Correct answers
  const correctAnswers = {
    wbsMethod: 'top_down', // Top-down decomposition is standard
    approvalAuthority: 'ccb', // CCB for baseline changes
    changeHandling: 'ccb_required', // Formal CCB process
  };

  // Track objective completion
  useEffect(() => {
    if (currentLevelId !== 4 || !currentProgress) return;

    // Objective: define_wbs_method
    if (config.wbsMethod && !currentProgress.objectivesCompleted['define_wbs_method']) {
      dispatch(completeObjective({ levelId: 4, objectiveId: 'define_wbs_method' }));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'WBS Method Selected',
        message: config.wbsMethod === correctAnswers.wbsMethod
          ? 'Top-down decomposition is the standard approach.'
          : 'Consider if this is the best approach for a well-defined scope.',
        type: config.wbsMethod === correctAnswers.wbsMethod ? 'success' : 'info',
        duration: 3000,
      }));
    }

    // Objective: define_approval_process
    if (config.approvalAuthority && !currentProgress.objectivesCompleted['define_approval_process']) {
      dispatch(completeObjective({ levelId: 4, objectiveId: 'define_approval_process' }));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Approval Process Defined',
        message: config.approvalAuthority === correctAnswers.approvalAuthority
          ? 'CCB approval ensures proper change control.'
          : 'Consider who should have authority over scope baseline changes.',
        type: config.approvalAuthority === correctAnswers.approvalAuthority ? 'success' : 'info',
        duration: 3000,
      }));
    }

    // Objective: define_change_handling
    if (config.changeHandling && !currentProgress.objectivesCompleted['define_change_handling']) {
      dispatch(completeObjective({ levelId: 4, objectiveId: 'define_change_handling' }));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Change Handling Defined',
        message: config.changeHandling === correctAnswers.changeHandling
          ? 'Formal CCB process prevents unauthorized scope changes.'
          : 'Informal processes can lead to scope creep.',
        type: config.changeHandling === correctAnswers.changeHandling ? 'success' : 'warning',
        duration: 3000,
      }));
    }

    // Objective: reject_gold_plating
    if (goldPlatingRejected && !currentProgress.objectivesCompleted['reject_gold_plating']) {
      dispatch(completeObjective({ levelId: 4, objectiveId: 'reject_gold_plating' }));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Gold Plating Prevented!',
        message: 'You correctly rejected the unauthorized scope addition.',
        type: 'success',
        duration: 4000,
      }));
    }
  }, [config, goldPlatingRejected, currentLevelId, currentProgress, dispatch]);

  // Trigger gold plating after all options selected
  useEffect(() => {
    if (config.wbsMethod && config.approvalAuthority && config.changeHandling && !goldPlatingHandled) {
      setTimeout(() => setShowGoldPlatingModal(true), 1000);
    }
  }, [config, goldPlatingHandled]);

  // Handle gold plating choice
  const handleGoldPlatingChoice = (accepted: boolean) => {
    setGoldPlatingHandled(true);
    setShowGoldPlatingModal(false);

    if (!accepted) {
      setGoldPlatingRejected(true);
    } else {
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Scope Creep!',
        message: 'You accepted an unauthorized scope change. This bypasses change control.',
        type: 'error',
        duration: 5000,
      }));
    }
  };

  // Check if level can be completed
  const canComplete =
    config.wbsMethod &&
    config.approvalAuthority &&
    config.changeHandling &&
    goldPlatingHandled;

  const handleFinalize = () => {
    if (canComplete) {
      dispatch(completeLevel(4));
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar - Objectives */}
      {currentLevelId === 4 && objectives.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-72 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto shrink-0"
        >
          {/* Level Header */}
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

          {/* Objectives List */}
          <div className="space-y-2 mb-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Target size={12} />
              Objectives
            </h4>
            {objectives.map(obj => (
              <motion.div
                key={obj.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
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

          {/* Progress */}
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
                initial={{ width: 0 }}
                animate={{
                  width: `${(objectives.filter(o => o.isCompleted).length / objectives.length) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* PMBOK Tip */}
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <h5 className="text-xs font-semibold text-purple-700 mb-1">PMBOK Tip</h5>
            <p className="text-xs text-purple-600">
              The Scope Management Plan defines HOW scope will be managed. It is NOT the scope
              itself - that's the Scope Baseline.
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Scope Management Plan</h2>
              <p className="text-sm text-slate-500">
                Define how scope will be defined, validated, and controlled
              </p>
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
              Finalize Plan
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* WBS Creation Method */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GitBranch size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">WBS Creation Method</h3>
                <p className="text-sm text-slate-500">How will the Work Breakdown Structure be created?</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <OptionCard
                id="top_down"
                title="Top-Down Decomposition"
                description="Start with major deliverables and break down into smaller components."
                isSelected={config.wbsMethod === 'top_down'}
                isCorrect={true}
                showFeedback={!!currentProgress?.objectivesCompleted['define_wbs_method']}
                onSelect={() => setConfig(prev => ({ ...prev, wbsMethod: 'top_down' }))}
                disabled={!!currentProgress?.objectivesCompleted['define_wbs_method']}
              />
              <OptionCard
                id="bottom_up"
                title="Bottom-Up Estimation"
                description="Gather work packages from team and organize into structure."
                isSelected={config.wbsMethod === 'bottom_up'}
                isCorrect={false}
                showFeedback={!!currentProgress?.objectivesCompleted['define_wbs_method']}
                onSelect={() => setConfig(prev => ({ ...prev, wbsMethod: 'bottom_up' }))}
                disabled={!!currentProgress?.objectivesCompleted['define_wbs_method']}
              />
              <OptionCard
                id="analogy"
                title="Using Analogy"
                description="Copy WBS structure from a similar past project."
                isSelected={config.wbsMethod === 'analogy'}
                isCorrect={false}
                showFeedback={!!currentProgress?.objectivesCompleted['define_wbs_method']}
                onSelect={() => setConfig(prev => ({ ...prev, wbsMethod: 'analogy' }))}
                disabled={!!currentProgress?.objectivesCompleted['define_wbs_method']}
              />
            </div>
          </div>

          {/* Baseline Approval */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Baseline Approval Authority</h3>
                <p className="text-sm text-slate-500">Who has authority to approve the scope baseline?</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <OptionCard
                id="pm_only"
                title="Project Manager Only"
                description="PM has sole authority to approve the baseline."
                isSelected={config.approvalAuthority === 'pm_only'}
                isCorrect={false}
                showFeedback={!!currentProgress?.objectivesCompleted['define_approval_process']}
                onSelect={() => setConfig(prev => ({ ...prev, approvalAuthority: 'pm_only' }))}
                disabled={!!currentProgress?.objectivesCompleted['define_approval_process']}
              />
              <OptionCard
                id="sponsor"
                title="Project Sponsor"
                description="Sponsor must approve all baseline documents."
                isSelected={config.approvalAuthority === 'sponsor'}
                isCorrect={false}
                showFeedback={!!currentProgress?.objectivesCompleted['define_approval_process']}
                onSelect={() => setConfig(prev => ({ ...prev, approvalAuthority: 'sponsor' }))}
                disabled={!!currentProgress?.objectivesCompleted['define_approval_process']}
              />
              <OptionCard
                id="ccb"
                title="Change Control Board"
                description="CCB reviews and approves baseline and any changes."
                isSelected={config.approvalAuthority === 'ccb'}
                isCorrect={true}
                showFeedback={!!currentProgress?.objectivesCompleted['define_approval_process']}
                onSelect={() => setConfig(prev => ({ ...prev, approvalAuthority: 'ccb' }))}
                disabled={!!currentProgress?.objectivesCompleted['define_approval_process']}
              />
            </div>
          </div>

          {/* Change Handling */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Settings size={20} className="text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Change Handling Process</h3>
                <p className="text-sm text-slate-500">How will scope change requests be processed?</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <OptionCard
                id="informal"
                title="Informal Process"
                description="Changes handled through email and verbal approval."
                isSelected={config.changeHandling === 'informal'}
                isCorrect={false}
                showFeedback={!!currentProgress?.objectivesCompleted['define_change_handling']}
                onSelect={() => setConfig(prev => ({ ...prev, changeHandling: 'informal' }))}
                disabled={!!currentProgress?.objectivesCompleted['define_change_handling']}
              />
              <OptionCard
                id="documented"
                title="Documented Only"
                description="Changes must be documented but PM can approve."
                isSelected={config.changeHandling === 'documented'}
                isCorrect={false}
                showFeedback={!!currentProgress?.objectivesCompleted['define_change_handling']}
                onSelect={() => setConfig(prev => ({ ...prev, changeHandling: 'documented' }))}
                disabled={!!currentProgress?.objectivesCompleted['define_change_handling']}
              />
              <OptionCard
                id="ccb_required"
                title="CCB Review Required"
                description="All scope changes require formal CCB review and approval."
                isSelected={config.changeHandling === 'ccb_required'}
                isCorrect={true}
                showFeedback={!!currentProgress?.objectivesCompleted['define_change_handling']}
                onSelect={() => setConfig(prev => ({ ...prev, changeHandling: 'ccb_required' }))}
                disabled={!!currentProgress?.objectivesCompleted['define_change_handling']}
              />
            </div>
          </div>

          {/* Warning about Gold Plating */}
          {goldPlatingHandled && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border ${
                goldPlatingRejected
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {goldPlatingRejected ? (
                  <CheckCircle2 size={20} className="text-green-600" />
                ) : (
                  <AlertTriangle size={20} className="text-red-600" />
                )}
                <div>
                  <h4 className={`font-medium ${goldPlatingRejected ? 'text-green-800' : 'text-red-800'}`}>
                    {goldPlatingRejected ? 'Gold Plating Prevented' : 'Gold Plating Accepted'}
                  </h4>
                  <p className={`text-sm ${goldPlatingRejected ? 'text-green-600' : 'text-red-600'}`}>
                    {goldPlatingRejected
                      ? 'You correctly directed the request through change control.'
                      : 'Unauthorized scope was added. This may cause issues.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Gold Plating Modal */}
      <AnimatePresence>
        {showGoldPlatingModal && (
          <GoldPlatingModal isOpen={showGoldPlatingModal} onChoice={handleGoldPlatingChoice} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScopeManagementBuilder;
