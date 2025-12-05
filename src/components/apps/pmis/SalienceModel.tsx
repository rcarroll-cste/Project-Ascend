import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stakeholder, SalienceClass } from '../../../types';
import { User, Info } from 'lucide-react';

interface SalienceModelProps {
  stakeholders: Stakeholder[];
}

// Color mapping for salience classes
const SALIENCE_COLORS: Record<SalienceClass, { bg: string; border: string; text: string }> = {
  Definitive: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700' },
  Dominant: { bg: 'bg-orange-100', border: 'border-orange-500', text: 'text-orange-700' },
  Dangerous: { bg: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-700' },
  Dependent: { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-700' },
  Dormant: { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-600' },
  Discretionary: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700' },
  Demanding: { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700' },
  None: { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-500' },
};

// Salience class descriptions
const SALIENCE_DESCRIPTIONS: Record<SalienceClass, string> = {
  Definitive: 'Has Power, Urgency, and Legitimacy. Highest priority - must be managed closely.',
  Dominant: 'Has Power and Legitimacy. Important stakeholder with formal authority.',
  Dangerous: 'Has Power and Urgency, but lacks Legitimacy. Can be coercive or violent.',
  Dependent: 'Has Urgency and Legitimacy, but lacks Power. Depends on others for influence.',
  Dormant: 'Has only Power. Low priority until they acquire urgency or legitimacy.',
  Discretionary: 'Has only Legitimacy. No urgency or power to demand attention.',
  Demanding: 'Has only Urgency. Demanding but lacking power or legitimacy.',
  None: 'Lacks all three attributes. Non-stakeholder.',
};

// Calculate position in Venn diagram based on salience attributes
const getVennPosition = (stakeholder: Stakeholder): { x: number; y: number; zone: string } => {
  const power = stakeholder.power === 'High';
  const urgency = stakeholder.urgency === 'High';
  const legitimacy = stakeholder.legitimacy === 'High';

  // Center of the Venn diagram
  const centerX = 200;
  const centerY = 180;

  // Positions for different combinations (approximate)
  if (power && urgency && legitimacy) {
    return { x: centerX, y: centerY, zone: 'center' }; // Definitive - center
  }
  if (power && urgency && !legitimacy) {
    return { x: centerX - 60, y: centerY - 40, zone: 'power-urgency' }; // Dangerous
  }
  if (power && !urgency && legitimacy) {
    return { x: centerX + 60, y: centerY - 40, zone: 'power-legitimacy' }; // Dominant
  }
  if (!power && urgency && legitimacy) {
    return { x: centerX, y: centerY + 60, zone: 'urgency-legitimacy' }; // Dependent
  }
  if (power && !urgency && !legitimacy) {
    return { x: centerX - 100, y: centerY - 80, zone: 'power-only' }; // Dormant
  }
  if (!power && !urgency && legitimacy) {
    return { x: centerX + 100, y: centerY - 80, zone: 'legitimacy-only' }; // Discretionary
  }
  if (!power && urgency && !legitimacy) {
    return { x: centerX, y: centerY + 100, zone: 'urgency-only' }; // Demanding
  }

  return { x: centerX, y: centerY + 150, zone: 'none' }; // None - outside
};

// Attribute bar component
const AttributeBar: React.FC<{ label: string; value: 'High' | 'Low' | 'Unknown'; color: string }> = ({
  label,
  value,
  color,
}) => (
  <div className="flex items-center gap-2">
    <span className="text-xs text-gray-500 w-16">{label}</span>
    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${color}`}
        style={{ width: value === 'High' ? '100%' : value === 'Low' ? '30%' : '0%' }}
      />
    </div>
    <span className="text-xs font-medium w-12 text-right">{value}</span>
  </div>
);

// Stakeholder tooltip with attribute bars
const StakeholderTooltip: React.FC<{ stakeholder: Stakeholder }> = ({ stakeholder }) => {
  const colors = stakeholder.salienceClass
    ? SALIENCE_COLORS[stakeholder.salienceClass]
    : SALIENCE_COLORS.None;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64 -translate-x-1/2 left-1/2 top-full mt-2"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
          {stakeholder.avatarUrl ? (
            <img src={stakeholder.avatarUrl} alt={stakeholder.name} className="w-full h-full object-cover" />
          ) : (
            <User size={20} className="text-slate-500" />
          )}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{stakeholder.name}</h4>
          <p className="text-xs text-gray-500">{stakeholder.role}</p>
        </div>
      </div>

      {/* Salience Class Badge */}
      {stakeholder.salienceClass && (
        <div className={`mb-3 px-2 py-1 rounded text-xs font-semibold ${colors.bg} ${colors.text}`}>
          {stakeholder.salienceClass} Stakeholder
        </div>
      )}

      {/* Attribute Bars */}
      <div className="space-y-2">
        <AttributeBar label="Power" value={stakeholder.power} color="bg-red-500" />
        <AttributeBar label="Urgency" value={stakeholder.urgency} color="bg-amber-500" />
        <AttributeBar label="Legitimacy" value={stakeholder.legitimacy} color="bg-blue-500" />
      </div>

      {/* Description */}
      {stakeholder.salienceClass && (
        <p className="mt-3 text-xs text-gray-500 border-t pt-2">
          {SALIENCE_DESCRIPTIONS[stakeholder.salienceClass]}
        </p>
      )}
    </motion.div>
  );
};

export const SalienceModel: React.FC<SalienceModelProps> = ({ stakeholders }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Only show analyzed stakeholders in the Venn diagram
  const analyzedStakeholders = stakeholders.filter((s) => s.isIdentified);

  return (
    <div className="flex flex-col h-full p-4 bg-gray-50">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800">Salience Model</h3>
        <p className="text-sm text-gray-500">
          Analyze stakeholders based on Power, Urgency, and Legitimacy.
        </p>
      </div>

      {/* Venn Diagram Container */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-[400px] h-[400px]">
          {/* SVG Venn Diagram Circles */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
            {/* Power Circle (Red) */}
            <circle
              cx="160"
              cy="140"
              r="100"
              fill="rgba(239, 68, 68, 0.15)"
              stroke="rgb(239, 68, 68)"
              strokeWidth="2"
            />
            <text x="80" y="70" className="text-sm font-bold" fill="rgb(185, 28, 28)">
              Power
            </text>

            {/* Legitimacy Circle (Blue) */}
            <circle
              cx="240"
              cy="140"
              r="100"
              fill="rgba(59, 130, 246, 0.15)"
              stroke="rgb(59, 130, 246)"
              strokeWidth="2"
            />
            <text x="280" y="70" className="text-sm font-bold" fill="rgb(29, 78, 216)">
              Legitimacy
            </text>

            {/* Urgency Circle (Amber) */}
            <circle
              cx="200"
              cy="220"
              r="100"
              fill="rgba(245, 158, 11, 0.15)"
              stroke="rgb(245, 158, 11)"
              strokeWidth="2"
            />
            <text x="170" y="340" className="text-sm font-bold" fill="rgb(180, 83, 9)">
              Urgency
            </text>
          </svg>

          {/* Stakeholder Avatars */}
          {analyzedStakeholders.map((stakeholder) => {
            const pos = getVennPosition(stakeholder);
            const colors = stakeholder.salienceClass
              ? SALIENCE_COLORS[stakeholder.salienceClass]
              : SALIENCE_COLORS.None;

            return (
              <div
                key={stakeholder.id}
                className="absolute"
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <motion.div
                  className={`relative w-10 h-10 rounded-full ${colors.bg} border-2 ${colors.border} flex items-center justify-center cursor-pointer shadow-md`}
                  whileHover={{ scale: 1.2 }}
                  onMouseEnter={() => setHoveredId(stakeholder.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {stakeholder.avatarUrl ? (
                    <img
                      src={stakeholder.avatarUrl}
                      alt={stakeholder.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User size={18} className={colors.text} />
                  )}

                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredId === stakeholder.id && <StakeholderTooltip stakeholder={stakeholder} />}
                  </AnimatePresence>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Info size={14} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Salience Classes</span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs">
          {(['Definitive', 'Dominant', 'Dangerous', 'Dependent'] as SalienceClass[]).map((cls) => (
            <div key={cls} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded-full ${SALIENCE_COLORS[cls].bg} border ${SALIENCE_COLORS[cls].border}`} />
              <span className={SALIENCE_COLORS[cls].text}>{cls}</span>
            </div>
          ))}
          {(['Dormant', 'Discretionary', 'Demanding', 'None'] as SalienceClass[]).map((cls) => (
            <div key={cls} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded-full ${SALIENCE_COLORS[cls].bg} border ${SALIENCE_COLORS[cls].border}`} />
              <span className={SALIENCE_COLORS[cls].text}>{cls}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
