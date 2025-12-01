import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, LayoutDashboard, Folder, Globe, Power } from 'lucide-react';
import { RootState } from '../../store';
import { openWindow, minimizeWindow, focusWindow } from '../../features/osSlice';
import { WindowState } from '../../types';

export const Taskbar: React.FC = () => {
  const dispatch = useDispatch();
  const { windows, activeWindowId } = useSelector((state: RootState) => state.os);
  const { isPMISUnlocked } = useSelector((state: RootState) => state.game);
  const [currentTime, setCurrentTime] = useState(new Date());

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
    <div className="h-12 bg-slate-800 border-t border-slate-600 flex items-center justify-between px-2 fixed bottom-0 w-full z-50 select-none">
      <div className="flex items-center gap-2">
        {/* Start Button */}
        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded font-bold transition-colors shadow-md active:translate-y-px">
          <Power size={18} />
          <span className="hidden sm:inline">START</span>
        </button>

        <div className="w-px h-8 bg-slate-600 mx-2" />

        {/* App Icons */}
        <TaskbarIcon
          icon={<LayoutDashboard size={20} />}
          label={isPMISUnlocked ? "PMIS (Hub)" : "PMIS (Locked)"}
          isActive={isActive('pmis')}
          onClick={() => isPMISUnlocked && handleAppClick('pmis', 'Project Management Information System', 'PMIS')}
          isDisabled={!isPMISUnlocked}
        />
        <TaskbarIcon
          icon={<Folder size={20} />}
          label="Files"
          isActive={isActive('files')}
          onClick={() => handleAppClick('files', 'My Documents', 'Document')}
        />
        <TaskbarIcon
          icon={<Globe size={20} />}
          label="Browser"
          isActive={isActive('browser')}
          onClick={() => handleAppClick('browser', 'Netscape Navigator', 'Browser')}
        />
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-4 px-3 py-1 bg-slate-900 rounded border border-slate-700 shadow-inner">
        <span className="text-blue-400 text-xs font-mono">EN</span>
        <span className="text-slate-200 text-sm font-mono tracking-wider">
          {formatTime(currentTime)}
        </span>
      </div>
    </div>
  );
};

interface TaskbarIconProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isDisabled?: boolean;
}

const TaskbarIcon: React.FC<TaskbarIconProps> = ({ icon, label, isActive, onClick, isDisabled }) => (
  <button
    onClick={onClick}
    disabled={isDisabled}
    className={`p-2 rounded transition-all duration-200 group relative flex flex-col items-center justify-center w-10 h-10
      ${isActive ? 'bg-slate-700 shadow-inner' : isDisabled ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:bg-slate-700/50'}
    `}
    title={label}
  >
    <div className={`text-slate-200 ${isActive ? 'scale-110 text-blue-300' : isDisabled ? '' : 'group-hover:text-white'}`}>
      {icon}
    </div>
    {isActive && (
      <div className="absolute -bottom-1 w-8 h-1 bg-blue-500 rounded-t-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
    )}
  </button>
);