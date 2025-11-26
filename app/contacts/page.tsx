'use client';

import { useContactsBoard, ContactCard } from '@/src/hooks/useContactsBoard';
import { BackgroundBlobs } from '@/components/BackgroundBlobs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Activity, 
  Lock, 
  Search, 
  Users,

} from 'lucide-react';
import { clsx } from 'clsx';
import React from 'react';
import { FloatingDock } from '@/components/FloatingDock';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: 'neon' | 'rose';
  delay: number;
}

interface ColumnZoneProps {
  title: string;
  count: number;
  color: 'neon' | 'rose';
  children: React.ReactNode;
}

interface PremiumCardProps {
  contact: ContactCard;
  onAction: () => void;
  actionIcon: React.ReactNode;
  variant: 'active' | 'blocked';
}

export default function ContactsPage() {
  const { activeContacts, blockedContacts, moveContact } = useContactsBoard();

  return (
    <main className="min-h-screen bg-[#030303] text-white selection:bg-neon selection:text-black overflow-hidden font-sans">
      <BackgroundBlobs />
      
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

      <div className="relative z-10 max-w-[1800px] mx-auto p-6 sm:p-12 flex flex-col h-screen">
        
<FloatingDock/>
        <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 shrink-0">
          <div className="space-y-2">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-neon rounded-full animate-pulse" />
              <span className="text-neon/60 text-[10px] font-bold tracking-[0.25em] uppercase">
                Neural Engine v1.0
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[0.9]"
            >
              Controle de <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-white/40">Fluxo.</span>
            </motion.h1>
          </div>

          <div className="flex gap-3">
            <StatCard 
              icon={<Activity size={18} />} 
              label="Ativos" 
              value={activeContacts.length} 
              color="neon"
              delay={0.2} 
            />
            <StatCard 
              icon={<Lock size={18} />} 
              label="Restritos" 
              value={blockedContacts.length} 
              color="rose"
              delay={0.3} 
            />
          </div>
        </header>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
          <ColumnZone 
            title="Fila de Processamento"
            count={activeContacts.length}
            color="neon"
          >
            <AnimatePresence mode='popLayout'>
              {activeContacts.map((contact) => (
                <PremiumCard 
                  key={contact.id} 
                  contact={contact} 
                  actionIcon={<ArrowRight size={18} />}
                  onAction={() => moveContact(contact.id, 'blocked')}
                  variant="active"
                />
              ))}
              {activeContacts.length === 0 && <EmptyState text="Nenhum lead ativo" />}
            </AnimatePresence>
          </ColumnZone>
          <ColumnZone 
            title="Lista de Bloqueio"
            count={blockedContacts.length}
            color="rose"
          >
            <AnimatePresence mode='popLayout'>
              {blockedContacts.map((contact) => (
                <PremiumCard 
                  key={contact.id} 
                  contact={contact} 
                  actionIcon={<ArrowLeft size={18} />}
                  onAction={() => moveContact(contact.id, 'active')}
                  variant="blocked"
                />
              ))}
              {blockedContacts.length === 0 && <EmptyState text="Lista vazia" />}
            </AnimatePresence>
          </ColumnZone>

        </div>
      </div>
    </main>
  );
}

const StatCard = ({ icon, label, value, color, delay }: StatCardProps) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: "spring", bounce: 0.2 }}
    className={clsx(
      "h-24 px-6 rounded-3xl border flex flex-col justify-center min-w-[140px] backdrop-blur-xl transition-colors",
      color === 'neon' 
        ? "bg-[#0A0A0A] border-white/5 hover:border-neon/20" 
        : "bg-[#0A0A0A] border-white/5 hover:border-rose-500/20"
    )}
  >
    <div className="flex items-center gap-3 mb-1">
      <span className={clsx("opacity-50", color === 'neon' ? "text-neon" : "text-rose-400")}>
        {icon}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium">{label}</span>
    </div>
    <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
  </motion.div>
);

const ColumnZone = ({ title, count, color, children }: ColumnZoneProps) => (
  <div className={clsx(
    "flex flex-col rounded-[2.5rem] p-2 border h-full overflow-hidden transition-all duration-500 relative group",
    color === 'neon' 
      ? "bg-linear-to-b from-[#0A0A0A] to-black border-white/5 shadow-[0_0_100px_-20px_rgba(137,243,54,0.05)]" 
      : "bg-linear-to-b from-[#0A0A0A] to-black border-white/5 shadow-[0_0_100px_-20px_rgba(244,63,94,0.05)]"
  )}>
    <div className="flex items-center justify-between p-6 pb-4 z-10">
      <div className="flex items-center gap-3">
        <div className={clsx(
          "w-2 h-2 rounded-full",
          color === 'neon' ? "bg-neon shadow-[0_0_10px_#89f336]" : "bg-rose-500 shadow-[0_0_10px_#f43f5e]"
        )} />
        <h2 className="text-lg font-bold tracking-tight text-white/90">{title}</h2>
      </div>
      <span className="text-xs font-mono text-white/30 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
        {String(count).padStart(2, '0')}
      </span>
    </div>

    <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar relative z-0">
      {children}
    </div>
  </div>
);

const PremiumCard = ({ contact, onAction, actionIcon, variant }: PremiumCardProps) => {
  return (
    <motion.div
      layoutId={contact.id}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="group relative"
    >
      {/* O Card */}
      <div className={clsx(
        "relative p-4 rounded-[1.8rem] border flex items-center justify-between transition-all duration-300",
        variant === 'active'
          ? "bg-[#111] border-white/5 hover:bg-[#151515] hover:border-neon/20"
          : "bg-[#080505] border-white/5 hover:bg-[#1a0f0f] hover:border-rose-500/20"
      )}>
        
        <div className="flex items-center gap-4">
          {/* Avatar Apple Style */}
          <div className={clsx(
            "w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold shadow-inner border",
            variant === 'active'
              ? "bg-linear-to-br from-[#222] to-[#111] border-white/10 text-white"
              : "bg-linear-to-br from-[#1a0f0f] to-[#0f0505] border-white/5 text-rose-400/50"
          )}>
            {variant === 'active' ? <Users size={18} /> : <Lock size={18} />}
          </div>

          <div className="flex flex-col">
            <span className={clsx(
              "font-medium text-[15px] tracking-tight",
              variant === 'active' ? "text-white" : "text-white/40 decoration-line-through"
            )}>
              {contact.name}
            </span>
            <span className="text-xs text-white/30 font-mono tracking-wide mt-0.5">
              {contact.phone}
            </span>
          </div>
        </div>

        {/* Action Button - iOS Switch Style */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAction();
          }}
          className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90",
            variant === 'active'
              ? "bg-[#1A1A1A] text-white/50 hover:text-neon hover:bg-black border border-white/5 hover:border-neon/30"
              : "bg-[#1A1A1A] text-white/50 hover:text-rose-400 hover:bg-black border border-white/5 hover:border-rose-500/30"
          )}
        >
          {actionIcon}
        </button>
      </div>
    </motion.div>
  );
};

const EmptyState = ({ text }: { text: string }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    className="h-64 flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/5 rounded-[2rem]"
  >
    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
      <Search size={20} />
    </div>
    <p className="text-xs uppercase tracking-widest font-medium">{text}</p>
  </motion.div>
);