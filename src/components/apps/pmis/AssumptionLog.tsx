import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { addAssumptionEntry } from '../../../features/pmisSlice';
import { useNotification } from '../../../hooks/useNotification';
import { AlertTriangle, CheckCircle, Info, Plus } from 'lucide-react';
import { DecisionModal } from '../../common/DecisionModal';
import { nanoid } from '@reduxjs/toolkit';

export const AssumptionLog: React.FC = () => {
  const dispatch = useDispatch();
  const { showNotification } = useNotification();
  const assumptionLog = useSelector((state: RootState) => state.pmis.assumptionLog);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatementId, setSelectedStatementId] = useState<string | null>(null);
  const [mistakeCount, setMistakeCount] = useState(0);

  // Simulation: List of incoming statements from emails/dialogue that need classification
  // In a real app, these would come from the game state/email interactions or be unlocked
  const [pendingStatements, setPendingStatements] = useState([
    { id: 'stmt_vendor', text: "Vendor promises delivery by June 1st." },
    { id: 'stmt_budget', text: "Budget cap is $500,000." },
    { id: 'stmt_legacy', text: "Legacy DB is SQL-based." }
  ]);

  const handleOpenModal = (stmtId: string) => {
    setSelectedStatementId(stmtId);
    setIsModalOpen(true);
  };

  const handleDecision = (category: 'Fact' | 'Assumption' | 'Risk') => {
    if (selectedStatementId) {
      const stmt = pendingStatements.find(s => s.id === selectedStatementId);
      if (stmt) {
        // Simple logic check (Hardcoded for prototype)
        // In real app, check against a data map
        let isCorrect = false;
        if (stmt.id === 'stmt_vendor' && category === 'Assumption') isCorrect = true;
        if (stmt.id === 'stmt_budget' && category === 'Fact') isCorrect = true;
        if (stmt.id === 'stmt_legacy' && category === 'Risk') isCorrect = false; // Maybe it's a fact?

        // Notification Feedback
        if (isCorrect) {
          showNotification('Correct Classification', 'Entry logged successfully.', 'success', 2000);
          setMistakeCount(0);
        } else {
          showNotification('Incorrect Classification', 'Review the definition.', 'error', 2000);
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
    <div className="flex flex-col h-full p-6 space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Assumption Log</h2>
          <p className="text-sm text-gray-500">Track and validate project assumptions and constraints.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
        
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
  );
};