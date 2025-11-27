import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { TOKEN_KEY } from '@/src/constants/app-keys';

const BASE_URL = 'http://localhost:8080';

export interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const useChatWindow = (selectedJid: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const getConfig = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      }
    };
  };

  const fetchHistory = useCallback(async () => {
    if (!selectedJid) return;

    try {
      const encodedJid = encodeURIComponent(selectedJid);
      
      const { data } = await axios.get(
        `${BASE_URL}/whatsapp/history/${encodedJid}`, 
        getConfig()
      );
      
      if (isMounted.current) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    }
  }, [selectedJid]);

  useEffect(() => {
    if (!selectedJid) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMessages([]);
        return;
    }

    const initLoad = async () => {
      if (isMounted.current) setLoading(true);
      await fetchHistory();
      
      if (isMounted.current) {
        setLoading(false);
        setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };

    initLoad();

    const interval = setInterval(fetchHistory, 3000);
    return () => clearInterval(interval);
  }, [selectedJid, fetchHistory]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return { messages, loading, scrollRef };
};