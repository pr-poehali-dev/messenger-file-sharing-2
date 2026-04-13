import { useState, useRef } from 'react';
import { GroupChannel } from '@/data/mockData';
import Icon from '@/components/ui/icon';

interface GroupChannelSettingsProps {
  group: GroupChannel;
  onClose: () => void;
}

const MEMBER_LIST = [
  { id: 'me', name: 'Алексей Морозов', username: 'morozov_alex', role: 'admin', online: true },
  { id: '1', name: 'Мария Соколова', username: 'maria_s', role: 'member', online: true },
  { id: '2', name: 'Дмитрий Власов', username: 'vlasov_d', role: 'member', online: false },
  { id: '3', name: 'Анна Белова', username: 'anna_belova', role: 'moderator', online: true },
  { id: '4', name: 'Сергей Козлов', username: 'skozlov', role: 'member', online: false },
];

const avatarColors = [
  'bg-red-500', 'bg-primary', 'bg-violet-500', 'bg-emerald-500',
  'bg-orange-500', 'bg-pink-500', 'bg-cyan-500', 'bg-indigo-500',
];

export default function GroupChannelSettings({ group, onClose }: GroupChannelSettingsProps) {
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description || '');
  const [username, setUsername] = useState(group.username || '');
  const [avatarColor, setAvatarColor] = useState(group.avatarColor || 'bg-primary');
  const [saved, setSaved] = useState(false);
  const [section, setSection] = useState<'main' | 'members' | 'avatar'>('main');
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); }, 1500);
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('');
  const isChannel = group.type === 'channel';

  if (section === 'members') {
    return (
      <div className="flex flex-col h-full bg-background animate-fade-in">
        <div className="px-4 pt-5 pb-4 flex items-center gap-3 border-b border-border">
          <button onClick={() => setSection('main')} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
            <Icon name="ArrowLeft" size={17} className="text-muted-foreground" />
          </button>
          <h2 className="text-base font-bold text-foreground flex-1">
            {isChannel ? 'Подписчики' : 'Участники'} · {group.membersCount}
          </h2>
          {group.isAdmin && (
            <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
              <Icon name="UserPlus" size={16} className="text-primary" />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {MEMBER_LIST.map((m, i) => (
            <div key={m.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors animate-slide-in" style={{ animationDelay: `${i * 30}ms` }}>
              <div className={`w-10 h-10 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center flex-shrink-0 relative`}>
                <span className="text-white text-sm font-semibold">{m.name.split(' ').map(n => n[0]).join('')}</span>
                {m.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground">{m.name}</div>
                <div className="text-xs text-muted-foreground">@{m.username}</div>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                m.role === 'admin' ? 'bg-primary/10 text-primary' :
                m.role === 'moderator' ? 'bg-violet-500/10 text-violet-500' :
                'text-muted-foreground'
              }`}>
                {m.role === 'admin' ? 'Админ' : m.role === 'moderator' ? 'Модер' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section === 'avatar') {
    return (
      <div className="flex flex-col h-full bg-background animate-fade-in">
        <div className="px-4 pt-5 pb-4 flex items-center gap-3 border-b border-border">
          <button onClick={() => setSection('main')} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
            <Icon name="ArrowLeft" size={17} className="text-muted-foreground" />
          </button>
          <h2 className="text-base font-bold text-foreground flex-1">Аватар</h2>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
          <div className="flex flex-col items-center mb-8">
            <div className={`w-24 h-24 rounded-full ${avatar ? '' : avatarColor} flex items-center justify-center overflow-hidden mb-3`}>
              {avatar
                ? <img src={avatar} alt="" className="w-full h-full object-cover" />
                : <span className="text-white text-2xl font-bold">{initials}</span>
              }
            </div>
            <button onClick={() => fileRef.current?.click()} className="text-sm text-primary font-medium hover:opacity-80 transition-opacity">
              Загрузить фото
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
          </div>

          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-1">Цвет аватара</p>
            <div className="grid grid-cols-4 gap-3">
              {avatarColors.map(color => (
                <button
                  key={color}
                  onClick={() => { setAvatarColor(color); setAvatar(null); }}
                  className={`h-14 rounded-2xl ${color} flex items-center justify-center transition-all ${
                    avatarColor === color && !avatar ? 'ring-2 ring-offset-2 ring-foreground scale-105' : 'hover:scale-105'
                  }`}
                >
                  <span className="text-white text-lg font-bold">{initials}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background animate-fade-in">
      <div className="px-4 pt-5 pb-4 flex items-center gap-3 border-b border-border">
        <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
          <Icon name="ArrowLeft" size={17} className="text-muted-foreground" />
        </button>
        <h2 className="text-base font-bold text-foreground flex-1">
          {isChannel ? 'Настройки канала' : 'Настройки группы'}
        </h2>
        {group.isAdmin && (
          <button
            onClick={handleSave}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              saved ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground hover:opacity-90'
            }`}
          >
            {saved ? '✓ Сохранено' : 'Сохранить'}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Avatar */}
        <div className="flex flex-col items-center py-6 px-4">
          <button onClick={() => setSection('avatar')} className="relative group">
            <div className={`w-20 h-20 rounded-full ${avatar ? '' : avatarColor} flex items-center justify-center overflow-hidden`}>
              {avatar
                ? <img src={avatar} alt="" className="w-full h-full object-cover" />
                : <span className="text-white text-2xl font-bold">{initials}</span>
              }
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Icon name="Camera" size={20} className="text-white" />
            </div>
          </button>
          <button onClick={() => setSection('avatar')} className="text-xs text-primary mt-2 font-medium hover:opacity-80 transition-opacity">
            Изменить аватар
          </button>
        </div>

        {/* Info */}
        <div className="px-4 space-y-3 pb-4">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1">Основное</div>

          <div>
            <label className="text-[10px] text-muted-foreground px-1 mb-1 block">Название</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={!group.isAdmin}
              className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground outline-none border border-transparent focus:border-primary transition-colors disabled:opacity-60"
            />
          </div>

          <div>
            <label className="text-[10px] text-muted-foreground px-1 mb-1 block">Описание</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={!group.isAdmin}
              rows={3}
              maxLength={255}
              className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground outline-none border border-transparent focus:border-primary transition-colors resize-none scrollbar-thin disabled:opacity-60"
            />
          </div>

          <div>
            <label className="text-[10px] text-muted-foreground px-1 mb-1 block">Ссылка / юзернейм</label>
            <div className="flex items-center gap-1.5 bg-muted rounded-xl px-4 py-3 border border-transparent focus-within:border-primary transition-colors">
              <span className="text-muted-foreground text-sm">@</span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                disabled={!group.isAdmin}
                className="bg-transparent text-sm text-foreground outline-none w-full disabled:opacity-60"
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 px-1">flex.app/{username}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 px-4 mb-4">
          {[
            { label: isChannel ? 'Подписчиков' : 'Участников', value: group.membersCount.toLocaleString() },
            { label: 'Онлайн', value: group.online?.toString() || '—' },
            { label: 'Сообщений', value: '247' },
          ].map(s => (
            <div key={s.label} className="bg-muted rounded-xl px-3 py-3 text-center">
              <div className="text-base font-bold text-foreground">{s.value}</div>
              <div className="text-[10px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Members */}
        <div className="px-4 mb-2">
          <button
            onClick={() => setSection('members')}
            className="w-full flex items-center gap-3 bg-muted rounded-xl px-4 py-3.5 hover:bg-muted/70 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon name="Users" size={16} className="text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground flex-1 text-left">
              {isChannel ? 'Подписчики' : 'Участники'} ({group.membersCount})
            </span>
            <Icon name="ChevronRight" size={15} className="text-muted-foreground" />
          </button>
        </div>

        {/* Permissions */}
        {group.isAdmin && (
          <div className="px-4 space-y-2 pb-4">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-2">Разрешения</div>
            {[
              { icon: 'MessageSquare', label: isChannel ? 'Комментарии' : 'Писать сообщения', sub: isChannel ? 'Разрешить комментировать' : 'Все участники', value: true },
              { icon: 'Image', label: 'Медиафайлы', sub: 'Отправлять фото и видео', value: true },
              { icon: 'Link', label: 'Ссылки', sub: 'Отправлять ссылки', value: !isChannel },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between bg-muted rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <Icon name={item.icon} size={15} className="text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-foreground">{item.label}</div>
                    <div className="text-[10px] text-muted-foreground">{item.sub}</div>
                  </div>
                </div>
                <div className="w-8 h-4.5 bg-primary rounded-full relative" style={{ height: '20px', width: '36px' }}>
                  <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-white rounded-full shadow" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Danger */}
        {group.isAdmin && (
          <div className="px-4 pb-8">
            <button className="w-full flex items-center gap-3 bg-destructive/10 rounded-xl px-4 py-3.5 hover:bg-destructive/20 transition-colors">
              <Icon name="Trash2" size={16} className="text-destructive" />
              <span className="text-sm font-semibold text-destructive">
                {isChannel ? 'Удалить канал' : 'Удалить группу'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
