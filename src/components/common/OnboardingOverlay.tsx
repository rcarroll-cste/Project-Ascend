import React from 'react';
import { useDispatch } from 'react-redux';
import { completeOnboarding } from '../../features/gameSlice';
import { Power, Mail, LayoutDashboard, FileText } from 'lucide-react';

export const OnboardingOverlay: React.FC = () => {
  const dispatch = useDispatch();

  const handleBegin = () => {
    dispatch(completeOnboarding());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-500">
      <div className="bg-slate-900 border-2 border-blue-500 rounded-lg shadow-[0_0_50px_rgba(59,130,246,0.3)] max-w-2xl w-full relative overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-800 p-6 border-b border-slate-700 flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-full shadow-lg">
            <Power size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">SYSTEM ONBOARDING</h1>
            <p className="text-blue-300 text-sm font-mono uppercase tracking-wider">Aethelgard HR Module v1.2</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Welcome, Intern.</h2>
            <p className="text-slate-300 leading-relaxed">
              Your probationary period begins now. You have been assigned to <strong className="text-white">Project Genesis</strong>. 
              The previous Project Manager left abruptly, and the project is in chaos.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Your objective is to bring order to this chaos and formally initiate the project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 p-4 rounded border border-slate-700 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-2 text-blue-400">
                <Mail size={20} />
                <span className="font-bold text-sm uppercase">Step 1</span>
              </div>
              <p className="text-slate-400 text-sm">Check your <strong>Email</strong> for instructions from Director Thorne.</p>
            </div>

            <div className="bg-slate-800/50 p-4 rounded border border-slate-700 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-2 text-purple-400">
                <LayoutDashboard size={20} />
                <span className="font-bold text-sm uppercase">Step 2</span>
              </div>
              <p className="text-slate-400 text-sm">Use intel to unlock the <strong>PMIS</strong> (Project Management System).</p>
            </div>

            <div className="bg-slate-800/50 p-4 rounded border border-slate-700 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-2 text-green-400">
                <FileText size={20} />
                <span className="font-bold text-sm uppercase">Step 3</span>
              </div>
              <p className="text-slate-400 text-sm">Draft the <strong>Project Charter</strong> using evidence found in files.</p>
            </div>
          </div>

          <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4">
            <p className="text-blue-200 text-sm italic">
              "Efficiency is the currency of Aethelgard. Do not waste it."
            </p>
          </div>

        </div>

        {/* Footer / Actions */}
        <div className="p-6 bg-slate-800/50 border-t border-slate-700 flex justify-end">
          <button 
            onClick={handleBegin}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded font-bold uppercase tracking-wide shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Begin Assignment
          </button>
        </div>

      </div>
    </div>
  );
};