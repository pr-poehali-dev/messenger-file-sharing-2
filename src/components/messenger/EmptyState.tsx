import Icon from '@/components/ui/icon';

export default function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon name="MessageCircle" size={28} className="text-primary" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">Выберите чат</h3>
      <p className="text-sm text-muted-foreground text-center max-w-48">
        Откройте диалог из списка, чтобы начать общение
      </p>
    </div>
  );
}
