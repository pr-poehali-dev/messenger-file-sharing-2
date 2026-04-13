import { useState } from 'react';
import { chats as initialChats, Chat, GroupChannel } from '@/data/mockData';
import Sidebar from '@/components/messenger/Sidebar';
import ChatWindow from '@/components/messenger/ChatWindow';
import ContactsList from '@/components/messenger/ContactsList';
import ProfilePanel from '@/components/messenger/ProfilePanel';
import SettingsPanel from '@/components/messenger/SettingsPanel';
import EmptyState from '@/components/messenger/EmptyState';
import AuthScreen from '@/components/messenger/AuthScreen';
import Icon from '@/components/ui/icon';

type Tab = 'chats' | 'contacts' | 'profile' | 'settings';

export default function Index() {
  const [authed, setAuthed] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileView, setMobileView] = useState<'sidebar' | 'chat'>('sidebar');
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [showCreate, setShowCreate] = useState(false);
  const [createType, setCreateType] = useState<'group' | 'channel' | null>(null);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  if (!authed) return <AuthScreen onAuth={() => setAuthed(true)} />;

  const chat = chats.find(c => c.id === activeChat) || null;

  const handleSelectChat = (id: string) => {
    setActiveChat(id);
    setTab('chats');
    setMobileView('chat');
  };

  const handleStartChat = (userId: string) => {
    const found = chats.find(c => c.user?.id === userId);
    if (found) {
      setActiveChat(found.id);
      setTab('chats');
      setMobileView('chat');
    }
  };

  const handleCreateGroup = () => {
    setShowCreate(true);
    setCreateType(null);
    setNewName('');
    setNewDesc('');
  };

  const handleCreate = () => {
    if (!createType || !newName.trim()) return;
    const colors = ['bg-violet-500', 'bg-emerald-500', 'bg-pink-500', 'bg-cyan-500', 'bg-orange-500'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const group: GroupChannel = {
      id: `${createType}-${Date.now()}`,
      type: createType,
      name: newName.trim(),
      description: newDesc.trim(),
      avatar: '',
      avatarColor: color,
      membersCount: 1,
      isAdmin: true,
      username: newName.toLowerCase().replace(/\s+/g, '_'),
    };
    const newChat: Chat = {
      id: group.id,
      type: createType,
      group,
      messages: [],
      unread: 0,
    };
    setChats(prev => [newChat, ...prev]);
    setShowCreate(false);
    setActiveChat(group.id);
    setMobileView('chat');
  };

  const renderMain = () => {
    if (tab === 'settings') return <SettingsPanel onClose={() => setTab('chats')} />;
    if (tab === 'contacts') return <ContactsList searchQuery={searchQuery} onStartChat={handleStartChat} />;
    if (tab === 'profile') return <ProfilePanel />;
    if (chat) return <ChatWindow key={chat.id} chat={chat} onBack={() => setMobileView('sidebar')} />;
    return <EmptyState />;
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Create group/channel modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4 animate-fade-in" onClick={() => setShowCreate(false)}>
          <div className="bg-card rounded-3xl w-full max-w-sm shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="px-6 pt-6 pb-4">
              <h3 className="text-base font-bold text-foreground mb-4">Создать</h3>

              {!createType ? (
                <div className="space-y-2">
                  <button onClick={() => setCreateType('group')} className="w-full flex items-center gap-4 bg-muted rounded-2xl px-4 py-4 hover:bg-muted/70 transition-colors text-left">
                    <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
                      <Icon name="Users" size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">Группа</div>
                      <div className="text-xs text-muted-foreground">Все участники могут писать</div>
                    </div>
                  </button>
                  <button onClick={() => setCreateType('channel')} className="w-full flex items-center gap-4 bg-muted rounded-2xl px-4 py-4 hover:bg-muted/70 transition-colors text-left">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Icon name="Radio" size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">Канал</div>
                      <div className="text-xs text-muted-foreground">Только администратор пишет</div>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <button onClick={() => setCreateType(null)} className="text-muted-foreground hover:text-foreground">
                      <Icon name="ArrowLeft" size={15} />
                    </button>
                    <span className="text-sm font-medium text-muted-foreground">
                      {createType === 'group' ? 'Новая группа' : 'Новый канал'}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder={createType === 'group' ? 'Название группы' : 'Название канала'}
                    autoFocus
                    className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground outline-none border border-transparent focus:border-primary transition-colors"
                  />
                  <textarea
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    placeholder="Описание (необязательно)"
                    rows={2}
                    className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground outline-none border border-transparent focus:border-primary transition-colors resize-none"
                  />
                </div>
              )}
            </div>

            <div className="px-6 pb-6 flex gap-2">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-3 rounded-2xl bg-muted text-sm font-medium text-foreground hover:bg-muted/70 transition-colors">
                Отмена
              </button>
              {createType && (
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim()}
                  className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    newName.trim() ? 'bg-primary text-primary-foreground hover:opacity-90' : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  Создать
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
        <Sidebar
          chats={chats}
          activeId={activeChat}
          onSelect={handleSelectChat}
          onTabChange={t => {
            setTab(t);
            if (t !== 'chats') {
              setActiveChat(null);
              setMobileView('sidebar');
            }
          }}
          tab={tab}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onCreateGroup={handleCreateGroup}
        />
      </div>

      {/* Main panel */}
      <div className={`flex-1 flex flex-col min-w-0 ${mobileView === 'sidebar' ? 'hidden md:flex' : 'flex'}`}>
        {renderMain()}
      </div>
    </div>
  );
}
