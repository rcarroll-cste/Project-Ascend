import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExamState, ExamResult } from '../types';
import { getQuestionsByLevel, PASSING_SCORE } from '../data/examQuestions';

const initialState: ExamState = {
  isExamActive: false,
  currentLevelId: null,
  currentQuestionIndex: 0,
  answers: [],
  results: [],
};

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    // Start an exam for a specific level
    startExam: (state, action: PayloadAction<number>) => {
      state.isExamActive = true;
      state.currentLevelId = action.payload;
      state.currentQuestionIndex = 0;
      state.answers = [];
    },

    // Submit an answer for the current question
    submitAnswer: (
      state,
      action: PayloadAction<{ questionId: string; selectedIndex: number; isCorrect: boolean }>
    ) => {
      const { questionId, selectedIndex, isCorrect } = action.payload;

      state.answers.push({
        questionId,
        selectedIndex,
        isCorrect,
      });

      // Move to next question
      state.currentQuestionIndex += 1;
    },

    // Finish the exam and calculate results
    finishExam: (state) => {
      if (state.currentLevelId === null) return;

      const questions = getQuestionsByLevel(state.currentLevelId);
      const correctCount = state.answers.filter((a) => a.isCorrect).length;
      const score = Math.round((correctCount / questions.length) * 100);

      const result: ExamResult = {
        levelId: state.currentLevelId,
        score,
        totalQuestions: questions.length,
        passed: score >= PASSING_SCORE,
        answers: [...state.answers],
        completedAt: Date.now(),
      };

      state.results.push(result);
      state.isExamActive = false;
      state.currentLevelId = null;
      state.currentQuestionIndex = 0;
      state.answers = [];
    },

    // Cancel/close the exam
    cancelExam: (state) => {
      state.isExamActive = false;
      state.currentLevelId = null;
      state.currentQuestionIndex = 0;
      state.answers = [];
    },

    // Reset all exam data (for new game)
    resetExamState: () => initialState,
  },
});

export const {
  startExam,
  submitAnswer,
  finishExam,
  cancelExam,
  resetExamState,
} = examSlice.actions;

export default examSlice.reducer;
