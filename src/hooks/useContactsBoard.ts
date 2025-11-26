import { useState, useEffect } from 'react';
import { useContacts } from './useContacts'; // Importa a API

// 1. EXPORTANDO A INTERFACE (Isso resolve o erro de ContactCard)
export interface ContactCard {
  id: string;
  name: string;
  phone: string;
  type: 'active' | 'blocked';
  lastInteraction?: string;
}

// 2. EXPORTANDO O HOOK (Isso resolve o erro de useContactsBoard)
export const useContactsBoard = () => {
  // Puxamos os dados reais da API
  const { blacklist, activeChats: rawActiveChats, blockContact, unblockContact, refresh } = useContacts();
  
  const [activeContacts, setActiveContacts] = useState<ContactCard[]>([]);
  const [blockedContacts, setBlockedContacts] = useState<ContactCard[]>([]);

  // EFEITO: Transforma os dados da API em Cards Visuais
  useEffect(() => {
    // Formata a Blacklist
    const formattedBlocked = blacklist.map(b => ({
      id: b.jid.replace('@s.whatsapp.net', ''),
      name: b.name || 'Sem nome',
      phone: b.jid.replace('@s.whatsapp.net', ''),
      type: 'blocked' as const
    }));

    // Formata os Chats Ativos (Filtrando quem já está bloqueado)
    const blockedIds = new Set(blacklist.map(b => b.jid));
    
    const formattedActive = rawActiveChats
      .filter(chat => !blockedIds.has(chat.chatId))
      .map(chat => ({
        id: chat.chatId.replace('@s.whatsapp.net', ''),
        name: 'Lead Ativo', // Futuramente pegaremos o nome real
        phone: chat.chatId.replace('@s.whatsapp.net', ''),
        type: 'active' as const,
        lastInteraction: new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBlockedContacts(formattedBlocked);
    setActiveContacts(formattedActive);

  }, [blacklist, rawActiveChats]); 

  // AÇÃO: Mover Cards
  const moveContact = async (contactId: string, targetColumn: 'active' | 'blocked') => {
    const contact = [...activeContacts, ...blockedContacts].find(c => c.id === contactId);
    if (!contact) return;

    if (targetColumn === 'blocked') {
      // Visual (Otimista)
      setActiveContacts(prev => prev.filter(c => c.id !== contactId));
      setBlockedContacts(prev => [...prev, { ...contact, type: 'blocked' }]);
      // API
      await blockContact(contact.phone, contact.name);
    } else {
      // Visual (Otimista)
      setBlockedContacts(prev => prev.filter(c => c.id !== contactId));
      setActiveContacts(prev => [...prev, { ...contact, type: 'active' }]);
      // API
      await unblockContact(contact.phone);
    }
    
    // Garante consistência com o banco
    setTimeout(() => refresh(), 800); 
  };

  return { activeContacts, blockedContacts, moveContact };
};