import React, { useState } from 'react';
import { Users, FileText, AlertTriangle, LayoutDashboard, PieChart, FolderOpen, ScrollText, Lock } from 'lucide-react';
import { StakeholderRegister } from './StakeholderRegister';
import { CharterBuilder } from './CharterBuilder';
import { SignedCharterView } from './SignedCharterView';
import { AssumptionLog } from './AssumptionLog';
import { DocCreator } from './DocCreator';
import { ContextSidebar } from './ContextSidebar';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useDispatch, useSelector } from 'react-redux';
import { identifyStakeholder, updateStakeholderPosition, assignEvidenceToSection, assignCompletedDocumentToSection } from '../../../features/pmisSlice';
import { addNotification } from '../../../features/gameSlice';
import { INITIAL_STAKEHOLDERS } from '../../../data/initialData';
import { PowerLevel, InterestLevel, Email, EvidenceItem, CompletedBusinessDocument } from '../../../types';
import { RootState } from '../../../store';
import { getLevelById } from '../../../data/levels';

type Tab = 'dashboard' | 'stakeholders' | 'doc-creator' | 'charter' | 'signed-charter' | 'assumptions';

// Dashboard Tab Component with Triple Constraint Bars
const DashboardTab: React.FC = () => {
  const { constraints, currentLevelId } = useSelector((state: RootState) => state.game);
  const { stakeholders, charterSections } = useSelector((state: RootState) => state.pmis);
  // Use getLevelById to get level title
  const currentLevelData = getLevelById(currentLevelId);
  const levelTitle = currentLevelData?.narrativeTitle || 'Unknown';

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
          <p className="text-gray-500">Level {currentLevelId}: {levelTitle}</p>
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
  const { currentLevelId } = useSelector((state: RootState) => state.game);
  // Default to Doc Creator for Level 1 (since Charter is locked), Signed Charter for Level 2+
  const [activeTab, setActiveTab] = useState<Tab>(currentLevelId >= 2 ? 'signed-charter' : 'doc-creator');
  const dispatch = useDispatch();
  const { stakeholders, completedDocuments } = useSelector((state: RootState) => state.pmis);
  const { items: inventoryItems } = useSelector((state: RootState) => state.inventory);

  // Check if Charter Builder should be unlocked
  // Unlocks when both Business Case AND Benefits Management Plan are completed
  const hasCompletedBusinessCase = completedDocuments.some(d => d.type === 'BusinessCase');
  const hasCompletedBenefitsPlan = completedDocuments.some(d => d.type === 'BenefitsManagementPlan');
  const isCharterUnlocked = hasCompletedBusinessCase && hasCompletedBenefitsPlan;

  // Check if Assumptions tab should be unlocked
  // Unlocks when player has collected clues (evidence items that are clues)
  const hasClues = inventoryItems.some(item => item.type === 'Clue');
  const isAssumptionsUnlocked = hasClues;

  // Check if Stakeholders tab should be unlocked
  // Unlocks in Level 2 (Process 13.1: Identify Stakeholders)
  const isStakeholdersUnlocked = currentLevelId >= 2;

  // Check if Dashboard tab should be unlocked
  // Unlocks at Phase Gate Review (after Level 2 objectives are complete)
  const isDashboardUnlocked = currentLevelId >= 2;

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

        // First priority: Use explicit stakeholder ID from email if available
        if (email.triggerStakeholderId) {
            const stakeholder = stakeholders.find(s => s.id === email.triggerStakeholderId);
            if (stakeholder && !stakeholder.isIdentified) {
                dispatch(identifyStakeholder(email.triggerStakeholderId));

                // Special notification for compliance stakeholder (hidden in spam)
                if (email.triggerStakeholderId === 'sh_compliance') {
                    dispatch(addNotification({
                        id: `notif_${Date.now()}`,
                        title: 'Hidden Stakeholder Found!',
                        message: `${stakeholder.name} was lurking in your spam! Critical external stakeholder identified.`,
                        type: 'warning',
                        duration: 5000,
                    }));
                } else {
                    dispatch(addNotification({
                        id: `notif_${Date.now()}`,
                        title: 'Stakeholder Identified',
                        message: `${stakeholder.name} (${stakeholder.role}) added to the register.`,
                        type: 'success',
                        duration: 3000,
                    }));
                }
                return;
            } else if (stakeholder?.isIdentified) {
                dispatch(addNotification({
                    id: `notif_${Date.now()}`,
                    title: 'Already Identified',
                    message: `${stakeholder.name} is already in the Stakeholder Register.`,
                    type: 'info',
                    duration: 2000,
                }));
                return;
            }
        }

        // Fallback: Match by sender name pattern
        const matchedStakeholder = stakeholders.find(s =>
            !s.isIdentified && (
                email.sender.toLowerCase().includes(s.name.toLowerCase()) ||
                s.name.toLowerCase().includes(email.sender.split(' ')[0].toLowerCase())
            )
        );

        if (matchedStakeholder) {
            dispatch(identifyStakeholder(matchedStakeholder.id));
            dispatch(addNotification({
                id: `notif_${Date.now()}`,
                title: 'Stakeholder Identified',
                message: `${matchedStakeholder.name} (${matchedStakeholder.role}) added to the register.`,
                type: 'success',
                duration: 3000,
            }));
        } else {
            // No matching stakeholder found
            dispatch(addNotification({
                id: `notif_${Date.now()}`,
                title: 'No Match Found',
                message: `Could not identify a stakeholder from this email sender (${email.sender}).`,
                type: 'warning',
                duration: 3000,
            }));
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

    // 3b. Handle Charter Builder Drop (Completed Document -> Section)
    // GDD v7.1: Completed Business Case and Benefits Plan from Analysis phase
    if (active.data.current?.type === 'completed-document' && over.data.current?.type === 'charter-section') {
      const document = active.data.current.document as CompletedBusinessDocument;
      const sectionId = over.data.current.sectionId;

      // Validate document type matches section expectation
      const isValidDrop =
        (sectionId === 'sec_business_case' && document.type === 'BusinessCase') ||
        (sectionId === 'sec_benefits_plan' && document.type === 'BenefitsManagementPlan');

      if (isValidDrop) {
        dispatch(assignCompletedDocumentToSection({
          sectionId: sectionId,
          documentId: document.id
        }));
        dispatch(addNotification({
          id: `notif_${Date.now()}`,
          title: 'Document Assigned',
          message: `${document.name} added to Charter.`,
          type: 'success',
          duration: 2000,
        }));
      } else {
        dispatch(addNotification({
          id: `notif_${Date.now()}`,
          title: 'Wrong Section',
          message: `This section requires a different document type.`,
          type: 'warning',
          duration: 3000,
        }));
      }
    }

    // 4. Handle PMP Builder Drop (Item -> Zone)
    // PMPBuilder uses its own internal state - events are dispatched via custom event
    if (active.data.current?.type === 'pmp-item' && over.data.current?.type === 'pmp-zone') {
      const itemId = active.id.toString().replace('pmp-item-', '');
      const category = over.data.current.category;

      // Dispatch custom event for PMPBuilder to handle
      window.dispatchEvent(new CustomEvent('pmp-drop', {
        detail: { itemId, category }
      }));
    }

    // 5. Handle Doc Creator Drop (Clue -> Document Zone)
    // DocCreator uses custom events for validation and MentOS feedback
    if (active.data.current?.type === 'doc-clue' && over.data.current?.type === 'doc-zone') {
      const item = active.data.current.item as EvidenceItem;
      const zoneId = over.data.current.zoneId;

      // Dispatch custom event for DocCreator to handle
      window.dispatchEvent(new CustomEvent('doc-creator-drop', {
        detail: { itemId: item.id, zoneId }
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
                onClick={() => isDashboardUnlocked && setActiveTab('dashboard')}
                disabled={!isDashboardUnlocked}
                title={!isDashboardUnlocked ? 'Available after Level 1 completion' : ''}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg flex items-center space-x-2 border-t border-l border-r ${
                  !isDashboardUnlocked
                    ? 'bg-gray-50 border-transparent text-gray-400 cursor-not-allowed opacity-60'
                    : activeTab === 'dashboard'
                      ? 'bg-gray-100 border-gray-200 text-purple-700'
                      : 'bg-white border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
                {!isDashboardUnlocked ? <Lock size={14} className="text-gray-400" /> : <LayoutDashboard size={16} />}
                <span>Dashboard</span>
            </button>
            <button
                onClick={() => isStakeholdersUnlocked && setActiveTab('stakeholders')}
                disabled={!isStakeholdersUnlocked}
                title={!isStakeholdersUnlocked ? 'Available in Level 2: Identify Stakeholders' : ''}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg flex items-center space-x-2 border-t border-l border-r ${
                  !isStakeholdersUnlocked
                    ? 'bg-gray-50 border-transparent text-gray-400 cursor-not-allowed opacity-60'
                    : activeTab === 'stakeholders'
                      ? 'bg-gray-100 border-gray-200 text-purple-700'
                      : 'bg-white border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
                {!isStakeholdersUnlocked ? <Lock size={14} className="text-gray-400" /> : <Users size={16} />}
                <span>Stakeholders</span>
            </button>
            <button
                onClick={() => setActiveTab('doc-creator')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg flex items-center space-x-2 border-t border-l border-r ${activeTab === 'doc-creator' ? 'bg-gray-100 border-gray-200 text-purple-700' : 'bg-white border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <FolderOpen size={16} />
                <span>Doc Creator</span>
            </button>
            <button
                onClick={() => isCharterUnlocked && setActiveTab('charter')}
                disabled={!isCharterUnlocked}
                title={!isCharterUnlocked ? 'Complete Business Case and Benefits Plan in Doc Creator first' : ''}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg flex items-center space-x-2 border-t border-l border-r ${
                  !isCharterUnlocked
                    ? 'bg-gray-50 border-transparent text-gray-400 cursor-not-allowed opacity-60'
                    : activeTab === 'charter'
                      ? 'bg-gray-100 border-gray-200 text-purple-700'
                      : 'bg-white border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
                {!isCharterUnlocked ? <Lock size={14} className="text-gray-400" /> : <FileText size={16} />}
                <span>Charter Builder</span>
            </button>
            {/* Signed Charter tab - appears for Level 2+ (after charter is signed) */}
            {currentLevelId >= 2 && (
                <button
                    onClick={() => setActiveTab('signed-charter')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg flex items-center space-x-2 border-t border-l border-r ${activeTab === 'signed-charter' ? 'bg-gray-100 border-gray-200 text-purple-700' : 'bg-white border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    <ScrollText size={16} />
                    <span>Signed Charter</span>
                </button>
            )}
            <button
                onClick={() => isAssumptionsUnlocked && setActiveTab('assumptions')}
                disabled={!isAssumptionsUnlocked}
                title={!isAssumptionsUnlocked ? 'Collect clues from Chatter conversations first' : ''}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg flex items-center space-x-2 border-t border-l border-r ${
                  !isAssumptionsUnlocked
                    ? 'bg-gray-50 border-transparent text-gray-400 cursor-not-allowed opacity-60'
                    : activeTab === 'assumptions'
                      ? 'bg-gray-100 border-gray-200 text-purple-700'
                      : 'bg-white border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
                {!isAssumptionsUnlocked ? <Lock size={14} className="text-gray-400" /> : <AlertTriangle size={16} />}
                <span>Assumptions</span>
            </button>
            {/* PMP and Report tabs removed for Demo scope (Levels 0-2 only) */}
        </div>

        {/* Content Area - Sidebar + Main Content */}
        <div className="flex-1 overflow-hidden flex">
            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden">
                {activeTab === 'dashboard' && (
                    <DashboardTab />
                )}

                {activeTab === 'stakeholders' && <StakeholderRegister />}

                {activeTab === 'doc-creator' && <DocCreator />}

                {activeTab === 'charter' && <CharterBuilder />}

                {activeTab === 'signed-charter' && <SignedCharterView />}

                {activeTab === 'assumptions' && <AssumptionLog />}
            </div>

            {/* Global Context Sidebar - Available across all tabs */}
            <ContextSidebar />
        </div>

        </div>
    </DndContext>
  );
};