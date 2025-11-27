'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TOKEN_KEY } from '@/src/constants/app-keys';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      router.push('/login');
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#030303] text-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#89F336]" />
        <p className="mt-4 text-sm text-white/40 tracking-widest uppercase">Verificando Acesso...</p>
      </div>
    );
  }

  return <>{children}</>;
};