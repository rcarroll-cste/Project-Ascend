import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Trophy, CheckCircle, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { EvidenceItem } from '../../types';

export const PerformanceReport: React.FC = () => {
  const { stakeholders, assumptionLog, charterSections } = useSelector((state: RootState) => state.pmis);
  const { items } = useSelector((state: RootState) => state.inventory);

  // --- Scoring Logic ---
  
  // 1. Stakeholder Analysis Score
  const analyzedStakeholders = stakeholders.filter(s => s.isAnalyzed);
  const stakeholderScore = Math.min(100, Math.round((analyzedStakeholders.length / stakeholders.length) * 100));

  // 2. Assumption Log Accuracy
  const correctAssumptions = assumptionLog.filter(a => a.isCorrectlyClassified);
  const assumptionScore = assumptionLog.length > 0 
    ? Math.round((correctAssumptions.length / assumptionLog.length) * 100)
    : 0;

  // 3. Charter Validation
  let charterScore = 0;
  const charterErrors: string[] = [];
  
  charterSections.forEach(section => {
    if (section.assignedItemId) {
      const item = items.find((i: EvidenceItem) => i.id === section.assignedItemId);
      if (item) {
        if (item.type === section.requiredType && !item.isDistractor) {
          charterScore += 25; // Simple weighting
        } else if (item.isDistractor) {
          charterErrors.push(`${section.label}: Used detailed artifact instead of high-level summary.`);
        } else {
            charterErrors.push(`${section.label}: Mismatched artifact type.`);
        }
      }
    } else if (!section.isLocked) {
        charterErrors.push(`${section.label}: Missing artifact.`);
    } else {
        // Locked sections count as correct/auto-filled
        charterScore += 25; 
    }
  });
  charterScore = Math.min(100, charterScore);

  // Total Confidence Score
  const totalScore = Math.round((stakeholderScore * 0.3) + (assumptionScore * 0.2) + (charterScore * 0.5));

  const isPassing = totalScore >= 75;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white p-10 overflow-y-auto">
      
      <div className="max-w-4xl mx-auto w-full">
        
        <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Performance Evaluation
            </h1>
            <p className="text-gray-400 text-lg">Project Initiation Phase Results</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Overall Score Card */}
            <div className="md:col-span-3 bg-slate-800 rounded-2xl p-8 flex items-center justify-between border border-slate-700 shadow-xl">
                <div>
                    <h2 className="text-2xl font-semibold mb-2 text-gray-200">Sponsor Confidence</h2>
                    <p className="text-gray-400">Composite score based on your actions.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className={`text-6xl font-bold ${isPassing ? 'text-green-400' : 'text-red-400'}`}>
                        {totalScore}%
                    </div>
                    {isPassing ? <Trophy size={48} className="text-yellow-500" /> : <AlertTriangle size={48} className="text-red-500" />}
                </div>
            </div>

            {/* Metric 1: Stakeholders */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-purple-300">Stakeholder Engagement</h3>
                    <span className="text-xl font-bold">{stakeholderScore}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full" style={{ width: `${stakeholderScore}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    {analyzedStakeholders.length} / {stakeholders.length} analyzed correctly.
                </p>
            </div>

            {/* Metric 2: Charter */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-blue-300">Charter Quality</h3>
                    <span className="text-xl font-bold">{charterScore}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${charterScore}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Accuracy of document selection.
                </p>
            </div>

            {/* Metric 3: Assumptions */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-yellow-300">Risk & Assumptions</h3>
                    <span className="text-xl font-bold">{assumptionScore}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-yellow-500 h-full" style={{ width: `${assumptionScore}%` }}></div>
                </div>
                 <p className="text-xs text-gray-500 mt-2">
                    Distinction between Facts and Assumptions.
                </p>
            </div>
        </div>

        {/* Detailed Feedback */}
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h3 className="text-xl font-semibold mb-6 border-b border-slate-700 pb-2">Evaluator Feedback</h3>
            
            <div className="space-y-4">
                {isPassing ? (
                    <div className="flex items-start space-x-3 text-green-300">
                        <CheckCircle className="shrink-0 mt-1" />
                        <p>Excellent work. The Project Charter is solid, and you've accurately identified the key players. Authorization is granted to proceed to Planning.</p>
                    </div>
                ) : (
                    <div className="flex items-start space-x-3 text-red-300">
                        <XCircle className="shrink-0 mt-1" />
                        <p>The Charter is insufficient for authorization. Review the errors below and revise your approach.</p>
                    </div>
                )}

                {charterErrors.length > 0 && (
                    <div className="mt-4 p-4 bg-slate-900 rounded-lg">
                        <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Charter Issues</h4>
                        <ul className="space-y-2">
                            {charterErrors.map((err, idx) => (
                                <li key={idx} className="text-sm text-red-400 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                                    {err}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="mt-8 flex justify-end">
                <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center">
                    {isPassing ? 'Proceed to Phase 2: Planning' : 'Retry Phase 1'}
                    <ArrowRight className="ml-2" size={20} />
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};