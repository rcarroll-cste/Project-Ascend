import { useDispatch } from 'react-redux';
import { addNotification } from '../features/gameSlice';
import { nanoid } from '@reduxjs/toolkit';
import { playNotificationSound, playSuccessSound, playErrorSound } from '../utils/audio';

export const useNotification = () => {
  const dispatch = useDispatch();

  const showNotification = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    duration: number = 5000
  ) => {
    
    // Play sound based on type
    if (type === 'success') playSuccessSound();
    else if (type === 'error') playErrorSound();
    else playNotificationSound();

    dispatch(addNotification({
      id: nanoid(),
      title,
      message,
      type,
      duration
    }));
  };

  return { showNotification };
};