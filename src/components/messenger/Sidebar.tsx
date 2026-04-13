import { useState } from 'react';
import { Chat, currentUser, groups } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface SidebarProps {
  chats: Chat[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onTabChange: (tab: 'chats' | 'contacts' | 'profile' | 'settings') => void;
  tab: 'chats' | 'contacts' | 'profile' | 'settings';
  searchQuery: string;
  onSearch: (q: string) => void;
  onCreateGroup: () => void;
}

const groupColors: Record<string, string> = {
  'bg-violet-500': 'bg-violet-500',
  'bg-emerald-500': 'bg-emerald-500',
  'bg-primary': 'bg-primary',
  'bg-pink-500': 'bg-pink-500',
};

export default function Sidebar({ chats, activeId, onSelect, onTabChange, tab, searchQuery, onSearch, onCreateGroup }: SidebarProps) {
  const [filterTab, setFilterTab] = useState<'all' | 'private' | 'groups' | 'channels'>('all');

  const filtered = chats.filter(c => {
    const name = c.type === 'private' ? c.user?.name : c.group?.name;
    const username = c.type === 'private' ? c.user?.username : c.group?.username;
    const matchSearch = !searchQuery ||
      name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      username?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterTab === 'all' ||
      (filterTab === 'private' && c.type === 'private') ||
      (filterTab === 'groups' && c.type === 'group') ||
      (filterTab === 'channels' && c.type === 'channel');
    return matchSearch && matchFilter;
  });

  const lastMsg = (chat: Chat) => {
    const last = chat.messages[chat.messages.length - 1];
    if (!last) return '';
    if (chat.type === 'channel') return last.text;
    const prefix = last.senderId === 'me' ? 'Вы: ' : '';
    return prefix + last.text;
  };

  const getChatName = (chat: Chat) => chat.type === 'private' ? chat.user?.name : chat.group?.name;

  const getChatSub = (chat: Chat) => {
    if (chat.type === 'group') return `${chat.group?.membersCount} участников`;
    if (chat.type === 'channel') return `${chat.group?.membersCount?.toLocaleString()} подписчиков`;
    return null;
  };

  const getChatIcon = (chat: Chat) => {
    if (chat.type === 'group') return 'Users';
    if (chat.type === 'channel') return 'Radio';
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border w-72 flex-shrink-0">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 flex items-center justify-between">
        <h1 className="text-lg font-bold tracking-tight text-primary">Flex</h1>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors relative">
            <Icon name="Bell" size={17} className="text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
          </button>
          <button
            onClick={() => onTabChange('settings')}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              tab === 'settings' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <Icon name="Settings" size={17} />
          </button>
          <button
            onClick={onCreateGroup}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
          >
            <Icon name="PenSquare" size={17} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
          <Icon name="Search" size={15} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground text-foreground"
          />
          {searchQuery && (
            <button onClick={() => onSearch('')} className="text-muted-foreground hover:text-foreground">
              <Icon name="X" size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-4 pb-3 flex gap-1 overflow-x-auto scrollbar-none">
        {[
          { key: 'all', label: 'Все' },
          { key: 'private', label: 'Личные' },
          { key: 'groups', label: 'Группы' },
          { key: 'channels', label: 'Каналы' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setFilterTab(t.key as typeof filterTab)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
              filterTab === t.key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Nav tabs */}
      <div className="px-4 pb-2 flex gap-1">
        {[
          { key: 'chats', label: 'Чаты' },
          { key: 'contacts', label: 'Контакты' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key as 'chats' | 'contacts')}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
              tab === t.key
                ? 'text-primary font-semibold border-b-2 border-primary rounded-none pb-1.5'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted-foreground text-sm">Ничего не найдено</div>
        ) : (
          filtered.map((chat, i) => {
            const isGroup = chat.type === 'group' || chat.type === 'channel';
            const name = getChatName(chat);
            const sub = getChatSub(chat);
            const iconName = getChatIcon(chat);
            const bgColor = chat.group?.avatarColor || 'bg-muted';
            const initials = name ? name.split(' ').map(n => n[0]).slice(0, 2).join('') : '?';

            return (
              <button
                key={chat.id}
                onClick={() => onSelect(chat.id)}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-colors text-left hover:bg-muted/60 animate-slide-in ${
                  activeId === chat.id ? 'bg-muted' : ''
                }`}
                style={{ animationDelay: `${i * 25}ms` }}
              >
                {isGroup ? (
                  <div className={`w-10 h-10 rounded-full ${groupColors[bgColor] || 'bg-muted'} flex items-center justify-center flex-shrink-0 relative`}>
                    <span className="text-white text-sm font-semibold">{initials}</span>
                    {chat.type === 'channel' && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-card rounded-full flex items-center justify-center">
                        <Icon name="Radio" size={9} className="text-primary" />
                      </span>
                    )}
                    {chat.type === 'group' && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-card rounded-full flex items-center justify-center">
                        <Icon name="Users" size={9} className="text-primary" />
                      </span>
                    )}
                  </div>
                ) : (
                  <Avatar user={chat.user!} size="md" showOnline />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-sm text-foreground truncate">{name}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-1">
                      {chat.messages[chat.messages.length - 1]?.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate">
                      {sub || lastMsg(chat)}
                    </span>
                    {chat.unread > 0 && (
                      <span className={`ml-1 flex-shrink-0 min-w-5 h-5 px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        chat.type === 'channel' ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'
                      }`}>
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Bottom Nav */}
      <div className="border-t border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => onTabChange('profile')} className="flex items-center gap-2 flex-1 min-w-0 hover:opacity-80 transition-opacity">
          <Avatar user={currentUser} size="sm" showOnline />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-foreground truncate">{currentUser.name}</div>
            <div className="text-[10px] text-muted-foreground truncate">@{currentUser.username}</div>
          </div>
        </button>
      </div>
    </div>
  );
}
