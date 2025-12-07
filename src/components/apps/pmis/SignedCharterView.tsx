import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle, UserPlus, Sparkles, Award } from 'lucide-react';
import { RootState } from '../../../store';
import { identifyStakeholder } from '../../../features/pmisSlice';
import { addNotification, completeObjective } from '../../../features/gameSlice';

// Stakeholder Hunt Targets - Names that can be identified from the charter
// These correspond to stakeholder IDs in INITIAL_STAKEHOLDERS
interface HuntTarget {
  text: string;           // The text to highlight in the charter
  stakeholderId: string;  // The stakeholder ID to identify when clicked
  role: string;           // Display role for feedback
}

const CHARTER_HUNT_TARGETS: HuntTarget[] = [
  { text: 'Director Vane', stakeholderId: 'sh_vane', role: 'Sponsor (CEO)' },
  { text: 'Project Manager', stakeholderId: 'sh_player', role: 'Project Manager (You)' },
];

// Clickable name component for the Stakeholder Hunt mechanic
interface ClickableNameProps {
  text: string;
  stakeholderId: string;
  role: string;
  isIdentified: boolean;
  onIdentify: (stakeholderId: string, name: string, role: string) => void;
}

const ClickableName: React.FC<ClickableNameProps> = ({
  text,
  stakeholderId,
  role,
  isIdentified,
  onIdentify,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!isIdentified) {
      onIdentify(stakeholderId, text, role);
    }
  };

  return (
    <motion.span
      className={`
        relative inline-flex items-center cursor-pointer transition-all
        ${isIdentified
          ? 'text-green-600 font-semibold'
          : 'text-amber-600 font-semibold hover:text-amber-700 hover:bg-amber-50 rounded px-0.5'
        }
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      whileHover={!isIdentified ? { scale: 1.02 } : {}}
      whileTap={!isIdentified ? { scale: 0.98 } : {}}
    >
      {text}
      {isIdentified ? (
        <CheckCircle size={14} className="ml-1 text-green-500" />
      ) : (
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="ml-1"
            >
              <Sparkles size={14} className="text-amber-500" />
            </motion.span>
          )}
        </AnimatePresence>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && !isIdentified && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10"
          >
            Click to identify stakeholder
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.span>
  );
};

// Helper function to render charter text with clickable names
const renderCharterText = (
  text: string,
  targets: HuntTarget[],
  identifiedStakeholders: string[],
  onIdentify: (stakeholderId: string, name: string, role: string) => void
): React.ReactNode[] => {
  const result: React.ReactNode[] = [];
  let remainingText = text;
  let keyIndex = 0;

  // Sort targets by their position in the text (to process in order)
  const sortedTargets = [...targets].sort((a, b) => {
    const posA = text.indexOf(a.text);
    const posB = text.indexOf(b.text);
    return posA - posB;
  });

  for (const target of sortedTargets) {
    const index = remainingText.indexOf(target.text);
    if (index === -1) continue;

    // Add text before the target
    if (index > 0) {
      result.push(<span key={`text-${keyIndex++}`}>{remainingText.substring(0, index)}</span>);
    }

    // Add the clickable target
    result.push(
      <ClickableName
        key={`target-${target.stakeholderId}`}
        text={target.text}
        stakeholderId={target.stakeholderId}
        role={target.role}
        isIdentified={identifiedStakeholders.includes(target.stakeholderId)}
        onIdentify={onIdentify}
      />
    );

    // Update remaining text
    remainingText = remainingText.substring(index + target.text.length);
  }

  // Add any remaining text
  if (remainingText) {
    result.push(<span key={`text-${keyIndex++}`}>{remainingText}</span>);
  }

  return result;
};

export const SignedCharterView: React.FC = () => {
  const dispatch = useDispatch();
  const { stakeholders } = useSelector((state: RootState) => state.pmis);
  const { currentLevelId } = useSelector((state: RootState) => state.game);

  // Track which stakeholders have been identified
  const identifiedStakeholderIds = stakeholders
    .filter(s => s.isIdentified)
    .map(s => s.id);

  // Count identified targets from the charter
  const charterTargetsIdentified = CHARTER_HUNT_TARGETS.filter(
    t => identifiedStakeholderIds.includes(t.stakeholderId)
  ).length;
  const allCharterTargetsFound = charterTargetsIdentified === CHARTER_HUNT_TARGETS.length;

  const handleIdentifyStakeholder = (stakeholderId: string, name: string, role: string) => {
    // Check if stakeholder exists and isn't already identified
    const stakeholder = stakeholders.find(s => s.id === stakeholderId);

    if (stakeholder && !stakeholder.isIdentified) {
      dispatch(identifyStakeholder(stakeholderId));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Stakeholder Identified!',
        message: `${name} (${role}) added to the Stakeholder Register.`,
        type: 'success',
        duration: 3000,
      }));

      // Check if this completes the charter extraction objective
      const newIdentifiedCount = charterTargetsIdentified + 1;
      if (newIdentifiedCount === CHARTER_HUNT_TARGETS.length && currentLevelId >= 2) {
        dispatch(completeObjective({ levelId: 2, objectiveId: 'charter_extraction' }));
        dispatch(addNotification({
          id: `notif_${Date.now()}_complete`,
          title: 'Charter Review Complete!',
          message: 'All key stakeholders from the charter have been identified.',
          type: 'success',
          duration: 4000,
        }));
      }
    } else if (stakeholder?.isIdentified) {
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Already Identified',
        message: `${name} is already in your Stakeholder Register.`,
        type: 'info',
        duration: 2000,
      }));
    }
  };

  // Charter document sections with their content
  const charterSections = [
    {
      title: 'Project Title',
      content: 'Server Infrastructure Migration Project',
    },
    {
      title: 'Project Sponsor',
      content: 'Director Vane, Chief Executive Officer',
    },
    {
      title: 'Project Manager',
      content: 'Project Manager (Assigned)',
    },
    {
      title: 'Project Purpose / Business Case',
      content: 'This project has been authorized to migrate the existing on-premises server infrastructure to a modern cloud-based solution. The business case demonstrates a Return on Investment of $350,000 within 12 months through reduced operational costs and improved system reliability.',
    },
    {
      title: 'Benefits Management Plan Summary',
      content: 'The primary strategic benefit is Internal Efficiency aligned with the Q4 Corporate Goal. This project focuses on operational improvements and cost reduction, not customer-facing features or revenue generation.',
    },
    {
      title: 'External Agreements',
      content: 'This project is bound by the Master Services Agreement with TechCore (TechCore_MSA.pdf). All vendor rates and regulatory compliance requirements specified in the agreement must be adhered to.',
    },
    {
      title: 'High-Level Assumptions',
      content: '• Facilities will have adequate power infrastructure ready for deployment\n• TechCore vendor resources will be available as scheduled\n• Current staff can be trained on new systems within the project timeline',
    },
    {
      title: 'Authorization',
      content: 'This Project Charter authorizes the Project Manager to proceed with project planning and execution within the approved scope and budget.',
    },
  ];

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <FileText size={24} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Signed Project Charter</h2>
            <p className="text-sm text-gray-500">Level 2: Review the charter to identify key stakeholders</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
          <UserPlus size={18} className="text-amber-600" />
          <span className="text-sm font-medium text-amber-800">
            Stakeholders Found: {charterTargetsIdentified}/{CHARTER_HUNT_TARGETS.length}
          </span>
          {allCharterTargetsFound && (
            <CheckCircle size={16} className="text-green-500 ml-1" />
          )}
        </div>
      </div>

      {/* Instruction Banner */}
      {!allCharterTargetsFound && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center gap-3 shrink-0"
        >
          <Sparkles size={20} className="text-purple-600 shrink-0" />
          <p className="text-sm text-purple-800">
            <strong>Stakeholder Hunt:</strong> Click on highlighted names in the charter to identify key project stakeholders.
            Look for roles like Sponsor and Project Manager.
          </p>
        </motion.div>
      )}

      {/* Completion Banner */}
      {allCharterTargetsFound && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 shrink-0"
        >
          <Award size={20} className="text-green-600 shrink-0" />
          <p className="text-sm text-green-800">
            <strong>Charter Review Complete!</strong> You've identified all stakeholders from the signed charter.
            Continue to identify more stakeholders from other sources.
          </p>
        </motion.div>
      )}

      {/* Charter Document */}
      <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 max-w-3xl mx-auto">
          {/* Official Header */}
          <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">
              PROJECT CHARTER
            </h1>
            <p className="text-sm text-gray-600 font-medium">Ascend Solutions Inc.</p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              <CheckCircle size={16} />
              AUTHORIZED
            </div>
          </div>

          {/* Charter Sections */}
          <div className="space-y-6">
            {charterSections.map((section, index) => (
              <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  {section.title}
                </h3>
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {renderCharterText(
                    section.content,
                    CHARTER_HUNT_TARGETS,
                    identifiedStakeholderIds,
                    handleIdentifyStakeholder
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* Signature Section */}
          <div className="mt-8 pt-6 border-t-2 border-gray-300">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-600 mb-2">Project Sponsor:</p>
                <div className="border-b-2 border-gray-400 pb-1 mb-1">
                  <p className="font-serif italic text-lg text-gray-800">
                    {renderCharterText(
                      'Director Vane',
                      CHARTER_HUNT_TARGETS,
                      identifiedStakeholderIds,
                      handleIdentifyStakeholder
                    )}
                  </p>
                </div>
                <p className="text-xs text-gray-500">Chief Executive Officer</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Assigned {renderCharterText(
                  'Project Manager',
                  CHARTER_HUNT_TARGETS,
                  identifiedStakeholderIds,
                  handleIdentifyStakeholder
                )}:</p>
                <div className="border-b-2 border-gray-400 pb-1 mb-1">
                  <p className="font-serif italic text-lg text-gray-800">
                    [Your Signature]
                  </p>
                </div>
                <p className="text-xs text-gray-500">Junior Project Manager</p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Date Authorized: {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
