'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, ShieldAlert, MessageCircle, Zap} from 'lucide-react';
import { clsx } from 'clsx';

const links = [
  { name: 'Home', href: '/', icon: Home },
  //{ name: 'Contatos', href: '/contacts', icon: Users },
  { name: 'Blacklist', href: '/blacklist', icon: ShieldAlert },
  { name: 'Chat', href: '/chat', icon: MessageCircle },
];

export const Header = () => {
  const pathname = usePathname();

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="glass-panel pl-2 pr-6 py-2 rounded-full flex items-center gap-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-white/10 bg-black/40 backdrop-blur-xl">
        
        <div className="w-10 h-10 rounded-full bg-neon flex items-center justify-center shadow-[0_0_15px_rgba(137,243,54,0.3)] mr-4">
            <Zap className="text-black fill-black" size={20} />
        </div>

        <div className="flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link key={link.href} href={link.href} className="relative group">
                {isActive && (
                  <motion.div
                    layoutId="nav-highlight"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className={clsx(
                  "relative px-4 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2",
                  isActive ? "text-neon" : "text-white/40 hover:text-white hover:bg-white/5"
                )}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                 
                  {isActive && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      className="text-xs font-bold tracking-wider uppercase whitespace-nowrap overflow-hidden"
                    >
                      {link.name}
                    </motion.span>
                  )}
                </div>
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-neon rounded-full blur-[2px]"
                  />
                )}
              </Link>
            );
          })}
        </div>

      </nav>
    </div>
  );
};