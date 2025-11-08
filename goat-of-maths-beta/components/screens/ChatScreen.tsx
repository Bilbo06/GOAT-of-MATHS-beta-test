import React, { useState, useRef, useEffect } from 'react';
import { Message, UserData } from '../../types';

interface ChatScreenProps {
  userData: UserData;
}

const formatTimestamp = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

export const ChatScreen: React.FC<ChatScreenProps> = ({ userData }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showInfo, setShowInfo] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialiser avec des messages de démonstration
    const initialMessages: Message[] = [
      { id: 1, authorId: 'student_002', author: 'Emma', text: 'Salut tout le monde ! 👋', timestamp: new Date(Date.now() - 10 * 60 * 1000) },
      { id: 2, authorId: 'student_003', author: 'Thomas', text: 'Quelqu\'un peut m\'aider sur les équations du 2nd degré ?', timestamp: new Date(Date.now() - 8 * 60 * 1000) },
      { id: 3, authorId: 'student_004', author: 'Léa', text: 'Oui, dis-moi ce que tu ne comprends pas !', timestamp: new Date(Date.now() - 5 * 60 * 1000) },
      { id: 4, authorId: 'student_003', author: 'Thomas', text: 'C\'est le discriminant que je ne comprends pas bien', timestamp: new Date(Date.now() - 3 * 60 * 1000) },
      { id: 5, authorId: userData.id, author: userData.name, text: 'Le discriminant c\'est b²-4ac, si > 0 il y a 2 solutions', timestamp: new Date(Date.now() - 2 * 60 * 1000) },
      { id: 6, authorId: 'student_002', author: 'Emma', text: 'Quelqu\'un a fait le quiz de trigo ?', timestamp: new Date(Date.now() - 1 * 60 * 1000) },
      { id: 7, authorId: 'student_005', author: 'Hugo', text: 'Oui ! J\'ai eu 80%, c\'était dur 😅', timestamp: new Date(Date.now() - 30 * 1000) },
      { id: 8, authorId: 'student_006', author: 'Chloé', text: 'Moi j\'ai réussi à avoir 100% ! 🎉', timestamp: new Date(Date.now() - 5 * 1000) },
    ];
    setMessages(initialMessages);
  }, [userData.name, userData.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    if (userData.isMuted && userData.muteEndDate && new Date(userData.muteEndDate) > new Date()) {
        alert(`Vous êtes muet jusqu'à ${new Date(userData.muteEndDate).toLocaleString('fr-FR')}.`);
        return;
    }

    const messageToSend: Message = {
      id: Date.now(),
      authorId: userData.id,
      author: userData.name,
      text: newMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, messageToSend]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
      <div className="text-center p-4 border-b border-border-light dark:border-border-dark">
        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">💬 Le Foyer</h2>
        <p className="text-md text-text-muted-light dark:text-text-muted-dark">Chat de classe</p>
      </div>
      
      {showInfo && (
        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 mx-4 mt-4 rounded-lg flex items-center justify-between gap-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">ℹ️ Sois respectueux et entraide-toi avec tes camarades !</p>
            <button onClick={() => setShowInfo(false)} className="text-blue-800 dark:text-blue-200 font-bold text-lg">&times;</button>
        </div>
      )}

      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => {
          const isCurrentUser = msg.author === userData.name;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[90%] md:max-w-[70%] p-3 rounded-2xl shadow-sm ${
                isCurrentUser
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark rounded-bl-none border border-border-light dark:border-border-dark'
              }`}>
                <div className="flex justify-between items-baseline gap-3">
                  <p className={`text-sm font-bold ${isCurrentUser ? 'text-blue-200' : 'text-primary'}`}>
                    {isCurrentUser ? 'Moi' : msg.author}
                  </p>
                  <p className={`text-xs ${isCurrentUser ? 'text-blue-200/80' : 'text-text-muted-light dark:text-text-muted-dark'}`}>
                    {formatTimestamp(msg.timestamp)}
                  </p>
                </div>
                <p className="mt-1 text-base break-words">{msg.text}</p>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="flex-grow flex flex-col items-center justify-center text-center text-text-muted-light dark:text-text-muted-dark h-full">
            <span className="text-6xl mb-4">💬</span>
            <h3 className="text-xl font-semibold">Aucun message pour le moment</h3>
            <p>Sois le premier à écrire !</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-card-light dark:bg-card-dark border-t border-border-light dark:border-border-dark mt-auto">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écris ton message..."
            className="flex-grow w-full px-4 py-3 text-base rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:outline-none transition text-text-light dark:text-text-dark"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary hover:bg-primary-hover text-white text-2xl font-bold disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all transform hover:scale-110"
            aria-label="Envoyer le message"
          >
            ✈️
          </button>
        </div>
      </form>
    </div>
  );
};