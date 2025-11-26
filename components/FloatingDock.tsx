'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Users, Settings, ShieldAlert, Zap, MessageCircle } from 'lucide-react';
import { clsx } from 'clsx';

const links = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Contatos', href: '/contacts', icon: Users },
  { name: 'Blacklist', href: '/blacklist', icon: ShieldAlert },
  {name: 'Chat',href:'/chat',icon : MessageCircle},
  { name: 'Config', href: '/settings', icon: Settings },
];

export const FloatingDock = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-6">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link key={link.href} href={link.href} className="relative group">
              {isActive && (
                <motion.div
                  layoutId="dock-highlight"
                  className="absolute inset-0 bg-neon/20 blur-md rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <div className={clsx(
                "relative p-3 rounded-full transition-all duration-300 hover:scale-110",
                isActive ? "text-neon bg-white/5" : "text-white/40 hover:text-white hover:bg-white/5"
              )}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-neon text-[10px] uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 backdrop-blur-md">
                {link.name}
              </span>
            </Link>
          );
        })}
        
        <div className="w-px h-8 bg-white/10 mx-2" />
        
        <div className="w-10 h-10 rounded-full bg-neon flex items-center justify-center shadow-[0_0_15px_rgba(137,243,54,0.4)]">
            <Zap className="text-black" size={20} />
        </div>
      </div>
    </div>
  );
};