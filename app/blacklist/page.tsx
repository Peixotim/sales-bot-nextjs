'use client';

import { useState, FormEvent } from 'react';
import { useContacts } from '@/src/hooks/useContacts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserX,
  ShieldAlert,
  Unlock,
  Search,
  Plus,
  Ban,
  ShieldCheck,
  AlertOctagon,
  CalendarClock
} from 'lucide-react';
import { clsx } from 'clsx';
import { Header } from '@/components/Header';

const SoftCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={clsx(
    "rounded-[2.5rem] border border-white/8 bg-[#121214]/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden",
    className
  )}>
    {children}
  </div>
);

interface OrganicInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

const OrganicInput = ({ label, value, onChange, placeholder, icon, disabled }: OrganicInputProps) => (
  <div className="space-y-3">
    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-4">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#89F336] transition-colors duration-300">
        {icon}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full h-14 pl-12 pr-6 rounded-2xl bg-black/20 border border-white/5 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:bg-black/40 focus:border-[#89F336]/30 focus:ring-4 focus:ring-[#89F336]/5 transition-all duration-300 disabled:opacity-50"
      />
    </div>
  </div>
);

export default function BlacklistPage() {
  const { blacklist, blockContact, unblockContact, loading } = useContacts();
  
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  // const filteredList = blacklist.filter(contact => 
  //   (contact.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
  //   contact.jid.includes(searchTerm)
  // );

  return (
    <div className="min-h-screen bg-black text-zinc-200 selection:bg-rose-500/30 selection:text-white font-sans pb-20 overflow-x-hidden">
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#89F336]/5 rounded-full blur-[120px] mix-blend-screen opacity-20" />
         <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-rose-900/10 rounded-full blur-[120px] mix-blend-screen opacity-30" />
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

     <Header/>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pt-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
              Security <span className="text-rose-500">Protocol</span>
            </h1>
            <p className="text-lg text-zinc-400 font-light max-w-md leading-relaxed">
              Gerencie a zona de exclusão. Contatos listados aqui são ignorados pelo bot.
            </p>
          </div>

          <div className="flex items-center gap-4 px-6 py-3 rounded-full border border-white/8 bg-white/2 backdrop-blur-md">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total Bloqueado</span>
              <span className="text-xl font-mono text-white leading-none">
                {loading ? '...' : blacklist.length}
              </span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
               <ShieldAlert size={20} className="text-rose-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <SoftCard className="p-8 sticky top-24">
              <div className="mb-8 flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-inner">
                   <Ban size={28} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Novo Bloqueio</h2>
                  <p className="text-xs text-zinc-400 uppercase tracking-wide">Adicionar Manualmente</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <OrganicInput
                  label="Whatsapp ID (Telefone)"
                  value={phone}
                  onChange={setPhone}
                  disabled={isSubmitting}
                  placeholder="Ex: 55319..."
                  icon={<Plus size={18} />}
                />

                <OrganicInput
                  label="Referência / Motivo"
                  value={name}
                  onChange={setName}
                  disabled={isSubmitting}
                  placeholder="Ex: Spam Marketing"
                  icon={<UserX size={18} />}
                />

                <button
                  disabled={!phone || isSubmitting}
                  className={clsx(
                    'w-full group relative overflow-hidden rounded-2xl py-4 text-sm font-bold text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed',
                    'bg-rose-600 shadow-rose-600/20 hover:shadow-rose-600/40'
                  )}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <span className="animate-pulse">Processando...</span>
                    ) : (
                      <>
                        <ShieldAlert size={18} /> Confirmar Bloqueio
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </button>

                <div className="rounded-2xl bg-rose-500/5 border border-rose-500/10 p-4 flex gap-3">
                  <AlertOctagon size={20} className="text-rose-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-rose-200">Ação Imediata</p>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      O bot encerrará qualquer sessão ativa com este número instantaneamente.
                    </p>
                  </div>
                </div>
              </form>
            </SoftCard>
          </motion.section>

          <section className="lg:col-span-8 space-y-6">

            <div className="flex items-center justify-between p-2 pl-4 rounded-full border border-white/5 bg-white/2 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-zinc-500 w-full group">
                <Search size={18} className="group-focus-within:text-[#89F336] transition-colors" />
                <input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar registros..." 
                  className="bg-transparent border-none text-sm text-white placeholder:text-zinc-600 focus:outline-none w-full mr-4"
                />
              </div>
              <div className="hidden sm:block px-4 py-1.5 text-[10px] font-bold text-zinc-500 bg-white/5 rounded-full border border-white/5 uppercase tracking-wider whitespace-nowrap">
                Database
              </div>
            </div>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {blacklist.map((contact) => (
                  <motion.div
                    key={contact.jid}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="group relative"
                  >
                    <SoftCard className="p-5 h-full hover:bg-white/2 transition-colors border-white/8 group-hover:border-rose-500/20">
                      
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-xl bg-linear-to-br from-[#1a0505] to-black border border-white/5 flex items-center justify-center text-rose-500/50 group-hover:text-rose-500 transition-colors">
                              <Ban size={18} />
                           </div>
                           <div className="flex flex-col">
                             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider group-hover:text-rose-400 transition-colors">Bloqueado</span>
                             <div className="h-1 w-8 bg-rose-500/20 rounded-full mt-1 overflow-hidden">
                               <div className="h-full w-full bg-rose-500 animate-pulse origin-left" />
                             </div>
                           </div>
                        </div>
                        
                        <button
                          onClick={() => unblockContact(contact.jid)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                          title="Desbloquear"
                        >
                          <Unlock size={14} />
                        </button>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white mb-1 truncate group-hover:text-rose-100 transition-colors">
                          {contact.name || 'Desconhecido'}
                        </h3>
                        <p className="font-mono text-xs text-zinc-500 mb-4 bg-black/20 inline-block px-2 py-1 rounded-lg border border-white/5">
                          {contact.jid.split('@')[0]}
                        </p>
                        
                        <div className="flex items-center gap-2 text-[11px] text-zinc-600 border-t border-white/5 pt-3">
                           <CalendarClock size={12} />
                           <span>
                             {contact.createdAt 
                               ? new Date(contact.createdAt).toLocaleDateString() 
                               : 'Data não registrada'}
                           </span>
                        </div>
                      </div>

                    </SoftCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {blacklist.length === 0 && !loading && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 rounded-[2.5rem] border border-dashed border-white/10 bg-white/1"
              >
                <div className="h-24 w-24 rounded-full bg-[#89F336]/5 flex items-center justify-center mb-6 border border-[#89F336]/10">
                  <ShieldCheck size={40} className="text-[#89F336]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sistema Limpo</h3>
                <p className="text-sm text-zinc-500 max-w-xs text-center leading-relaxed">
                  Não há contatos bloqueados no momento. O tráfego está fluindo normalmente.
                </p>
              </motion.div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}