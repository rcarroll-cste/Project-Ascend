import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Users } from 'lucide-react';
import { setAvatar, advanceOnboarding, AvatarArchetype, AVATARS } from '../../../features/playerSlice';
import { RootState } from '../../../store';
import { CartoonAvatar } from '../../common/CartoonAvatar';

export const AvatarSelectionScreen: React.FC = () => {
  const dispatch = useDispatch();
  const playerName = useSelector((state: RootState) => state.player.name);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarArchetype | null>(null);

  const handleSelect = (avatarId: AvatarArchetype) => {
    setSelectedAvatar(avatarId);
  };

  const handleContinue = () => {
    if (selectedAvatar) {
      dispatch(setAvatar(selectedAvatar));
      dispatch(advanceOnboarding());
    }
  };

  const avatarList = Object.values(AVATARS);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl"
      >
        {/* Glass card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg"
            >
              <Users className="w-7 h-7 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white mb-2"
            >
              Welcome, {playerName}!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-300"
            >
              Please select your profile image for the corporate directory (Chatter).
            </motion.p>
          </div>

          {/* Avatar Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
          >
            {avatarList.map((avatar, index) => (
              <motion.button
                key={avatar.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.08 }}
                onClick={() => handleSelect(avatar.id)}
                className={`relative p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center
                  ${selectedAvatar === avatar.id
                    ? 'bg-white/20 border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
                  }
                `}
              >
                {/* Selection checkmark */}
                {selectedAvatar === avatar.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}

                {/* Cartoon Avatar */}
                <CartoonAvatar avatar={avatar} size="xl" />
              </motion.button>
            ))}
          </motion.div>

          {/* Continue button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            onClick={handleContinue}
            disabled={!selectedAvatar}
            className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300
              ${selectedAvatar
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
