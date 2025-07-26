import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
  onClose: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onClose
}) => {
  return (
    <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <p className="text-green-100 font-medium">{message}</p>
        </div>
        
        <button
          onClick={onClose}
          className="text-green-300 hover:text-green-100 transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};