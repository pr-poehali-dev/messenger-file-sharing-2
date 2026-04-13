export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  online: boolean;
  lastSeen?: string;
  bio?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
  read: boolean;
  delivered: boolean;
  type: 'text' | 'image' | 'file';
  fileName?: string;
  fileSize?: string;
  imageUrl?: string;
}

export interface Chat {
  id: string;
  user: User;
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

export const chats: Chat[] = [
  {
    id: 'c1',
    user: contacts[0],
    unread: 3,
    pinned: true,
    messages: [
      { id: 'm1', senderId: '1', text: 'Привет! Посмотрела твои правки — очень круто получилось 🔥', time: '10:32', read: true, delivered: true, type: 'text' },
      { id: 'm2', senderId: 'me', text: 'Спасибо! Старался сделать всё максимально чисто', time: '10:35', read: true, delivered: true, type: 'text' },
      { id: 'm3', senderId: '1', text: 'Да, это видно. Кстати, можешь скинуть финальные файлы?', time: '10:36', read: true, delivered: true, type: 'text' },
      { id: 'm4', senderId: 'me', text: 'Конечно, сейчас подготовлю', time: '10:38', read: true, delivered: true, type: 'text' },
      { id: 'm5', senderId: '1', text: 'Отлично! Жду', time: '10:39', read: false, delivered: true, type: 'text' },
      { id: 'm6', senderId: '1', text: 'И ещё — клиент хочет добавить анимации', time: '10:40', read: false, delivered: true, type: 'text' },
      { id: 'm7', senderId: '1', text: 'Что думаешь?', time: '10:41', read: false, delivered: true, type: 'text' },
    ],
  },
  {
    id: 'c2',
    user: contacts[1],
    unread: 0,
    messages: [
      { id: 'm1', senderId: 'me', text: 'Дима, как там с деплоем?', time: '09:15', read: true, delivered: true, type: 'text' },
      { id: 'm2', senderId: '2', text: 'Всё готово, задеплоил вчера вечером', time: '09:20', read: true, delivered: true, type: 'text' },
      { id: 'm3', senderId: 'me', text: 'Отлично, спасибо!', time: '09:21', read: true, delivered: true, type: 'text' },
    ],
  },
  {
    id: 'c3',
    user: contacts[2],
    unread: 1,
    messages: [
      { id: 'm1', senderId: '3', text: 'Лёш, можем созвониться в 16:00?', time: '08:00', read: false, delivered: true, type: 'text' },
    ],
  },
  {
    id: 'c4',
    user: contacts[3],
    unread: 0,
    messages: [
      { id: 'm1', senderId: 'me', text: 'Сергей, отправил договор на почту', time: 'вчера', read: true, delivered: true, type: 'text' },
      { id: 'm2', senderId: '4', text: 'Получил, спасибо. Изучу и вернусь', time: 'вчера', read: true, delivered: true, type: 'text' },
    ],
  },
  {
    id: 'c5',
    user: contacts[4],
    unread: 0,
    messages: [
      { id: 'm1', senderId: '5', text: 'Привет! Фотографии готовы', time: 'вторник', read: true, delivered: true, type: 'text' },
    ],
  },
];
