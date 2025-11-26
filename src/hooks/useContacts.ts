import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const API_URL_CONTACTS = 'http://localhost:8080/contacts';
const API_URL_WHATSAPP = 'http://localhost:8080/whatsapp';

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
  
  // Ref para evitar atualizações em componentes desmontados
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const fetchBlacklist = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL_CONTACTS}/blacklist`);
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
      const { data } = await axios.get(`${API_URL_WHATSAPP}/chats`);
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

  // Ações
  const blockContact = async (phoneNumber: string, name: string) => {
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      await axios.post(`${API_URL_CONTACTS}/block`, { phoneNumber: cleanPhone, name });
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
      await axios.delete(`${API_URL_CONTACTS}/unblock/${cleanPhone}`);
      await refreshAll();
      return true;
    } catch (error) {
      console.error("Erro ao desbloquear:", error);
      return false;
    }
  };


  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { 
    blacklist, 
    activeChats,
    loading, 
    blockContact, 
    unblockContact, 
    refresh: refreshAll 
  };
};