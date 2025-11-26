import { clsx } from 'clsx';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const isConnected = status === 'CONNECTED';
  const isConnecting = status === 'CONNECTING' || status === 'QR_CODE_READY';

  return (
    <div className={clsx(
      "px-4 py-1.5 rounded-full border text-xs font-medium tracking-wide uppercase flex items-center gap-2 transition-all duration-500",
      isConnected ? "bg-neon/10 border-neon/50 text-neon shadow-[0_0_20px_rgba(137,243,54,0.2)]" : 
      isConnecting ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-200" :
      "bg-red-500/10 border-red-500/50 text-red-200"
    )}>
      <span className={clsx(
        "w-2 h-2 rounded-full",
        isConnected ? "bg-neon animate-pulse" : 
        isConnecting ? "bg-yellow-400 animate-pulse" : "bg-red-500"
      )} />
      {status}
    </div>
  );
};