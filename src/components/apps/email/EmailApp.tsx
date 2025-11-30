import React, { useState } from 'react';
import { InboxList } from './InboxList';
import { ComposeModal } from './ComposeModal';
import { Mail, Calendar, Users, Settings, Edit3, Search, ChevronLeft, ChevronRight, X, Reply, ReplyAll, Forward, Trash2, Clock, Folder, FileText } from 'lucide-react';
import { Email } from '../../../types';
import { useDispatch } from 'react-redux';
import { identifyStakeholder } from '../../../features/pmisSlice';
import { unlockPMIS } from '../../../features/gameSlice';
import { useNotification } from '../../../hooks/useNotification';

export const EmailApp: React.FC = () => {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const dispatch = useDispatch();
  const { showNotification } = useNotification();

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
    
    // Handle specific triggers
    if (email.triggerAction === 'UNLOCK_PMIS') {
      dispatch(identifyStakeholder('sh_elias'));
      dispatch(unlockPMIS());
      showNotification(
        "PMIS Unlocked",
        "You now have access to the Project Management Information System.",
        "success"
      );
    }
  };

  const handleCloseDetail = () => {
    setSelectedEmail(null);
  }

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden font-sans">
      
      {/* Sidebar (Left Rail) */}
      <div className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-6 space-y-8 z-10 shrink-0">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-purple-200">
            S
        </div>

        <div className="flex flex-col space-y-6 w-full items-center">
            <button className="text-gray-400 hover:text-gray-800 transition-colors relative group">
                <Mail size={24} strokeWidth={1.5} />
                <span className="absolute left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">Inbox</span>
            </button>
            <button className="text-gray-400 hover:text-gray-800 transition-colors relative group">
                <Calendar size={24} strokeWidth={1.5} />
                <span className="absolute left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">Calendar</span>
            </button>
            <button className="text-gray-400 hover:text-gray-800 transition-colors relative group">
                <Users size={24} strokeWidth={1.5} />
                <span className="absolute left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">Contacts</span>
            </button>
        </div>

        <div className="mt-auto flex flex-col space-y-6 w-full items-center pt-8">
            <button className="text-gray-400 hover:text-gray-800 transition-colors">
                <Settings size={24} strokeWidth={1.5} />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" />
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        
        {/* Top Search Bar (Global) */}
        <div className="h-16 border-b border-transparent flex items-center px-6 justify-between shrink-0">
            <div className="flex items-center text-gray-400 bg-gray-50 px-3 py-1.5 rounded-md w-96 hover:bg-gray-100 transition-colors cursor-text group">
                <Search size={16} className="group-hover:text-gray-600 transition-colors" />
                <span className="ml-3 text-sm font-medium">Search (⌘K)</span>
            </div>
            
            <button 
                onClick={() => setIsComposeOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center shadow-sm transition-all hover:shadow-md"
            >
                <Edit3 size={16} className="mr-2" />
                Compose
            </button>
        </div>

        {/* List View */}
        <div className={`flex-1 overflow-hidden relative ${selectedEmail ? 'hidden md:block' : ''}`}>
            <InboxList onSelectEmail={handleEmailSelect} selectedEmailId={selectedEmail?.id || null} />
        </div>

        {/* Reading Pane (Overlay or Side-by-Side depending on width - simplistic overlay here) */}
        {selectedEmail && (
            <div className="absolute inset-0 bg-white z-20 flex flex-col animate-in slide-in-from-right-10 duration-200 shadow-xl border-l border-gray-100 md:left-1/3 md:w-2/3 md:border-l">
                
                {/* Email Header Actions */}
                <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
                    <div className="flex items-center space-x-2 text-gray-500">
                        <button onClick={handleCloseDetail} className="hover:bg-gray-100 p-1 rounded md:hidden"><ChevronLeft size={20} /></button>
                        <button className="hover:bg-gray-100 p-1 rounded" title="Archive"><span className="text-xs font-bold px-2 py-0.5 border rounded">E</span></button>
                        <button className="hover:bg-gray-100 p-1 rounded" title="Delete"><Trash2 size={18} /></button>
                        <div className="h-4 w-px bg-gray-200 mx-2" />
                        <button className="hover:bg-gray-100 p-1 rounded"><Clock size={18} /></button>
                        <button className="hover:bg-gray-100 p-1 rounded"><Folder size={18} /></button>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                        <span className="text-xs mr-2">1 of {10}</span>
                        <button className="hover:text-gray-800"><ChevronLeft size={20} /></button>
                        <button className="hover:text-gray-800"><ChevronRight size={20} /></button>
                    </div>
                </div>

                {/* Email Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">{selectedEmail.subject}</h1>
                        <span className="text-sm text-gray-400 whitespace-nowrap ml-4">{selectedEmail.timestamp}</span>
                    </div>

                    <div className="flex items-center mb-8">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mr-3">
                            {selectedEmail.sender[0]}
                        </div>
                        <div>
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                                {selectedEmail.sender}
                                <span className="text-gray-400 font-normal text-sm">director@ascend.corp</span>
                            </div>
                            <div className="text-sm text-gray-500">to me</div>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none text-gray-800 leading-relaxed whitespace-pre-line">
                        {selectedEmail.body}
                    </div>

                    {selectedEmail.relatedEvidenceId && (
                        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between group hover:border-purple-200 hover:bg-purple-50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded border border-gray-200">
                                    <FileText size={20} className="text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 group-hover:text-purple-700">Attachment: Market_Analysis_v1.pdf</p>
                                    <p className="text-xs text-gray-500">2.4 MB</p>
                                </div>
                            </div>
                            <button className="text-sm font-medium text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                Download
                            </button>
                        </div>
                    )}

                    <div className="mt-12 flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                            <Reply size={16} /> Reply
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                            <ReplyAll size={16} /> Reply All
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                            <Forward size={16} /> Forward
                        </button>
                    </div>

                </div>
            </div>
        )}

      </div>

      {/* Modals */}
      <ComposeModal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} />

    </div>
  );
};
