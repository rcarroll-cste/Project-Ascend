import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../../store';
import { setGameStage, startLevel } from '../../features/gameSlice';

/**
 * TitleCardScene - Cinematic level transition screen
 *
 * Per GDD v7.2 Section 5 "Signaling Event":
 * - Dark background with "Boot Sequence" style typography (White/Cyan)
 * - Displays Level Title, Process Name (subtitle), and interaction prompt
 * - Pressing Enter or clicking advances to gameplay
 */
export function TitleCardScene() {
  const dispatch = useDispatch();
  const { titleCardData, currentLevelId } = useSelector((state: RootState) => state.game);

  const handleContinue = useCallback(() => {
    // Start the level and transition to Playing
    dispatch(startLevel(titleCardData?.levelId ?? currentLevelId));
    dispatch(setGameStage('Playing'));
  }, [dispatch, titleCardData, currentLevelId]);

  // Listen for Enter key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleContinue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleContinue]);

  // Default content if no title card data
  const title = titleCardData?.title ?? `LEVEL ${currentLevelId}`;
  const subtitle = titleCardData?.subtitle ?? '';
  const processName = titleCardData?.processName ?? '';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 bg-black flex flex-col items-center justify-center cursor-pointer select-none"
        onClick={handleContinue}
      >
        {/* Scanline effect overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.03) 2px, rgba(0, 255, 255, 0.03) 4px)',
          }}
        />

        {/* CRT glow effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-cyan-950/20 via-transparent to-transparent" />

        {/* Content container */}
        <div className="relative z-10 text-center px-8 max-w-4xl">
          {/* Top decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            className="w-64 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-12"
          />

          {/* Subtitle / Process Name (appears first) */}
          {(subtitle || processName) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mb-4"
            >
              <span className="text-cyan-400 font-mono text-sm md:text-base tracking-[0.3em] uppercase">
                {subtitle || processName}
              </span>
            </motion.div>
          )}

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5, ease: 'easeOut' }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-wide mb-6"
            style={{
              textShadow: '0 0 40px rgba(0, 255, 255, 0.5), 0 0 80px rgba(0, 255, 255, 0.3)',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            }}
          >
            {title}
          </motion.h1>

          {/* Process Name (if subtitle was provided separately) */}
          {subtitle && processName && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="text-cyan-300/80 font-mono text-lg md:text-xl tracking-wider mb-8"
            >
              {processName}
            </motion.p>
          )}

          {/* Bottom decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.0, duration: 0.6, ease: 'easeOut' }}
            className="w-64 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-12 mb-16"
          />

          {/* Press Enter prompt */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0.5, 1] }}
            transition={{
              delay: 1.3,
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop',
            }}
            className="text-cyan-400/90 font-mono text-sm md:text-base tracking-[0.2em]"
          >
            [ PRESS ENTER TO CONTINUE ]
          </motion.div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-cyan-500/30" />
        <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-cyan-500/30" />
        <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-cyan-500/30" />
        <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-cyan-500/30" />

        {/* Boot sequence decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-cyan-600/60 tracking-wider"
        >
          ASCEND_OS v2.1.0 // LOADING MODULE...
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
