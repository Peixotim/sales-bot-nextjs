'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  MessageSquare, 
  ShieldAlert, 
  Settings, 
  Zap, 
  Bell,
  Search,
} from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { name: 'Visão Geral', path: '/', icon: <LayoutDashboard size={16} /> },
  { name: 'Monitor', path: '/chat', icon: <MessageSquare size={16} /> },
  { name: 'Blacklist', path: '/blacklist', icon: <ShieldAlert size={16} /> },
  { name: 'Ajustes', path: '/settings', icon: <Settings size={16} /> },
];

export function Header() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 20) {
        setIsVisible(true);
      } else {
        setIsVisible(currentScrollY < lastScrollY);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      
      <AnimatePresence>
        {isVisible && (
          <motion.header
            initial={{ y: -100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={clsx(
              "pointer-events-auto flex items-center gap-1 p-1.5 pr-2",
              "bg-[#121214]/80 backdrop-blur-2xl border border-white/8 shadow-2xl shadow-black/50",
              "rounded-full"
            )}
          >
            
            <Link 
              href="/" 
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#89F336] text-black shadow-[0_0_15px_rgba(137,243,54,0.4)] hover:scale-105 transition-transform mr-2"
            >
              <Zap size={20} fill="currentColor" />
            </Link>

            <nav className="flex items-center bg-white/3 rounded-full p-1 border border-white/2">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                
                return (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    className="relative px-4 py-2 rounded-full transition-colors group"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill-minimal"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        className="absolute inset-0 bg-[#89F336] rounded-full"
                      />
                    )}
                    
                    <span className={clsx(
                      "relative z-10 flex items-center gap-2 text-xs font-bold transition-colors",
                      isActive ? "text-black" : "text-zinc-400 group-hover:text-white"
                    )}>
                      {item.icon}
                      <span className="hidden md:inline">{item.name}</span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="w-px h-6 bg-white/10 mx-2" />

            <div className="flex items-center gap-1">
              <button className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                <Search size={18} />
              </button>
              
              <button className="relative w-9 h-9 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                <Bell size={18} />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#89F336] rounded-full" />
              </button>

              <button className="ml-1 w-9 h-9 rounded-full bg-linear-to-tr from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-transparent hover:ring-[#89F336]/50 transition-all">
                PP
              </button>
            </div>

          </motion.header>
        )}
      </AnimatePresence>

    </div>
  );
}