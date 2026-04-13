import { useState } from 'react';
import Icon from '@/components/ui/icon';

type AuthStep = 'welcome' | 'phone' | 'phone-code' | 'email' | 'email-code' | 'google' | 'register' | 'done';

interface AuthScreenProps {
  onAuth: () => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [step, setStep] = useState<AuthStep>('welcome');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [loading, setLoading] = useState(false);

  const fakeLoading = (cb: () => void, ms = 1200) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); cb(); }, ms);
  };

  const validateUsername = (v: string) => {
    if (v.length < 4) return 'Минимум 4 символа';
    if (!/^[a-zA-Z0-9_]+$/.test(v)) return 'Только a–z, 0–9 и _';
    return '';
  };

  const handleFinish = () => {
    const err = validateUsername(username);
    if (err) { setUsernameError(err); return; }
    fakeLoading(() => onAuth());
  };

  // Welcome screen
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 animate-fade-in">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mb-5 shadow-lg shadow-primary/30">
              <Icon name="MessageCircle" size={38} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Flex</h1>
            <p className="text-muted-foreground text-sm mt-2 text-center">Быстрый мессенджер для общения</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setStep('phone')}
              className="w-full flex items-center gap-4 bg-primary text-primary-foreground rounded-2xl px-5 py-4 font-semibold hover:opacity-90 transition-opacity"
            >
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Phone" size={18} className="text-white" />
              </div>
              <span className="text-sm">Войти по номеру телефона</span>
              <Icon name="ChevronRight" size={16} className="text-white/70 ml-auto" />
            </button>

            <button
              onClick={() => fakeLoading(() => setStep('register'), 800)}
              className="w-full flex items-center gap-4 bg-card border border-border rounded-2xl px-5 py-4 font-semibold hover:bg-muted transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                <span className="text-lg">G</span>
              </div>
              <span className="text-sm text-foreground">Войти через Google</span>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground ml-auto" />
            </button>

            <button
              onClick={() => setStep('email')}
              className="w-full flex items-center gap-4 bg-card border border-border rounded-2xl px-5 py-4 font-semibold hover:bg-muted transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                <Icon name="Mail" size={18} className="text-muted-foreground" />
              </div>
              <span className="text-sm text-foreground">Войти по Email</span>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground ml-auto" />
            </button>
          </div>

          <p className="text-center text-[11px] text-muted-foreground mt-8 leading-relaxed">
            Продолжая, вы соглашаетесь с{' '}
            <button className="text-primary underline underline-offset-2">условиями использования</button>
            {' '}и{' '}
            <button className="text-primary underline underline-offset-2">политикой конфиденциальности</button>
          </p>
        </div>
      </div>
    );
  }

  // Phone input
  if (step === 'phone') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 animate-fade-in">
        <div className="w-full max-w-sm">
          <button onClick={() => setStep('welcome')} className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="ArrowLeft" size={16} />
            <span className="text-sm">Назад</span>
          </button>

          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
            <Icon name="Phone" size={24} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Номер телефона</h2>
          <p className="text-sm text-muted-foreground mb-6">Введите ваш номер для получения кода</p>

          <div className="flex items-center gap-2 bg-muted rounded-2xl px-4 py-3.5 mb-4 border border-transparent focus-within:border-primary transition-colors">
            <span className="text-muted-foreground text-sm font-medium">🇷🇺 +7</span>
            <div className="w-px h-5 bg-border mx-1" />
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="900 000 00 00"
              className="bg-transparent text-sm text-foreground outline-none flex-1"
            />
          </div>

          <button
            onClick={() => phone.length >= 10 ? fakeLoading(() => setStep('phone-code')) : null}
            disabled={phone.length < 10 || loading}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all ${
              phone.length >= 10 && !loading
                ? 'bg-primary text-primary-foreground hover:opacity-90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {loading ? 'Отправляем код...' : 'Получить код'}
          </button>
        </div>
      </div>
    );
  }

  // Phone code
  if (step === 'phone-code') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 animate-fade-in">
        <div className="w-full max-w-sm">
          <button onClick={() => setStep('phone')} className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="ArrowLeft" size={16} />
            <span className="text-sm">Назад</span>
          </button>

          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
            <Icon name="Shield" size={24} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Введите код</h2>
          <p className="text-sm text-muted-foreground mb-6">Код отправлен на +7 {phone}</p>

          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            className="w-full text-center text-3xl font-bold tracking-[0.5em] bg-muted rounded-2xl px-4 py-4 mb-4 outline-none border border-transparent focus:border-primary transition-colors text-foreground"
          />

          <button
            onClick={() => code.length === 6 ? fakeLoading(() => setStep('register')) : null}
            disabled={code.length < 6 || loading}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all ${
              code.length === 6 && !loading
                ? 'bg-primary text-primary-foreground hover:opacity-90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {loading ? 'Проверяем...' : 'Подтвердить'}
          </button>

          <button className="w-full mt-3 text-sm text-primary hover:opacity-80 transition-opacity py-2">
            Отправить код повторно
          </button>
        </div>
      </div>
    );
  }

  // Email
  if (step === 'email') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 animate-fade-in">
        <div className="w-full max-w-sm">
          <button onClick={() => setStep('welcome')} className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="ArrowLeft" size={16} />
            <span className="text-sm">Назад</span>
          </button>

          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
            <Icon name="Mail" size={24} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Email</h2>
          <p className="text-sm text-muted-foreground mb-6">Введите адрес для получения кода</p>

          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-muted rounded-2xl px-4 py-3.5 text-sm text-foreground outline-none border border-transparent focus:border-primary transition-colors mb-4"
          />

          <button
            onClick={() => email.includes('@') ? fakeLoading(() => setStep('email-code')) : null}
            disabled={!email.includes('@') || loading}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all ${
              email.includes('@') && !loading
                ? 'bg-primary text-primary-foreground hover:opacity-90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {loading ? 'Отправляем...' : 'Получить код'}
          </button>
        </div>
      </div>
    );
  }

  // Email code
  if (step === 'email-code') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 animate-fade-in">
        <div className="w-full max-w-sm">
          <button onClick={() => setStep('email')} className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="ArrowLeft" size={16} />
            <span className="text-sm">Назад</span>
          </button>

          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
            <Icon name="Shield" size={24} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Введите код</h2>
          <p className="text-sm text-muted-foreground mb-2">Код отправлен на {email}</p>

          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            className="w-full text-center text-3xl font-bold tracking-[0.5em] bg-muted rounded-2xl px-4 py-4 mb-4 outline-none border border-transparent focus:border-primary transition-colors text-foreground"
          />

          <button
            onClick={() => code.length === 6 ? fakeLoading(() => setStep('register')) : null}
            disabled={code.length < 6 || loading}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all ${
              code.length === 6 && !loading
                ? 'bg-primary text-primary-foreground hover:opacity-90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {loading ? 'Проверяем...' : 'Подтвердить'}
          </button>
        </div>
      </div>
    );
  }

  // Register — name & username
  if (step === 'register') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 animate-fade-in">
        <div className="w-full max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
            <Icon name="UserCheck" size={24} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Ваш профиль</h2>
          <p className="text-sm text-muted-foreground mb-6">Введите имя и придумайте юзернейм</p>

          <div className="space-y-3 mb-5">
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block px-1">Имя</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ваше имя"
                className="w-full bg-muted rounded-2xl px-4 py-3.5 text-sm text-foreground outline-none border border-transparent focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block px-1">Юзернейм</label>
              <div className={`flex items-center gap-1.5 bg-muted rounded-2xl px-4 py-3.5 border transition-colors ${
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
                {username.length >= 4 && !usernameError && (
                  <Icon name="CheckCircle" size={16} className="text-green-500 flex-shrink-0" />
                )}
              </div>
              {usernameError
                ? <p className="text-[10px] text-destructive mt-1 px-1">{usernameError}</p>
                : <p className="text-[10px] text-muted-foreground mt-1 px-1">4–32 символа: a–z, 0–9, _</p>
              }
            </div>
          </div>

          <button
            onClick={handleFinish}
            disabled={!name.trim() || username.length < 4 || loading}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all ${
              name.trim() && username.length >= 4 && !loading
                ? 'bg-primary text-primary-foreground hover:opacity-90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {loading ? 'Создаём аккаунт...' : 'Создать аккаунт'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
