import React, { useState } from 'react';
import { Users, FileText, AlertTriangle, LayoutDashboard, PieChart, MessageSquare } from 'lucide-react';
import { StakeholderRegister } from './StakeholderRegister';
import { CharterBuilder } from './CharterBuilder';
import { AssumptionLog } from './AssumptionLog';
import { EmailApp } from '../email/EmailApp';
import { PerformanceReport } from '../../scenes/PerformanceReport';
import { DndContext, DragEndEvent, useDroppable, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useDispatch, useSelector } from 'react-redux';
import { identifyStakeholder, updateStakeholderPosition, assignEvidenceToSection } from '../../../features/pmisSlice';
import { PowerLevel, InterestLevel, Email, EvidenceItem } from '../../../types';
import { RootState } from '../../../store';

type Tab = 'dashboard' | 'communications' | 'stakeholders' | 'charter' | 'assumptions' | 'report';

// Mini Drop Zone Component for the Communications Tab
const StakeholderDropZone = () => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'stakeholder-register-drop-zone',
    data: { type: 'stakeholder-register' },
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-64 border-l border-gray-200 p-4 transition-colors flex flex-col items-center justify-center text-center
        ${isOver ? 'bg-purple-100 border-purple-500' : 'bg-gray-50'}
      `}
    >
      <Users size={32} className={isOver ? 'text-purple-600' : 'text-gray-400'} />
      <p className="mt-2 text-sm font-medium text-gray-600">
        {isOver ? 'Drop to Identify!' : 'Drag Emails Here to Identify Stakeholders'}
      </p>
    </div>
  );
};

export const PMISApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('communications'); // Default to Communications for flow
  const dispatch = useDispatch();
  const { stakeholders } = useSelector((state: RootState) => state.pmis);
  const { charterSubmissionCount } = useSelector((state: RootState) => state.game);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // 1. Handle Email Drop (Identifying Stakeholder)
    if (active.data.current?.type === 'email' && over.id === 'stakeholder-register-drop-zone') {
        const email = active.data.current.email as Email;
        
        // Simple logic: Check if email sender matches a stakeholder name (or part of it)
        // In a real app, this would be more robust (e.g., using IDs or metadata)
        const matchedStakeholder = stakeholders.find(s => 
            !s.isIdentified && email.sender.includes(s.name) || 
            (s.id === 'sh_sarah' && email.sender === 'Sarah Jenkins') || // specific mapping
            (s.id === 'sh_elias' && email.sender.includes('Elias'))
        );

        if (matchedStakeholder) {
            dispatch(identifyStakeholder(matchedStakeholder.id));
            // Could show a toast/notification here
            console.log(`Identified stakeholder: ${matchedStakeholder.name}`);
        }
    }

    // 2. Handle Stakeholder Analysis Drop (Grid Placement)
    if (active.data.current?.type === 'stakeholder' && over.data.current?.type === 'quadrant') {
        const stakeholderId = active.id.toString().replace('stakeholder-', '');
        const { power, interest } = over.data.current;

        dispatch(updateStakeholderPosition({
            id: stakeholderId,
            power: power as PowerLevel,
            interest: interest as InterestLevel
        }));
    }

    // 3. Handle Charter Builder Drop (Evidence -> Section)
    if (active.data.current?.type === 'evidence' && over.data.current?.type === 'charter-section') {
      const item = active.data.current.item as EvidenceItem;
      const sectionId = over.data.current.sectionId;

      dispatch(assignEvidenceToSection({
        sectionId: sectionId,
        evidenceId: item.id
      }));
    }
  };
  
  // Watch for charter submission to show report (Simplified logic)
  React.useEffect(() => {
    if (charterSubmissionCount > 0) {
        setActiveTab('report');
    }
  }, [charterSubmissionCount]);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex flex-col h-full bg-gray-100 font-sans text-gray-900">
        
        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 px-4 pt-2 flex space-x-1 shrink-0">
            <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg flex items-center space-x-2 border-t border-l border-r ${activeTab === 'dashboard' ? 'bg-gray-100 border-gray-200 text-purple-700' : 'bg-white border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
            </button>
            <button
                onClick={() => setActiveTab('communications')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg flex items-center space-x-2 border-t border-l border-r ${activeTab === 'communications' ? 'bg-gray-100 border-gray-200 text-purple-700' : 'bg-white border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <MessageSquare size={16} />
                <span>Communications</span>
            </button>
            <button
                onClick={() => setActiveTab('stakeholders')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg flex items-center space-x-2 border-t border-l border-r ${activeTab === 'stakeholders' ? 'bg-gray-100 border-gray-200 text-purple-700' : 'bg-white border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <Users size={16} />
                <span>Stakeholders</span>
            </button>
            <button 
                onClick={() => setActiveTab('charter')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg flex items-center space-x-2 border-t border-l border-r ${activeTab === 'charter' ? 'bg-gray-100 border-gray-200 text-purple-700' : 'bg-white border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <FileText size={16} />
                <span>Project Charter</span>
            </button>
            <button
                onClick={() => setActiveTab('assumptions')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg flex items-center space-x-2 border-t border-l border-r ${activeTab === 'assumptions' ? 'bg-gray-100 border-gray-200 text-purple-700' : 'bg-white border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <AlertTriangle size={16} />
                <span>Assumptions</span>
            </button>
            {charterSubmissionCount > 0 && (
                <button
                    onClick={() => setActiveTab('report')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg flex items-center space-x-2 border-t border-l border-r ${activeTab === 'report' ? 'bg-gray-100 border-gray-200 text-purple-700' : 'bg-white border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    <PieChart size={16} />
                    <span>Report</span>
                </button>
            )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
            {activeTab === 'dashboard' && (
                <div className="p-8 text-center text-gray-500">
                    <h2 className="text-xl font-semibold mb-2">Project Dashboard</h2>
                    <p>Metrics and KPIs will appear here.</p>
                </div>
            )}
            
            {activeTab === 'communications' && (
                <div className="flex h-full">
                    <div className="flex-1 border-r border-gray-200">
                        {/* We use a wrapper to override some EmailApp styles if needed,
                            but EmailApp is designed as h-full so it should fit. */}
                        <EmailApp />
                    </div>
                    {/* Persistent Drop Zone for easy drag-and-drop */}
                    <StakeholderDropZone />
                </div>
            )}

            {activeTab === 'stakeholders' && <StakeholderRegister />}
            
            {activeTab === 'charter' && <CharterBuilder />}

            {activeTab === 'assumptions' && <AssumptionLog />}
            
            {activeTab === 'report' && <PerformanceReport />}
        </div>

        </div>
    </DndContext>
  );
};