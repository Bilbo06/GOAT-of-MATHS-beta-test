import React, { useRef, useEffect } from 'react';
import { UserData, PrivateMessage } from '../../types';
import { SHOP_ITEMS } from '../../constants';

interface PrivateChatScreenProps {
  currentUser: UserData;
  friend: UserData;
  conversation: PrivateMessage[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
}

const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

export const PrivateChatScreen: React.FC<PrivateChatScreenProps> = ({ currentUser, friend, conversation, onSendMessage, onBack }) => {
  const [newMessage, setNewMessage] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const friendAvatar = friend.avatarId ? SHOP_ITEMS.find(i => i.id === friend.avatarId) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [conversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
        {/* Header */}
        <div className="flex items-center p-3 border-b border-border-light dark:border-border-dark flex-shrink-0">
            <button onClick={onBack} className="px-3 py-1 mr-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-2xl">
                ‹
            </button>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-lg">
                {friendAvatar ? <span className="text-2xl">{friendAvatar.icon}</span> : friend.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold ml-3">{friend.name}</h2>
        </div>

        {/* Messages */}
        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
            {conversation.map((msg) => {
              const isCurrentUser = msg.fromUserId === currentUser.id;
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
                      <p className={`text-xs ${isCurrentUser ? 'text-blue-200/80' : 'text-text-muted-light dark:text-text-muted-dark'}`}>
                        {formatTimestamp(msg.timestamp)}
                      </p>
                    </div>
                    <p className="mt-1 text-base break-words">{msg.text}</p>
                  </div>
                </div>
              );
            })}
             {conversation.length === 0 && (
                <div className="flex-grow flex flex-col items-center justify-center text-center text-text-muted-light dark:text-text-muted-dark h-full">
                    <span className="text-6xl mb-4">👋</span>
                    <h3 className="text-xl font-semibold">Ceci est le début de votre conversation</h3>
                    <p>Dites bonjour à {friend.name} !</p>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 bg-card-light dark:bg-card-dark border-t border-border-light dark:border-border-dark mt-auto">
            <div className="flex items-center gap-2">
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Envoyer un message à ${friend.name}`}
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