import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageCircle, LayoutDashboard, Folder, BookOpen, Power } from 'lucide-react';
import { motion } from 'framer-motion';
import { RootState } from '../../store';
import { openWindow, minimizeWindow, focusWindow } from '../../features/osSlice';
import { WindowState, AppId } from '../../types';

export const Taskbar: React.FC = () => {
  const dispatch = useDispatch();
  const { windows, activeWindowId } = useSelector((state: RootState) => state.os);
  const { unlockedApps } = useSelector((state: RootState) => state.game);
  const { contacts } = useSelector((state: RootState) => state.dialogue);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Check if any contacts have unread messages
  const hasUnreadChatter = contacts.some((c) => c.isUnlocked && c.hasUnreadMessages);

  // Helper to check if an app is unlocked
  const isAppUnlocked = (appId: AppId): boolean => unlockedApps.includes(appId);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAppClick = (appId: string, title: string, type: WindowState['type']) => {
    const existingWindow = windows.find(w => w.id === appId);

    if (existingWindow) {
      if (existingWindow.isMinimized) {
        dispatch(focusWindow(appId));
      } else if (existingWindow.id === activeWindowId) {
        dispatch(minimizeWindow(appId));
      } else {
        dispatch(focusWindow(appId));
      }
    } else {
      dispatch(openWindow({
        id: appId,
        title,
        type,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: 10,
      }));
    }
  };

  const isActive = (id: string): boolean => {
    const win = windows.find(w => w.id === id);
    return !!(win && win.isOpen && !win.isMinimized);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-16 bg-slate-800 border-t border-slate-600 flex items-center justify-between px-4 fixed bottom-0 w-full z-50 select-none">
      <div className="flex items-center gap-1">
        {/* Start Button */}
        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded font-bold transition-colors shadow-md active:translate-y-px">
          <Power size={18} />
          <span className="hidden sm:inline">START</span>
        </button>

        <div className="w-px h-10 bg-slate-600 mx-3" />

        {/* App Icons - Desktop style with labels */}
        <DesktopIcon
          icon={<MessageCircle size={24} />}
          label="Chatter"
          isActive={isActive('chatter')}
          onClick={() => isAppUnlocked('chatter') && handleAppClick('chatter', 'Chatter', 'Chatter')}
          isDisabled={!isAppUnlocked('chatter')}
          hasBadge={hasUnreadChatter}
        />
        <DesktopIcon
          icon={<LayoutDashboard size={24} />}
          label="PMIS"
          isActive={isActive('pmis')}
          onClick={() => isAppUnlocked('pmis') && handleAppClick('pmis', 'Project Management Information System', 'PMIS')}
          isDisabled={!isAppUnlocked('pmis')}
        />
        <DesktopIcon
          icon={<Folder size={24} />}
          label="Files"
          isActive={isActive('files')}
          onClick={() => isAppUnlocked('files') && handleAppClick('files', 'Files', 'Files')}
          isDisabled={!isAppUnlocked('files')}
        />
        <DesktopIcon
          icon={<BookOpen size={24} />}
          label="WikiBOK"
          isActive={isActive('wikibok')}
          onClick={() => isAppUnlocked('wikibok') && handleAppClick('wikibok', 'WikiBOK', 'WikiBOK')}
          isDisabled={!isAppUnlocked('wikibok')}
        />
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-4 px-3 py-1.5 bg-slate-900 rounded border border-slate-700 shadow-inner">
        <span className="text-blue-400 text-xs font-mono">EN</span>
        <span className="text-slate-200 text-sm font-mono tracking-wider">
          {formatTime(currentTime)}
        </span>
      </div>
    </div>
  );
};

interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isDisabled?: boolean;
  hasBadge?: boolean;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({
  icon,
  label,
  isActive,
  onClick,
  isDisabled,
  hasBadge,
}) => (
  <button
    onClick={onClick}
    disabled={isDisabled}
    className={`
      px-3 py-1.5 rounded-lg transition-all duration-200 group relative
      flex flex-col items-center justify-center min-w-[60px]
      ${isActive ? 'bg-slate-700 shadow-inner' : isDisabled ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:bg-slate-700/50'}
      ${hasBadge && !isDisabled ? 'animate-bounce' : ''}
    `}
  >
    {/* Icon */}
    <div
      className={`mb-0.5 ${isActive ? 'text-blue-300' : isDisabled ? 'text-slate-500' : 'text-slate-300 group-hover:text-white'}`}
    >
      {icon}
    </div>

    {/* Label */}
    <span
      className={`text-[10px] font-medium leading-tight ${
        isActive ? 'text-blue-300' : isDisabled ? 'text-slate-500' : 'text-slate-400 group-hover:text-slate-200'
      }`}
    >
      {label}
    </span>

    {/* Active indicator */}
    {isActive && (
      <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
    )}

    {/* Notification badge */}
    {hasBadge && !isDisabled && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-800"
      >
        <span className="text-[10px] text-white font-bold">!</span>
      </motion.div>
    )}

    {/* Locked indicator */}
    {isDisabled && (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-slate-900/30 rounded-lg" />
      </div>
    )}
  </button>
);