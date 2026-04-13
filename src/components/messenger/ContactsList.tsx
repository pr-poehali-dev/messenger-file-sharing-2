import { contacts, User } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface ContactsListProps {
  searchQuery: string;
  onStartChat: (userId: string) => void;
}

export default function ContactsList({ searchQuery, onStartChat }: ContactsListProps) {
  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const online = filtered.filter(c => c.online);
  const offline = filtered.filter(c => !c.online);

  const renderUser = (user: User, i: number) => (
    <div
      key={user.id}
      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors animate-slide-in"
      style={{ animationDelay: `${i * 30}ms` }}
    >
      <Avatar user={user} size="md" showOnline />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-foreground">{user.name}</div>
        <div className="text-xs text-muted-foreground truncate">
          @{user.username}
          {user.bio && <span className="mx-1">·</span>}
          {user.bio && <span>{user.bio}</span>}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onStartChat(user.id)}
          className="w-8 h-8 rounded-xl hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all text-muted-foreground"
        >
          <Icon name="MessageCircle" size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto scrollbar-thin">
      <div className="px-4 pt-5 pb-4">
        <h2 className="text-lg font-bold text-foreground">Контакты</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{contacts.length} контактов</p>
      </div>

      <button className="mx-4 mb-4 flex items-center gap-3 border border-dashed border-border rounded-xl px-4 py-3 hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <Icon name="UserPlus" size={18} />
        </div>
        <div className="text-sm font-medium">Добавить контакт</div>
      </button>

      {online.length > 0 && (
        <div>
          <div className="px-4 py-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Онлайн · {online.length}
            </span>
          </div>
          {online.map((u, i) => renderUser(u, i))}
        </div>
      )}

      {offline.length > 0 && (
        <div className="mt-2">
          <div className="px-4 py-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Не в сети · {offline.length}
            </span>
          </div>
          {offline.map((u, i) => renderUser(u, online.length + i))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center px-8">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <Icon name="Users" size={22} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">Контакты не найдены</p>
          <p className="text-xs text-muted-foreground">Попробуйте другой запрос</p>
        </div>
      )}
    </div>
  );
}
