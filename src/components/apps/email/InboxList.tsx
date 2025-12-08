import React, { useMemo } from 'react';
import { Star, Clock, MoreHorizontal, GripVertical, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Email, EmailFolder } from '../../../types';
import { INITIAL_EMAILS } from '../../../data/initialData';
import { useDraggable } from '@dnd-kit/core';

interface InboxListProps {
  onSelectEmail: (email: Email) => void;
  selectedEmailId: string | null;
  currentFolder: EmailFolder;
}

const DraggableEmailItem: React.FC<{ email: Email; isSelected: boolean; onClick: () => void }> = ({ email, isSelected, onClick }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `email-${email.id}`,
    data: {
      type: 'email',
      email: email,
    },
  });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.3 : 1,
    transition: 'opacity 0.15s ease',
  };

  return (
    <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        onClick={onClick}
        className={`group flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 border-l-4 transition-colors relative
          ${!email.isRead ? 'font-medium bg-white' : 'bg-gray-50/50'}
          ${isSelected ? 'border-purple-500 bg-purple-50/30' : 'border-transparent'}
        `}
      >
        {/* Drag Handle */}
        <div
            {...listeners}
            className="mr-2 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing p-1 -ml-2"
            onClick={(e) => e.stopPropagation()} // Prevent opening email when dragging
        >
            <GripVertical size={16} />
        </div>

        {/* Status Dot / Category */}
        <div className="w-6 flex-shrink-0 flex items-center justify-center">
          {email.categoryColor ? (
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: email.categoryColor }} />
          ) : (
            <div className="w-2 h-2" /> // Spacer
          )}
        </div>

        {/* Sender */}
        <div className={`w-48 flex-shrink-0 truncate ${!email.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
          {email.sender}
        </div>

        {/* Subject & Preview */}
        <div className="flex-1 min-w-0 flex items-center mr-4">
          <span className={`truncate ${!email.isRead ? 'text-gray-900' : 'text-gray-800'}`}>
            {email.subject}
          </span>
          <span className="mx-2 text-gray-400">-</span>
          <span className="text-gray-500 truncate flex-1">
            {email.preview}
          </span>
        </div>

        {/* Actions (Visible on Hover) & Timestamp */}
        <div className="flex-shrink-0 flex items-center text-xs text-gray-400 font-medium w-24 justify-end">
          <div className="hidden group-hover:flex space-x-2 mr-4 text-gray-500">
            <button title="Snooze"><Clock size={16} /></button>
            <button title="Star"><Star size={16} /></button>
          </div>
          <span>{email.timestamp}</span>
        </div>
      </div>
  );
};

export const InboxList: React.FC<InboxListProps> = ({ onSelectEmail, selectedEmailId, currentFolder }) => {
  // Filter emails by current folder
  const filteredEmails = useMemo(() => {
    return INITIAL_EMAILS.filter(email => email.folder === currentFolder);
  }, [currentFolder]);

  const folderConfig = {
    inbox: {
      title: 'Inbox',
      icon: null,
      emptyMessage: 'Your inbox is empty.',
      bgClass: 'bg-white',
    },
    spam: {
      title: 'Spam',
      icon: <AlertTriangle size={16} className="text-red-500" />,
      emptyMessage: 'No spam messages.',
      bgClass: 'bg-red-50/30',
      warningBanner: true,
    },
    sent: { title: 'Sent', icon: null, emptyMessage: 'No sent messages.', bgClass: 'bg-white' },
    draft: { title: 'Drafts', icon: null, emptyMessage: 'No drafts.', bgClass: 'bg-white' },
    archive: { title: 'Archive', icon: null, emptyMessage: 'No archived messages.', bgClass: 'bg-white' },
  };

  const config = folderConfig[currentFolder];

  return (
    <div className={`flex flex-col h-full ${config.bgClass} text-gray-800 font-sans`}>
      {/* Header Tabs */}
      <div className="flex items-center px-6 py-4 border-b border-transparent">
        <div className="flex space-x-6 text-sm font-medium">
          <button className={`pb-1 flex items-center gap-2 ${currentFolder === 'spam' ? 'text-red-600 border-b-2 border-red-500' : 'text-gray-900 border-b-2 border-purple-500'}`}>
            {config.icon}
            {config.title}
            <span className="text-gray-400 font-normal ml-1">{filteredEmails.length}</span>
          </button>
        </div>
        <div className="ml-auto flex space-x-2 text-gray-400">
          <button className="p-1 hover:bg-gray-100 rounded"><MoreHorizontal size={18} /></button>
        </div>
      </div>

      {/* Spam Warning Banner */}
      {currentFolder === 'spam' && (
        <div className="mx-4 mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <ShieldAlert size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Watch out for important messages</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Some legitimate emails may end up here. Check carefully - there might be critical stakeholders trying to reach you!
            </p>
          </div>
        </div>
      )}

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {filteredEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-sm">{config.emptyMessage}</p>
          </div>
        ) : (
          <>
            {/* Date Separator */}
            <div className="px-6 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider mt-4">
              {currentFolder === 'spam' ? 'Filtered Messages' : 'Today'}
            </div>

            {filteredEmails.map((email) => (
              <DraggableEmailItem
                key={email.id}
                email={email}
                isSelected={selectedEmailId === email.id}
                onClick={() => onSelectEmail(email)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};