import React, { useState } from 'react';
import { User, Mail, MessageCircle } from 'lucide-react';
import { getUserAvatar } from '../../Post/utils/avatarUtils';
import { useAuth } from '../../../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { SendEmailModal } from './modals/SendEmailModal';
import { SendMessageModal } from './modals/SendMessageModal';

interface ProfileHeaderProps {
  user: any;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const { user: currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  
  const avatarId = user?.id || user?.userId;
  const userAvatar = avatarId ? getUserAvatar(avatarId) : '/default-avatar.png';
  
  const urlUserId = searchParams.get('userId');
  const isOwnProfile = !urlUserId || urlUserId === String(currentUser?.userId);

  const handleSendEmail = () => {
    if (!isOwnProfile && user?.email) {
      console.log('📧 Abriendo modal de correo para:', user.email);
      setShowEmailModal(true);
    }
  };

  const handleSendMessage = () => {
    if (!isOwnProfile) {
      console.log('💬 Abriendo modal de mensaje para usuario ID:', user?.id || user?.userId);
      setShowMessageModal(true);
    }
  };

  return (
    <>
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={userAvatar}
                alt="Avatar del usuario"
                className="w-20 h-20 rounded-xl object-cover border-4 border-white/30 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-2 shadow-lg">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {isOwnProfile ? 'Mi Perfil' : `Perfil de ${user?.name}`}
              </h1>
              <p className="text-white/70 text-lg mb-3">
                {isOwnProfile 
                  ? 'Gestiona tu información personal y preferencias'
                  : 'Información del usuario'
                }
              </p>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-white/60" />
                <span className="text-white/60 text-sm font-medium">
                  {user?.name} {user?.secondName}
                </span>
              </div>
              
            </div>
          </div>

          {!isOwnProfile && (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSendEmail}
                disabled={!user?.email}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                title={user?.email ? `Enviar correo a ${user.email}` : 'Email no disponible'}
              >
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Enviar correo</span>
              </button>
              
              <button
                onClick={handleSendMessage}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all duration-200 font-medium shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Enviar Mensaje</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <SendEmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        recipientName={`${user?.name} ${user?.secondName}`}
        recipientEmail={user?.email || ''}
      />

      <SendMessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        recipientName={user?.name || 'Usuario'}
        recipientId={user?.id || user?.userId || 0}
      />
    </>
  );
};