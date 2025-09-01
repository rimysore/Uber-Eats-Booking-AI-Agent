import React from 'react';
import { User } from '../types';
import { X, User as UserIcon, Mail } from 'lucide-react';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 w-full max-w-sm p-6 space-y-4 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          aria-label="Close profile"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4 border-4 border-gray-700">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
        </div>
        
        <div className="space-y-3 pt-4">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <span className="text-gray-300">{user.email}</span>
          </div>
        </div>

      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ProfileModal;
