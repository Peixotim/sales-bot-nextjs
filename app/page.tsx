'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { 
  Smartphone, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Lock,
  Server,
  MoreHorizontal,
  Radio,
  Cpu,
  CheckCircle2
} from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '@/src/hooks/api';
import { TOKEN_KEY } from '@/src/constants/app-keys';
import { Header } from '@/components/Header';
import Image from 'next/image';

const SOCKET_URL = 'http://localhost:8080';

export type WhatsappStatus = 
  | 'CONNECTING' 
  | 'QR_CODE_READY' 
  | 'CONNECTED' 
  | 'DISCONNECTED' 
  | 'OFFLINE'; 

interface SocketStatusPayload { status: WhatsappStatus; id?: string; }
interface SocketQrPayload { qrCode: string; }
interface ApiStatusResponse { status: WhatsappStatus; id: string | null; }
interface ApiQrResponse { qrCode: string; }

const useWhatsApp = () => {
  const [status, setStatus] = useState<WhatsappStatus>('DISCONNECTED');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [connectedId, setConnectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    if (!token) return;

    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, { auth: { token }, transports: ['websocket'] });
      const socket = socketRef.current;

      socket.on('status', (data: SocketStatusPayload) => {
        setStatus(data.status);
        if (data.status === 'CONNECTED') {
          setQrCode(null);
          if (data.id) setConnectedId(data.id);
        }
      });

      socket.on('qr-code', (data: SocketQrPayload) => {
        setQrCode(data.qrCode);
        setStatus('QR_CODE_READY');
        setIsLoading(false);
      });
    }

    const fetchInitialState = async () => {
        try {
            const { data } = await api.get<ApiStatusResponse>('/whatsapp/status');
            setStatus(data.status);
            setConnectedId(data.id);
            if (data.status === 'QR_CODE_READY') {
                 const qrRes = await api.get<ApiQrResponse>('/whatsapp/qr');
                 setQrCode(qrRes.data.qrCode);
            }
        } catch (error) { console.error(error); }
    };
    fetchInitialState();
    return () => { if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; } };
  }, []);

  const connectBot = async () => {
    setIsLoading(true);
    try {
      await api.get<void>('/whatsapp/qr');
      setStatus('CONNECTING');
    } catch (error) { console.error(error); setIsLoading(false); }
  };

  return { status, qrCode, connectedId, connectBot, isLoading };
};

const StatusPill = ({ status }: { status: WhatsappStatus }) => {
  const config = {
    CONNECTED: { bg: 'bg-[#89F336]/10', text: 'text-[#89F336]', dot: 'bg-[#89F336]', label: 'Online & Operacional' },
    DISCONNECTED: { bg: 'bg-zinc-500/15', text: 'text-zinc-400', dot: 'bg-zinc-400', label: 'Desconectado' },
    OFFLINE: { bg: 'bg-zinc-500/15', text: 'text-zinc-400', dot: 'bg-zinc-400', label: 'Offline' },
    CONNECTING: { bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400', label: 'Inicializando...' },
    QR_CODE_READY: { bg: 'bg-blue-500/15', text: 'text-blue-400', dot: 'bg-blue-400', label: 'Aguardando Leitura' },
  };
  
  const current = config[status] || config.DISCONNECTED;

  return (
    <div className={clsx("flex items-center gap-2.5 rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur-md border border-white/5", current.bg, current.text)}>
      <span className="relative flex h-2.5 w-2.5">
        {(status === 'CONNECTED' || status === 'CONNECTING') && (
           <span className={clsx("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", current.dot)}></span>
        )}
        <span className={clsx("relative inline-flex rounded-full h-2.5 w-2.5", current.dot)}></span>
      </span>
      {current.label}
    </div>
  );
};

const SoftCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={clsx(
    "rounded-4xl border border-white/8 bg-[#121214]/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden",
    className
  )}>
    {children}
  </div>
);


