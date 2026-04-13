import { useState } from 'react';
import { currentUser } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

export default function ProfilePanel() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto scrollbar-thin">
      <div className="px-4 pt-5 pb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Профиль</h2>
        <button
          onClick={() => setEditing(!editing)}
          className="text-xs font-medium text-primary hover:opacity-80 transition-opacity"
        >
          {editing ? 'Сохранить' : 'Изменить'}
        </button>
      </div>

      {/* Avatar section */}
      <div className="flex flex-col items-center py-6 px-4 animate-fade-in">
        <div className="relative group cursor-pointer">
          <Avatar user={currentUser} size="lg" showOnline />
          {editing && (
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Icon name="Camera" size={18} className="text-white" />
            </div>
          )}
        </div>

        {editing ? (
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-4 text-center font-bold text-foreground bg-muted rounded-xl px-3 py-1.5 text-sm outline-none border border-transparent focus:border-primary"
          />
        ) : (
          <h3 className="mt-4 font-bold text-foreground text-base">{name}</h3>
        )}

        <div className="text-xs text-muted-foreground mt-1">@{currentUser.username}</div>

        {editing ? (
          <input
            type="text"
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Расскажи о себе..."
            className="mt-2 text-center text-xs text-muted-foreground bg-muted rounded-xl px-3 py-1.5 outline-none border border-transparent focus:border-primary w-full max-w-xs"
          />
        ) : (
          bio && <p className="text-xs text-muted-foreground mt-2 text-center">{bio}</p>
        )}

        <div className="flex items-center gap-1.5 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">онлайн</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 px-4 mb-4">
        {[
          { label: 'Чатов', value: '5' },
          { label: 'Контактов', value: '6' },
        ].map(s => (
          <div key={s.label} className="bg-muted rounded-xl px-4 py-3 text-center">
            <div className="text-lg font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="px-4 space-y-2 pb-6">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-1">Настройки</div>

        {[
          {
            icon: 'Moon', label: 'Тёмная тема',
            value: darkMode, toggle: toggleDark,
          },
          {
            icon: 'Bell', label: 'Уведомления',
            value: notifications, toggle: () => setNotifications(!notifications),
          },
          {
            icon: 'Eye', label: 'Статус прочтения',
            value: readReceipts, toggle: () => setReadReceipts(!readReceipts),
          },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between bg-muted rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <Icon name={item.icon} size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground font-medium">{item.label}</span>
            </div>
            <button
              onClick={item.toggle}
              className={`relative w-10 h-5.5 rounded-full transition-colors ${item.value ? 'bg-primary' : 'bg-border'}`}
              style={{ height: '22px', width: '40px' }}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                  item.value ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        ))}

        <div className="pt-2">
          <button className="w-full flex items-center gap-3 bg-muted rounded-xl px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group">
            <Icon name="LogOut" size={16} className="text-muted-foreground group-hover:text-red-500 transition-colors" />
            <span className="text-sm font-medium text-muted-foreground group-hover:text-red-500 transition-colors">Выйти</span>
          </button>
        </div>
      </div>
    </div>
  );
}
