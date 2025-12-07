import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../../../store';
import { addAssumptionEntry } from '../../../features/pmisSlice';
import { completeObjective, addNotification } from '../../../features/gameSlice';
import { useNotification } from '../../../hooks/useNotification';
import { AlertTriangle, CheckCircle, Info, Plus, Target, Book, CheckCircle2 } from 'lucide-react';
import { DecisionModal } from '../../common/DecisionModal';
import { nanoid } from '@reduxjs/toolkit';
import { getLevelById } from '../../../data/levels';
import { LevelObjective } from '../../../types';

export const AssumptionLog: React.FC = () => {
  const dispatch = useDispatch();
  const { showNotification } = useNotification();
  const assumptionLog = useSelector((state: RootState) => state.pmis.assumptionLog);
  const { currentLevelId, levelProgress } = useSelector((state: RootState) => state.game);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatementId, setSelectedStatementId] = useState<string | null>(null);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [vendorCorrectlyClassified, setVendorCorrectlyClassified] = useState(false);

  // Get current level data
  const currentLevel = getLevelById(currentLevelId);
  const currentProgress = levelProgress[currentLevelId];

  // Get level objectives for display (Level 1 relevant)
  const objectives: LevelObjective[] = useMemo(() => {
    if (!currentLevel || currentLevelId !== 1) return [];
    // Only show the assumption log objective
    const relevantObjective = currentLevel.objectives.find(obj => obj.id === 'create_assumption_log');
    if (!relevantObjective) return [];
    return [{
      ...relevantObjective,
      isCompleted: currentProgress?.objectivesCompleted[relevantObjective.id] ?? false,
    }];
  }, [currentLevel, currentLevelId, currentProgress]);

  // Track objective completion when vendor promise is correctly classified
  useEffect(() => {
    if (currentLevelId === 1 && vendorCorrectlyClassified &&
        !currentProgress?.objectivesCompleted['create_assumption_log']) {
      dispatch(completeObjective({ levelId: 1, objectiveId: 'create_assumption_log' }));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Objective Complete',
        message: 'Vendor promise correctly classified as an Assumption!',
        type: 'success',
        duration: 4000,
      }));
    }
  }, [vendorCorrectlyClassified, currentLevelId, currentProgress, dispatch]);

  // Simulation: List of incoming statements from emails/dialogue that need classification
  // In a real app, these would come from the game state/email interactions or be unlocked
  const [pendingStatements, setPendingStatements] = useState([
    { id: 'stmt_vendor', text: "Vendor promises delivery by June 1st.", correctCategory: 'Assumption' as const, hint: "Is this verified or just a promise?" },
    { id: 'stmt_budget', text: "Budget cap is $500,000.", correctCategory: 'Fact' as const, hint: "This comes from the signed contract." },
    { id: 'stmt_legacy', text: "Legacy DB is SQL-based.", correctCategory: 'Fact' as const, hint: "IT department has confirmed this." }
  ]);

  const handleOpenModal = (stmtId: string) => {
    setSelectedStatementId(stmtId);
    setIsModalOpen(true);
  };

  const handleDecision = (category: 'Fact' | 'Assumption' | 'Risk') => {
    if (selectedStatementId) {
      const stmt = pendingStatements.find(s => s.id === selectedStatementId);
      if (stmt) {
        // Check if the category matches the correct one
        const isCorrect = category === stmt.correctCategory;

        // Notification Feedback
        if (isCorrect) {
          showNotification('Correct Classification', 'Entry logged successfully.', 'success', 2000);
          setMistakeCount(0);

          // Track vendor promise for Level 1 objective
          if (stmt.id === 'stmt_vendor' && category === 'Assumption') {
            setVendorCorrectlyClassified(true);
          }
        } else {
          showNotification('Incorrect Classification', stmt.hint || 'Review the definition.', 'error', 3000);
          const newMistakeCount = mistakeCount + 1;
          setMistakeCount(newMistakeCount);

          if (newMistakeCount >= 3) {
             showNotification(
               'Hint from Director Thorne',
               'Remember: Facts are verified. Assumptions are considered true without proof. Risks are uncertain events.',
               'info',
               8000
             );
             setMistakeCount(0);
          }
        }

        dispatch(addAssumptionEntry({
          id: nanoid(),
          content: stmt.text,
          category: category,
          isCorrectlyClassified: isCorrect
        }));

        // Remove from pending
        setPendingStatements(prev => prev.filter(s => s.id !== selectedStatementId));
      }
    }
    setIsModalOpen(false);
    setSelectedStatementId(null);
  };

  return (
    <div className="flex h-full">
      {/* Level 1 Objectives Sidebar */}
      {currentLevelId === 1 && objectives.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-64 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto shrink-0"
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
          </div>

          {/* Objective */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Target size={12} />
              Objective
            </h4>
            {objectives.map((obj) => (
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

          {/* PMBOK Definition Box */}
          <div className="mt-6 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <h5 className="text-xs font-semibold text-purple-700 mb-2">PMBOK Definitions</h5>
            <ul className="text-xs text-purple-600 space-y-2">
              <li><strong>Fact:</strong> Verified information from a reliable source.</li>
              <li><strong>Assumption:</strong> Something believed true without proof.</li>
              <li><strong>Risk:</strong> An uncertain event that may affect objectives.</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 space-y-6 overflow-hidden">
        <div className="flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Assumption Log</h2>
            <p className="text-sm text-gray-500">Track and validate project assumptions and constraints.</p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
        
        {/* Left: Pending Statements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
            <Plus size={18} className="mr-2 text-purple-600" />
            Pending Analysis
          </h3>
          {pendingStatements.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No new statements to analyze.</p>
          ) : (
            <ul className="space-y-3">
              {pendingStatements.map(stmt => (
                <li key={stmt.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center hover:bg-purple-50 transition-colors">
                  <span className="text-sm text-gray-800">{stmt.text}</span>
                  <button 
                    onClick={() => handleOpenModal(stmt.id)}
                    className="text-xs bg-white border border-gray-300 px-3 py-1 rounded shadow-sm hover:bg-purple-600 hover:text-white transition-colors"
                  >
                    Classify
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right: Logged Entries */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
            <Info size={18} className="mr-2 text-blue-600" />
            Registered Entries
          </h3>
          
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="p-2">Statement</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assumptionLog.map(entry => (
                  <tr key={entry.id}>
                    <td className="p-2 text-gray-800">{entry.content}</td>
                    <td className="p-2">
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${entry.category === 'Fact' ? 'bg-green-100 text-green-700' : ''}
                        ${entry.category === 'Assumption' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${entry.category === 'Risk' ? 'bg-red-100 text-red-700' : ''}
                      `}>
                        {entry.category}
                      </span>
                    </td>
                    <td className="p-2">
                        {/* In a real game, feedback might be delayed. Showing immediate feedback here for prototype. */}
                        {entry.isCorrectlyClassified ? (
                            <CheckCircle size={16} className="text-green-500" />
                        ) : (
                            <AlertTriangle size={16} className="text-orange-500" />
                        )}
                    </td>
                  </tr>
                ))}
                {assumptionLog.length === 0 && (
                   <tr>
                     <td colSpan={3} className="p-4 text-center text-gray-400 italic">No entries logged yet.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        </div>

        <DecisionModal
          isOpen={isModalOpen}
          title="Classify Statement"
          description="Is this statement a verified Fact, an unverified Assumption, or a Risk?"
          onConfirm={handleDecision}
          onCancel={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};