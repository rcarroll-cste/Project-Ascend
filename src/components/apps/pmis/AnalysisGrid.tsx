import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Stakeholder, PowerLevel, InterestLevel } from '../../../types';
import { User, HelpCircle, LayoutGrid, CircleDot } from 'lucide-react';
import { SalienceModel } from './SalienceModel';

type ViewMode = 'grid' | 'salience';

interface AnalysisGridProps {
  stakeholders: Stakeholder[];
}

const Quadrant: React.FC<{
  power: PowerLevel;
  interest: InterestLevel;
  label: string;
  colorClass: string;
  stakeholders: Stakeholder[];
}> = ({ power, interest, label, colorClass, stakeholders }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `quadrant-${power}-${interest}`,
    data: {
      type: 'quadrant',
      power,
      interest,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative p-4 border-2 rounded-lg transition-colors flex flex-col gap-2 min-h-[150px]
        ${isOver ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'}
        ${colorClass}
      `}
    >
      <div className="absolute top-2 right-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
        {label}
      </div>
      
      {/* Content */}
      <div className="flex flex-wrap gap-2 mt-6">
        {stakeholders.map((sh) => (
          <div 
            key={sh.id} 
            className="flex items-center gap-2 px-2 py-1 bg-white rounded shadow-sm border border-gray-200 text-xs font-medium"
            title={sh.role}
          >
            {sh.avatarUrl ? (
                <img src={sh.avatarUrl} alt={sh.name} className="w-5 h-5 rounded-full" />
            ) : (
                <User size={12} />
            )}
            {sh.name}
            {sh.isAnalyzed && <div className="w-1.5 h-1.5 rounded-full bg-green-500 ml-1" />}
          </div>
        ))}
      </div>
    </div>
  );
};

// Power/Interest Grid View Component
const GridView: React.FC<{ stakeholders: Stakeholder[] }> = ({ stakeholders }) => {
  const getStakeholdersInQuadrant = (power: PowerLevel, interest: InterestLevel) => {
    return stakeholders.filter(s => s.isAnalyzed && s.power === power && s.interest === interest);
  };

  return (
    <>
      <div className="flex-1 grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-4">
        {/* Y-Axis Label */}
        <div className="row-start-2 flex items-center justify-center">
          <div className="-rotate-90 text-sm font-bold text-gray-400 tracking-widest uppercase whitespace-nowrap">
            Power
          </div>
        </div>

        {/* X-Axis Label */}
        <div className="col-start-2 flex items-center justify-center">
          <div className="text-sm font-bold text-gray-400 tracking-widest uppercase">
            Interest
          </div>
        </div>

        {/* The Grid */}
        <div className="col-start-2 row-start-2 grid grid-cols-2 grid-rows-2 gap-4 h-full min-h-[400px]">
          {/* High Power / Low Interest (Keep Satisfied) */}
          <Quadrant
            power="High"
            interest="Low"
            label="Keep Satisfied"
            colorClass="bg-red-50/30"
            stakeholders={getStakeholdersInQuadrant('High', 'Low')}
          />

          {/* High Power / High Interest (Manage Closely) */}
          <Quadrant
            power="High"
            interest="High"
            label="Manage Closely"
            colorClass="bg-green-50/30"
            stakeholders={getStakeholdersInQuadrant('High', 'High')}
          />

          {/* Low Power / Low Interest (Monitor) */}
          <Quadrant
            power="Low"
            interest="Low"
            label="Monitor"
            colorClass="bg-gray-100/50"
            stakeholders={getStakeholdersInQuadrant('Low', 'Low')}
          />

          {/* Low Power / High Interest (Keep Informed) */}
          <Quadrant
            power="Low"
            interest="High"
            label="Keep Informed"
            colorClass="bg-yellow-50/30"
            stakeholders={getStakeholdersInQuadrant('Low', 'High')}
          />
        </div>
      </div>

      {/* Legend / Help */}
      <div className="mt-4 flex gap-4 text-xs text-gray-500 justify-center">
        <div className="flex items-center gap-1">
          <HelpCircle size={14} />
          <span>Green dot indicates correct analysis</span>
        </div>
      </div>
    </>
  );
};

export const AnalysisGrid: React.FC<AnalysisGridProps> = ({ stakeholders }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  return (
    <div className="flex flex-col h-full p-4 bg-gray-50">
      {/* Header with View Toggle */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-center flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {viewMode === 'grid' ? 'Stakeholder Analysis Matrix' : 'Salience Model'}
          </h3>
          <p className="text-sm text-gray-500">
            {viewMode === 'grid'
              ? 'Drag stakeholders to the correct quadrant based on their Power and Interest.'
              : 'Analyze stakeholders based on Power, Urgency, and Legitimacy.'}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <LayoutGrid size={14} />
            Grid
          </button>
          <button
            onClick={() => setViewMode('salience')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'salience'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <CircleDot size={14} />
            Salience
          </button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'grid' ? (
        <GridView stakeholders={stakeholders} />
      ) : (
        <SalienceModel stakeholders={stakeholders} />
      )}
    </div>
  );
};