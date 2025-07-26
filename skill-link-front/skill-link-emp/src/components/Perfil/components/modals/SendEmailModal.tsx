import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle } from 'lucide-react';

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientEmail: string;
}

export const SendEmailModal: React.FC<SendEmailModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  recipientEmail
}) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    setIsSending(true);
    
    try {
      const token = sessionStorage.getItem('jwt_token');
      
      const response = await fetch('https://skill-link-emprendedor-pjof.onrender.com/api/contact/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          destinatario: recipientEmail,
          asunto: subject.trim(),
          mensaje: body.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.exito) {
        console.log('✅ Correo enviado exitosamente');
        setEmailSent(true);
        
        // Cerrar modal después de mostrar éxito
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        throw new Error(data.mensaje || 'Error al enviar el correo');
      }
      
    } catch (error) {
      console.error('❌ Error al enviar correo:', error);
      alert(error instanceof Error ? error.message : 'Error al enviar el correo. Inténtalo de nuevo.');
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setSubject('');
    setBody('');
    setEmailSent(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${emailSent ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
              {emailSent ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <Mail className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {emailSent ? '¡Correo enviado!' : 'Enviar correo'}
              </h3>
              <p className="text-white/70 text-sm">
                {emailSent ? 'Tu mensaje ha sido enviado exitosamente' : `Para: ${recipientName}`}
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
        {!emailSent ? (
          <div className="p-6 space-y-4">
            {/* Asunto */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Asunto
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Escribe el asunto del correo..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                maxLength={100}
                disabled={isSending}
              />
              <p className="text-white/50 text-xs mt-1">
                {subject.length}/100 caracteres
              </p>
            </div>

            {/* Cuerpo del mensaje */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Mensaje
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
                rows={6}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                maxLength={500}
                disabled={isSending}
              />
              <p className="text-white/50 text-xs mt-1">
                {body.length}/500 caracteres
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">¡Mensaje enviado!</h3>
            <p className="text-white/70 text-sm">
              Tu correo ha sido enviado a {recipientName} exitosamente.
            </p>
          </div>
        )}

        {/* Footer */}
        {!emailSent && (
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
                disabled={isSending || !subject.trim() || !body.trim()}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar</span>
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