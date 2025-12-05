import { ToastNotification } from '../common/ToastNotification';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { RootState } from '../../store';
import { Taskbar } from './Taskbar';
import { StatusBar } from './StatusBar';
import { WindowFrame } from './WindowFrame';
import { OnboardingOverlay } from '../common/OnboardingOverlay';
import { EmailApp } from '../apps/email/EmailApp';
import { PMISApp } from '../apps/pmis/PMISApp';
import { ChatterApp } from '../apps/chatter/ChatterApp';
import { FilesApp } from '../apps/files/FilesApp';
import { WikiBOKApp } from '../apps/wikibok/WikiBOKApp';
import { ExamSimApp } from '../apps/exam/ExamSimApp';
import {
  closeWindow,
  minimizeWindow,
  maximizeWindow,
  focusWindow,
} from '../../features/osSlice';
import { Mail, LayoutDashboard, Folder, Globe, MessageCircle, BookOpen } from 'lucide-react';

export const DesktopLayout: React.FC = () => {
  const dispatch = useDispatch();
  const { windows } = useSelector((state: RootState) => state.os);
  const { isOnboardingCompleted } = useSelector((state: RootState) => state.game);

  const getWindowIcon = (type: string) => {
    switch (type) {
      case 'Email':
        return <Mail size={16} />;
      case 'PMIS':
        return <LayoutDashboard size={16} />;
      case 'Document':
      case 'Files':
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
      case 'Files':
        return <FilesApp />;
      case 'WikiBOK':
        return <WikiBOKApp />;
      case 'Browser':
        return <div className="p-4 text-slate-400">Browser Content Placeholder</div>;
      default:
        return <div className="p-4 text-slate-400">Content Not Found</div>;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 relative flex flex-col font-sans">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <div className="text-9xl font-bold text-white tracking-widest uppercase transform -rotate-12 select-none">Aethelgard</div>
      </div>
      {/* Notifications */}
      <ToastNotification />

      {/* Onboarding Overlay */}
      {!isOnboardingCompleted && <OnboardingOverlay />}

      {/* Status Bar HUD (GDD v3.3) */}
      <StatusBar />

      {/* Desktop Area - with padding for taskbar */}
      <div className="flex-1 relative pb-16">
        {/* Desktop Icons could go here */}

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

      {/* Taskbar */}
      <Taskbar />

      {/* ExamSim Modal (renders when exam is active) */}
      <ExamSimApp />
    </div>
  );
};