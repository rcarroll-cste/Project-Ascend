import React from 'react';
import { ExamSimApp } from '../apps/ExamSimApp';

interface ExamSimScreenProps {
  levelId: number;
}

export const ExamSimScreen: React.FC<ExamSimScreenProps> = ({ levelId }) => {
  return (
    <div className="h-screen w-screen bg-slate-900">
      <div className="h-full max-w-4xl mx-auto">
        <ExamSimApp levelId={levelId} />
      </div>
    </div>
  );
};
