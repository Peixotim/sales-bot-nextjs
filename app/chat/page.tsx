'use client';

import { useState } from 'react';
import { useContacts } from '@/src/hooks/useContacts';
import { useChatWindow } from '@/src/hooks/useChatWindow';
import { BackgroundBlobs } from '@/components/BackgroundBlobs';
import { motion } from 'framer-motion';
import { User,MessageSquare, Send, MoreVertical, Phone } from 'lucide-react';
import { clsx } from 'clsx';

export default function ChatPage() {
  const { activeChats } = useContacts();
  const [selectedJid, setSelectedJid] = useState<string | null>(null);
  
  const { messages, loading, scrollRef } = useChatWindow(selectedJid);

  return (
    <main className="h-screen w-full bg-[#030303] text-white font-sans overflow-hidden flex">
      <BackgroundBlobs />
      
      <aside className="w-full md:w-[400px] bg-black/20 backdrop-blur-xl border-r border-white/5 flex flex-col z-10">
        <div className="p-6 border-b border-white/5">
          <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-3">
            <div className="w-3 h-3 bg-neon rounded-full animate-pulse" />
            Live Monitor
          </h1>
          <p className="text-xs text-white/40 mt-1">Acompanhamento em tempo real</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {activeChats.length === 0 ? (
            <div className="text-center text-white/20 mt-10">Nenhuma conversa ativa</div>
          ) : (
            activeChats.map((chat) => {
              const cleanId = chat.chatId.replace('@s.whatsapp.net', '');
              const isSelected = selectedJid === cleanId;

              return (
                <motion.button
                  key={chat.chatId}
                  onClick={() => setSelectedJid(cleanId)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={clsx(
                    "w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 border text-left group",
                    isSelected 
                      ? "bg-white/10 border-neon/30 shadow-[0_0_20px_-5px_rgba(137,243,54,0.1)]" 
                      : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/5"
                  )}
                >
                  <div className={clsx(
                    "w-12 h-12 rounded-full flex items-center justify-center text-lg",
                    isSelected ? "bg-neon text-black" : "bg-white/10 text-white/50"
                  )}>
                    <User size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={clsx("font-bold truncate", isSelected ? "text-white" : "text-white/70")}>
                      {cleanId}
                    </h3>
                    <p className="text-xs text-white/30 truncate">
                      {new Date(chat.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </motion.button>
              );
            })
          )}
        </div>
      </aside>

      {/* --- ÁREA DE CHAT (DIREITA) --- */}
      <section className="flex-1 flex flex-col relative z-10 bg-black/40">
        {selectedJid ? (
          <>
            {/* Header do Chat */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-white/[0.02] backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                  <User size={18} />
                </div>
                <div>
                  <h2 className="font-bold text-lg">{selectedJid}</h2>
                  <span className="flex items-center gap-1.5 text-xs text-neon">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon" /> Online via WhatsApp
                  </span>
                </div>
              </div>
              <div className="flex gap-4 text-white/30">
                <Phone size={20} className="hover:text-white cursor-pointer" />
                <MoreVertical size={20} className="hover:text-white cursor-pointer" />
              </div>
            </header>

            {/* Lista de Mensagens */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {messages.length === 0 && !loading && (
                <div className="text-center text-white/20 py-20">Histórico vazio ou não carregado.</div>
              )}
              
              {messages.map((msg, idx) => {
                // Gemini: 'user' = Cliente (Esquerda), 'model' = Bot (Direita)
                const isBot = msg.role === 'model'; 
                const text = msg.parts[0]?.text || '(Áudio ou Mídia)';

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={clsx(
                      "flex w-full",
                      isBot ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={clsx(
                      "max-w-[60%] p-4 rounded-2xl shadow-xl backdrop-blur-sm border text-sm leading-relaxed",
                      isBot 
                        ? "bg-neon/10 border-neon/20 text-white rounded-tr-sm" 
                        : "bg-[#1A1A1A] border-white/5 text-white/80 rounded-tl-sm"
                    )}>
                      {/* Label (Quem fala) */}
                      <p className={clsx(
                        "text-[10px] font-bold uppercase tracking-widest mb-1 opacity-50",
                        isBot ? "text-neon text-right" : "text-blue-400 text-left"
                      )}>
                        {isBot ? 'AI Assistant' : 'Cliente'}
                      </p>
                      
                      <p className="whitespace-pre-wrap">{text}</p>
                    </div>
                  </motion.div>
                );
              })}
              
              {/* Elemento invisível para scrollar até aqui */}
              <div ref={scrollRef} />
            </div>

            {/* Input Area (Apenas visual por enquanto, ou funcional se quiser implementar envio manual) */}
            <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-xl">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Monitorando conversa (Modo somente leitura)..." 
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-6 pr-12 text-white placeholder:text-white/20 focus:outline-none cursor-not-allowed"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/20">
            <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-center mb-6 animate-pulse">
              <MessageSquare size={40} />
            </div>
            <p className="text-lg font-light">Selecione uma conversa para monitorar</p>
          </div>
        )}
      </section>
    </main>
  );
}