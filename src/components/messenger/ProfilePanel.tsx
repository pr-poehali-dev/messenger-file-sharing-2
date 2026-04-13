import { useState } from 'react';
import { currentUser } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

export default function ProfilePanel() {
  const [name] = useState(currentUser.name);
  const [username] = useState(currentUser.username);
  const [bio] = useState(currentUser.bio || '');

  const stats = [
    { label: 'Чатов', value: '5' },
    { label: 'Контактов', value: '6' },
    { label: 'Сообщений', value: '124' },
    { label: 'Медиафайлов', value: '18' },
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto scrollbar-thin">
      <div className="px-4 pt-5 pb-4">
        <h2 className="text-lg font-bold text-foreground">Профиль</h2>
      </div>

      {/* Avatar + info */}
      <div className="flex flex-col items-center py-6 px-4 animate-fade-in">
        <div className="relative group cursor-pointer">
          <Avatar user={{ ...currentUser, name }} size="lg" showOnline />
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Icon name="Camera" size={18} className="text-white" />
          </div>
        </div>

        <h3 className="mt-4 font-bold text-foreground text-base">{name}</h3>
        <div className="text-xs text-muted-foreground mt-0.5">@{username}</div>
        {bio && <p className="text-xs text-muted-foreground mt-2 text-center max-w-xs leading-relaxed">{bio}</p>}

        <div className="flex items-center gap-1.5 mt-3">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">онлайн</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 px-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-muted rounded-2xl px-4 py-4 text-center">
            <div className="text-xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="px-4 space-y-2 pb-8">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-1">Действия</div>

        {[
          { icon: 'Share2', label: 'Поделиться профилем', sub: 'Отправить ссылку на профиль' },
          { icon: 'QrCode', label: 'QR-код профиля', sub: 'Сканируй для добавления' },
          { icon: 'Star', label: 'Избранное', sub: 'Сохранённые сообщения' },
        ].map(item => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 bg-muted rounded-2xl px-4 py-3.5 hover:bg-muted/70 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon name={item.icon} size={16} className="text-primary" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground">{item.label}</div>
              <div className="text-[11px] text-muted-foreground">{item.sub}</div>
            </div>
            <Icon name="ChevronRight" size={15} className="text-muted-foreground ml-auto flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
