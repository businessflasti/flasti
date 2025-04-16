import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: string;
  timestamp: string;
  sender: string;
  isAdmin?: boolean;
  status?: 'sent' | 'delivered' | 'read';
  className?: string;
}

export function ChatMessage({
  message,
  timestamp,
  sender,
  isAdmin = false,
  status = 'sent',
  className,
}: ChatMessageProps) {
  if (!message || !timestamp || !sender) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-1',
        isAdmin ? 'items-end' : 'items-start',
        className
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-xl p-3',
          isAdmin
            ? 'bg-primary/20 neon-border'
            : 'bg-secondary/50 hover:bg-secondary/70'
        )}
      >
        <p className="text-sm font-medium">{sender}</p>
        <p className="text-foreground/90">{message}</p>
        <div className="flex items-center justify-end gap-2 mt-1">
          <span className="text-xs text-muted-foreground">
            {new Date(timestamp).toLocaleString()}
          </span>
          {isAdmin && status && (
            <span className="text-xs text-primary/70">{status}</span>
          )}
        </div>
      </div>
    </div>
  );
}