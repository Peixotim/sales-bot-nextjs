'use client';

import { useState } from 'react';
import { useContacts } from '@/src/hooks/useContacts';
import { useChatWindow } from '@/src/hooks/useChatWindow';
import { motion } from 'framer-motion';
import { 
  User, 
  Bot, 
  Send, 
  MoreVertical, 
  Phone, 
  Search, 
  MessageSquare,
  Clock,
  CheckCheck,
  Cpu
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

const IconButton = ({ icon, onClick }: { icon: React.ReactNode; onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
  >
    {icon}
  </button>
);

export default function ChatPage() {
  const { activeChats } = useContacts(); 
  const [selectedJid, setSelectedJid] = useState<string | null>(null);

  const { messages, loading, scrollRef } = useChatWindow(selectedJid);

  return (
    <div className="h-screen w-full bg-black text-zinc-200 font-sans overflow-hidden flex flex-col relative selection:bg-[#89F336]/30 selection:text-black">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#89F336]/5 rounded-full blur-[120px] mix-blend-screen opacity-20" />
         <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen opacity-30" />
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <Header />

      <div className="relative z-10 flex w-full h-full p-4 lg:p-6 gap-6 pt-24 pb-6">
        <SoftCard className="w-full md:w-[400px] flex flex-col shrink-0 h-full">

          <div className="p-6 pb-4 border-b border-white/5 bg-white/2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Monitor
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#89F336] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#89F336]"></span>
                </span>
              </h1>
              <span className="text-[10px] font-bold bg-[#89F336]/10 text-[#89F336] px-2 py-1 rounded-full uppercase tracking-wider">
                {activeChats.length} Ativos
              </span>
            </div>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 group-focus-within:text-[#89F336] transition-colors" />
              <input 
                type="text" 
                placeholder="Filtrar conversas..." 
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#89F336]/30 focus:bg-black/40 transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {activeChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-3 opacity-60">
                <MessageSquare size={32} strokeWidth={1.5} />
                <p className="text-sm">Nenhuma conversa ativa</p>
              </div>
            ) : (
              activeChats.map((chat) => {
                const cleanId = chat.chatId.replace('@s.whatsapp.net', '');
                const isSelected = selectedJid === chat.chatId;

                return (
                  <motion.button
                    key={chat.chatId}
                    layoutId={`card-${chat.chatId}`}
                    onClick={() => setSelectedJid(chat.chatId)}
                    className={clsx(
                      "w-full p-4 rounded-[1.2rem] flex items-center gap-4 transition-all duration-300 text-left group relative",
                      isSelected 
                        ? "bg-white/6" 
                        : "hover:bg-white/2"
                    )}
                  >
                    {/* Indicador Ativo */}
                    {isSelected && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#89F336] rounded-r-full shadow-[0_0_10px_#89f336]"
                      />
                    )}

                    <div className={clsx(
                      "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0 transition-colors border",
                      isSelected 
                        ? "bg-[#89F336] text-black border-[#89F336]" 
                        : "bg-white/5 text-zinc-500 border-white/5 group-hover:border-white/10 group-hover:text-zinc-300"
                    )}>
                      <User size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className={clsx("font-semibold text-sm truncate", isSelected ? "text-white" : "text-zinc-300")}>
                          {cleanId}
                        </h3>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 truncate flex items-center gap-1.5">
                        {isSelected ? (
                          <span className="text-[#89F336] flex items-center gap-1">
                            <Cpu size={10} /> Monitorando
                          </span>
                        ) : (
                          'Clique para visualizar'
                        )}
                      </p>
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>
        </SoftCard>

        
        <SoftCard className="flex-1 flex flex-col relative bg-[#0E0E10]/80 h-full">
          
          {selectedJid ? (
            <>
              <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-white/1 backdrop-blur-xl z-20 absolute top-0 left-0 right-0 rounded-t-[2.5rem]">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center text-white shadow-lg">
                      <User size={18} />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#89F336] rounded-full border-2 border-[#121214]"></div>
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-white tracking-wide">
                        {selectedJid.replace('@s.whatsapp.net', '')}
                    </h2>
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                       via WhatsApp Business
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <IconButton icon={<Phone size={18} />} />
                  <IconButton icon={<Search size={18} />} />
                  <IconButton icon={<MoreVertical size={18} />} />
                </div>
              </header>
              <div className="flex-1 overflow-y-auto p-8 pt-24 space-y-8 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent scroll-smooth">
                {messages.length === 0 && !loading && (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4">
                    <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center">
                      <Clock size={32} />
                    </div>
                    <p className="text-sm">Histórico sincronizado. Aguardando novas mensagens.</p>
                  </div>
                )}
                
                {messages.map((msg, idx) => {
                  const isBot = msg.role === 'model'; 
                  const text = (msg.parts && msg.parts[0]?.text) ? msg.parts[0].text : '📎 Mídia ou Áudio';

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={clsx(
                        "flex w-full",
                        isBot ? "justify-end" : "justify-start"
                      )}
                    >
                      <div className={clsx(
                        "max-w-[70%] p-5 rounded-[1.2rem] shadow-sm text-sm leading-relaxed relative group transition-all",
                        isBot 
                          ? "bg-[#89F336] text-black rounded-tr-sm shadow-[0_4px_20px_-5px_rgba(137,243,54,0.3)]" // Bot Style
                          : "bg-[#27272A] text-zinc-100 rounded-tl-sm border border-white/5" // User Style
                      )}>
  
                        <div className={clsx(
                          "flex justify-between items-center mb-1.5 gap-4 text-[10px] font-bold uppercase tracking-widest",
                          isBot ? "text-black/60" : "text-white/40"
                        )}>
                          <span>{isBot ? 'Break Flow AI' : 'Cliente'}</span>
                          {isBot && <Bot size={12} />}
                        </div>
                        
                        <p className="whitespace-pre-wrap font-medium">{text}</p>

                        <div className={clsx("flex justify-end mt-1", isBot ? "text-black/40" : "text-white/20")}>
                          <CheckCheck size={14} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                
                <div ref={scrollRef} className="h-4" />
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-white/5 bg-[#121214]/80 backdrop-blur-xl">
                <div className="relative group cursor-not-allowed opacity-60">
                  <input 
                    type="text" 
                    placeholder="Modo Observador: A IA está respondendo automaticamente..." 
                    disabled
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-zinc-400 placeholder:text-zinc-600 focus:outline-none transition-all pointer-events-none font-mono text-xs"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/5 rounded-xl text-zinc-500">
                    <Send size={18} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            // EMPTY STATE (Sem chat selecionado)
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-[#89F336] blur-[80px] opacity-10 rounded-full group-hover:opacity-20 transition-opacity duration-700"></div>
                <div className="w-32 h-32 rounded-[2.5rem] bg-[#18181B] border border-white/5 flex items-center justify-center relative z-10 shadow-2xl">
                  <MessageSquare size={40} className="text-[#89F336]" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Monitoramento Neural</h2>
              <p className="text-zinc-500 max-w-sm leading-relaxed">
                Selecione uma conexão lateral para visualizar o fluxo de pensamento da IA em tempo real.
              </p>
            </div>
          )}
        </SoftCard>
      </div>
    </div>
  );
}