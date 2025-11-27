import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client'
import { api } from './api';
import { TOKEN_KEY } from '../constants/app-keys';
export type WhatsappStatus = 
  | 'CONNECTING' 
  | 'QR_CODE_READY' 
  | 'CONNECTED' 
  | 'DISCONNECTED' 
  | 'OFFLINE'; 

interface SocketStatusPayload {
  status: WhatsappStatus;
  id?: string;
}

interface SocketQrPayload {
  qrCode: string;
}

interface ApiStatusResponse {
  status: WhatsappStatus;
  id: string | null;
}

interface ApiQrResponse {
  qrCode: string;
}

const SOCKET_URL = 'http://localhost:8080';

export const useWhatsApp = () => {
  const [status, setStatus] = useState<WhatsappStatus>('DISCONNECTED');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [connectedId, setConnectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
      });

      const socket = socketRef.current;
      socket.on('status', (data: SocketStatusPayload) => {
        console.log('📡 Socket Status:', data.status);
        setStatus(data.status);
        
        if (data.status === 'CONNECTED') {
          setQrCode(null);
        }
      });

      socket.on('qr-code', (data: SocketQrPayload) => {
        console.log('📡 Socket QR Recebido');
        setQrCode(data.qrCode);
        setStatus('QR_CODE_READY');
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
        } catch (error) {
          console.log(`Error : ${error}`);
        }
    };

    fetchInitialState();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const connectBot = async () => {
    setIsLoading(true);
    try {
      // O tipo de retorno aqui não importa muito pois só queremos o status 200
      await api.get<void>('/whatsapp/qr');
    } catch (error: unknown) {
      // Tratamento de erro tipado
      if (error instanceof Error) {
        console.error("Erro ao conectar bot:", error.message);
      } else {
        console.error("Erro desconhecido ao conectar bot");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { status, qrCode, connectedId, connectBot, isLoading };
};