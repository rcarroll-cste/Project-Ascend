import { ToastNotification } from '../common/ToastNotification';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { RootState } from '../../store';
import { Taskbar } from './Taskbar';
import { WindowFrame } from './WindowFrame';
import { EmailApp } from '../apps/email/EmailApp';
import { PMISApp } from '../apps/pmis/PMISApp';
import {
  closeWindow, 
  minimizeWindow, 
  maximizeWindow, 
  focusWindow 
} from '../../features/osSlice';
import { Mail, LayoutDashboard, Folder, Globe } from 'lucide-react';

export const DesktopLayout: React.FC = () => {
  const dispatch = useDispatch();
  const { windows } = useSelector((state: RootState) => state.os);

  const getWindowIcon = (type: string) => {
    switch (type) {
      case 'Email': return <Mail size={16} />;
      case 'PMIS': return <LayoutDashboard size={16} />;
      case 'Document': return <Folder size={16} />;
      case 'Browser': return <Globe size={16} />;
      default: return <Folder size={16} />;
    }
  };

  const renderWindowContent = (type: string) => {
    switch (type) {
      case 'Email':
        return <EmailApp />;
      case 'PMIS':
        return <PMISApp />;
      case 'Browser':
         return <div className="p-4">Browser Content Placeholder</div>;
      default:
        return <div className="p-4">Content Not Found</div>;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#008080] relative flex flex-col font-sans">
      {/* Notifications */}
      <ToastNotification />
      {/* Desktop Area */}
      <div className="flex-1 relative">
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
    </div>
  );
};