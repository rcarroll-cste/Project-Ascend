import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WindowFrameProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused?: boolean;
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  children: React.ReactNode;
  // Optional sizing
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  title,
  icon,
  isOpen,
  isMinimized,
  isMaximized,
  isFocused = true,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  children,
  defaultWidth = 800,
  defaultHeight = 600,
  minWidth = 400,
  minHeight = 300,
}) => {
  const [position, setPosition] = useState({ x: 100 + Math.random() * 50, y: 50 + Math.random() * 30 });
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isHoveringControls, setIsHoveringControls] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  // Reset position when maximized
  useEffect(() => {
    if (isMaximized) {
      setPosition({ x: 0, y: 44 }); // Account for status bar
    }
  }, [isMaximized]);

  // Handle title bar drag
  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    e.preventDefault();
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    onFocus();
  };

  // Handle resize
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
    onFocus();
  };

  // Global mouse events for drag and resize
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        const newX = e.clientX - dragOffset.x;
        const newY = Math.max(44, e.clientY - dragOffset.y); // Don't go above status bar
        setPosition({ x: newX, y: newY });
      }

      if (isResizing && !isMaximized) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        setSize({
          width: Math.max(minWidth, resizeStart.width + deltaX),
          height: Math.max(minHeight, resizeStart.height + deltaY)
        });
      }
    };

    if (isDragging || isResizing) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, isResizing, dragOffset, isMaximized, resizeStart, minWidth, minHeight]);

  // Double-click title bar to maximize/restore
  const handleTitleBarDoubleClick = () => {
    onMaximize();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          ref={windowRef}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`absolute flex flex-col overflow-hidden ${
            isMaximized
              ? 'inset-0 top-[44px] rounded-none'
              : 'rounded-os'
          } ${
            isFocused
              ? 'shadow-os-focused'
              : 'shadow-os'
          }`}
          style={{
            left: isMaximized ? 0 : position.x,
            top: isMaximized ? 44 : position.y,
            width: isMaximized ? '100%' : size.width,
            height: isMaximized ? 'calc(100vh - 44px - 78px)' : size.height, // Account for status bar and dock
            zIndex: zIndex,
            // Glassmorphism
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
          onMouseDown={onFocus}
        >
          {/* Title Bar - macOS Style */}
          <div
            className={`h-[28px] flex items-center px-3 select-none cursor-default transition-colors ${
              isFocused
                ? 'bg-gradient-to-b from-white/10 to-transparent'
                : 'bg-gradient-to-b from-black/5 to-transparent'
            }`}
            style={{
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            }}
            onMouseDown={handleTitleBarMouseDown}
            onDoubleClick={handleTitleBarDoubleClick}
          >
            {/* Traffic Light Controls */}
            <div
              className="flex items-center gap-2 mr-4"
              onMouseEnter={() => setIsHoveringControls(true)}
              onMouseLeave={() => setIsHoveringControls(false)}
            >
              {/* Close Button */}
              <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className={`w-3 h-3 rounded-full flex items-center justify-center transition-all ${
                  isFocused ? 'bg-[#ff5f56]' : 'bg-gray-300'
                } hover:brightness-90`}
                aria-label="Close"
              >
                {isHoveringControls && (
                  <svg className="w-2 h-2 text-black/50" viewBox="0 0 12 12">
                    <path
                      fill="currentColor"
                      d="M3.5 3.5l5 5m0-5l-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>

              {/* Minimize Button */}
              <button
                onClick={(e) => { e.stopPropagation(); onMinimize(); }}
                className={`w-3 h-3 rounded-full flex items-center justify-center transition-all ${
                  isFocused ? 'bg-[#ffbd2e]' : 'bg-gray-300'
                } hover:brightness-90`}
                aria-label="Minimize"
              >
                {isHoveringControls && (
                  <svg className="w-2 h-2 text-black/50" viewBox="0 0 12 12">
                    <path
                      fill="currentColor"
                      d="M2 6h8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>

              {/* Maximize Button */}
              <button
                onClick={(e) => { e.stopPropagation(); onMaximize(); }}
                className={`w-3 h-3 rounded-full flex items-center justify-center transition-all ${
                  isFocused ? 'bg-[#27ca3f]' : 'bg-gray-300'
                } hover:brightness-90`}
                aria-label={isMaximized ? 'Restore' : 'Maximize'}
              >
                {isHoveringControls && (
                  <svg className="w-2 h-2 text-black/50" viewBox="0 0 12 12">
                    {isMaximized ? (
                      // Restore icon (two overlapping squares)
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        d="M3 5v4h4M5 3h4v4"
                      />
                    ) : (
                      // Maximize icon (diagonal arrows)
                      <>
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          d="M2 10L10 2M7 2h3v3M5 10H2V7"
                        />
                      </>
                    )}
                  </svg>
                )}
              </button>
            </div>

            {/* Window Title */}
            <div className="flex-1 flex items-center justify-center gap-2">
              {icon && <span className="opacity-60">{icon}</span>}
              <span
                className={`text-[13px] font-medium truncate ${
                  isFocused ? 'text-gray-800' : 'text-gray-500'
                }`}
              >
                {title}
              </span>
            </div>

            {/* Spacer to balance the controls */}
            <div className="w-[60px]" />
          </div>

          {/* Content Area */}
          <div
            className="flex-1 overflow-auto bg-white/50 scrollbar-glass"
            style={{
              background: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            {children}
          </div>

          {/* Resize Handle (bottom-right corner) */}
          {!isMaximized && (
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
              onMouseDown={handleResizeMouseDown}
              style={{
                background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.1) 50%)',
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WindowFrame;
