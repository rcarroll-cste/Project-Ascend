import React, { useState } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { identifyStakeholder } from '../../../features/pmisSlice';
import { Stakeholder } from '../../../types';
import { User, GripVertical, AlertCircle, CheckCircle2, LayoutGrid, List as ListIcon } from 'lucide-react';
import { AnalysisGrid } from './AnalysisGrid';

const DraggableStakeholderRow: React.FC<{ stakeholder: Stakeholder }> = ({ stakeholder }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `stakeholder-${stakeholder.id}`,
    data: {
        type: 'stakeholder',
        stakeholder: stakeholder
    }
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
        className="flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm mb-2 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <div className="mr-3 text-gray-400">
        <GripVertical size={16} />
      </div>
      
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4 overflow-hidden border border-gray-200">
        {stakeholder.avatarUrl ? (
            <img src={stakeholder.avatarUrl} alt={stakeholder.name} className="w-full h-full object-cover" />
        ) : (
            <User size={20} className="text-gray-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">{stakeholder.name}</h4>
        <p className="text-xs text-gray-500 truncate">{stakeholder.role}</p>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500">
         <div className="flex flex-col items-end min-w-[80px]">
            <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Power</span>
            <span className={`font-medium ${stakeholder.power === 'High' ? 'text-red-600' : 'text-gray-600'}`}>{stakeholder.power}</span>
         </div>
         <div className="flex flex-col items-end min-w-[80px]">
            <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Interest</span>
            <span className={`font-medium ${stakeholder.interest === 'High' ? 'text-blue-600' : 'text-gray-600'}`}>{stakeholder.interest}</span>
         </div>
      </div>

      <div className="ml-4 w-6 flex justify-center">
        {stakeholder.isAnalyzed ? (
            <CheckCircle2 size={18} className="text-green-500" />
        ) : (
            <AlertCircle size={18} className="text-gray-300" />
        )}
      </div>
    </div>
  );
};

export const StakeholderRegister: React.FC = () => {
  const dispatch = useDispatch();
  const { stakeholders } = useSelector((state: RootState) => state.pmis);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Drop zone for identifying new stakeholders (from emails)
  const { setNodeRef, isOver } = useDroppable({
    id: 'stakeholder-register-drop-zone',
    data: {
      type: 'stakeholder-register',
    },
  });

  const identifiedStakeholders = stakeholders.filter(s => s.isIdentified);

  return (
    <div className="flex flex-col h-full bg-white font-sans">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
            <div>
                <h2 className="text-lg font-semibold text-gray-800">Stakeholder Register</h2>
                <p className="text-sm text-gray-500">Identify and analyze project stakeholders.</p>
            </div>
            
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <ListIcon size={18} />
                </button>
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <LayoutGrid size={18} />
                </button>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden relative">
            {viewMode === 'list' ? (
                <div className="absolute inset-0 overflow-y-auto p-6">
                    
                    {/* Identification Drop Zone */}
                    <div 
                        ref={setNodeRef}
                        className={`mb-8 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors
                            ${isOver ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
                        `}
                    >
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                            <User className="text-purple-600" size={24} />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">Identify New Stakeholder</h3>
                        <p className="text-xs text-gray-500 mt-1 max-w-xs">
                            Drag emails here to add the sender to the stakeholder register.
                        </p>
                    </div>

                    {/* List of Stakeholders */}
                    <div className="space-y-1">
                        <div className="flex items-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <div className="w-8 mr-3"></div> {/* Grip Spacer */}
                            <div className="w-14 mr-4">Avatar</div>
                            <div className="flex-1">Name / Role</div>
                            <div className="w-[200px] flex justify-end gap-4 mr-4">Analysis</div>
                            <div className="w-6 text-center">Status</div>
                        </div>

                        {identifiedStakeholders.length === 0 ? (
                            <div className="text-center py-12 text-gray-400 text-sm">
                                No stakeholders identified yet. Check your emails.
                            </div>
                        ) : (
                            identifiedStakeholders.map(stakeholder => (
                                <DraggableStakeholderRow key={stakeholder.id} stakeholder={stakeholder} />
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <AnalysisGrid stakeholders={identifiedStakeholders} />
            )}
        </div>
    </div>
  );
};