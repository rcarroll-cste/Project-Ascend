import React from 'react';
import { Star, Clock, MoreHorizontal } from 'lucide-react';
import { Email } from '../../../types';
import { INITIAL_EMAILS } from '../../../data/initialData';
import { useDraggable } from '@dnd-kit/core';

interface InboxListProps {
  onSelectEmail: (email: Email) => void;
  selectedEmailId: string | null;
}

const DraggableEmailItem: React.FC<{ email: Email; isSelected: boolean; onClick: () => void }> = ({ email, isSelected, onClick }) => {
  // Make all emails draggable for various purposes (Evidence or Stakeholder ID)
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `email-${email.id}`,
    data: {
      type: 'email',
      email: email, // Pass the whole email object for easier checking
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 999,
  } : undefined;

  return (
    <div 
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        onClick={onClick}
        className={`group flex items-center px-6 py-3 cursor-pointer hover:bg-gray-50 border-l-4 transition-colors
          ${!email.isRead ? 'font-medium bg-white' : 'bg-gray-50/50'}
          ${isSelected ? 'border-purple-500 bg-purple-50/30' : 'border-transparent'}
        `}
      >
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

export const InboxList: React.FC<InboxListProps> = ({ onSelectEmail, selectedEmailId }) => {
  return (
    <div className="flex flex-col h-full bg-white text-gray-800 font-sans">
      {/* Header Tabs */}
      <div className="flex items-center px-6 py-4 border-b border-transparent">
        <div className="flex space-x-6 text-sm font-medium">
          <button className="text-gray-900 border-b-2 border-purple-500 pb-1">Important <span className="text-gray-400 font-normal ml-1">{INITIAL_EMAILS.length}</span></button>
          <button className="text-gray-500 hover:text-gray-700 pb-1">Shared</button>
          <button className="text-gray-500 hover:text-gray-700 pb-1">Calendar <span className="text-gray-400 font-normal ml-1">0</span></button>
          <button className="text-gray-500 hover:text-gray-700 pb-1">Other</button>
        </div>
        <div className="ml-auto flex space-x-2 text-gray-400">
          <button className="p-1 hover:bg-gray-100 rounded"><MoreHorizontal size={18} /></button>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {/* Date Separator */}
        <div className="px-6 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider mt-4">Today</div>
        
        {INITIAL_EMAILS.map((email) => (
          <DraggableEmailItem 
            key={email.id} 
            email={email} 
            isSelected={selectedEmailId === email.id}
            onClick={() => onSelectEmail(email)}
          />
        ))}

        {/* Example "Last 7 Days" Section */}
        {INITIAL_EMAILS.length > 5 && (
            <>
                <div className="px-6 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider mt-8">Last 7 Days</div>
                {/* Could map older emails here */}
            </>
        )}
      </div>
    </div>
  );
};