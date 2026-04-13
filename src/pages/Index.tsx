import { useState } from 'react';
import { chats as initialChats } from '@/data/mockData';
import Sidebar from '@/components/messenger/Sidebar';
import ChatWindow from '@/components/messenger/ChatWindow';
import ContactsList from '@/components/messenger/ContactsList';
import ProfilePanel from '@/components/messenger/ProfilePanel';
import SettingsPanel from '@/components/messenger/SettingsPanel';
import EmptyState from '@/components/messenger/EmptyState';

type Tab = 'chats' | 'contacts' | 'profile' | 'settings';

export default function Index() {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileView, setMobileView] = useState<'sidebar' | 'chat'>('sidebar');

  const chat = initialChats.find(c => c.id === activeChat) || null;

  const handleSelectChat = (id: string) => {
    setActiveChat(id);
    setTab('chats');
    setMobileView('chat');
  };

  const handleStartChat = (userId: string) => {
    const found = initialChats.find(c => c.user.id === userId);
    if (found) {
      setActiveChat(found.id);
      setTab('chats');
      setMobileView('chat');
    }
  };

  const handleBack = () => {
    setMobileView('sidebar');
  };

  const renderMain = () => {
    if (tab === 'settings') return <SettingsPanel onClose={() => setTab('chats')} />;
    if (tab === 'contacts') return <ContactsList searchQuery={searchQuery} onStartChat={handleStartChat} />;
    if (tab === 'profile') return <ProfilePanel />;
    if (chat) return <ChatWindow key={chat.id} chat={chat} onBack={handleBack} />;
    return <EmptyState />;
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className={`${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
        <Sidebar
          chats={initialChats}
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
        />
      </div>

      {/* Main panel */}
      <div className={`flex-1 flex flex-col min-w-0 ${mobileView === 'sidebar' ? 'hidden md:flex' : 'flex'}`}>
        {renderMain()}
      </div>
    </div>
  );
}
