import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardCheck,
  CheckCircle,
  XCircle,
  ArrowRight,
  Award,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { RootState } from '../../store';
import { passExam, failExam, setGameStage } from '../../features/gameSlice';
import { getRandomExamQuestions, PASSING_SCORE } from '../../data/examQuestions';
import { ExamQuestion } from '../../types';

interface ExamSimAppProps {
  levelId: number;
  onClose?: () => void;
}

type ExamStage = 'intro' | 'questions' | 'review' | 'results';

export const ExamSimApp: React.FC<ExamSimAppProps> = ({ levelId, onClose }) => {
  const dispatch = useDispatch();
  const playerName = useSelector((state: RootState) => state.player.name);

  const [stage, setStage] = useState<ExamStage>('intro');
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ questionId: string; selected: number; correct: boolean }[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    // Load random questions for this level
    const examQuestions = getRandomExamQuestions(levelId, 5);
    setQuestions(examQuestions);
  }, [levelId]);

  const currentQuestion = questions[currentQuestionIndex];
  const score = answers.filter(a => a.correct).length;
  const totalQuestions = questions.length;
  const percentageScore = Math.round((score / totalQuestions) * 100);
  const passed = percentageScore >= PASSING_SCORE;

  const handleStartExam = () => {
    setStage('questions');
  };

  const handleSelectAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctIndex;
    setAnswers([
      ...answers,
      {
        questionId: currentQuestion.id,
        selected: selectedAnswer,
        correct: isCorrect,
      },
    ]);
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setStage('results');
    }
  };

  const handleFinish = () => {
    if (passed) {
      dispatch(passExam(levelId));
    } else {
      dispatch(failExam(levelId));
    }

    // Check if this is the final level (Level 2 for demo)
    if (levelId === 2) {
      dispatch(setGameStage('Ending'));
    } else {
      dispatch(setGameStage('LevelComplete'));
    }

    onClose?.();
  };

  const levelTitle = levelId === 1 ? 'The Handover' : 'Who\'s Who?';
  const processName = levelId === 1 ? 'Develop Project Charter (4.1)' : 'Identify Stakeholders (13.1)';

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="w-6 h-6" />
          <div>
            <h2 className="font-bold text-lg">Performance Review</h2>
            <p className="text-indigo-200 text-sm">Level {levelId}: {levelTitle}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <AnimatePresence mode="wait">
          {/* Intro Stage */}
          {stage === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex flex-col items-center justify-center text-center"
            >
              <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-10 h-10 text-indigo-400" />
              </div>

              <h3 className="text-2xl font-bold mb-2">Ready for Assessment, {playerName}?</h3>
              <p className="text-slate-400 mb-6 max-w-md">
                You've completed <span className="text-indigo-400 font-semibold">{processName}</span>.
                Answer 5 questions to test your understanding.
              </p>

              <div className="bg-slate-800/50 rounded-lg p-4 mb-6 text-left max-w-sm">
                <h4 className="font-semibold mb-2 text-indigo-300">Exam Details:</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• 5 randomly selected questions</li>
                  <li>• Immediate feedback after each answer</li>
                  <li>• {PASSING_SCORE}% required to pass</li>
                </ul>
              </div>

              <button
                onClick={handleStartExam}
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center gap-2"
              >
                Begin Assessment
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* Questions Stage */}
          {stage === 'questions' && currentQuestion && (
            <motion.div
              key={`question-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                  <span>{answers.filter(a => a.correct).length} correct</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + (showFeedback ? 1 : 0)) / totalQuestions) * 100}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  />
                </div>
              </div>

              {/* Question */}
              <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
                <p className="text-lg leading-relaxed">{currentQuestion.question}</p>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQuestion.correctIndex;
                  const showCorrectness = showFeedback;

                  let bgClass = 'bg-slate-800/50 hover:bg-slate-700/50 border-slate-600';
                  if (showCorrectness) {
                    if (isCorrect) {
                      bgClass = 'bg-green-500/20 border-green-500';
                    } else if (isSelected && !isCorrect) {
                      bgClass = 'bg-red-500/20 border-red-500';
                    }
                  } else if (isSelected) {
                    bgClass = 'bg-indigo-500/20 border-indigo-500';
                  }

                  return (
                    <motion.button
                      key={index}
                      whileHover={!showFeedback ? { scale: 1.01 } : {}}
                      whileTap={!showFeedback ? { scale: 0.99 } : {}}
                      onClick={() => handleSelectAnswer(index)}
                      disabled={showFeedback}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-start gap-3 ${bgClass}`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5
                        ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-500'}
                        ${showCorrectness && isCorrect ? 'border-green-500 bg-green-500' : ''}
                        ${showCorrectness && isSelected && !isCorrect ? 'border-red-500 bg-red-500' : ''}
                      `}>
                        {showCorrectness && isCorrect && <CheckCircle className="w-4 h-4 text-white" />}
                        {showCorrectness && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-white" />}
                        {!showCorrectness && isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span>{option}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`rounded-lg p-4 mb-6 ${
                      selectedAnswer === currentQuestion.correctIndex
                        ? 'bg-green-500/20 border border-green-500/50'
                        : 'bg-amber-500/20 border border-amber-500/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {selectedAnswer === currentQuestion.correctIndex ? (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={`font-semibold mb-1 ${
                          selectedAnswer === currentQuestion.correctIndex ? 'text-green-300' : 'text-amber-300'
                        }`}>
                          {selectedAnswer === currentQuestion.correctIndex ? 'Correct!' : 'Learning Moment'}
                        </p>
                        <p className="text-slate-300 text-sm">{currentQuestion.explanation}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="mt-auto">
                {!showFeedback ? (
                  <button
                    onClick={handleConfirmAnswer}
                    disabled={selectedAnswer === null}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      selectedAnswer !== null
                        ? 'bg-indigo-600 hover:bg-indigo-700'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Confirm Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                  >
                    {currentQuestionIndex < questions.length - 1 ? (
                      <>
                        Next Question
                        <ArrowRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        View Results
                        <Award className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Results Stage */}
          {stage === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center"
            >
              {/* Score Display */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 ${
                  passed
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                    : 'bg-gradient-to-br from-amber-500 to-orange-600'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold">{score}/{totalQuestions}</div>
                  <div className="text-sm opacity-80">{percentageScore}%</div>
                </div>
              </motion.div>

              {/* Result Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {passed ? (
                  <>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Award className="w-6 h-6 text-green-400" />
                      <h3 className="text-2xl font-bold text-green-400">Assessment Passed!</h3>
                    </div>
                    <p className="text-slate-400 mb-6">
                      Excellent work, {playerName}! You've demonstrated solid understanding.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-amber-400 mb-2">Keep Learning!</h3>
                    <p className="text-slate-400 mb-6">
                      You needed {PASSING_SCORE}% to pass. Review the concepts and try again.
                    </p>
                  </>
                )}
              </motion.div>

              {/* Answer Summary */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="w-full max-w-md bg-slate-800/50 rounded-lg p-4 mb-6"
              >
                <h4 className="font-semibold mb-3 text-left">Answer Summary:</h4>
                <div className="space-y-2">
                  {answers.map((answer, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-sm p-2 rounded ${
                        answer.correct ? 'bg-green-500/10' : 'bg-red-500/10'
                      }`}
                    >
                      {answer.correct ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-slate-300">Question {index + 1}</span>
                      <span className={answer.correct ? 'text-green-400' : 'text-red-400'}>
                        {answer.correct ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex gap-3"
              >
                {!passed && (
                  <button
                    onClick={() => {
                      setStage('intro');
                      setCurrentQuestionIndex(0);
                      setSelectedAnswer(null);
                      setAnswers([]);
                      setShowFeedback(false);
                      setQuestions(getRandomExamQuestions(levelId, 5));
                    }}
                    className="px-6 py-3 bg-slate-700 rounded-lg font-semibold hover:bg-slate-600 transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Try Again
                  </button>
                )}
                <button
                  onClick={handleFinish}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
