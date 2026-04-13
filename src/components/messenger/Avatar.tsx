import { User } from '@/data/mockData';

interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showOnline?: boolean;
}

const sizeMap = {
  sm: { box: 'w-8 h-8', text: 'text-xs', dot: 'w-2 h-2 border' },
  md: { box: 'w-10 h-10', text: 'text-sm', dot: 'w-2.5 h-2.5 border-2' },
  lg: { box: 'w-14 h-14', text: 'text-lg', dot: 'w-3.5 h-3.5 border-2' },
};

const colors = [
  'bg-blue-500', 'bg-emerald-500', 'bg-violet-500',
  'bg-orange-500', 'bg-rose-500', 'bg-cyan-500',
];

function getColor(name: string) {
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('');
}

export default function Avatar({ user, size = 'md', showOnline = false }: AvatarProps) {
  const s = sizeMap[size];
  return (
    <div className="relative flex-shrink-0">
      <div className={`${s.box} ${getColor(user.name)} rounded-full flex items-center justify-center text-white font-semibold ${s.text} select-none`}>
        {getInitials(user.name)}
      </div>
      {showOnline && user.online && (
        <span className={`absolute bottom-0 right-0 ${s.dot} bg-green-500 rounded-full border-white dark:border-background`} />
      )}
    </div>
  );
}
