import React, { useState } from 'react';
import { X, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientId: number;
}

export const SendMessageModal: React.FC<SendMessageModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  recipientId
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSend = async () => {
    if (!message.trim() || !user?.userId) {
      alert('Por favor escribe un mensaje');
      return;
    }

    setIsSending(true);
    
    try {
      console.log('🚀 Enviando mensaje a:', recipientName, 'ID:', recipientId);
      console.log('📝 Mensaje:', message);
      console.log('👤 Usuario actual:', user.userId);

      const token = sessionStorage.getItem('jwt_token');
      
      // Paso 1: Crear o obtener conversación
      const conversationResponse = await fetch('https://skill-link-emprendedor-pjof.onrender.com/api/conversaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          idUsuario1: parseInt(String(user.userId)),
          idUsuario2: recipientId
        })
      });

      if (!conversationResponse.ok) {
        throw new Error('Error al crear/obtener conversación');
      }

      const conversationData = await conversationResponse.json();
      console.log('✅ Conversación obtenida/creada:', conversationData.id);

      // Paso 2: Enviar mensaje
      const messageResponse = await fetch('https://skill-link-emprendedor-pjof.onrender.com/api/mensajes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          idConversacion: conversationData.id,
          idEmisor: parseInt(String(user.userId)),
          contenido: message.trim()
        })
      });

      if (!messageResponse.ok) {
        throw new Error('Error al enviar mensaje');
      }

      const messageData = await messageResponse.json();
      console.log('✅ Mensaje enviado exitosamente:', messageData.id);

      // Mostrar éxito
      setMessageSent(true);
      
      // Redirigir al chat después de un momento
      setTimeout(() => {
        handleClose();
        navigate(`/messages?conversation=${conversationData.id}`);
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error al enviar mensaje:', error);
      alert('Error al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setMessage('');
    setMessageSent(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${messageSent ? 'bg-green-500/20' : 'bg-cyan-500/20'}`}>
              {messageSent ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <MessageCircle className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {messageSent ? '¡Mensaje enviado!' : 'Enviar mensaje'}
              </h3>
              <p className="text-white/70 text-sm">
                {messageSent ? 'Redirigiendo al chat...' : `Conecta con ${recipientName}`}
              </p>
            </div>
          </div>
          {!isSending && (
            <button
              onClick={handleClose}
              className="text-white/50 hover:text-white transition-colors duration-300 p-1 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        {!messageSent ? (
          <div className="p-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-3">
                Tu mensaje
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hola ${recipientName}, me gustaría conectar contigo...`}
                rows={8}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 resize-none"
                maxLength={300}
                disabled={isSending}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-white/50 text-xs">
                  {message.length}/300 caracteres
                </p>
                <div className="flex items-center space-x-1 text-white/60 text-xs">
                  <MessageCircle className="w-3 h-3" />
                  <span>Mensaje directo</span>
                </div>
              </div>
            </div>

            {/* Sugerencias */}
            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white/70 text-xs mb-2 font-medium">💡 Sugerencias:</p>
              <ul className="text-white/60 text-xs space-y-1">
                <li>• Preséntate brevemente</li>
                <li>• Menciona por qué quieres conectar</li>
                <li>• Sé respetuoso y profesional</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">¡Mensaje enviado!</h3>
            <p className="text-white/70 text-sm mb-4">
              Tu mensaje ha sido enviado a {recipientName} exitosamente.
            </p>
            <div className="flex items-center justify-center space-x-2 text-cyan-400 text-sm">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span>Abriendo chat...</span>
            </div>
          </div>
        )}

        {/* Footer */}
        {!messageSent && (
          <div className="p-6 border-t border-white/10">
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                disabled={isSending}
                className="flex-1 bg-white/10 text-white font-semibold py-3 px-4 rounded-xl hover:bg-white/15 transition-all duration-300 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSend}
                disabled={isSending || !message.trim()}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-cyan-700 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar mensaje</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};