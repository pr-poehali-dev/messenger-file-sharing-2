export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  online: boolean;
  lastSeen?: string;
  bio?: string;
  avatarColor?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
  read: boolean;
  delivered: boolean;
  type: 'text' | 'image' | 'file' | 'sticker';
  fileName?: string;
  fileSize?: string;
  imageUrl?: string;
  stickerUrl?: string;
  edited?: boolean;
  reactions?: { emoji: string; count: number }[];
}

export type ChatType = 'private' | 'group' | 'channel';

export interface GroupChannel {
  id: string;
  name: string;
  type: ChatType;
  description?: string;
  avatar: string;
  avatarColor?: string;
  membersCount: number;
  online?: number;
  username?: string;
  isAdmin?: boolean;
}

export interface Chat {
  id: string;
  type: ChatType;
  user?: User;
  group?: GroupChannel;
  messages: Message[];
  unread: number;
  pinned?: boolean;
}

export const currentUser: User = {
  id: 'me',
  name: 'Алексей Морозов',
  username: 'morozov_alex',
  avatar: '',
  online: true,
  bio: 'На связи всегда 🚀',
};

export const contacts: User[] = [
  { id: '1', name: 'Мария Соколова', username: 'maria_s', avatar: '', online: true, bio: 'Дизайнер • Москва' },
  { id: '2', name: 'Дмитрий Власов', username: 'vlasov_d', avatar: '', online: false, lastSeen: '15 мин назад', bio: 'Разработчик' },
  { id: '3', name: 'Анна Белова', username: 'anna_belova', avatar: '', online: true, bio: 'Маркетолог' },
  { id: '4', name: 'Сергей Козлов', username: 'skozlov', avatar: '', online: false, lastSeen: '2 ч назад' },
  { id: '5', name: 'Ольга Новикова', username: 'olga_nov', avatar: '', online: true, bio: 'Фотограф • СПб' },
  { id: '6', name: 'Павел Иванов', username: 'pavivan', avatar: '', online: false, lastSeen: 'вчера' },
];

export const groups: GroupChannel[] = [
  {
    id: 'g1', type: 'group', name: 'Команда дизайна', avatar: '',
    avatarColor: 'bg-violet-500', membersCount: 12, online: 5,
    description: 'Рабочая группа дизайн-отдела', isAdmin: true,
    username: 'design_team',
  },
  {
    id: 'g2', type: 'group', name: 'Разработка', avatar: '',
    avatarColor: 'bg-emerald-500', membersCount: 8, online: 3,
    description: 'Frontend и backend разработчики', isAdmin: false,
    username: 'dev_group',
  },
  {
    id: 'ch1', type: 'channel', name: 'Новости Flex', avatar: '',
    avatarColor: 'bg-primary', membersCount: 1420, online: undefined,
    description: 'Официальный канал мессенджера Flex', isAdmin: true,
    username: 'flex_news',
  },
  {
    id: 'ch2', type: 'channel', name: 'Дизайн-дайджест', avatar: '',
    avatarColor: 'bg-pink-500', membersCount: 384, online: undefined,
    description: 'Лучшие материалы по UI/UX', isAdmin: false,
    username: 'design_digest',
  },
];

export const chats: Chat[] = [
  {
    id: 'c1', type: 'private', user: contacts[0], unread: 3, pinned: true,
    messages: [
      { id: 'm1', senderId: '1', text: 'Привет! Посмотрела твои правки — очень круто получилось 🔥', time: '10:32', read: true, delivered: true, type: 'text' },
      { id: 'm2', senderId: 'me', text: 'Спасибо! Старался сделать всё максимально чисто', time: '10:35', read: true, delivered: true, type: 'text' },
      { id: 'm3', senderId: '1', text: 'Да, это видно. Кстати, можешь скинуть финальные файлы?', time: '10:36', read: true, delivered: true, type: 'text' },
      { id: 'm4', senderId: 'me', text: 'Конечно, сейчас подготовлю', time: '10:38', read: true, delivered: true, type: 'text' },
      { id: 'm5', senderId: '1', text: 'Отлично! Жду 👍', time: '10:39', read: false, delivered: true, type: 'text' },
      { id: 'm6', senderId: '1', text: 'И ещё — клиент хочет добавить анимации', time: '10:40', read: false, delivered: true, type: 'text' },
      { id: 'm7', senderId: '1', text: 'Что думаешь?', time: '10:41', read: false, delivered: true, type: 'text' },
    ],
  },
  {
    id: 'c2', type: 'private', user: contacts[1], unread: 0,
    messages: [
      { id: 'm1', senderId: 'me', text: 'Дима, как там с деплоем?', time: '09:15', read: true, delivered: true, type: 'text' },
      { id: 'm2', senderId: '2', text: 'Всё готово, задеплоил вчера вечером', time: '09:20', read: true, delivered: true, type: 'text' },
      { id: 'm3', senderId: 'me', text: 'Отлично, спасибо!', time: '09:21', read: true, delivered: true, type: 'text' },
    ],
  },
  {
    id: 'c3', type: 'private', user: contacts[2], unread: 1,
    messages: [
      { id: 'm1', senderId: '3', text: 'Лёш, можем созвониться в 16:00?', time: '08:00', read: false, delivered: true, type: 'text' },
    ],
  },
  {
    id: 'g1', type: 'group', group: groups[0], unread: 5,
    messages: [
      { id: 'm1', senderId: '1', text: 'Всем привет! Встреча в 15:00', time: '10:00', read: true, delivered: true, type: 'text' },
      { id: 'm2', senderId: '2', text: 'Ок, буду', time: '10:05', read: true, delivered: true, type: 'text' },
      { id: 'm3', senderId: 'me', text: 'Тоже подключусь', time: '10:10', read: true, delivered: true, type: 'text' },
      { id: 'm4', senderId: '3', text: 'Подготовила новые макеты, покажу на встрече', time: '10:20', read: false, delivered: true, type: 'text' },
      { id: 'm5', senderId: '1', text: '🔥 Отлично!', time: '10:25', read: false, delivered: true, type: 'text' },
    ],
  },
  {
    id: 'ch1', type: 'channel', group: groups[2], unread: 2,
    messages: [
      { id: 'm1', senderId: 'admin', text: 'Flex 1.0 теперь доступен! Новые функции: группы, каналы, стикеры 🚀', time: '09:00', read: true, delivered: true, type: 'text' },
      { id: 'm2', senderId: 'admin', text: 'Следующее обновление: видеозвонки и реакции на сообщения', time: '11:00', read: false, delivered: true, type: 'text' },
    ],
  },
  {
    id: 'c4', type: 'private', user: contacts[3], unread: 0,
    messages: [
      { id: 'm1', senderId: 'me', text: 'Сергей, отправил договор на почту', time: 'вчера', read: true, delivered: true, type: 'text' },
      { id: 'm2', senderId: '4', text: 'Получил, спасибо. Изучу и вернусь', time: 'вчера', read: true, delivered: true, type: 'text' },
    ],
  },
];
