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

type Section = 'main' | 'profile' | 'language';

interface SettingsPanelProps {
  onClose?: () => void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [section, setSection] = useState<Section>('main');

  // Profile
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [usernameError, setUsernameError] = useState('');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Theme
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  // Language
  const [language, setLanguage] = useState('ru');
  const [langSearch, setLangSearch] = useState('');

  // Notifications & receipts
  const [notifications, setNotifications] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);

  // Cache
  const [cacheCleared, setCacheCleared] = useState(false);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
  };

  const handleSaveProfile = () => {
    const err = validateUsername(username);
    if (err) { setUsernameError(err); return; }
    setUsernameError('');
    setProfileSaved(true);
    setTimeout(() => { setProfileSaved(false); setSection('main'); }, 800);
  };

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2000);
  };

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  const filteredLangs = LANGUAGES.filter(l =>
    l.label.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  // ─── PROFILE section ────────────────────────────────────────────
  if (section === 'profile') {
    return (
      <div className="flex flex-col h-full bg-background animate-fade-in">
        <div className="px-4 pt-5 pb-4 flex items-center gap-3 border-b border-border">
          <button onClick={() => setSection('main')} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
            <Icon name="ArrowLeft" size={17} className="text-muted-foreground" />
          </button>
          <h2 className="text-base font-bold text-foreground flex-1">Профиль</h2>
          <button
            onClick={handleSaveProfile}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              profileSaved ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground hover:opacity-90'
            }`}
          >
            {profileSaved ? '✓ Сохранено' : 'Сохранить'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Avatar */}
          <div className="flex flex-col items-center py-8 px-4">
            <div className="relative group cursor-pointer">
              <Avatar user={{ ...currentUser, name }} size="lg" showOnline />
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="Camera" size={18} className="text-white" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Нажмите для смены фото</p>
          </div>

          <div className="px-4 space-y-3 pb-8">
            {/* Name */}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-1.5 block">Имя</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground outline-none border border-transparent focus:border-primary transition-colors"
                placeholder="Ваше имя"
              />
            </div>

            {/* Username */}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-1.5 block">Юзернейм</label>
              <div className={`flex items-center gap-1.5 bg-muted rounded-xl px-4 py-3 border transition-colors ${
                usernameError ? 'border-destructive' : 'border-transparent focus-within:border-primary'
              }`}>
                <span className="text-muted-foreground text-sm font-medium">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => {
                    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                    setUsernameError('');
                  }}
                  maxLength={32}
                  placeholder="username123"
                  className="bg-transparent text-sm text-foreground outline-none w-full"
                />
              </div>
              {usernameError
                ? <p className="text-[10px] text-destructive mt-1 px-1">{usernameError}</p>
                : <p className="text-[10px] text-muted-foreground mt-1 px-1">4–32 символа: a–z, 0–9, _</p>
              }
            </div>

            {/* Bio */}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-1.5 block">Описание</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                maxLength={120}
                placeholder="Расскажи о себе..."
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground outline-none border border-transparent focus:border-primary transition-colors resize-none scrollbar-thin"
              />
              <p className="text-[10px] text-muted-foreground mt-1 px-1 text-right">{bio.length}/120</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── LANGUAGE section ────────────────────────────────────────────
  if (section === 'language') {
    return (
      <div className="flex flex-col h-full bg-background animate-fade-in">
        <div className="px-4 pt-5 pb-4 flex items-center gap-3 border-b border-border">
          <button onClick={() => setSection('main')} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
            <Icon name="ArrowLeft" size={17} className="text-muted-foreground" />
          </button>
          <h2 className="text-base font-bold text-foreground flex-1">Язык интерфейса</h2>
          <span className="text-sm">{currentLang.flag}</span>
        </div>

        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
            <Icon name="Search" size={15} className="text-muted-foreground flex-shrink-0" />
            <input
              autoFocus
              type="text"
              value={langSearch}
              onChange={e => setLangSearch(e.target.value)}
              placeholder="Найти язык..."
              className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground"
            />
            {langSearch && (
              <button onClick={() => setLangSearch('')} className="text-muted-foreground hover:text-foreground">
                <Icon name="X" size={13} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
          {filteredLangs.map((lang, i) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setSection('main'); }}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left animate-slide-in ${
                language === lang.code ? 'bg-primary/8' : ''
              }`}
              style={{ animationDelay: `${i * 15}ms` }}
            >
              <span className="text-xl w-7 text-center">{lang.flag}</span>
              <span className={`text-sm flex-1 ${language === lang.code ? 'text-primary font-semibold' : 'text-foreground'}`}>
                {lang.label}
              </span>
              {language === lang.code && (
                <Icon name="Check" size={15} className="text-primary" />
              )}
            </button>
          ))}
          {filteredLangs.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">Ничего не найдено</div>
          )}
        </div>
      </div>
    );
  }

  // ─── MAIN section ────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-background animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex items-center gap-3 border-b border-border">
        {onClose && (
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
            <Icon name="ArrowLeft" size={17} className="text-muted-foreground" />
          </button>
        )}
        <h2 className="text-base font-bold text-foreground flex-1">Настройки</h2>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Profile preview */}
        <button
          onClick={() => setSection('profile')}
          className="w-full flex items-center gap-4 px-4 py-4 hover:bg-muted/60 transition-colors border-b border-border"
        >
          <Avatar user={{ ...currentUser, name }} size="md" showOnline />
          <div className="flex-1 min-w-0 text-left">
            <div className="font-semibold text-sm text-foreground">{name}</div>
            <div className="text-xs text-muted-foreground">@{username} · {bio || 'Добавить описание'}</div>
          </div>
          <Icon name="ChevronRight" size={16} className="text-muted-foreground flex-shrink-0" />
        </button>

        {/* Section: Внешний вид */}
        <div className="px-4 pt-5 pb-2">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Внешний вид</span>
        </div>

        {/* Theme toggle */}
        <div className="mx-4 mb-2 bg-muted rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${darkMode ? 'bg-slate-700' : 'bg-amber-100'}`}>
                <Icon name={darkMode ? 'Moon' : 'Sun'} size={16} className={darkMode ? 'text-slate-300' : 'text-amber-500'} />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Тема оформления</div>
                <div className="text-[11px] text-muted-foreground">{darkMode ? 'Тёмная (красно-чёрная)' : 'Светлая (красно-белая)'}</div>
              </div>
            </div>
            <button
              onClick={toggleDark}
              style={{ height: '24px', width: '44px' }}
              className={`relative rounded-full transition-colors flex-shrink-0 ${darkMode ? 'bg-primary' : 'bg-border'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="mx-4 mb-2">
          <button
            onClick={() => { setSection('language'); setLangSearch(''); }}
            className="w-full flex items-center justify-between bg-muted rounded-2xl px-4 py-3.5 hover:bg-muted/70 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Icon name="Globe" size={16} className="text-blue-500" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-foreground">Язык интерфейса</div>
                <div className="text-[11px] text-muted-foreground">{currentLang.flag} {currentLang.label}</div>
              </div>
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Section: Уведомления */}
        <div className="px-4 pt-4 pb-2">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Уведомления</span>
        </div>

        <div className="mx-4 mb-2 bg-muted rounded-2xl overflow-hidden divide-y divide-border/50">
          {[
            {
              icon: 'Bell', iconBg: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-500',
              label: 'Push-уведомления', sub: 'Новые сообщения и события',
              value: notifications, toggle: () => setNotifications(v => !v),
            },
            {
              icon: 'Eye', iconBg: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-500',
              label: 'Статус прочтения', sub: 'Показывать когда прочитано',
              value: readReceipts, toggle: () => setReadReceipts(v => !v),
            },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.iconBg}`}>
                  <Icon name={item.icon} size={16} className={item.iconColor} />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{item.label}</div>
                  <div className="text-[11px] text-muted-foreground">{item.sub}</div>
                </div>
              </div>
              <button
                onClick={item.toggle}
                style={{ height: '24px', width: '44px' }}
                className={`relative rounded-full transition-colors flex-shrink-0 ${item.value ? 'bg-primary' : 'bg-border'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.value ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>

        {/* Section: Данные */}
        <div className="px-4 pt-4 pb-2">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Данные и память</span>
        </div>

        <div className="mx-4 mb-2 bg-muted rounded-2xl overflow-hidden">
          <button
            onClick={handleClearCache}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-muted/70 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Icon name={cacheCleared ? 'CheckCircle' : 'Trash2'} size={16} className={cacheCleared ? 'text-green-500' : 'text-orange-500'} />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-foreground">Очистить кэш</div>
                <div className="text-[11px] text-muted-foreground">
                  {cacheCleared ? 'Кэш успешно очищен' : 'Медиафайлы и данные сессии'}
                </div>
              </div>
            </div>
            {cacheCleared
              ? <Icon name="Check" size={16} className="text-green-500" />
              : <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            }
          </button>
        </div>

        {/* Section: О приложении */}
        <div className="px-4 pt-4 pb-2">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">О приложении</span>
        </div>

        <div className="mx-4 mb-2 bg-muted rounded-2xl overflow-hidden divide-y divide-border/50">
          <div className="px-4 py-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon name="MessageCircle" size={16} className="text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">Flex Messenger</div>
              <div className="text-[11px] text-muted-foreground">Версия 1.0.0</div>
            </div>
          </div>
          <div className="px-4 py-3.5">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Flex — быстрый и удобный мессенджер для общения в реальном времени.
              Обмен сообщениями, файлами и медиа. Статусы онлайн, прочтение сообщений,
              управление контактами и гибкие настройки.
            </p>
          </div>
          <div className="px-4 py-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-muted-foreground/10 flex items-center justify-center">
              <Icon name="Shield" size={16} className="text-muted-foreground" />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">Политика конфиденциальности</div>
              <div className="text-[11px] text-muted-foreground">Ваши данные защищены</div>
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground ml-auto" />
          </div>
        </div>

        {/* Logout */}
        <div className="mx-4 mt-2 mb-8">
          <button className="w-full flex items-center gap-3 bg-destructive/10 rounded-2xl px-4 py-3.5 hover:bg-destructive/20 transition-colors group">
            <div className="w-8 h-8 rounded-xl bg-destructive/15 flex items-center justify-center">
              <Icon name="LogOut" size={16} className="text-destructive" />
            </div>
            <span className="text-sm font-semibold text-destructive">Выйти из аккаунта</span>
          </button>
        </div>
      </div>
    </div>
  );
}
