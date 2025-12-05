import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, FileText, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { INITIAL_DOCUMENTS } from '../../../data/documents';
import { GameDocument } from '../../../types';
import { DocumentViewer } from './DocumentViewer';

type FolderType = 'Documents' | 'Templates' | 'OrgCharts' | 'Generated';

interface FolderItem {
  name: FolderType;
  icon: React.ReactNode;
}

const FOLDERS: FolderItem[] = [
  { name: 'Documents', icon: <Folder size={16} /> },
  { name: 'OrgCharts', icon: <Folder size={16} /> },
  { name: 'Templates', icon: <Folder size={16} /> },
  { name: 'Generated', icon: <Folder size={16} /> },
];

export function FilesApp() {
  const [selectedFolder, setSelectedFolder] = useState<FolderType>('Documents');
  const [selectedDocument, setSelectedDocument] = useState<GameDocument | null>(null);

  // Get documents for current folder (only discovered ones)
  const folderDocuments = INITIAL_DOCUMENTS.filter(
    (doc) => doc.folder === selectedFolder && doc.isDiscovered
  );

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.xlsx')) {
      return <FileSpreadsheet size={20} className="text-green-400" />;
    }
    return <FileText size={20} className="text-blue-400" />;
  };

  if (selectedDocument) {
    return (
      <DocumentViewer
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    );
  }

  return (
    <div className="flex h-full bg-slate-900">
      {/* Sidebar - Folder List */}
      <div className="w-48 border-r border-slate-700 flex flex-col">
        <div className="p-3 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-slate-300">Files</h2>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {FOLDERS.map((folder) => {
            const docCount = INITIAL_DOCUMENTS.filter(
              (d) => d.folder === folder.name && d.isDiscovered
            ).length;
            return (
              <button
                key={folder.name}
                onClick={() => setSelectedFolder(folder.name)}
                className={`
                  w-full px-3 py-2 flex items-center gap-2 text-left
                  transition-colors
                  ${
                    selectedFolder === folder.name
                      ? 'bg-slate-800 text-slate-200'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
                  }
                `}
              >
                <span
                  className={selectedFolder === folder.name ? 'text-blue-400' : 'text-slate-500'}
                >
                  {folder.icon}
                </span>
                <span className="text-sm flex-1">{folder.name}</span>
                {docCount > 0 && (
                  <span className="text-xs text-slate-500">{docCount}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Area - File List */}
      <div className="flex-1 flex flex-col">
        {/* Breadcrumb */}
        <div className="p-3 border-b border-slate-700 flex items-center gap-2 text-sm text-slate-400">
          <span>Files</span>
          <ChevronRight size={14} />
          <span className="text-slate-200">{selectedFolder}</span>
        </div>

        {/* File Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {folderDocuments.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-500">
              <div className="text-center">
                <Folder size={48} className="mx-auto mb-4 opacity-50" />
                <p>This folder is empty</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <AnimatePresence>
                {folderDocuments.map((doc) => (
                  <motion.button
                    key={doc.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedDocument(doc)}
                    className="flex flex-col items-center p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors group"
                  >
                    <div className="mb-2">{getFileIcon(doc.name)}</div>
                    <span className="text-xs text-slate-300 text-center group-hover:text-slate-100 break-all">
                      {doc.name}
                    </span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="p-2 border-t border-slate-700 bg-slate-800">
          <p className="text-xs text-slate-500">
            {folderDocuments.length} item{folderDocuments.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
