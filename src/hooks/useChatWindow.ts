import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/whatsapp';

export interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const useChatWindow = (selectedJid: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedJid) return;

    const fetchHistory = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/history/${selectedJid}`);
        setMessages(data);
      } catch (error) {
        console.error('Erro ao buscar histórico', error);
      }
    };

    setLoading(true);
    fetchHistory().then(() => {
        setLoading(false);
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    const interval = setInterval(fetchHistory, 3000);

    return () => clearInterval(interval);
  }, [selectedJid]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return { messages, loading, scrollRef };
};