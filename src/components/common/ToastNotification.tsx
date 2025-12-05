import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { removeNotification } from '../../features/gameSlice';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const ToastNotification: React.FC = () => {
  const notifications = useSelector((state: RootState) => state.game.notifications);

  // Auto-dismiss logic is handled by individual toast items for better control
  
  return (
    <div className="fixed bottom-16 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <ToastItem key={notification.id} notification={notification} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastItemProps {
  notification: {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
  };
}

const ToastItem: React.FC<ToastItemProps> = ({ notification }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const duration = notification.duration || 5000;
    const timer = setTimeout(() => {
      dispatch(removeNotification(notification.id));
    }, duration);

    return () => clearTimeout(timer);
  }, [notification, dispatch]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <CheckCircle size={20} className="text-green-500" />;
      case 'warning': return <AlertTriangle size={20} className="text-yellow-500" />;
      case 'error': return <AlertCircle size={20} className="text-red-500" />;
      default: return <Info size={20} className="text-blue-500" />;
    }
  };

  const getBorderColor = () => {
     switch (notification.type) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'error': return 'border-red-200 bg-red-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      layout
      className={`pointer-events-auto w-80 p-4 rounded-lg shadow-lg border flex items-start gap-3 ${getBorderColor()}`}
    >
      <div className="shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1">
        <h4 className="font-semibold text-sm text-gray-900">{notification.title}</h4>
        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
      </div>
      <button 
        onClick={() => dispatch(removeNotification(notification.id))}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};