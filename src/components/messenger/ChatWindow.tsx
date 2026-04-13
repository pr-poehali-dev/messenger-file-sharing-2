import { useState, useRef, useEffect } from 'react';
import { Chat, Message, currentUser } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface ChatWindowProps {
  chat: Chat;
  onBack: () => void;
}

export default function ChatWindow({ chat, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const [input, setInput] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages(chat.messages);
  }, [chat.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const msg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      delivered: true,
      type: 'text',
    };
    setMessages(prev => [...prev, msg]);
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const groupByDate = () => {
    const groups: { date: string; msgs: Message[] }[] = [];
    messages.forEach(msg => {
      const date = 'Сегодня';
      const last = groups[groups.length - 1];
      if (last && last.date === date) last.msgs.push(msg);
      else groups.push({ date, msgs: [msg] });
    });
    return groups;
  };

  return (
    <div className="flex flex-col h-full flex-1 bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <button onClick={onBack} className="md:hidden w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
          <Icon name="ArrowLeft" size={18} className="text-muted-foreground" />
        </button>
        <button onClick={() => setShowInfo(!showInfo)} className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity text-left">
          <Avatar user={chat.user} size="md" showOnline />
          <div className="min-w-0">
            <div className="font-semibold text-sm text-foreground">{chat.user.name}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              {chat.user.online ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  <span className="text-green-600 dark:text-green-400">онлайн</span>
                </>
              ) : (
                <span>был(а) {chat.user.lastSeen}</span>
              )}
            </div>
          </div>
        </button>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
            <Icon name="Phone" size={16} className="text-muted-foreground" />
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
            <Icon name="Video" size={16} className="text-muted-foreground" />
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
            <Icon name="MoreVertical" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-1">
        {groupByDate().map(group => (
          <div key={group.date}>
            <div className="flex justify-center my-3">
              <span className="text-[10px] text-muted-foreground bg-muted px-3 py-1 rounded-full">{group.date}</span>
            </div>
            {group.msgs.map((msg, i) => {
              const isMe = msg.senderId === 'me';
              const showAvatar = !isMe && (i === 0 || group.msgs[i - 1]?.senderId !== msg.senderId);
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 mb-1 animate-fade-in ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                  style={{ animationDelay: `${i * 20}ms` }}
                >
                  {!isMe && (
                    <div className="w-7 flex-shrink-0">
                      {showAvatar && <Avatar user={chat.user} size="sm" />}
                    </div>
                  )}
                  <div className={`max-w-[68%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                    <div className={`px-3.5 py-2.5 text-sm leading-relaxed ${isMe ? 'msg-bubble-out' : 'msg-bubble-in text-foreground'}`}>
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-1 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                      {isMe && (
                        <span className="text-[10px]">
                          {msg.read
                            ? <Icon name="CheckCheck" size={12} className="text-primary" />
                            : <Icon name="Check" size={12} className="text-muted-foreground" />
                          }
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-card">
        <div className="flex items-center gap-2 bg-muted rounded-2xl px-3 py-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-background/60 transition-colors flex-shrink-0">
            <Icon name="Paperclip" size={17} className="text-muted-foreground" />
          </button>
          <input
            ref={inputRef}
            type="text"
            placeholder="Сообщение..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
          />
          <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-background/60 transition-colors flex-shrink-0">
            <Icon name="Smile" size={17} className="text-muted-foreground" />
          </button>
          <button
            onClick={send}
            disabled={!input.trim()}
            className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all flex-shrink-0 ${
              input.trim()
                ? 'bg-primary text-primary-foreground hover:opacity-90 scale-100'
                : 'text-muted-foreground cursor-default'
            }`}
          >
            <Icon name="Send" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
