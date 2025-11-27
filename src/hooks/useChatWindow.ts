import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from './api';

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

  const fetchHistory = useCallback(async () => {
    if (!selectedJid) return;

    try {
      const { data } = await api.get(`/whatsapp/history/${selectedJid}`);
      
      if (isMounted.current) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Erro ao buscar histórico', error);
    }
  }, [selectedJid]);

  useEffect(() => {
    if (!selectedJid) return;

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