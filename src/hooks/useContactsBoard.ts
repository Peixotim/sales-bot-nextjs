import { useState, useEffect } from 'react';
import { useContacts } from './useContacts'; 

export interface ContactCard {
  id: string;
  name: string;
  phone: string;
  type: 'active' | 'blocked';
  lastInteraction?: string;
}

export const useContactsBoard = () => {
  const { blacklist, activeChats: rawActiveChats, blockContact, unblockContact, refresh } = useContacts();
  
  const [activeContacts, setActiveContacts] = useState<ContactCard[]>([]);
  const [blockedContacts, setBlockedContacts] = useState<ContactCard[]>([]);

  useEffect(() => {
    const formattedBlocked = blacklist.map(b => ({
      id: b.jid.replace('@s.whatsapp.net', ''),
      name: b.name || 'Sem nome',
      phone: b.jid.replace('@s.whatsapp.net', ''),
      type: 'blocked' as const
    }));

    const blockedIds = new Set(blacklist.map(b => b.jid));
    
    const formattedActive = rawActiveChats
      .filter(chat => !blockedIds.has(chat.chatId))
      .map(chat => ({
        id: chat.chatId.replace('@s.whatsapp.net', ''),
        name: 'Lead Ativo',
        phone: chat.chatId.replace('@s.whatsapp.net', ''),
        type: 'active' as const,
        lastInteraction: new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBlockedContacts(formattedBlocked);
    setActiveContacts(formattedActive);

  }, [blacklist, rawActiveChats]); 

  const moveContact = async (contactId: string, targetColumn: 'active' | 'blocked') => {
    const contact = [...activeContacts, ...blockedContacts].find(c => c.id === contactId);
    if (!contact) return;

    if (targetColumn === 'blocked') {
      setActiveContacts(prev => prev.filter(c => c.id !== contactId));
      setBlockedContacts(prev => [...prev, { ...contact, type: 'blocked' }]);
      await blockContact(contact.phone, contact.name);
    } else {
      setBlockedContacts(prev => prev.filter(c => c.id !== contactId));
      setActiveContacts(prev => [...prev, { ...contact, type: 'active' }]);
      await unblockContact(contact.phone);
    }
    setTimeout(() => refresh(), 800); 
  };

  return { activeContacts, blockedContacts, moveContact };
};