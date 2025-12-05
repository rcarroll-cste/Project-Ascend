import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface ChatterMessageProps {
  speaker: string;
  speakerAvatar?: string;
  text: string;
  isPlayer?: boolean;
  isSystem?: boolean;
  isTyping?: boolean;
}

export function ChatterMessage({
  speaker,
  speakerAvatar,
  text,
  isPlayer = false,
  isSystem = false,
  isTyping = false,
}: ChatterMessageProps) {
  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center my-2"
      >
        <div className="bg-slate-700/50 text-slate-400 text-xs px-3 py-1 rounded-full">
          {text}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 mb-3 ${isPlayer ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isPlayer ? 'bg-blue-600' : 'bg-slate-600'
        }`}
      >
        {speakerAvatar ? (
          <img
            src={speakerAvatar}
            alt={speaker}
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              // Fallback to icon if image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <User size={16} className="text-slate-300" />
        )}
      </div>

      {/* Message Bubble */}
      <div className={`flex flex-col ${isPlayer ? 'items-end' : 'items-start'} max-w-[75%]`}>
        {!isPlayer && (
          <span className="text-xs text-slate-500 mb-1 ml-1">{speaker}</span>
        )}
        <div
          className={`px-3 py-2 rounded-lg ${
            isPlayer
              ? 'bg-blue-600 text-white rounded-br-sm'
              : 'bg-slate-700 text-slate-200 rounded-bl-sm'
          }`}
        >
          {isTyping ? (
            <div className="flex gap-1 py-1">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                className="w-2 h-2 bg-current rounded-full"
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 bg-current rounded-full"
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 bg-current rounded-full"
              />
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{text}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
