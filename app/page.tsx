'use client';
import { BackgroundBlobs } from '@/components/BackgroundBlobs';
import { StatusBadge } from '@/components/StatusBadge';
import { useWhatsApp } from '@/src/hooks/useWhatsApp';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import { Smartphone, RefreshCw, ShieldCheck, Zap, } from 'lucide-react';
import { FloatingDock } from '@/components/FloatingDock';

export default function Home() {
  const { status, qrCode, connectedId } = useWhatsApp();

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative font-sans selection:bg-neon selection:text-black">
      <FloatingDock/>
      <BackgroundBlobs />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-5xl glass-panel rounded-[3rem] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-neon flex items-center justify-center text-black font-bold">
                <Zap size={20} fill="black" />
              </div>
              <span className="text-white/60 text-sm font-medium tracking-wider">SALES AI BOT 1.0</span>
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tighter">
              Automação <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Inteligente.</span>
            </h1>
            <p className="text-lg text-white/50 max-w-md leading-relaxed">
              Gerencie seus leads, responda com IA e escale suas vendas via WhatsApp com a tecnologia Gemini Flash.
            </p>
          </div>

          <div className="flex gap-4">
             <StatusBadge status={status} />
          </div>
          <AnimatePresence>
            {status === 'CONNECTED' && connectedId && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                  <div className="bg-green-500/20 p-3 rounded-full">
                    <Smartphone className="text-green-400" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest">Conectado como</p>
                    <p className="text-white font-mono text-lg">{connectedId.split('@')[0]}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative w-[350px] h-[450px] bg-dark/80 border border-white/10 rounded-[2.5rem] p-6 flex flex-col items-center justify-center shadow-2xl overflow-hidden group">

            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-neon/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {status === 'QR_CODE_READY' && qrCode ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-4 rounded-xl"
              >
                <QRCode 
                  value={qrCode} 
                  size={220}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
                <p className="text-black mt-4 text-center font-medium text-sm">Escaneie com seu WhatsApp</p>
              </motion.div>
            ) : status === 'CONNECTED' ? (
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="w-32 h-32 rounded-full bg-neon/10 flex items-center justify-center border border-neon/20 shadow-[0_0_40px_rgba(137,243,54,0.2)]">
                  <ShieldCheck size={64} className="text-neon" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white">Tudo Pronto</h3>
                  <p className="text-white/40 text-sm mt-2">Seu bot está ouvindo e respondendo.</p>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center gap-4 opacity-50">
                <RefreshCw className="animate-spin text-white" size={40} />
                <p className="text-sm text-white/60">Conectando servidor...</p>
              </div>
            )}

          </div>
        </div>

      </motion.div>
      
     
      <div className="absolute bottom-6 text-white/20 text-xs tracking-widest">
            Desenvolvido por : Pedro Peixoto
      </div>  
    </main>
  );
}