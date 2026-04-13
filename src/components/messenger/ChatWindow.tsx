import { useState, useRef, useEffect } from 'react';
import { Chat, Message, currentUser } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';
import GroupChannelSettings from './GroupChannelSettings';

const EMOJI_LIST = [
  '😀','😂','🥰','😎','🤔','😅','🥳','😍',
  '👍','👎','❤️','🔥','💯','🎉','✅','🙏',
  '😭','😤','🤣','😊','😇','🤩','😴','🥺',
  '👏','💪','🫂','🤝','✌️','🤙','💬','📌',
  '🚀','⭐','💡','🎯','💎','🌟','⚡','🎁',
];

const STICKER_PACK = [
  { id: 's1', emoji: '🐶', label: 'Собачка' },
  { id: 's2', emoji: '🐱', label: 'Котик' },
  { id: 's3', emoji: '🦊', label: 'Лиса' },
  { id: 's4', emoji: '🐻', label: 'Мишка' },
  { id: 's5', emoji: '🐼', label: 'Панда' },
  { id: 's6', emoji: '🐨', label: 'Коала' },
  { id: 's7', emoji: '🦁', label: 'Лев' },
  { id: 's8', emoji: '🐯', label: 'Тигр' },
  { id: 's9', emoji: '🦄', label: 'Единорог' },
  { id: 's10', emoji: '🐸', label: 'Лягушка' },
  { id: 's11', emoji: '🐧', label: 'Пингвин' },
  { id: 's12', emoji: '🦋', label: 'Бабочка' },
];

interface ChatWindowProps {
  chat: Chat;
  onBack: () => void;
}

type PanelMode = null | 'emoji' | 'stickers' | 'create-sticker';

