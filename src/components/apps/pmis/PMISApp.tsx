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
import { addNotification } from '../../../features/gameSlice';
import { INITIAL_STAKEHOLDERS } from '../../../data/initialData';
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

// Dashboard Tab Component with Triple Constraint Bars
const DashboardTab: React.FC = () => {
  const { constraints, currentLevel, levelTitle } = useSelector((state: RootState) => state.game);
  const { stakeholders, charterSections } = useSelector((state: RootState) => state.pmis);

  // Calculate progress metrics
  const identifiedStakeholders = stakeholders.filter(s => s.isIdentified).length;
  const totalStakeholders = stakeholders.length;
  const charterProgress = charterSections.filter(s => s.assignedItemId !== null).length;
  const totalCharterSections = charterSections.length;

  const ConstraintBar: React.FC<{ label: string; value: number; color: string; icon: React.ReactNode }> = ({
    label,
    value,
    color,
    icon,
  }) => {
    const getBarColor = () => {
      if (value >= 80) return 'bg-green-500';
      if (value >= 50) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
            <span className="font-semibold text-gray-700">{label}</span>
          </div>
          <span className={`font-bold ${value >= 50 ? 'text-gray-800' : 'text-red-600'}`}>
            {value}%
          </span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getBarColor()} rounded-full transition-all duration-500`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">AscendTrack Dashboard</h1>
          <p className="text-gray-500">Level {currentLevel}: {levelTitle}</p>
        </div>

        {/* Triple Constraint Gauges */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Project Health</h2>
          <div className="grid grid-cols-2 gap-4">
            <ConstraintBar
              label="Schedule"
              value={constraints.schedule}
              color="bg-blue-100 text-blue-600"
              icon={<LayoutDashboard size={18} />}
            />
            <ConstraintBar
              label="Budget"
              value={constraints.budget}
              color="bg-green-100 text-green-600"
              icon={<FileText size={18} />}
            />
            <ConstraintBar
              label="Team Morale"
              value={constraints.morale}
              color="bg-yellow-100 text-yellow-600"
              icon={<Users size={18} />}
            />
            <ConstraintBar
              label="Scope Balance"
              value={constraints.scope}
              color="bg-purple-100 text-purple-600"
              icon={<PieChart size={18} />}
            />
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Level Progress</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Users size={20} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stakeholders Identified</p>
                  <p className="text-xl font-bold text-gray-800">
                    {identifiedStakeholders} / {totalStakeholders}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <FileText size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Charter Sections</p>
                  <p className="text-xl font-bold text-gray-800">
                    {charterProgress} / {totalCharterSections}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PMIS Evolution Message */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
          <h3 className="font-semibold text-purple-800 mb-2">📊 PMIS Evolution</h3>
          <p className="text-sm text-purple-700">
            As you progress through the game and implement Monitoring & Controlling processes,
            this dashboard will evolve to include advanced analytics like Earned Value Management (EVM)
            forecasting and predictive insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export const PMISApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('charter'); // Default to Charter for Level 1
  const dispatch = useDispatch();
  const { stakeholders } = useSelector((state: RootState) => state.pmis);
  const { currentLevel } = useSelector((state: RootState) => state.game);

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

        // Get the correct values from initial data
        const correctStakeholder = INITIAL_STAKEHOLDERS.find(s => s.id === stakeholderId);
        const isCorrectPlacement =
            correctStakeholder?.power === power &&
            correctStakeholder?.interest === interest;

        // Update position in state
        dispatch(updateStakeholderPosition({
            id: stakeholderId,
            power: power as PowerLevel,
            interest: interest as InterestLevel
        }));

        // Show feedback notification
        const stakeholderName = correctStakeholder?.name || 'Stakeholder';
        if (isCorrectPlacement) {
            dispatch(addNotification({
                id: `notif_${Date.now()}`,
                title: 'Correct Placement!',
                message: `${stakeholderName} correctly placed in the grid.`,
                type: 'success',
                duration: 3000,
            }));
        } else {
            dispatch(addNotification({
                id: `notif_${Date.now()}`,
                title: 'Stakeholder Placed',
                message: `${stakeholderName} added to grid. Review your analysis.`,
                type: 'info',
                duration: 3000,
            }));
        }

        // Check if Level 2 is complete (all required stakeholders correctly placed)
        // We need to check after state updates, so we do this in a separate effect
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
  
  // Note: Charter validation is now handled in CharterBuilder
  // The report tab is available but not auto-shown

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
            {currentLevel >= 2 && (
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
                <DashboardTab />
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