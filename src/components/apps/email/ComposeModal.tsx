import React from 'react';
import { X, Paperclip, Calendar, Sparkles, Trash2 } from 'lucide-react';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComposeModal: React.FC<ComposeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/5 flex items-center justify-center z-50" onClick={onClose}>
      {/* Modal Container */}
      <div
        className="bg-white rounded-lg shadow-2xl w-[800px] h-[600px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-2">
          <h2 className="text-lg font-semibold text-gray-800">New Message</h2>
          <div className="flex space-x-2 text-gray-400">
             <button onClick={onClose} className="hover:text-red-500">
                <X size={20} />
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-8 py-2 flex flex-col overflow-y-auto">
          
          {/* TO Field */}
          <div className="flex items-center border-b border-transparent py-2 group hover:border-gray-100 transition-colors">
            <span className="w-16 text-gray-500 font-medium text-sm">To</span>
            <div className="flex-1 flex items-center">
                <span className="text-gray-900 font-medium bg-gray-100 px-2 py-0.5 rounded text-sm flex items-center">
                    director.thorne@ascend.corp
                    <X size={12} className="ml-1 cursor-pointer hover:text-red-500" />
                </span>
                <input type="text" className="flex-1 outline-none ml-2 text-gray-800" autoFocus />
            </div>
            <div className="text-gray-400 text-xs hidden group-hover:flex space-x-2">
                <span className="cursor-pointer hover:text-gray-600">Cc</span>
                <span className="cursor-pointer hover:text-gray-600">Bcc</span>
            </div>
          </div>

          {/* Subject Field */}
          <div className="flex items-center border-b border-transparent py-3 group hover:border-gray-100 transition-colors">
            <span className="w-16 text-gray-500 font-medium text-sm">Subject</span>
            <input type="text" className="flex-1 outline-none font-medium text-gray-800" placeholder="" />
          </div>

          {/* AI Hint */}
          <div className="py-4 text-gray-300 font-medium text-2xl tracking-tight selection:bg-purple-100">
             Tip: Hit <span className="font-sans">⌘J</span> for AI
          </div>

          {/* Body */}
          <div className="flex-1 outline-none text-gray-800 leading-relaxed py-2">
            <p className="mb-4 text-purple-500 bg-purple-50 inline-block px-1 rounded">Drafting response...</p>
          </div>
        </div>

        {/* Footer Toolbar */}
        <div className="px-6 py-4 border-t border-gray-50 bg-white flex items-center justify-between text-gray-500">
          
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-1 hover:text-gray-800 font-medium text-sm">
                <span>Send</span>
            </button>
            <button className="hover:text-gray-800 text-sm">Send later</button>
            <button className="hover:text-gray-800 text-sm">Remind me</button>
          </div>

          <div className="flex items-center space-x-4">
            <button className="hover:text-purple-600 transition-colors flex items-center gap-1 group">
                <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">AI</span>
                <Sparkles size={18} />
            </button>
            <button className="hover:text-gray-800"><Calendar size={18} /></button>
            <button className="hover:text-gray-800 text-sm font-mono">{`{ }`}</button>
            <button className="hover:text-gray-800"><Paperclip size={18} /></button>
            <button className="hover:text-red-500 ml-2"><Trash2 size={18} /></button>
          </div>

        </div>
        
        {/* Keyboard Shortcuts Hint Overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-gray-300 pointer-events-none">
            Hit <span className="font-bold border border-gray-200 px-1 rounded bg-gray-50">⌘</span> <span className="font-bold border border-gray-200 px-1 rounded bg-gray-50">enter</span> to send
        </div>

      </div>
    </div>
  );
};