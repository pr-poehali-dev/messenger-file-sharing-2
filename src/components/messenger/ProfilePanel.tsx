import { useState } from 'react';
import { currentUser } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

const LANGUAGES = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
  { code: 'be', label: 'Беларуская', flag: '🇧🇾' },
  { code: 'kk', label: 'Қазақша', flag: '🇰🇿' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'cs', label: 'Čeština', flag: '🇨🇿' },
  { code: 'sk', label: 'Slovenčina', flag: '🇸🇰' },
  { code: 'ro', label: 'Română', flag: '🇷🇴' },
  { code: 'hu', label: 'Magyar', flag: '🇭🇺' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', label: 'ภาษาไทย', flag: '🇹🇭' },
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', label: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', label: 'Svenska', flag: '🇸🇪' },
  { code: 'no', label: 'Norsk', flag: '🇳🇴' },
  { code: 'da', label: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', label: 'Suomi', flag: '🇫🇮' },
  { code: 'el', label: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'he', label: 'עברית', flag: '🇮🇱' },
  { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
  { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
  { code: 'az', label: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'hy', label: 'Հայերեն', flag: '🇦🇲' },
  { code: 'ge', label: 'ქართული', flag: '🇬🇪' },
  { code: 'lt', label: 'Lietuvių', flag: '🇱🇹' },
  { code: 'lv', label: 'Latviešu', flag: '🇱🇻' },
  { code: 'et', label: 'Eesti', flag: '🇪🇪' },
];

function validateUsername(val: string) {
  if (val.length < 4) return 'Минимум 4 символа';
  if (!/^[a-zA-Z0-9_]+$/.test(val)) return 'Только латиница, цифры и _';
  return '';
}

export default function ProfilePanel() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [usernameError, setUsernameError] = useState('');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );
  const [notifications, setNotifications] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [language, setLanguage] = useState('ru');
  const [langOpen, setLangOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
  };

  const handleSave = () => {
    const err = validateUsername(username);
    if (err) { setUsernameError(err); return; }
    setEditing(false);
    setUsernameError('');
  };

  const handleUsernameChange = (val: string) => {
    setUsername(val.toLowerCase().replace(/[^a-z0-9_]/g, ''));
    setUsernameError('');
  };

  const filteredLangs = LANGUAGES.filter(l =>
    l.label.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto scrollbar-thin">
      <div className="px-4 pt-5 pb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Профиль</h2>
        <button
          onClick={editing ? handleSave : () => setEditing(true)}
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
            className="mt-4 text-center font-bold text-foreground bg-muted rounded-xl px-3 py-1.5 text-sm outline-none border border-transparent focus:border-primary w-full max-w-xs"
          />
        ) : (
          <h3 className="mt-4 font-bold text-foreground text-base">{name}</h3>
        )}

        {/* Username field */}
        {editing ? (
          <div className="mt-2 w-full max-w-xs">
            <div className={`flex items-center gap-1 bg-muted rounded-xl px-3 py-1.5 border ${usernameError ? 'border-destructive' : 'border-transparent focus-within:border-primary'}`}>
              <span className="text-muted-foreground text-xs">@</span>
              <input
                type="text"
                value={username}
                onChange={e => handleUsernameChange(e.target.value)}
                maxLength={32}
                placeholder="username123"
                className="bg-transparent text-xs outline-none w-full text-foreground"
              />
            </div>
            {usernameError && (
              <p className="text-[10px] text-destructive mt-1 px-1">{usernameError}</p>
            )}
            <p className="text-[10px] text-muted-foreground mt-1 px-1">4–32 символа: a–z, 0–9, _</p>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground mt-1">@{username}</div>
        )}

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

        {/* Toggles */}
        {[
          { icon: darkMode ? 'Moon' : 'Sun', label: darkMode ? 'Тёмная тема' : 'Светлая тема', value: darkMode, toggle: toggleDark },
          { icon: 'Bell', label: 'Уведомления', value: notifications, toggle: () => setNotifications(!notifications) },
          { icon: 'Eye', label: 'Статус прочтения', value: readReceipts, toggle: () => setReadReceipts(!readReceipts) },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between bg-muted rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <Icon name={item.icon} size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground font-medium">{item.label}</span>
            </div>
            <button
              onClick={item.toggle}
              style={{ height: '22px', width: '40px' }}
              className={`relative rounded-full transition-colors flex-shrink-0 ${item.value ? 'bg-primary' : 'bg-border'}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                  item.value ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        ))}

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => { setLangOpen(!langOpen); setLangSearch(''); }}
            className="w-full flex items-center justify-between bg-muted rounded-xl px-4 py-3 hover:bg-muted/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Icon name="Globe" size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground font-medium">Язык интерфейса</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{currentLang.flag}</span>
              <span className="text-xs text-muted-foreground">{currentLang.label}</span>
              <Icon name={langOpen ? 'ChevronUp' : 'ChevronDown'} size={14} className="text-muted-foreground" />
            </div>
          </button>

          {langOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-scale-in">
              <div className="p-2 border-b border-border">
                <div className="flex items-center gap-2 bg-muted rounded-lg px-2 py-1.5">
                  <Icon name="Search" size={13} className="text-muted-foreground" />
                  <input
                    autoFocus
                    type="text"
                    value={langSearch}
                    onChange={e => setLangSearch(e.target.value)}
                    placeholder="Поиск языка..."
                    className="bg-transparent text-xs outline-none w-full text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div className="max-h-52 overflow-y-auto scrollbar-thin">
                {filteredLangs.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-left ${
                      language === lang.code ? 'bg-primary/10' : ''
                    }`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span className={`text-sm ${language === lang.code ? 'text-primary font-semibold' : 'text-foreground'}`}>
                      {lang.label}
                    </span>
                    {language === lang.code && (
                      <Icon name="Check" size={13} className="text-primary ml-auto" />
                    )}
                  </button>
                ))}
                {filteredLangs.length === 0 && (
                  <div className="px-4 py-6 text-center text-xs text-muted-foreground">Не найдено</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="pt-2">
          <button className="w-full flex items-center gap-3 bg-muted rounded-xl px-4 py-3 hover:bg-destructive/10 transition-colors group">
            <Icon name="LogOut" size={16} className="text-muted-foreground group-hover:text-destructive transition-colors" />
            <span className="text-sm font-medium text-muted-foreground group-hover:text-destructive transition-colors">Выйти</span>
          </button>
        </div>
      </div>
    </div>
  );
}
