import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { TOKEN_KEY } from '@/src/constants/app-keys';
const BASE_URL = 'http://localhost:8080';

export interface BlockedContact {
  jid: string;
  name: string;
  createdAt: string;
}

export interface ActiveChat {
  chatId: string;
  updatedAt: string;
}

export const useContacts = () => {
  const [blacklist, setBlacklist] = useState<BlockedContact[]>([]);
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([]);
  const [loading, setLoading] = useState(false);
  
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

  const fetchBlacklist = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/contacts/blacklist`, getConfig());
      if (isMounted.current) {
        setBlacklist(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Erro ao buscar blacklist", error);
      if (isMounted.current) setBlacklist([]);
    }
  }, []);

  const fetchActiveChats = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/whatsapp/chats`, getConfig());
      if (isMounted.current) {
        setActiveChats(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Erro ao buscar chats ativos", error);
      if (isMounted.current) setActiveChats([]);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    if (isMounted.current) setLoading(true);
    await Promise.all([fetchBlacklist(), fetchActiveChats()]);
    if (isMounted.current) setLoading(false);
  }, [fetchBlacklist, fetchActiveChats]);

  const blockContact = async (phoneNumber: string, name: string) => {
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      await axios.post(
        `${BASE_URL}/contacts/block`, 
        { phoneNumber: cleanPhone, name }, 
        getConfig()
      );
      await refreshAll();
      return true;
    } catch (error) {
      console.error("Erro ao bloquear:", error);
      return false;
    }
  };

  const unblockContact = async (jidOrPhone: string) => {
    try {
      const cleanPhone = jidOrPhone.replace('@s.whatsapp.net', '').replace(/\D/g, '');
      await axios.delete(
        `${BASE_URL}/contacts/unblock/${cleanPhone}`, 
        getConfig()
      );
      await refreshAll();
      return true;
    } catch (error) {
      console.error("Erro ao desbloquear:", error);
      return false;
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshAll();
  }, [refreshAll]);

  return { 
    blacklist, 
    activeChats,
    loading, 
    blockContact, 
    unblockContact, 
    refresh: refreshAll 
  };
};