'use client';

import { useState } from 'react';
import { useContacts } from '@/src/hooks/useContacts';
import { useChatWindow } from '@/src/hooks/useChatWindow';
import { BackgroundBlobs } from '@/components/BackgroundBlobs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Bot, 
  Send, 
  MoreVertical, 
  Phone, 
  Search, 
  MessageSquare,
  Clock
} from 'lucide-react';
import { clsx } from 'clsx';

export default function ChatPage() {
  const { activeChats } = useContacts();
  const [selectedJid, setSelectedJid] = useState<string | null>(null);
  
  // Hook de mensagens (faz polling automático)
  const { messages, loading, scrollRef } = useChatWindow(selectedJid);

  return (
    <main className="h-screen w-full bg-[#020202] text-white font-sans overflow-hidden flex relative selection:bg-neon selection:text-black">
      <BackgroundBlobs />
      
      {/* Texture Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

      <div className="relative z-10 flex w-full h-full p-4 gap-4">
        
        {/* --- SIDEBAR (LISTA DE CONVERSAS) --- */}
        <aside className="w-full md:w-[380px] flex flex-col glass-panel rounded-[2rem] border border-white/5 bg-black/40 backdrop-blur-2xl overflow-hidden shrink-0">
          
          {/* Header da Sidebar */}
          <div className="p-6 border-b border-white/5 flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon animate-pulse shadow-[0_0_10px_#89f336]" />
                Live Monitor
              </h1>
              <p className="text-white/40 text-xs mt-1 uppercase tracking-widest">
                {activeChats.length} Conversas Ativas
              </p>
            </div>

            {/* Busca (Visual) */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-neon transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar conversa..." 
                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-neon/30 focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          {/* Lista Scrollable */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {activeChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-white/20">
                <MessageSquare size={24} className="mb-2 opacity-50" />
                <p className="text-sm">Nenhuma conversa recente</p>
              </div>
            ) : (
              activeChats.map((chat) => {
                const cleanId = chat.chatId.replace('@s.whatsapp.net', '');
                const isSelected = selectedJid === cleanId;

                return (
                  <motion.button
                    key={chat.chatId}
                    layoutId={chat.chatId}
                    onClick={() => setSelectedJid(cleanId)}
                    className={clsx(
                      "w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 border text-left group relative overflow-hidden",
                      isSelected 
                        ? "bg-white/[0.08] border-white/10" 
                        : "bg-transparent border-transparent hover:bg-white/[0.03]"
                    )}
                  >
                    {isSelected && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-neon rounded-r-full"
                      />
                    )}

                    {/* Avatar */}
                    <div className={clsx(
                      "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-inner shrink-0",
                      isSelected 
                        ? "bg-gradient-to-br from-neon to-emerald-600 text-black" 
                        : "bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white"
                    )}>
                      <User size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <h3 className={clsx("font-bold text-sm truncate", isSelected ? "text-white" : "text-white/70")}>
                          {cleanId}
                        </h3>
                        <span className="text-[10px] text-white/20 font-mono">
                          {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-white/30 truncate flex items-center gap-1.5">
                        <span className={clsx("w-1.5 h-1.5 rounded-full", isSelected ? "bg-neon" : "bg-white/20")} />
                        {isSelected ? 'Monitorando...' : 'Clique para ver'}
                      </p>
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>
        </aside>

        {/* --- ÁREA DE CHAT (DIREITA) --- */}
        <section className="flex-1 flex flex-col relative glass-panel rounded-[2rem] border border-white/5 bg-black/60 backdrop-blur-3xl overflow-hidden">
          {selectedJid ? (
            <>
              {/* Header do Chat */}
              <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-white/[0.02] backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#222] to-black border border-white/10 flex items-center justify-center text-white shadow-lg">
                    <User size={18} />
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-white tracking-wide">{selectedJid}</h2>
                    <span className="flex items-center gap-1.5 text-[10px] text-neon uppercase tracking-wider font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" /> Online via WhatsApp
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <IconButton icon={<Phone size={18} />} />
                  <IconButton icon={<Search size={18} />} />
                  <IconButton icon={<MoreVertical size={18} />} />
                </div>
              </header>
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar scroll-smooth">
                {messages.length === 0 && !loading && (
                  <div className="h-full flex flex-col items-center justify-center opacity-30">
                    <Clock size={48} className="mb-4" />
                    <p>Histórico sincronizado. Nenhuma mensagem recente.</p>
                  </div>
                )}
                
                {messages.map((msg, idx) => {
                  const isBot = msg.role === 'model'; 
                  const text = msg.parts[0]?.text || 'Conteúdo de mídia (Áudio/Imagem)';

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={clsx(
                        "flex w-full",
                        isBot ? "justify-end" : "justify-start"
                      )}
                    >
                      <div className={clsx(
                        "max-w-[70%] p-4 rounded-2xl shadow-xl backdrop-blur-md text-sm leading-relaxed relative group transition-all hover:scale-[1.01]",
                        isBot 
                          ? "bg-neon text-black rounded-tr-sm shadow-[0_5px_20px_-5px_rgba(137,243,54,0.3)]" 
                          : "bg-[#1A1A1A] border border-white/10 text-white rounded-tl-sm"
                      )}>
  
                        <div className="flex justify-between items-center mb-1 gap-4 opacity-50 text-[10px] font-bold uppercase tracking-widest">
                          <span>{isBot ? 'Peixotim AI' : 'Cliente'}</span>
                          {isBot && <Bot size={12} />}
                        </div>
                        
                        <p className="whitespace-pre-wrap font-medium">{text}</p>
                      </div>
                    </motion.div>
                  );
                })}
                
                {/* Elemento invisível para auto-scroll */}
                <div ref={scrollRef} className="h-4" />
              </div>

              {/* Input Area (Visual - Modo Leitura) */}
              <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="relative group cursor-not-allowed opacity-60">
                  <input 
                    type="text" 
                    placeholder="Modo Espectador Ativo (IA está respondendo...)" 
                    disabled
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-white placeholder:text-white/20 focus:outline-none transition-all pointer-events-none"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/5 rounded-xl text-white/20">
                    <Send size={18} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            // EMPTY STATE (Nenhuma conversa selecionada)
            <div className="flex-1 flex flex-col items-center justify-center text-white/20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent">
              <div className="relative">
                <div className="absolute inset-0 bg-neon blur-[100px] opacity-10 rounded-full animate-pulse-slow"></div>
                <div className="w-32 h-32 rounded-[2.5rem] bg-[#0A0A0A] border border-white/10 flex items-center justify-center mb-8 relative z-10 shadow-2xl">
                  <MessageSquare size={48} className="text-white/40" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Monitoramento Neural</h2>
              <p className="text-lg font-light text-white/40 max-w-sm text-center leading-relaxed">
                Selecione uma conexão lateral para visualizar o fluxo de pensamento da IA em tempo real.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}


const IconButton = ({ icon }: { icon: React.ReactNode }) => (
  <button className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90">
    {icon}
  </button>
);