export default function ChatWindow({ chat, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const [input, setInput] = useState('');
  const [panel, setPanel] = useState<PanelMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [contextMsg, setContextMsg] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [myStickers, setMyStickers] = useState<{ id: string; url: string }[]>([]);
  const [stickerTab, setStickerTab] = useState<'pack' | 'my'>('pack');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const isChannel = chat.type === 'channel';
  const isGroup = chat.type === 'group';
  const canWrite = !isChannel || chat.group?.isAdmin;

  useEffect(() => {
    setMessages(chat.messages);
    setPanel(null);
    setEditingId(null);
    setContextMsg(null);
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
    setPanel(null);
  };

  const sendSticker = (emoji: string) => {
    const msg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: emoji,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      read: false, delivered: true, type: 'sticker',
    };
    setMessages(prev => [...prev, msg]);
    setPanel(null);
  };

  const sendCustomSticker = (url: string) => {
    const msg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: '',
      stickerUrl: url,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      read: false, delivered: true, type: 'sticker',
    };
    setMessages(prev => [...prev, msg]);
    setPanel(null);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const startEdit = (msg: Message) => {
    setEditingId(msg.id);
    setEditText(msg.text);
    setContextMsg(null);
    setPanel(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const saveEdit = () => {
    if (!editText.trim()) return;
    setMessages(prev => prev.map(m =>
      m.id === editingId ? { ...m, text: editText.trim(), edited: true } : m
    ));
    setEditingId(null);
    setEditText('');
  };

  const deleteMsg = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    setContextMsg(null);
  };

  const handleStickerCreate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setMyStickers(prev => [...prev, { id: Date.now().toString(), url }]);
      setStickerTab('my');
      setPanel('stickers');
    };
    reader.readAsDataURL(file);
  };

  const chatName = chat.type === 'private' ? chat.user?.name : chat.group?.name;
  const chatSub = chat.type === 'group'
    ? `${chat.group?.membersCount} участников · ${chat.group?.online} онлайн`
    : chat.type === 'channel'
    ? `${chat.group?.membersCount?.toLocaleString()} подписчиков`
    : chat.user?.online ? 'онлайн' : `был(а) ${chat.user?.lastSeen}`;

  // Show group/channel settings
  if (showSettings && chat.group) {
    return <GroupChannelSettings group={chat.group} onClose={() => setShowSettings(false)} />;
  }

  return (
    <div className="flex flex-col h-full flex-1 bg-background" onClick={() => { if (contextMsg) setContextMsg(null); }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <button onClick={onBack} className="md:hidden w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
          <Icon name="ArrowLeft" size={18} className="text-muted-foreground" />
        </button>
        <button onClick={() => (isGroup || isChannel) ? setShowSettings(true) : null} className="flex items-center gap-3 flex-1 min-w-0 text-left">
          {(isGroup || isChannel) ? (
            <div className={`w-10 h-10 rounded-full ${chat.group?.avatarColor || 'bg-primary'} flex items-center justify-center flex-shrink-0`}>
              <span className="text-white text-sm font-semibold">
                {chatName?.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </span>
            </div>
          ) : (
            <Avatar user={chat.user!} size="md" showOnline />
          )}
          <div className="min-w-0">
            <div className="font-semibold text-sm text-foreground flex items-center gap-1.5">
              {chatName}
              {isChannel && <Icon name="Radio" size={12} className="text-primary" />}
              {isGroup && <Icon name="Users" size={12} className="text-primary" />}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              {chat.type === 'private' && chat.user?.online && (
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              )}
              <span className={chat.type === 'private' && chat.user?.online ? 'text-green-600 dark:text-green-400' : ''}>
                {chatSub}
              </span>
            </div>
          </div>
        </button>
        <div className="flex items-center gap-1">
          {!isChannel && <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
            <Icon name="Phone" size={16} className="text-muted-foreground" />
          </button>}
          {!isChannel && <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
            <Icon name="Video" size={16} className="text-muted-foreground" />
          </button>}
          <button
            onClick={() => (isGroup || isChannel) ? setShowSettings(true) : null}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
          >
            <Icon name="MoreVertical" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-1">
        {/* Date separator */}
        <div className="flex justify-center my-3">
          <span className="text-[10px] text-muted-foreground bg-muted px-3 py-1 rounded-full">Сегодня</span>
        </div>

        {messages.map((msg, i) => {
          const isMe = msg.senderId === 'me';
          const showAvatar = !isMe && (i === 0 || messages[i - 1]?.senderId !== msg.senderId);
          const isCtx = contextMsg === msg.id;
          const isSticker = msg.type === 'sticker';

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 mb-1 animate-fade-in ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              style={{ animationDelay: `${i * 15}ms` }}
            >
              {!isMe && (
                <div className="w-7 flex-shrink-0">
                  {showAvatar && chat.user && <Avatar user={chat.user} size="sm" />}
                  {showAvatar && !chat.user && (
                    <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center">
                      <span className="text-white text-[9px] font-bold">U</span>
                    </div>
                  )}
                </div>
              )}

              <div className={`max-w-[68%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5 relative`}>
                {/* Context menu */}
                {isCtx && (
                  <div className={`absolute ${isMe ? 'right-0' : 'left-0'} bottom-full mb-1 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-scale-in min-w-36`}
                    onClick={e => e.stopPropagation()}
                  >
                    {isMe && (
                      <button onClick={() => startEdit(msg)} className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-muted text-sm text-foreground transition-colors">
                        <Icon name="Pencil" size={14} className="text-muted-foreground" />
                        Редактировать
                      </button>
                    )}
                    <button className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-muted text-sm text-foreground transition-colors">
                      <Icon name="Forward" size={14} className="text-muted-foreground" />
                      Переслать
                    </button>
                    <button className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-muted text-sm text-foreground transition-colors">
                      <Icon name="Copy" size={14} className="text-muted-foreground" />
                      Копировать
                    </button>
                    {isMe && (
                      <button onClick={() => deleteMsg(msg.id)} className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-destructive/10 text-sm text-destructive transition-colors">
                        <Icon name="Trash2" size={14} />
                        Удалить
                      </button>
                    )}
                  </div>
                )}

                <button
                  onContextMenu={e => { e.preventDefault(); setContextMsg(isCtx ? null : msg.id); }}
                  onClick={() => setContextMsg(isCtx ? null : msg.id)}
                  className="text-left"
                >
                  {isSticker ? (
                    <div className={`${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                      {msg.stickerUrl ? (
                        <img src={msg.stickerUrl} alt="sticker" className="w-24 h-24 rounded-2xl object-cover" />
                      ) : (
                        <span className="text-6xl leading-none select-none">{msg.text}</span>
                      )}
                    </div>
                  ) : (
                    <div className={`px-3.5 py-2.5 text-sm leading-relaxed ${isMe ? 'msg-bubble-out' : 'msg-bubble-in text-foreground'}`}>
                      {msg.text}
                      {msg.edited && <span className="text-[9px] opacity-60 ml-1">ред.</span>}
                    </div>
                  )}
                </button>

                <div className={`flex items-center gap-1 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                  {isMe && (
                    msg.read
                      ? <Icon name="CheckCheck" size={12} className="text-primary" />
                      : <Icon name="Check" size={12} className="text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Emoji / Sticker panel */}
      {panel === 'emoji' && (
        <div className="border-t border-border bg-card px-4 py-3 animate-fade-in">
          <div className="grid grid-cols-8 gap-1">
            {EMOJI_LIST.map(e => (
              <button key={e} onClick={() => setInput(v => v + e)} className="text-2xl p-1 rounded-lg hover:bg-muted transition-colors">
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      {panel === 'stickers' && (
        <div className="border-t border-border bg-card animate-fade-in">
          <div className="flex items-center px-4 pt-3 gap-3 border-b border-border pb-2">
            <button onClick={() => setStickerTab('pack')} className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${stickerTab === 'pack' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
              Стандартные
            </button>
            <button onClick={() => setStickerTab('my')} className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${stickerTab === 'my' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
              Мои стикеры {myStickers.length > 0 && `(${myStickers.length})`}
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="ml-auto flex items-center gap-1.5 text-xs text-primary font-medium hover:opacity-80 transition-opacity"
            >
              <Icon name="Plus" size={14} />
              Создать
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleStickerCreate} />
          </div>
          <div className="px-4 py-3">
            {stickerTab === 'pack' ? (
              <div className="grid grid-cols-6 gap-2">
                {STICKER_PACK.map(s => (
                  <button key={s.id} onClick={() => sendSticker(s.emoji)} className="aspect-square rounded-2xl bg-muted flex items-center justify-center text-3xl hover:bg-muted/70 hover:scale-105 transition-all">
                    {s.emoji}
                  </button>
                ))}
              </div>
            ) : myStickers.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground mb-3">Нет своих стикеров</p>
                <button onClick={() => fileRef.current?.click()} className="text-sm text-primary font-medium hover:opacity-80">
                  Создать из фото
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {myStickers.map(s => (
                  <button key={s.id} onClick={() => sendCustomSticker(s.url)} className="aspect-square rounded-2xl overflow-hidden hover:scale-105 transition-all">
                    <img src={s.url} alt="sticker" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input */}
      {canWrite ? (
        <div className="px-4 py-3 border-t border-border bg-card">
          {editingId && (
            <div className="flex items-center gap-2 mb-2 px-1">
              <Icon name="Pencil" size={13} className="text-primary" />
              <span className="text-xs text-primary">Редактирование сообщения</span>
              <button onClick={() => { setEditingId(null); setEditText(''); }} className="ml-auto">
                <Icon name="X" size={13} className="text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 bg-muted rounded-2xl px-3 py-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-background/60 transition-colors flex-shrink-0">
              <Icon name="Paperclip" size={17} className="text-muted-foreground" />
            </button>
            <input
              ref={inputRef}
              type="text"
              placeholder="Сообщение..."
              value={editingId ? editText : input}
              onChange={e => editingId ? setEditText(e.target.value) : setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (editingId) { saveEdit(); } else { send(); }
                }
              }}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
            />
            <button
              onClick={() => setPanel(p => p === 'stickers' ? null : 'stickers')}
              className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors flex-shrink-0 ${panel === 'stickers' ? 'bg-primary/20 text-primary' : 'hover:bg-background/60 text-muted-foreground'}`}
            >
              <Icon name="Sticker" size={17} />
            </button>
            <button
              onClick={() => setPanel(p => p === 'emoji' ? null : 'emoji')}
              className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors flex-shrink-0 ${panel === 'emoji' ? 'bg-primary/20 text-primary' : 'hover:bg-background/60 text-muted-foreground'}`}
            >
              <Icon name="Smile" size={17} />
            </button>
            <button
              onClick={editingId ? saveEdit : send}
              disabled={!(editingId ? editText.trim() : input.trim())}
              className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all flex-shrink-0 ${
                (editingId ? editText.trim() : input.trim())
                  ? 'bg-primary text-primary-foreground hover:opacity-90'
                  : 'text-muted-foreground cursor-default'
              }`}
            >
              <Icon name={editingId ? 'Check' : 'Send'} size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-3 border-t border-border bg-card">
          <div className="flex items-center justify-center gap-2 py-2 text-muted-foreground">
            <Icon name="Radio" size={15} />
            <span className="text-sm">Только администратор может писать в этом канале</span>
          </div>
        </div>
      )}
    </div>
  );
}