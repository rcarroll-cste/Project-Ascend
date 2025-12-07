import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MessageCircle,
  LayoutDashboard,
  Folder,
  BookOpen,
  GitBranch,
  Mail,
  GraduationCap,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../../store';
import { openWindow, minimizeWindow, focusWindow } from '../../features/osSlice';
import { WindowState, AppId } from '../../types';

interface DockApp {
  id: AppId;
  windowId: string;
  title: string;
  windowType: WindowState['type'];
  icon: React.ReactNode;
  color: string;
}

const DOCK_APPS: DockApp[] = [
  {
    id: 'chatter',
    windowId: 'chatter',
    title: 'Chatter',
    windowType: 'Chatter',
    icon: <MessageCircle size={28} />,
    color: 'from-green-400 to-green-600',
  },
  {
    id: 'email',
    windowId: 'email',
    title: 'Mailbox',
    windowType: 'Email',
    icon: <Mail size={28} />,
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'pmis',
    windowId: 'pmis',
    title: 'PMIS',
    windowType: 'PMIS',
    icon: <LayoutDashboard size={28} />,
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 'processmap',
    windowId: 'processmap',
    title: 'ProcessMap',
    windowType: 'ProcessMap',
    icon: <GitBranch size={28} />,
    color: 'from-orange-400 to-orange-600',
  },
  {
    id: 'files',
    windowId: 'files',
    title: 'Files',
    windowType: 'Files',
    icon: <Folder size={28} />,
    color: 'from-cyan-400 to-cyan-600',
  },
  {
    id: 'wikibok',
    windowId: 'wikibok',
    title: 'WikiBOK',
    windowType: 'WikiBOK',
    icon: <BookOpen size={28} />,
    color: 'from-amber-400 to-amber-600',
  },
  {
    id: 'examsim',
    windowId: 'examsim',
    title: 'ExamSim',
    windowType: 'PMIS', // Uses PMIS window type for now
    icon: <GraduationCap size={28} />,
    color: 'from-rose-400 to-rose-600',
  },
];

export const Dock: React.FC = () => {
  const dispatch = useDispatch();
  const { windows, activeWindowId } = useSelector((state: RootState) => state.os);
  const { unlockedApps } = useSelector((state: RootState) => state.game);
  const { contacts } = useSelector((state: RootState) => state.dialogue);
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  // Check for unread messages
  const hasUnreadChatter = contacts.some((c) => c.isUnlocked && c.hasUnreadMessages);

  const isAppUnlocked = (appId: AppId): boolean => unlockedApps.includes(appId);

  const handleAppClick = (app: DockApp) => {
    if (!isAppUnlocked(app.id)) return;

    const existingWindow = windows.find((w) => w.id === app.windowId);

    if (existingWindow) {
      // If window was closed, reopen it
      if (!existingWindow.isOpen) {
        dispatch(
          openWindow({
            id: app.windowId,
            title: app.title,
            type: app.windowType,
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            zIndex: 10,
          })
        );
      } else if (existingWindow.isMinimized) {
        dispatch(focusWindow(app.windowId));
      } else if (existingWindow.id === activeWindowId) {
        dispatch(minimizeWindow(app.windowId));
      } else {
        dispatch(focusWindow(app.windowId));
      }
    } else {
      dispatch(
        openWindow({
          id: app.windowId,
          title: app.title,
          type: app.windowType,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: 10,
        })
      );
    }
  };

  const isActive = (id: string): boolean => {
    const win = windows.find((w) => w.id === id);
    return !!(win && win.isOpen && !win.isMinimized);
  };

  const getBadgeCount = (appId: AppId): number | null => {
    if (appId === 'chatter' && hasUnreadChatter) {
      return contacts.filter((c) => c.isUnlocked && c.hasUnreadMessages).length;
    }
    return null;
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }}
      className="fixed bottom-2 left-0 right-0 flex justify-center z-50"
    >
      <div
        className="flex items-end gap-1 px-2 py-2 rounded-dock-lg"
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.04), 0 4px 20px rgba(0, 0, 0, 0.12)',
        }}
      >
        {DOCK_APPS.map((app) => (
          <DockIcon
            key={app.id}
            app={app}
            isActive={isActive(app.windowId)}
            isUnlocked={isAppUnlocked(app.id)}
            isHovered={hoveredApp === app.id}
            badgeCount={getBadgeCount(app.id)}
            onClick={() => handleAppClick(app)}
            onHover={(hovered) => setHoveredApp(hovered ? app.id : null)}
          />
        ))}
      </div>
    </motion.div>
  );
};

interface DockIconProps {
  app: DockApp;
  isActive: boolean;
  isUnlocked: boolean;
  isHovered: boolean;
  badgeCount: number | null;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

const DockIcon: React.FC<DockIconProps> = ({
  app,
  isActive,
  isUnlocked,
  isHovered,
  badgeCount,
  onClick,
  onHover,
}) => {
  return (
    <motion.div
      className="relative"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      animate={{
        scale: isHovered ? 1.2 : 1,
        y: isHovered ? -8 : 0,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-md whitespace-nowrap pointer-events-none"
            style={{
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span className="text-white text-xs font-medium">{app.title}</span>
            {!isUnlocked && (
              <span className="text-gray-400 text-xs ml-1">(Locked)</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon Button */}
      <button
        onClick={onClick}
        disabled={!isUnlocked}
        className={`
          relative w-12 h-12 rounded-dock flex items-center justify-center
          transition-all duration-200
          ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}
        `}
        style={{
          background: isUnlocked
            ? `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`
            : 'rgba(128, 128, 128, 0.3)',
          boxShadow: isUnlocked
            ? '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
            : 'none',
        }}
      >
        {/* Gradient overlay for color */}
        {isUnlocked && (
          <div
            className={`absolute inset-0 rounded-dock bg-gradient-to-br ${app.color} opacity-100`}
          />
        )}

        {/* Icon */}
        <div
          className={`relative z-10 ${
            isUnlocked ? 'text-white' : 'text-gray-500'
          }`}
        >
          {isUnlocked ? app.icon : <Lock size={20} />}
        </div>

        {/* Locked overlay */}
        {!isUnlocked && (
          <div className="absolute inset-0 rounded-dock bg-black/20" />
        )}

        {/* Shine effect */}
        {isUnlocked && (
          <div
            className="absolute inset-0 rounded-dock pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
            }}
          />
        )}
      </button>

      {/* Active Indicator (dot) */}
      {isActive && isUnlocked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/80"
          style={{
            boxShadow: '0 0 4px rgba(255, 255, 255, 0.6)',
          }}
        />
      )}

      {/* Badge */}
      <AnimatePresence>
        {badgeCount && isUnlocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 flex items-center justify-center"
            style={{
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            <span className="text-white text-[10px] font-bold">
              {badgeCount > 9 ? '9+' : badgeCount}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dock;
