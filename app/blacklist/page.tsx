'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useContacts, BlockedContact } from '@/src/hooks/useContacts';
import { BackgroundBlobs } from '@/components/BackgroundBlobs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldOff, 
  UserX, 
  Search, 
  Plus, 
  Unlock, 
  AlertCircle, 
  ArrowRight,
  Lock
} from 'lucide-react';
import { clsx } from 'clsx';
import React from 'react';


interface GlassInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  type?: string;
  maxLength?: number;
}

interface BlockedCardProps {
  contact: BlockedContact;
  onUnblock: () => void;
}

interface EmptyStateProps {
  text: string;
}

export default function BlacklistPage() {
  const { blacklist, blockContact, unblockContact, loading } = useContacts();
  
  const [phone, setPhone] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setIsSubmitting(true);
    const success = await blockContact(phone, name || 'Desconhecido');
    
    if (success) {
      setPhone('');
      setName('');
    }
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-[#020202] text-white selection:bg-rose-500 selection:text-white font-sans overflow-x-hidden">
      <BackgroundBlobs />
      
      {/* Texture Overlay - Efeito de grão cinematográfico */}
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

      <div className="relative z-10 max-w-[1400px] mx-auto p-6 sm:p-12 pb-32">
        
        {/* --- HEADER --- */}
        <header className="mb-16 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="h-px w-12 bg-linear-to-r from-rose-500 to-transparent" />
            <span className="text-rose-500 text-xs font-bold tracking-[0.3em] uppercase drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">
              Security Protocol
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9]">
              Blacklist <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-500 via-rose-400 to-purple-500">
                Control.
              </span>
            </h1>
            <p className="mt-6 text-lg text-white/40 max-w-xl leading-relaxed">
              Gerencie a zona de exclusão. Contatos listados aqui serão ignorados instantaneamente pela inteligência artificial.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          
          <div className="lg:col-span-4 lg:sticky lg:top-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-linear-to-br from-rose-500/20 to-purple-600/20 rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              
              <div className="relative bg-[#0A0A0A] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl backdrop-blur-3xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-500 border border-rose-500/20">
                      <ShieldOff size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Novo Bloqueio</h3>
                      <p className="text-xs text-white/30 uppercase tracking-wider">Adicionar Manualmente</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <GlassInput 
                      label="Whatsapp ID"
                      value={phone}
                      onChange={setPhone}
                      placeholder="Ex: 55319..."
                      icon={<Plus size={16} />}
                      type="tel"
                    />
                    
                    <GlassInput 
                      label="Referência"
                      value={name}
                      onChange={setName}
                      placeholder="Ex: Spam Marketing"
                      icon={<UserX size={16} />}
                    />

                    <button
                      disabled={!phone || isSubmitting}
                      className={clsx(
                        "w-full h-14 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden",
                        !phone || isSubmitting
                          ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                          : "bg-rose-600 text-white hover:bg-rose-500 shadow-[0_0_40px_-10px_rgba(225,29,72,0.5)]"
                      )}
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      
                      {isSubmitting ? (
                        <span className="animate-pulse">Bloqueando...</span>
                      ) : (
                        <>
                          Confirmar
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-8 pt-6 border-t border-white/5">
                    <div className="flex gap-4 p-4 rounded-2xl bg-rose-500/3 border border-rose-500/10">
                      <AlertCircle size={20} className="shrink-0 text-rose-500/60" />
                      <p className="text-xs text-white/40 leading-relaxed">
                        Ao bloquear, o bot encerra imediatamente qualquer sessão ativa com este número.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-8">
            <div className="flex items-end justify-between mb-8 px-2">
              <div>
                <h2 className="text-2xl font-bold text-white">Registros Ativos</h2>
                <p className="text-white/40 text-sm mt-1">Gerencie quem está na geladeira</p>
              </div>
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-xs font-mono text-white/60">
                TOTAL: <span className="text-rose-400 font-bold ml-2">{blacklist.length}</span>
              </div>
            </div>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {blacklist.map((contact) => (
                  <BlockedCard 
                    key={contact.jid} 
                    contact={contact} 
                    onUnblock={() => unblockContact(contact.jid)} 
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {blacklist.length === 0 && !loading && (
              <EmptyState text="O sistema está limpo. Nenhum bloqueio ativo." />
            )}
          </div>

        </div>
      </div>
    </main>
  );
}

const GlassInput = ({ label, value, onChange, placeholder, icon, type = "text" }: GlassInputProps) => (
  <div className="group space-y-2">
    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 group-focus-within:text-rose-400 transition-colors ml-1">
      {label}
    </label>
    <div className="relative transition-all duration-300 group-focus-within:scale-[1.01]">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-rose-500 transition-colors">
        {icon}
      </div>
      <input 
        type={type}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[] border border-white/10 rounded-2xl h-14 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all duration-300"
      />
    </div>
  </div>
);

const BlockedCard = ({ contact, onUnblock }: BlockedCardProps) => {
  const cleanPhone = contact.jid.split('@')[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative p-5 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-rose-500/30 transition-all duration-300"
    >
      {/* Background Gradient on Hover */}
      <div className="absolute inset-0 bg-linear-to-br from-rose-500/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-5">
          {/* Avatar com Gradiente Rose */}
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#1a0505] to-[#050000] border border-white/10 flex items-center justify-center shadow-inner group-hover:border-rose-500/20 transition-colors">
            <Lock size={18} className="text-rose-500/40 group-hover:text-rose-500 transition-colors" />
          </div>
          
          <div className="flex flex-col">
            <span className="font-bold text-white text-[15px] tracking-tight group-hover:text-rose-100 transition-colors">
              {contact.name}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
              <p className="text-xs text-white/30 font-mono tracking-wide">{cleanPhone}</p>
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            onUnblock();
          }}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/30 hover:bg-white hover:text-black hover:border-white transition-all duration-300 active:scale-90 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
          title="Desbloquear"
        >
          <Unlock size={16} />
        </button>
      </div>
    </motion.div>
  );
};

const EmptyState = ({ text }: EmptyStateProps) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    className="col-span-full h-64 flex flex-col items-center justify-center text-white/20 border border-dashed border-white/10 rounded-[2.5rem] bg-white/1"
  >
    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
      <Search size={24} className="opacity-50" />
    </div>
    <p className="text-xs uppercase tracking-[0.2em] font-medium">{text}</p>
  </motion.div>
);