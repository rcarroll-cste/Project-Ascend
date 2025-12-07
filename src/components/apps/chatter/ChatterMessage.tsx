import { motion } from 'framer-motion';
import { User, Sparkles, FileText, Download, Check } from 'lucide-react';
import { getNPCAvatar } from '../../../data/npcAvatars';
import { CartoonAvatar } from '../../common/CartoonAvatar';
import { MiningTarget, EvidenceItem } from '../../../types';

interface ChatterMessageProps {
  speaker: string;
  speakerAvatar?: string;
  text: string;
  isPlayer?: boolean;
  isSystem?: boolean;
  isTyping?: boolean;
  miningTargets?: MiningTarget[];
  onMineClue?: (evidenceId: string, targetText: string) => void;
  attachment?: EvidenceItem | null;
  isAttachmentDownloaded?: boolean;
  onDownloadAttachment?: (evidenceId: string) => void;
}

export function ChatterMessage({
  speaker,
  speakerAvatar: _speakerAvatar,
  text,
  isPlayer = false,
  isSystem = false,
  isTyping = false,
  miningTargets = [],
  onMineClue,
  attachment,
  isAttachmentDownloaded = false,
  onDownloadAttachment,
}: ChatterMessageProps) {
  // Render text with mining targets highlighted
  const renderTextWithMiningTargets = (
    messageText: string,
    targets: MiningTarget[]
  ) => {
    if (!targets || targets.length === 0) {
      return <span>{messageText}</span>;
    }

    // Sort targets by their position in the text to handle overlapping correctly
    const sortedTargets = [...targets].sort(
      (a, b) => messageText.indexOf(a.text) - messageText.indexOf(b.text)
    );

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedTargets.forEach((target, idx) => {
      const startIndex = messageText.indexOf(target.text, lastIndex);
      if (startIndex === -1) return; // Target text not found

      // Add text before the target
      if (startIndex > lastIndex) {
        elements.push(
          <span key={`text-${idx}`}>{messageText.slice(lastIndex, startIndex)}</span>
        );
      }

      // Add the mining target (highlighted and clickable)
      const isCollected = target.isCollected;
      elements.push(
        <motion.span
          key={`target-${idx}`}
          className={`relative inline-flex items-center gap-1 cursor-pointer transition-all ${
            isCollected
              ? 'text-slate-400 line-through'
              : 'text-amber-400 hover:text-amber-300 font-medium'
          }`}
          onClick={() => {
            if (!isCollected && onMineClue) {
              onMineClue(target.evidenceId, target.text);
            }
          }}
          whileHover={!isCollected ? { scale: 1.02 } : {}}
          whileTap={!isCollected ? { scale: 0.98 } : {}}
          title={isCollected ? 'Clue collected!' : 'Click to collect this clue'}
        >
          {!isCollected && (
            <motion.span
              className="inline-block"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.95, 1.05, 0.95]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={12} className="text-amber-400" />
            </motion.span>
          )}
          <span className={!isCollected ? 'underline decoration-amber-400/50 decoration-2 underline-offset-2' : ''}>
            {target.text}
          </span>
          {isCollected && (
            <span className="text-xs text-green-400 ml-1">✓</span>
          )}
        </motion.span>
      );

      lastIndex = startIndex + target.text.length;
    });

    // Add remaining text after the last target
    if (lastIndex < messageText.length) {
      elements.push(
        <span key="text-end">{messageText.slice(lastIndex)}</span>
      );
    }

    return <>{elements}</>;
  };
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

  const npcAvatar = getNPCAvatar(speaker);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 mb-3 ${isPlayer ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
          isPlayer ? 'bg-blue-600' : 'bg-slate-600'
        }`}
      >
        {npcAvatar ? (
          <CartoonAvatar avatar={npcAvatar} size="sm" />
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
            <p className="text-sm whitespace-pre-wrap">
              {renderTextWithMiningTargets(text, miningTargets)}
            </p>
          )}
        </div>

        {/* File Attachment Card */}
        {attachment && (
          <motion.button
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => {
              if (!isAttachmentDownloaded && onDownloadAttachment) {
                onDownloadAttachment(attachment.id);
              }
            }}
            disabled={isAttachmentDownloaded}
            className={`mt-2 flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${
              isAttachmentDownloaded
                ? 'bg-slate-800/50 border-green-600/30 cursor-default'
                : 'bg-slate-800 border-slate-600 hover:border-blue-500 hover:bg-slate-700 cursor-pointer'
            }`}
            title={isAttachmentDownloaded ? 'Downloaded to Sidebar' : 'Click to download'}
          >
            <div className={`p-2 rounded ${isAttachmentDownloaded ? 'bg-green-600/20' : 'bg-blue-600/20'}`}>
              <FileText size={18} className={isAttachmentDownloaded ? 'text-green-400' : 'text-blue-400'} />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-medium text-slate-200 truncate">{attachment.name}</div>
              <div className="text-xs text-slate-500 truncate">{attachment.type}</div>
            </div>
            {isAttachmentDownloaded ? (
              <Check size={16} className="text-green-400 flex-shrink-0" />
            ) : (
              <Download size={16} className="text-slate-400 flex-shrink-0" />
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
