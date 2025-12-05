import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Award, RotateCcw, ChevronRight } from 'lucide-react';
import { RootState } from '../../../store';
import { startExam, submitAnswer, finishExam, cancelExam } from '../../../features/examSlice';
import { clearExamPending } from '../../../features/gameSlice';
import { getQuestionsByLevel, PASSING_SCORE } from '../../../data/examQuestions';
import { ExamQuestion } from '../../../types';

interface QuestionViewProps {
  question: ExamQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedIndex: number) => void;
}

const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (index: number) => {
    if (showFeedback) return; // Already answered

    setSelectedIndex(index);
    setIsCorrect(index === question.correctIndex);
    setShowFeedback(true);
  };

  const handleContinue = () => {
    if (selectedIndex !== null) {
      onAnswer(selectedIndex);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col h-full"
    >
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm text-gray-400">
            {Math.round((questionNumber / totalQuestions) * 100)}% Complete
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3 flex-1">
        {question.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrectOption = index === question.correctIndex;

          let optionClass = 'border-gray-200 hover:border-purple-400 hover:bg-purple-50';
          if (showFeedback) {
            if (isCorrectOption) {
              optionClass = 'border-green-500 bg-green-50';
            } else if (isSelected && !isCorrectOption) {
              optionClass = 'border-red-500 bg-red-50';
            } else {
              optionClass = 'border-gray-200 opacity-50';
            }
          } else if (isSelected) {
            optionClass = 'border-purple-500 bg-purple-50';
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={showFeedback}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${optionClass}`}
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-gray-700 pt-0.5">{option}</span>
                {showFeedback && isCorrectOption && (
                  <CheckCircle className="ml-auto text-green-500 flex-shrink-0" size={20} />
                )}
                {showFeedback && isSelected && !isCorrectOption && (
                  <XCircle className="ml-auto text-red-500 flex-shrink-0" size={20} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-lg ${
              isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
              ) : (
                <XCircle className="text-amber-500 flex-shrink-0" size={24} />
              )}
              <div>
                <h4 className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                  {isCorrect ? 'Correct!' : 'Not quite right'}
                </h4>
                <p className="text-sm text-gray-600 mt-1">{question.explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue Button */}
      {showFeedback && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleContinue}
          className="mt-6 w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          {questionNumber === totalQuestions ? 'See Results' : 'Next Question'}
          <ChevronRight size={18} />
        </motion.button>
      )}
    </motion.div>
  );
};

interface ResultsViewProps {
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  levelId: number;
  onClose: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({
  score,
  correctCount,
  totalQuestions,
  passed,
  levelId,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full text-center"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: passed ? 360 : 0 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
          passed ? 'bg-green-100' : 'bg-amber-100'
        }`}
      >
        {passed ? (
          <Award size={48} className="text-green-600" />
        ) : (
          <RotateCcw size={48} className="text-amber-600" />
        )}
      </motion.div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {passed ? 'Performance Review Passed!' : 'Review Needed'}
      </h2>

      {/* Score */}
      <div className="mb-6">
        <div className="text-5xl font-bold text-gray-800 mb-1">{score}%</div>
        <div className="text-gray-500">
          {correctCount} of {totalQuestions} correct
        </div>
      </div>

      {/* Pass/Fail Message */}
      <p className="text-gray-600 max-w-md mb-8">
        {passed
          ? `Excellent work on Level ${levelId}! You've demonstrated solid understanding of the concepts. You may continue to the next level.`
          : `You need ${PASSING_SCORE}% to pass. Review the concepts from Level ${levelId} and try again when ready.`}
      </p>

      {/* Action Button */}
      <button
        onClick={onClose}
        className={`px-8 py-3 rounded-lg font-medium transition-colors ${
          passed
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-amber-600 text-white hover:bg-amber-700'
        }`}
      >
        {passed ? 'Continue' : 'Review & Retry'}
      </button>
    </motion.div>
  );
};

export const ExamSimApp: React.FC = () => {
  const dispatch = useDispatch();
  const { isExamActive, currentLevelId, currentQuestionIndex, answers } = useSelector(
    (state: RootState) => state.exam
  );
  const { examPending, pendingExamLevel } = useSelector((state: RootState) => state.game);

  const [showResults, setShowResults] = useState(false);

  // Auto-start exam when pending
  useEffect(() => {
    if (examPending && pendingExamLevel && !isExamActive) {
      // Start the exam for the pending level
      dispatch(startExam(pendingExamLevel));
      // Clear the pending flag
      dispatch(clearExamPending());
    }
  }, [examPending, pendingExamLevel, isExamActive, dispatch]);

  const questions = currentLevelId ? getQuestionsByLevel(currentLevelId) : [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (selectedIndex: number) => {
    if (!currentQuestion || currentLevelId === null) return;

    const isCorrect = selectedIndex === currentQuestion.correctIndex;

    dispatch(
      submitAnswer({
        questionId: currentQuestion.id,
        selectedIndex,
        isCorrect,
      })
    );

    // Check if this was the last question
    if (currentQuestionIndex + 1 >= questions.length) {
      setShowResults(true);
      dispatch(finishExam());
    }
  };

  const handleClose = () => {
    setShowResults(false);
    dispatch(cancelExam());
  };

  if (!isExamActive && !showResults) {
    return null; // Don't render if not active
  }

  // Calculate results
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const passed = score >= PASSING_SCORE;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <h1 className="text-xl font-bold text-white">Performance Review</h1>
          <p className="text-purple-200 text-sm">
            Level {currentLevelId || pendingExamLevel} Assessment
          </p>
        </div>

        {/* Content */}
        <div className="p-6 h-[calc(90vh-80px)] overflow-y-auto">
          <AnimatePresence mode="wait">
            {showResults ? (
              <ResultsView
                key="results"
                score={score}
                correctCount={correctCount}
                totalQuestions={questions.length}
                passed={passed}
                levelId={currentLevelId || pendingExamLevel || 1}
                onClose={handleClose}
              />
            ) : currentQuestion ? (
              <QuestionView
                key={currentQuestion.id}
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                onAnswer={handleAnswer}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
