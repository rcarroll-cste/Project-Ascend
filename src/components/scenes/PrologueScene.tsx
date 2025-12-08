import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  FileText,
  Trash2,
  Archive,
  AlertTriangle,
  ChevronRight,
  CheckCircle,
  Lock,
  Unlock,
} from 'lucide-react';
import { RootState } from '../../store';
import {
  setGameStage,
  completeObjective,
  unlockApp,
  startLevel,
} from '../../features/gameSlice';

interface DesktopFile {
  id: string;
  name: string;
  type: 'folder' | 'document' | 'locked';
  icon: 'folder' | 'document' | 'personal' | 'locked';
  isPersonal?: boolean;
  isArchived?: boolean;
  containsViolation?: boolean;
}

const INITIAL_FILES: DesktopFile[] = [
  {
    id: 'folder_personal',
    name: 'Personal Photos',
    type: 'folder',
    icon: 'personal',
    isPersonal: true,
  },
  {
    id: 'folder_vacation',
    name: 'Vacation Plans 2024',
    type: 'folder',
    icon: 'personal',
    isPersonal: true,
  },
  {
    id: 'doc_shopping',
    name: 'Shopping_List.txt',
    type: 'document',
    icon: 'document',
    isPersonal: true,
  },
  {
    id: 'doc_audit',
    name: 'Audit_Report_Termination.pdf',
    type: 'document',
    icon: 'document',
    containsViolation: true,
  },
  {
    id: 'folder_titan',
    name: 'Project_Titan_Drafts',
    type: 'locked',
    icon: 'locked',
  },
  {
    id: 'folder_templates',
    name: 'PM_Templates',
    type: 'folder',
    icon: 'folder',
  },
];

