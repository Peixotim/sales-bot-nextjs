import { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = 'http://localhost:8080/whatsapp';

export const useWhatsApp = () => {
  const [status, setStatus] = useState('DISCONNECTED');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [connectedId, setConnectedId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkStatusAndQr = async () => {
      try {

        const { data } = await axios.get(`${API_URL}/status`);
        
        if (!isMounted) return;

        setStatus(data.status);
        setConnectedId(data.id);
        if (data.status === 'QR_CODE_READY' || data.status === 'CONNECTING') {
          try {
            const qrResponse = await axios.get(`${API_URL}/qr`);
            if (isMounted) setQrCode(qrResponse.data.qrCode);
          } catch (qrError) {
            console.error("Erro ao buscar QR:", qrError);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Erro de conexão:", error);
          setStatus('OFFLINE');
        }
      }
    };

    checkStatusAndQr();

  
    const interval = setInterval(checkStatusAndQr, 2000);


    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []); 

  return { status, qrCode, connectedId };
};