'use client';

import { useState, FormEvent } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { clsx } from 'clsx';
import React from 'react';


interface GlassInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ReactNode;
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
    <main className="min-h-screen p-6 sm:p-12 relative font-sans text-white pb-32 selection:bg-rose-500 selection:text-white overflow-hidden">
      <BackgroundBlobs />
      
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay bg-rose-900"></div>

      <div className="relative z-10 max-w-[1200px] mx-auto space-y-12">
        
        <header className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            <span className="text-rose-500/80 text-[10px] font-bold tracking-[0.25em] uppercase">
              Zona de Exclusão
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-bold tracking-tighter text-white"
          >
            Blacklist <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-500 to-purple-600">
              Protocol.
            </span>
          </motion.h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
      
          <div className="lg:col-span-4 sticky top-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-1 rounded-[2.5rem] bg-linear-to-b from-white/10 to-white/2"
            >
              <div className="bg-dark rounded-[2.3rem] p-6 border border-white/5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10">
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                    <ShieldOff size={20} className="text-rose-500" />
                    Adicionar Bloqueio
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <GlassInput 
                      label="Telefone (DDD + Número)"
                      value={phone}
                      onChange={setPhone}
                      placeholder="55319..."
                      icon={<Plus size={14} />}
                    />
                    
                    <GlassInput 
                      label="Nome (Identificação)"
                      value={name}
                      onChange={setName}
                      placeholder="Ex: Spam / Concorrente"
                      icon={<UserX size={14} />}
                    />

                    <button
                      disabled={!phone || isSubmitting}
                      className={clsx(
                        "w-full py-4 rounded-xl font-bold text-sm tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 group",
                        !phone || isSubmitting
                          ? "bg-white/5 text-white/20 cursor-not-allowed"
                          : "bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] hover:scale-[1.02]"
                      )}
                    >
                      {isSubmitting ? (
                        <span className="animate-pulse">Processando...</span>
                      ) : (
                        <>
                          Confirmar Bloqueio
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-6 pt-6 border-t border-white/5">
                    <div className="flex items-start gap-3 text-white/40 text-xs leading-relaxed">
                      <AlertCircle size={14} className="mt-0.5 shrink-0 text-rose-500/50" />
                      <p>Números nesta lista serão ignorados silenciosamente pela IA. Nenhuma resposta será enviada.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* LISTA */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold tracking-widest uppercase text-white/40 flex items-center gap-2">
                Registros Ativos
                <span className="bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-md border border-rose-500/20">
                  {blacklist.length}
                </span>
              </h2>
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


const GlassInput = ({ label, value, onChange, placeholder, icon }: GlassInputProps) => (
  <div className="group">
    <label className="text-[10px] uppercase tracking-widest text-white/30 mb-2 block ml-1 group-focus-within:text-rose-400 transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-rose-500 transition-colors">
        {icon}
      </div>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-rose-500/50 focus:bg-rose-500/5 transition-all duration-300"
      />
    </div>
  </div>
);

const BlockedCard = ({ contact, onUnblock }: BlockedCardProps) => {
  const cleanPhone = contact.jid.split('@')[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ y: -2 }}
      className="group relative p-5 rounded-3xl bg-[#080505] border border-white/5 hover:border-rose-500/30 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-linear-to-br from-transparent via-rose-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#1a0505] to-black border border-white/5 flex items-center justify-center shadow-inner group-hover:border-rose-500/20 transition-colors">
            <UserX size={20} className="text-rose-500/60 group-hover:text-rose-500 transition-colors" />
          </div>
          
          <div>
            <h4 className="font-bold text-white text-base tracking-tight">{contact.name}</h4>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <p className="text-xs text-white/30 font-mono">{cleanPhone}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onUnblock}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/30 hover:bg-white hover:text-black hover:border-white transition-all duration-300 active:scale-90"
          title="Desbloquear (Restaurar acesso)"
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
    className="mt-12 flex flex-col items-center justify-center text-white/20 p-12 text-center border border-dashed border-white/5 rounded-[3rem]"
  >
    <div className="w-20 h-20 rounded-full bg-white/2 flex items-center justify-center mb-6 border border-white/5">
      <Search size={28} />
    </div>
    <p className="text-sm uppercase tracking-widest font-medium">{text}</p>
  </motion.div>
);