export const PrologueScene: React.FC = () => {
  const dispatch = useDispatch();
  const { levelProgress, currentLevelId } = useSelector(
    (state: RootState) => state.game
  );

  const [files, setFiles] = useState<DesktopFile[]>(INITIAL_FILES);
  const [selectedFile, setSelectedFile] = useState<DesktopFile | null>(null);
  const [isViewingDocument, setIsViewingDocument] = useState(false);
  const [highlightedViolation, setHighlightedViolation] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const currentProgress = levelProgress[0] || {
    objectivesCompleted: {},
    isCompleted: false,
  };

  const personalFilesArchived =
    currentProgress.objectivesCompleted['archive_personal_files'];
  const violationFound = currentProgress.objectivesCompleted['find_violation'];
  const titanUnlocked =
    currentProgress.objectivesCompleted['unlock_project_files'];
  const cleanupComplete =
    currentProgress.objectivesCompleted['complete_cleanup'];

  // Check if all objectives are complete
  useEffect(() => {
    if (
      personalFilesArchived &&
      violationFound &&
      titanUnlocked &&
      !cleanupComplete
    ) {
      dispatch(completeObjective({ levelId: 0, objectiveId: 'complete_cleanup' }));
      setTimeout(() => setShowCompletionModal(true), 500);
    }
  }, [personalFilesArchived, violationFound, titanUnlocked, cleanupComplete, dispatch]);

  // Start level when component mounts
  useEffect(() => {
    if (currentLevelId === 0 && !currentProgress.isStarted) {
      dispatch(startLevel(0));
    }
  }, [currentLevelId, currentProgress.isStarted, dispatch]);

  const handleArchivePersonal = () => {
    const updatedFiles = files.filter((f) => !f.isPersonal);
    setFiles(updatedFiles);
    dispatch(
      completeObjective({ levelId: 0, objectiveId: 'archive_personal_files' })
    );
  };

  const handleOpenDocument = (file: DesktopFile) => {
    if (file.type === 'locked') {
      // Can't open locked files until violation is found
      return;
    }
    setSelectedFile(file);
    if (file.containsViolation) {
      setIsViewingDocument(true);
    }
  };

  const handleHighlightViolation = () => {
    setHighlightedViolation(true);
    dispatch(completeObjective({ levelId: 0, objectiveId: 'find_violation' }));

    // Unlock titan folder
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === 'folder_titan' ? { ...f, type: 'folder', icon: 'folder' } : f
        )
      );
      dispatch(
        completeObjective({ levelId: 0, objectiveId: 'unlock_project_files' })
      );
    }, 1500);
  };

  const handleProceedToLevel1 = () => {
    // Unlock apps for level 1
    dispatch(unlockApp('chatter'));
    dispatch(unlockApp('wikibok'));
    dispatch(unlockApp('pmis'));
    dispatch(unlockApp('email'));

    // Move to playing state
    dispatch(setGameStage('Playing'));
  };

  const renderIntroModal = () => (
    <AnimatePresence>
      {showIntroModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="max-w-lg w-full bg-slate-900 rounded-xl border border-slate-700 shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="text-amber-400" size={24} />
                Day Zero: The Clean Up
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-slate-300">
                Welcome to your first day at Ascend Solutions. The previous
                Project Manager was terminated, and you've inherited their
                workstation.
              </p>
              <p className="text-slate-400 text-sm">
                Before you can access the real project files, IT needs you to:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs">
                    1
                  </div>
                  Archive the previous PM's personal files
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs">
                    2
                  </div>
                  Review the termination audit report
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs">
                    3
                  </div>
                  Identify what policy violation occurred
                </li>
              </ul>

              <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mt-4">
                <p className="text-purple-300 text-sm">
                  <strong>Learning Objective:</strong> Understand the
                  professional responsibilities of a Project Manager and the
                  consequences of unauthorized scope changes.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 border-t border-slate-700">
              <button
                onClick={() => setShowIntroModal(false)}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Begin Cleanup
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderCompletionModal = () => (
    <AnimatePresence>
      {showCompletionModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="max-w-lg w-full bg-slate-900 rounded-xl border border-green-500/50 shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle className="text-green-400" size={24} />
                Prologue Complete!
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-slate-300">
                Excellent work! You've successfully cleaned up the workstation
                and identified the critical policy violation.
              </p>

              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h3 className="text-amber-400 font-semibold mb-2">
                  Key Takeaway
                </h3>
                <p className="text-slate-300 text-sm">
                  The previous PM was terminated for{' '}
                  <strong className="text-red-400">
                    authorizing scope changes without a formal Change Request
                  </strong>
                  . This is known as "Gold Plating" - adding features beyond
                  what was agreed upon. All changes must go through the
                  Integrated Change Control process.
                </p>
              </div>

              <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-300 text-sm">
                  <strong>PMBOK Reference:</strong> Perform Integrated Change
                  Control (4.6) - All change requests must be formally
                  documented and processed through the change control board.
                </p>
              </div>

              <p className="text-slate-400 text-sm">
                Director Vane has just assigned you to take over the Server
                Migration Project. Your first task: Develop the Project Charter.
              </p>
            </div>

            <div className="p-4 bg-slate-800/50 border-t border-slate-700">
              <button
                onClick={handleProceedToLevel1}
                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Level 1: The Authorization
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderDocumentViewer = () => (
    <AnimatePresence>
      {isViewingDocument && selectedFile?.containsViolation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="max-w-2xl w-full max-h-[80vh] bg-slate-900 rounded-xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-white font-medium flex items-center gap-2">
                <FileText size={18} className="text-slate-400" />
                {selectedFile.name}
              </h3>
              <button
                onClick={() => setIsViewingDocument(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-sm">
              <h2 className="text-lg font-bold text-slate-200">
                INTERNAL AUDIT REPORT
              </h2>
              <p className="text-slate-400">
                Subject: Termination of Employment - Project Titan PM
              </p>
              <p className="text-slate-400">Date: [REDACTED]</p>
              <p className="text-slate-400">Classification: CONFIDENTIAL</p>

              <h3 className="text-md font-bold text-slate-300 mt-4">
                Summary of Findings
              </h3>
              <p className="text-slate-400">
                The following issues were identified during the compliance audit
                of Project Titan:
              </p>

              <div
                className="p-3 rounded-lg bg-slate-800/50 border border-slate-600 cursor-pointer hover:bg-slate-800 transition-colors"
                title="Click to select"
              >
                <p className="text-slate-300">
                  Issue 1: The project exceeded its timeline by 3 months due to
                  resource constraints.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-600 cursor-pointer hover:bg-slate-800 transition-colors">
                <p className="text-slate-300">
                  Issue 2: Budget overrun of $50,000 on hardware procurement.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-600 cursor-pointer hover:bg-slate-800 transition-colors">
                <p className="text-slate-300">
                  Issue 3: Team conflict between Development and QA leads.
                </p>
              </div>

              <h3 className="text-md font-bold text-red-400 mt-4">
                Critical Policy Violation
              </h3>

              <motion.div
                onClick={handleHighlightViolation}
                whileHover={{ scale: highlightedViolation ? 1 : 1.02 }}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                  highlightedViolation
                    ? 'bg-green-500/20 border-2 border-green-500'
                    : 'bg-red-900/30 border-2 border-red-500/50 hover:border-red-500'
                }`}
              >
                <p
                  className={`${
                    highlightedViolation ? 'text-green-300' : 'text-red-300'
                  } font-medium`}
                >
                  Authorized unapproved scope changes directly from the client
                  without a Change Request.
                </p>
                {highlightedViolation && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 text-sm mt-2 flex items-center gap-2"
                  >
                    <CheckCircle size={16} />
                    Correct! This is the policy violation.
                  </motion.p>
                )}
                {!highlightedViolation && (
                  <p className="text-red-400/70 text-xs mt-1">
                    (Click to identify this as the violation)
                  </p>
                )}
              </motion.div>

              <p className="text-slate-400">
                This action bypassed the Integrated Change Control process and
                violated company policy Section 4.6.
              </p>

              <h3 className="text-md font-bold text-slate-300 mt-4">
                Recommendation
              </h3>
              <p className="text-slate-400">
                Immediate termination. All future PMs must follow established
                change management procedures.
              </p>

              <p className="text-slate-600 mt-4">
                ────────────────────────
              </p>
              <p className="text-slate-500">Signed: Internal Audit Committee</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderTaskProgress = () => (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-xl px-6 py-3 shadow-xl"
      >
        <div className="flex items-center gap-6">
          <div
            className={`flex items-center gap-2 ${
              personalFilesArchived ? 'text-green-400' : 'text-slate-400'
            }`}
          >
            {personalFilesArchived ? (
              <CheckCircle size={16} />
            ) : (
              <Archive size={16} />
            )}
            <span className="text-sm">Archive Personal</span>
          </div>
          <ChevronRight size={14} className="text-slate-600" />
          <div
            className={`flex items-center gap-2 ${
              violationFound ? 'text-green-400' : 'text-slate-400'
            }`}
          >
            {violationFound ? (
              <CheckCircle size={16} />
            ) : (
              <FileText size={16} />
            )}
            <span className="text-sm">Find Violation</span>
          </div>
          <ChevronRight size={14} className="text-slate-600" />
          <div
            className={`flex items-center gap-2 ${
              titanUnlocked ? 'text-green-400' : 'text-slate-400'
            }`}
          >
            {titanUnlocked ? <Unlock size={16} /> : <Lock size={16} />}
            <span className="text-sm">Unlock Files</span>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderDesktop = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-8 pt-20">
      {/* File Grid */}
      <div className="grid grid-cols-6 gap-6">
        {files.map((file) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleOpenDocument(file)}
            className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-colors ${
              file.isPersonal
                ? 'bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30'
                : file.type === 'locked'
                ? 'bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 opacity-60'
                : 'bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50'
            }`}
          >
            {file.icon === 'folder' && (
              <Folder size={48} className="text-blue-400 mb-2" />
            )}
            {file.icon === 'personal' && (
              <Folder size={48} className="text-amber-400 mb-2" />
            )}
            {file.icon === 'document' && (
              <FileText
                size={48}
                className={`mb-2 ${
                  file.containsViolation ? 'text-red-400' : 'text-slate-400'
                }`}
              />
            )}
            {file.icon === 'locked' && (
              <Lock size={48} className="text-slate-500 mb-2" />
            )}
            <span className="text-sm text-center text-slate-300 line-clamp-2">
              {file.name}
            </span>
            {file.isPersonal && (
              <span className="text-xs text-amber-400 mt-1">Personal</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Archive Button */}
      {!personalFilesArchived && files.some((f) => f.isPersonal) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8"
        >
          <button
            onClick={handleArchivePersonal}
            className="flex items-center gap-3 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-lg transition-colors"
          >
            <Trash2 size={20} />
            Archive Personal Files
          </button>
        </motion.div>
      )}

      {/* Hint for audit report */}
      {personalFilesArchived && !violationFound && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-xl px-6 py-3 shadow-xl">
            <p className="text-slate-300 text-sm flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-400" />
              Click on the Audit Report to review the termination details
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <>
      {renderTaskProgress()}
      {renderDesktop()}
      {renderIntroModal()}
      {renderDocumentViewer()}
      {renderCompletionModal()}
    </>
  );
};

export default PrologueScene;