export default function Home() {
  const { status, qrCode, connectedId, connectBot, isLoading } = useWhatsApp();

  const textBrand = "text-[#89F336]";
  const bgBrand = "bg-[#89F336]";
  const bgBrandLight = "bg-[#89F336]/10";
  const borderBrand = "border-[#89F336]/20";

  return (
    <div className="min-h-screen bg-dark text-zinc-200 selection:bg-[#89F336]/30 font-sans pb-20">
      <Header/>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#89F336]/10 rounded-full blur-[120px] mix-blend-screen opacity-20" />
         <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen opacity-30" />
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pt-20">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
              Conexão <span className={textBrand}> BOT</span>
            </h1>
            <p className="text-lg text-zinc-400 font-light max-w-md leading-relaxed">
              Gerencie a integração do seu bot de forma segura e tranquila.
            </p>
          </div>
          <StatusPill status={status} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex flex-col gap-8">
            <SoftCard className="p-8">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={clsx("flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner border border-white/5", bgBrandLight)}>
                    {status === 'CONNECTED' ? <Radio size={28} className={textBrand} /> : <Server size={28} className="text-zinc-400" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Instância Principal</h3>
                    <p className="text-sm text-zinc-400">Bot Engine</p>
                  </div>
                </div>
                <button className="text-zinc-500 hover:text-white transition p-2 hover:bg-white/5 rounded-full">
                  <MoreHorizontal size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-white/3 border border-white/5">
                  <div className="text-zinc-500 text-sm font-medium mb-2 flex items-center gap-2">
                    <Cpu size={16} /> Criptografia
                  </div>
                  <div className="text-white font-semibold flex items-center gap-2">
                    <ShieldCheck size={18} className={textBrand} />
                    Ponta-a-Ponta
                  </div>
                </div>
                <div className="p-5 rounded-3xl bg-white/3 border border-white/5">
                  <div className="text-zinc-500 text-sm font-medium mb-2 flex items-center gap-2">
                    <Activity size={16} /> Latência
                  </div>
                  <div className="text-white font-semibold">
                    <span className={textBrand}>~45ms</span> (Excelente)
                  </div>
                </div>
              </div>

              {status === 'CONNECTED' && connectedId && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={clsx("mt-6 p-5 rounded-3xl border flex items-center justify-between", bgBrandLight, borderBrand)}
                >
                   <div className="flex items-center gap-4">
                      <div className={clsx("p-3 rounded-xl bg-[#89F336]/20")}>
                        <Smartphone className={textBrand} size={24} />
                      </div>
                      <div>
                        <p className={clsx("text-sm font-semibold", textBrand)}>Dispositivo Sincronizado</p>
                        <p className="text-lg text-white font-mono tracking-wide">{connectedId.split('@')[0]}</p>
                      </div>
                   </div>
                   <CheckCircle2 size={28} className={textBrand} />
                </motion.div>
              )}
            </SoftCard>
            <SoftCard className="p-6 flex-1 min-h-[180px] flex flex-col justify-end">
              <div className="absolute top-4 left-6 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Logs do Sistema
              </div>
              <div className="font-mono text-[13px] text-zinc-400 space-y-2.5 mt-8">
                <p className="opacity-60">[10:00:01] Iniciando módulos de conexão...</p>
                {status === 'QR_CODE_READY' && (
                  <p><span className="text-blue-400">➤</span> Aguardando leitura do QR Code pelo usuário.</p>
                )}
                {status === 'CONNECTED' && (
                   <p><span className={textBrand}>✓</span> Conexão estabelecida com sucesso. Sessão segura.</p>
                )}
                 {status === 'CONNECTING' && (
                   <p>Gerando nova chave de autenticação...</p>
                )}
                <div className="flex items-center gap-2">
                  <span className={textBrand}>❯</span>
                  <span className="animate-pulse h-4 w-2 bg-zinc-600 block"/>
                </div>
              </div>
            </SoftCard>
          </div>
          <div className="lg:col-span-5 flex flex-col">
            <SoftCard className="h-full w-full p-8 flex flex-col relative z-10">
              <AnimatePresence mode="wait">
                {status === 'CONNECTED' ? (
                  <motion.div 
                    key="connected"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center"
                  >
                    <div className={clsx("h-32 w-32 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(137,243,54,0.15)] border border-[#89F336]/20", bgBrandLight)}>
                      <Lock size={48} className={textBrand} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Sistema Operacional</h3>
                    <p className="text-zinc-400 mb-8 max-w-xs leading-relaxed text-center">
                      Sua instância está online e pronta.
                    </p>
                    <div className="mt-auto w-full">
                       <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                        Gerenciar Sessão
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  
                  <motion.div 
                    key="auth"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center w-full"
                  >
                    <div className="flex-1 w-full flex flex-col items-center justify-center mb-6">
                      <div className="w-full aspect-square max-w-[280px] rounded-4xl border-2 border-dashed border-white/10 bg-black/20 flex flex-col items-center justify-center relative overflow-hidden p-6">
                         
                         {status === 'QR_CODE_READY' && qrCode ? (
                            <Image
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrCode)}`}
                              alt="QR Code"
                              className="w-full h-full object-contain mix-blend-screen opacity-90"
                            />
                         ) : (
                           <>
                             <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                {isLoading || status === 'CONNECTING' ? (
                                   <RefreshCw className={clsx("animate-spin", textBrand)} size={24} />
                                ) : (
                                   <Zap size={24} className="text-zinc-600" />
                                )}
                             </div>
                             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                                {isLoading || status === 'CONNECTING' ? 'Gerando...' : 'Aguardando Início'}
                             </p>
                           </>
                         )}
                      </div>
                    </div>

                    <div className="text-center mb-8">
                       <h3 className="text-2xl font-bold text-white mb-2">
                         {status === 'QR_CODE_READY' ? 'Escaneie o Código' : 'Nova Conexão'}
                       </h3>
                       <p className="text-sm text-zinc-500 max-w-[260px] mx-auto leading-relaxed">
                         {status === 'QR_CODE_READY' 
                           ? 'Aponte a câmera do seu WhatsApp para iniciar.'
                           : 'Inicie uma sessão segura para ativar os recursos do seu bot.'}
                       </p>
                    </div>

                    {status !== 'QR_CODE_READY' && (
                       <button 
                        onClick={connectBot}
                        disabled={isLoading || status === 'CONNECTING'}
                        className={clsx(
                          "w-full rounded-2xl px-6 py-4 text-sm font-bold text-black transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
                          bgBrand,
                          `shadow-[#89F336]/20 hover:shadow-[#89F336]/40`
                        )}
                      >
                        {isLoading || status === 'CONNECTING' ? 'Solicitando Acesso...' : 'Iniciar Nova Sessão'}
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </SoftCard>
          </div>

        </div>
      </main>
    </div>
  );
}