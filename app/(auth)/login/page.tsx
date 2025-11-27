"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ArrowRight,
  Mail,
  Lock,
  User,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import { api } from "@/src/hooks/api";
import { AxiosError } from 'axios';
import { NestErrorResponse } from '@/components/interfaces/nestError';

export default function AuthPage() {
  const router = useRouter();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === "number") {
        formattedValue = value.replace(/\D/g, "");
    }

    setRegisterData({ ...registerData, [name]: formattedValue });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
        const { data } = await api.post('/auth/login', {
            email: loginData.email,
            password: loginData.password
        });

        localStorage.setItem('peixotim_token', data.access_token);
        toast.success(`Bem-vindo, ${data.user.name}!`);
        
        setTimeout(() => router.push("/"), 1000);

    }catch (err: unknown) { 
      console.error(err);
      
      let finalMessage = "Erro ao tentar logar na conta.";

      if (err instanceof AxiosError) {
        const data = err.response?.data as NestErrorResponse;
        
        if (data?.message) {
          finalMessage = Array.isArray(data.message) 
            ? data.message[0] 
            : data.message;
        }
      } 
      else if (err instanceof Error) {
         finalMessage = err.message;
      }

      setError(finalMessage);
      toast.error("Erro ao tentar logar");
    } finally {
        setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    try {
        await api.post('/auth/register-consultant', {
            name: registerData.name,
            email: registerData.email,
            number: registerData.number, 
            password: registerData.password
        });

        toast.success("Conta criada com sucesso!");
        setIsRegisterMode(false); 
        setLoginData({ email: registerData.email, password: "" }); 

    } catch (err: unknown) { 
      console.error(err);
      
      let finalMessage = "Erro ao criar conta.";

      if (err instanceof AxiosError) {
        const data = err.response?.data as NestErrorResponse;
        
        if (data?.message) {
          finalMessage = Array.isArray(data.message) 
            ? data.message[0] 
            : data.message;
        }
      } 
      else if (err instanceof Error) {
         finalMessage = err.message;
      }

      setError(finalMessage);
      toast.error("Erro no cadastro");
    } finally {
        setIsLoading(false);
    }
  };

  const overlayVariants = {
    login: { x: "0%" },
    register: { x: "100%" },
  };
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-black text-[#EDEDED] selection:bg-[#89F336]/30 font-sans">
      <Toaster position="bottom-right" richColors theme="dark" />
   <div className="pointer-events-none absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-size-[24px_24px]"></div>
      <div className="relative h-screen w-full overflow-hidden lg:flex">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]"></div>        
        <div
          className={`absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center p-8 transition-all duration-500 lg:w-1/2 ${isRegisterMode ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"}`}
        >
          <div className="w-full max-w-[420px]">
            <div className="mb-6 text-center lg:text-left">
              <h2 className="mb-2 bg-linear-to-r from-white via-[#89F336] to-white bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                Criar Conta
              </h2>
              <p className="text-sm text-[#888888]">
                Crie sua conta e conecte seu número de atendimento.
              </p>
            </div>
            
            <AnimatePresence>
              {error && isRegisterMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 rounded-xl bg-red-500/10 p-3 text-center text-sm text-red-400 border border-red-500/20"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleRegister} className="space-y-3 overflow-visible">
              <InputGroup
                icon={<User />}
                placeholder="Seu Nome"
                name="name"
                value={registerData.name}
                onChange={handleRegisterChange}
                label="Nome"
              />
              
              <InputGroup
                icon={<Phone />}
                placeholder="5531999998888"
                name="number"
                value={registerData.number}
                onChange={handleRegisterChange}
                label="WhatsApp (ID do Bot)"
                type="tel"
              />

              <InputGroup
                icon={<Mail />}
                placeholder="seu@email.com"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                label="Email"
                type="email"
              />

              <div className="grid grid-cols-2 gap-3">
                <InputGroup
                  icon={<Lock />}
                  placeholder="Senha"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  label="Senha"
                  type="password"
                />
                <InputGroup
                  icon={<CheckCircle2 />}
                  placeholder="Confirmar"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  label="Confirmar"
                  type="password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#89F336] text-lg font-bold text-[#0B0C10] shadow-[0_0_20px_-5px_rgba(137,243,54,0.4)] transition-all hover:bg-[#9EFF55] active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Cadastrar"}
              </button>
            </form>

            <div className="mt-4 text-center lg:hidden">
              <button
                onClick={() => setIsRegisterMode(false)}
                className="text-sm font-bold text-[#89F336] underline"
              >
                Voltar para Login
              </button>
            </div>
          </div>
        </div>
        <div
          className={`absolute top-0 right-0 flex h-full w-full flex-col items-center justify-center p-8 transition-all duration-500 lg:w-1/2 ${!isRegisterMode ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"}`}
        >
          <div className="w-full max-w-[420px]">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="animate-text-shimmer mb-3 bg-linear-to-r from-white via-[#89F336] to-white bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                Bem-vindo
              </h2>
              <p className="text-lg text-[#888888]">
                Gerencie seus atendimentos, mensagens e automações em um só lugar.
              </p>
            </div>

            <AnimatePresence>
              {error && !isRegisterMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 rounded-xl bg-red-500/10 p-3 text-center text-sm text-red-400 border border-red-500/20"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-5 overflow-visible">
              <InputGroup
                icon={<Mail />}
                placeholder="seu@email.com"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                label="Email"
                type="email"
              />
              
              <div className="group space-y-2">
                <label className="ml-4 text-[11px] font-bold tracking-widest text-[#666666] uppercase transition-colors group-focus-within:text-[#89F336]">
                  Senha
                </label>
                <div className="relative transition-all duration-300 group-focus-within:scale-[1.01]">
                  <div className="absolute top-1/2 left-5 -translate-y-1/2 text-[#666666] transition-colors group-focus-within:text-[#89F336]">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••••••"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="h-14 w-full rounded-2xl border border-white/5 bg-[#18181B] pr-6 pl-14 text-base font-medium text-white shadow-black/20 transition-all duration-300 outline-none placeholder:text-[#444] hover:border-white/10 hover:bg-[#1E1E22] focus:border-[#89F336]/50 focus:bg-[#18181B] focus:ring-4 focus:ring-[#89F336]/10"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#89F336] text-[17px] font-bold text-[#0B0C10] shadow-[0_0_20px_-5px_rgba(137,243,54,0.4)] transition-all duration-200 hover:bg-[#9EFF55] hover:shadow-[0_0_25px_-5px_rgba(137,243,54,0.6)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    Acessar <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center lg:hidden">
              <p className="text-sm font-medium text-[#666]">
                Não tem conta?{" "}
                <button
                  onClick={() => setIsRegisterMode(true)}
                  className="font-bold text-[#89F336] hover:underline"
                >
                  Criar agora
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* PAINEL ANIMADO (Transição Lateral) */}
        <motion.div
          initial={false}
          animate={isRegisterMode ? "register" : "login"}
          variants={overlayVariants}
          transition={{ type: "spring", stiffness: 200, damping: 25, mass: 1 }}
          className="animate-gradient absolute top-0 left-0 z-20 hidden h-full w-1/2 items-center justify-center overflow-hidden bg-linear-to-br from-[#89F336] via-[#1a7c37] to-[#89F336] lg:flex"
        >
          <div className="relative z-10 max-w-md rounded-[2.5rem] border border-white/20 bg-white/10 p-12 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-2xl">
            <AnimatePresence mode="wait">
              {!isRegisterMode ? (
                <motion.div
                  key="login-text"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-linear-to-tr from-[#89F336] to-[#9EFF55] text-4xl shadow-2xl shadow-[#89F336]/30">
                    💬
                  </div>
                  <h1 className="mb-4 text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                    Sales Bot
                  </h1>
                  <p className="mb-6 text-lg leading-relaxed font-medium text-white/90">
                    Escale suas vendas no automático.
                  </p>
                  <button
                    onClick={() => setIsRegisterMode(true)}
                    className="rounded-full border border-white/30 bg-white/20 px-8 py-3 font-bold text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white/30"
                  >
                    Criar Conta Nova
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="register-text"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/30 bg-white/20 text-4xl shadow-2xl">
                    👋
                  </div>
                  <h1 className="mb-4 text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                    Bem-vindo!
                  </h1>
                  <p className="mb-8 text-lg leading-relaxed font-medium text-white/90">
                    Já tem conta? Volte para acessar seu painel.
                  </p>
                  <button
                    onClick={() => setIsRegisterMode(false)}
                    className="rounded-full border border-white/30 bg-white/20 px-8 py-3 font-bold text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white/30"
                  >
                    Acessar Login
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className="fixed bottom-6 text-[10px] font-bold tracking-[0.2em] text-[#333] uppercase dark:text-[#444]">
        SalesBot Version 1.0
      </div>
    </div>
  );
}

// Componente de Input Reutilizável
const InputGroup = ({
  icon,
  label,
  ...props
}: {
  icon: React.ReactNode;
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="group space-y-2">
    <label className="ml-4 text-[11px] font-bold tracking-widest text-[#666666] uppercase transition-colors group-focus-within:text-[#89F336]">
      {label}
    </label>
    <div className="relative transition-all duration-300 group-focus-within:scale-[1.01]">
      <div className="absolute top-1/2 left-5 -translate-y-1/2 text-[#666666] transition-colors group-focus-within:text-[#89F336]">
        {icon}
      </div>
      <input
        {...props}
        className="h-14 w-full rounded-2xl border border-white/5 bg-[#18181B] pr-6 pl-14 text-base font-medium text-white shadow-black/20 transition-all duration-300 outline-none placeholder:text-[#444] hover:border-white/10 hover:bg-[#1E1E22] focus:border-[#89F336]/50 focus:bg-[#18181B] focus:ring-4 focus:ring-[#89F336]/10"
        required
      />
    </div>
  </div>
);