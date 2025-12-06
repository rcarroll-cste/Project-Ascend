import React from 'react';
import { motion } from 'framer-motion';
import { FileOutput, Sparkles, AlertTriangle } from 'lucide-react';
import { ProcessCard, ProcessOutput } from '../../../types';

interface OutputPreviewProps {
  selectedProcess: ProcessCard | null;
  calculatedQuality: number;
  assignedInputCount: number;
  requiredInputCount: number;
}

const QualityGauge: React.FC<{ quality: number }> = ({ quality }) => {
  const getQualityColor = () => {
    if (quality >= 80) return 'bg-green-500';
    if (quality >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getQualityLabel = () => {
    if (quality >= 80) return 'High Quality';
    if (quality >= 50) return 'Acceptable';
    return 'Poor Quality';
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">Output Quality</span>
        <span className="font-semibold">{quality}%</span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${quality}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full ${getQualityColor()} rounded-full`}
        />
      </div>
      <p className={`text-xs mt-1 ${quality >= 50 ? 'text-gray-500' : 'text-red-500'}`}>
        {getQualityLabel()}
      </p>
    </div>
  );
};

const OutputCard: React.FC<{ output: ProcessOutput; quality: number }> = ({
  output,
  quality,
}) => {
  const isLowQuality = quality < 50;

  return (
    <div
      className={`
        p-4 rounded-lg border-2 transition-all
        ${isLowQuality ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}
      `}
    >
      <div className="flex items-start gap-3">
        <FileOutput
          size={24}
          className={isLowQuality ? 'text-red-500' : 'text-purple-500'}
        />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{output.name}</h4>
          <p className="text-xs text-gray-500 mt-1">
            Type: {output.documentType}
          </p>
          {isLowQuality && (
            <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
              <AlertTriangle size={14} />
              <span>Low quality may cause issues later</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OutputPreview: React.FC<OutputPreviewProps> = ({
  selectedProcess,
  calculatedQuality,
  assignedInputCount,
  requiredInputCount,
}) => {
  if (!selectedProcess) {
    return (
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Output Preview</h3>
        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-center text-gray-400">
            <Sparkles size={32} className="mx-auto mb-2" />
            <p>Select a process to see outputs</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Output Preview</h3>
      <p className="text-sm text-gray-500 mb-4">
        Documents that will be generated
      </p>

      {/* Quality Gauge */}
      <QualityGauge quality={calculatedQuality} />

      {/* Quality Explanation */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
        <p className="text-xs text-blue-700">
          <strong>Quality Formula:</strong> Based on input document quality and
          completeness ({assignedInputCount}/{requiredInputCount} inputs
          assigned).
        </p>
        {calculatedQuality < 50 && (
          <p className="text-xs text-red-600 mt-1">
            ⚠️ Low-quality outputs may trigger problems in later levels!
          </p>
        )}
      </div>

      {/* Output Documents */}
      <div className="flex-1 space-y-3">
        {selectedProcess.outputs.map((output) => (
          <OutputCard
            key={output.id}
            output={output}
            quality={calculatedQuality}
          />
        ))}
      </div>
    </div>
  );
};

export default OutputPreview;
