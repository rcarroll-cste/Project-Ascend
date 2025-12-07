import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Sparkles, ArrowRight } from 'lucide-react';
import { advanceOnboarding, selectPlayerAvatar } from '../../../features/playerSlice';
import { setGameStage } from '../../../features/gameSlice';
import { RootState } from '../../../store';
import { CartoonAvatar } from '../../common/CartoonAvatar';

export const BadgeGenerationScreen: React.FC = () => {
  const dispatch = useDispatch();
  const playerName = useSelector((state: RootState) => state.player.name);
  const avatar = useSelector(selectPlayerAvatar);
  const [stage, setStage] = useState<'generating' | 'complete'>('generating');
  const [showElements, setShowElements] = useState({
    logo: false,
    name: false,
    title: false,
    avatar: false,
    barcode: false,
  });

  useEffect(() => {
    // Animate badge elements appearing one by one
    const timers = [
      setTimeout(() => setShowElements(prev => ({ ...prev, logo: true })), 500),
      setTimeout(() => setShowElements(prev => ({ ...prev, name: true })), 1000),
      setTimeout(() => setShowElements(prev => ({ ...prev, title: true })), 1500),
      setTimeout(() => setShowElements(prev => ({ ...prev, avatar: true })), 2000),
      setTimeout(() => setShowElements(prev => ({ ...prev, barcode: true })), 2500),
      setTimeout(() => setStage('complete'), 3000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleEnterDesktop = () => {
    dispatch(advanceOnboarding());
    // Don't unlock all apps immediately - they unlock progressively through Chatter
    dispatch(setGameStage('Playing'));
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl" />
      </div>

      {/* Sparkle effects */}
      <AnimatePresence>
        {stage === 'generating' && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 200],
                  y: [0, (Math.random() - 0.5) * 200],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                }}
                className="absolute top-1/2 left-1/2 text-yellow-400"
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        {/* Status text */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <CreditCard className="w-10 h-10 text-green-400 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-white">
            {stage === 'generating' ? 'Generating ID Badge...' : 'Badge Generated!'}
          </h2>
        </motion.div>

        {/* ID Badge */}
        <motion.div
          initial={{ rotateY: 90 }}
          animate={{ rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-80 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl shadow-2xl overflow-hidden"
          style={{ perspective: '1000px' }}
        >
          {/* Badge header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
            <AnimatePresence>
              {showElements.logo && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">A</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">ASCEND SOLUTIONS</h3>
                    <p className="text-blue-200 text-xs">Corporate ID</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Badge content */}
          <div className="p-6">
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              <AnimatePresence>
                {showElements.avatar && avatar && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="shadow-lg border-4 border-white rounded-full overflow-hidden"
                  >
                    <CartoonAvatar avatar={avatar} size="lg" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Name */}
            <div className="text-center mb-4">
              <AnimatePresence>
                {showElements.name && (
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-2xl font-bold text-slate-800"
                  >
                    {playerName}
                  </motion.h3>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showElements.title && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-blue-600 font-medium"
                  >
                    Junior Project Manager
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Barcode */}
            <AnimatePresence>
              {showElements.barcode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-slate-100 rounded-lg p-3"
                >
                  {/* Fake barcode */}
                  <div className="flex justify-center gap-0.5 mb-2">
                    {[...Array(30)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-slate-800"
                        style={{
                          width: Math.random() > 0.5 ? '2px' : '1px',
                          height: '24px',
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-center text-slate-500 text-xs font-mono">
                    EMP-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Badge footer */}
          <div className="bg-slate-300 px-4 py-2">
            <p className="text-slate-600 text-xs text-center">
              Valid for Project Titan Access
            </p>
          </div>
        </motion.div>

        {/* Enter button */}
        <AnimatePresence>
          {stage === 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <button
                onClick={handleEnterDesktop}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Enter AscendOS
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-slate-400 text-sm mt-4">
                Your workstation is ready. Good luck, {playerName}!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
