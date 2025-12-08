import { ToastNotification } from '../common/ToastNotification';
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { RootState } from '../../store';
import { Dock } from './Dock';
import { WindowFrame } from './WindowFrame';
import { MentOS } from './MentOS';
import { EmailApp } from '../apps/email/EmailApp';
import { PMISApp } from '../apps/pmis/PMISApp';
import { ChatterApp } from '../apps/chatter/ChatterApp';
import { WikiBOKApp } from '../apps/wikibok/WikiBOKApp';
import { ExamSimApp } from '../apps/exam/ExamSimApp';
import {
  openWindow,
  closeWindow,
  minimizeWindow,
  maximizeWindow,
  focusWindow,
} from '../../features/osSlice';
import {
  Mail,
  LayoutDashboard,
  Folder,
  Globe,
  MessageCircle,
  BookOpen,
} from 'lucide-react';

export const DesktopLayout: React.FC = () => {
  const dispatch = useDispatch();
  const { windows, activeWindowId } = useSelector((state: RootState) => state.os);
  const hasInitialized = useRef(false);

  // Auto-open Chatter on first mount
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      dispatch(
        openWindow({
          id: 'Chatter',
          title: 'Chatter',
          type: 'Chatter',
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: 10,
        })
      );
    }
  }, [dispatch]);

  const getWindowIcon = (type: string) => {
    switch (type) {
      case 'Email':
        return <Mail size={16} />;
      case 'PMIS':
        return <LayoutDashboard size={16} />;
      case 'Document':
        return <Folder size={16} />;
      case 'Browser':
        return <Globe size={16} />;
      case 'Chatter':
        return <MessageCircle size={16} />;
      case 'WikiBOK':
        return <BookOpen size={16} />;
      default:
        return <Folder size={16} />;
    }
  };

  const renderWindowContent = (type: string) => {
    switch (type) {
      case 'Email':
        return <EmailApp />;
      case 'PMIS':
        return <PMISApp />;
      case 'Chatter':
        return <ChatterApp />;
      case 'WikiBOK':
        return <WikiBOKApp />;
      case 'Browser':
        return <div className="p-4 text-gray-400">Browser Content Placeholder</div>;
      default:
        return <div className="p-4 text-gray-400">Content Not Found</div>;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative flex flex-col font-sans">
      {/* Desktop Background - Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        }}
      />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Notifications */}
      <ToastNotification />


      {/* Desktop Area - with padding for dock */}
      <div className="flex-1 relative mb-[78px]">
        {/* Desktop could have icons or widgets here in the future */}

        {/* Windows */}
        <AnimatePresence>
          {windows.map((window) => (
            <WindowFrame
              key={window.id}
              id={window.id}
              title={window.title}
              icon={getWindowIcon(window.type)}
              isOpen={window.isOpen}
              isMinimized={window.isMinimized}
              isMaximized={window.isMaximized}
              isFocused={window.id === activeWindowId}
              zIndex={window.zIndex}
              onClose={() => dispatch(closeWindow(window.id))}
              onMinimize={() => dispatch(minimizeWindow(window.id))}
              onMaximize={() => dispatch(maximizeWindow(window.id))}
              onFocus={() => dispatch(focusWindow(window.id))}
            >
              {renderWindowContent(window.type)}
            </WindowFrame>
          ))}
        </AnimatePresence>
      </div>

      {/* Dock (replaces old Taskbar) */}
      <Dock />

      {/* MentOS Guidance System */}
      <MentOS />

      {/* ExamSim Modal (renders when exam is active) */}
      <ExamSimApp />
    </div>
  );
};
