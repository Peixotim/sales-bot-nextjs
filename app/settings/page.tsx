'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Bot, 
  Bell, 
  Shield, 
  Cpu, 
  Save,
  Zap,
  Volume2,
  Smartphone,
  Settings,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface SoftCardProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

interface OrganicInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

interface ChunkySwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

type Tab = 'bot' | 'account' | 'notifications' | 'security';

const SoftCard = ({ title, icon, children, className }: SoftCardProps) => (
  <div className={clsx(
    "rounded-[2.5rem] border border-white/8 bg-[#121214]/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden p-8",
    className
  )}>
    {title && (
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
        {icon && <div className="text-[#89F336]">{icon}</div>}
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

const NavButton = ({ icon, label, isActive, onClick }: NavButtonProps) => (
  <button 
    onClick={onClick}
    className={clsx(
      "w-full flex items-center gap-4 p-4 rounded-[1.2rem] transition-all duration-300 group relative overflow-hidden text-left",
      isActive 
        ? "bg-white/10 text-white shadow-lg" 
        : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
    )}
  >
    {isActive && (
      <motion.div 
        layoutId="active-tab-indicator"
        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-[#89F336] rounded-r-full shadow-[0_0_12px_#89f336]" 
      />
    )}
    <div className={clsx("transition-colors duration-300 ml-2", isActive && "text-[#89F336]")}>
      {icon}
    </div>
    <span className="font-semibold tracking-wide">{label}</span>
    {isActive && <ChevronRight size={16} className="ml-auto text-white/20" />}
  </button>
);

const OrganicInput = ({ label, value, onChange, type = "text" }: OrganicInputProps) => (
  <div className="space-y-3">
    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-4">
      {label}
    </label>
    <input 
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-14 pl-6 pr-6 rounded-2xl bg-white/3 border border-white/8 text-zinc-200 focus:outline-none focus:bg-white/5 focus:border-[#89F336]/50 focus:ring-4 focus:ring-[#89F336]/10 transition-all duration-300"
    />
  </div>
);

const ChunkySwitch = ({ checked, onChange }: ChunkySwitchProps) => (
  <div 
    onClick={() => onChange(!checked)}
    className={clsx(
      "w-16 h-9 rounded-full p-1 cursor-pointer transition-all duration-500 border relative",
      checked 
        ? "bg-[#89F336]/20 border-[#89F336]" 
        : "bg-black/40 border-white/10"
    )}
  >
    <motion.div 
      layout
      className={clsx(
        "w-7 h-7 rounded-full shadow-lg absolute top-0.5",
        checked ? "bg-[#89F336] left-[calc(100%-1.85rem)]" : "bg-zinc-500 left-0.5"
      )}
    />
  </div>
);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('bot');
  const [botName, setBotName] = useState('Peixotim AI');
  const [creativity, setCreativity] = useState(50);
  const [autoReply, setAutoReply] = useState(true);

  return (
    <div className="min-h-screen bg-black text-zinc-200 selection:bg-[#89F336]/30 font-sans overflow-hidden flex pb-20">

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#89F336]/5 rounded-full blur-[120px] mix-blend-screen opacity-20" />
         <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen opacity-30" />
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[32px_32px] mask-q[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 flex w-full h-screen p-4 lg:p-8 gap-8 max-w-[1600px] mx-auto pt-24">
        <aside className="hidden lg:flex w-80 flex-col shrink-0">
          <SoftCard className="h-full flex flex-col p-6 gap-2 bg-[#0E0E10]/80!">
            <div className="px-4 mb-8 mt-2 flex items-center gap-3 text-white">
               <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                 <Settings size={20} className="text-[#89F336]" />
               </div>
               <span className="font-bold text-lg tracking-tight">Preferências</span>
            </div>

            <nav className="flex-1 space-y-2">
              <NavButton icon={<Bot size={20} />} label="Inteligência Artificial" isActive={activeTab === 'bot'} onClick={() => setActiveTab('bot')} />
              <NavButton icon={<User size={20} />} label="Perfil do Consultor" isActive={activeTab === 'account'} onClick={() => setActiveTab('account')} />
              <NavButton icon={<Bell size={20} />} label="Notificações" isActive={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
              <NavButton icon={<Shield size={20} />} label="Segurança & API" isActive={activeTab === 'security'} onClick={() => setActiveTab('security')} />
            </nav>

            <div className="mt-auto pt-6 border-t border-white/5">
               <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/3 border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#89F336] to-emerald-600 flex items-center justify-center text-black font-bold">
                    PP
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Pedro Peixoto</p>
                    <p className="text-xs text-zinc-500">Plano Enterprise</p>
                  </div>
               </div>
            </div>
          </SoftCard>
        </aside>

        <section className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          <header className="mb-8 flex justify-between items-end">
             <div>
                <motion.p 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                  className="text-[#89F336] font-mono text-xs mb-2 tracking-wide uppercase"
                >
                  Configurações do Sistema
                </motion.p>
                <motion.h1 
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold text-white tracking-tight"
                >
                  {activeTab === 'bot' && 'Configuração Neural'}
                  {activeTab === 'account' && 'Dados do Consultor'}
                  {activeTab === 'notifications' && 'Central de Alertas'}
                  {activeTab === 'security' && 'Segurança'}
                </motion.h1>
             </div>

             <Link href="/">
                <button className="flex items-center gap-2 bg-[#89F336] text-black px-8 py-3.5 rounded-2xl font-bold shadow-[0_4px_20px_rgba(137,243,54,0.3)] hover:scale-105 hover:shadow-[0_6px_30px_rgba(137,243,54,0.4)] transition-all active:scale-95 group">
                   <Save size={18} className="group-hover:rotate-12 transition-transform" />
                   Salvar Alterações
                </button>
             </Link>
          </header>

          <div className="flex-1 overflow-y-auto pr-2 pb-20 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            <AnimatePresence mode="wait">
              
              {/* TAB: BOT CONFIG */}
              {activeTab === 'bot' && (
                <motion.div 
                  key="bot"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <SoftCard title="Identidade do Agente" icon={<Smartphone size={18}/>} className="col-span-1">
                    <div className="space-y-8">
                      <OrganicInput label="Nome do Bot" value={botName} onChange={setBotName} />
                      
                      <div className="space-y-4">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-4">
                          Tom de Voz
                        </label>
                        <div className="flex bg-black/20 p-1.5 rounded-2xl border border-white/5">
                           {['Formal', 'Equilibrado', 'Extrovertido'].map((tone) => (
                             <button key={tone} className="flex-1 py-3 text-sm font-semibold rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 focus:bg-white/10 focus:text-[#89F336] transition-all">
                               {tone}
                             </button>
                           ))}
                        </div>
                      </div>
                    </div>
                  </SoftCard>

                  <SoftCard title="Parâmetros Neurais" icon={<Zap size={18}/>} className="col-span-1 relative">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#89F336] rounded-full blur-[100px] opacity-[0.15] pointer-events-none" />

                    <div className="space-y-8 relative z-10">
                      <div>
                        <div className="flex justify-between mb-6">
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Nível de Criatividade</label>
                          <span className="text-[#89F336] font-mono bg-[#89F336]/10 px-2 py-1 rounded-lg">{creativity}%</span>
                        </div>
                        
                        {/* Custom Slider */}
                        <div className="relative h-2 bg-white/10 rounded-full mb-4">
                           <div 
                              className="absolute top-0 left-0 h-full bg-[#89F336] rounded-full" 
                              style={{ width: `${creativity}%` }}
                           />
                           <input 
                            type="range" min="0" max="100" value={creativity} 
                            onChange={(e) => setCreativity(Number(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div 
                              className="absolute top-1/2 -translate-y-1/2 h-6 w-6 bg-white rounded-full shadow-lg pointer-events-none transition-all"
                              style={{ left: `${creativity}%`, transform: 'translate(-50%, -50%)' }}
                          />
                        </div>

                        <p className="text-xs text-zinc-500 pl-1 flex items-center gap-2">
                           <Sparkles size={12} className="text-[#89F336]" />
                           {creativity < 30 ? 'Respostas diretas e factuais.' : creativity > 70 ? 'Usa emojis e linguagem natural.' : 'Equilíbrio ideal para atendimento.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between p-5 bg-white/2 rounded-3xl border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${autoReply ? 'bg-[#89F336] text-black' : 'bg-white/5 text-zinc-600'}`}>
                            <Bot size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">Resposta Automática</p>
                            <p className="text-xs text-zinc-500 mt-0.5">Permitir que a IA responda sozinha</p>
                          </div>
                        </div>
                        <ChunkySwitch checked={autoReply} onChange={setAutoReply} />
                      </div>
                    </div>
                  </SoftCard>

                  <SoftCard title="Modelos de IA (LLM)" icon={<Cpu size={18}/>} className="col-span-1 lg:col-span-2">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-5 rounded-3xl bg-[#89F336]/5 border border-[#89F336]/30 cursor-pointer relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                              <Zap size={60} />
                           </div>
                           <div className="mb-3 text-[#89F336]"><Bot size={24}/></div>
                           <h4 className="font-bold text-white">Gemini 1.5 Flash</h4>
                           <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Alta velocidade. Ideal para respostas rápidas em tempo real.</p>
                        </div>
                        
                        <div className="p-5 rounded-3xl bg-white/2 border border-white/5 hover:border-white/10 transition-colors cursor-pointer opacity-60 hover:opacity-100">
                           <div className="mb-3 text-zinc-400"><Cpu size={24}/></div>
                           <h4 className="font-bold text-white">Gemini 1.5 Pro</h4>
                           <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Maior raciocínio. Recomendado para análises complexas.</p>
                        </div>

                        <div className="p-5 rounded-3xl bg-white/2 border border-white/5 hover:border-white/10 transition-colors cursor-pointer opacity-60 hover:opacity-100">
                           <div className="mb-3 text-zinc-400"><Volume2 size={24}/></div>
                           <h4 className="font-bold text-white">Whisper AI</h4>
                           <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Módulo exclusivo para transcrição de áudios do WhatsApp.</p>
                        </div>
                     </div>
                  </SoftCard>

                </motion.div>
              )}
              {activeTab === 'account' && (
                <motion.div 
                  key="account"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-3xl"
                >
                  <SoftCard title="Dados Pessoais" icon={<User size={18}/>}>
                    <div className="space-y-8">
                       <div className="flex items-center gap-8">
                          <div className="w-28 h-28 rounded-full bg-linear-to-br from-zinc-800 to-black border-4 border-white/5 flex items-center justify-center text-3xl font-bold text-zinc-600">
                            PP
                          </div>
                          <div>
                             <h3 className="text-xl font-bold text-white mb-2">Pedro Peixoto</h3>
                             <p className="text-zinc-500 text-sm mb-4">Administrador do Sistema</p>
                             <button className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold hover:bg-white hover:text-black transition-all bg-white/5">
                               Alterar Foto de Perfil
                             </button>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-6">
                          <OrganicInput label="Nome Completo" value="Pedro Peixoto" onChange={() => {}} />
                          <OrganicInput label="Email Corporativo" value="pedro@breakflow.com" onChange={() => {}} type="email" />
                       </div>
                    </div>
                  </SoftCard>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </section>
      </div>
    </div>
  );
}