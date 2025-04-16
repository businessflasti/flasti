'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from '@/components/ui/chat-message';
import { chatService } from '@/lib/chat-service';

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  name: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read';
}

interface GroupedChat {
  userId: string;
  username: string;
  lastMessage: ChatMessage;
  unreadCount: number;
}

export default function AdminChatPage() {
  const [selectedChat, setSelectedChat] = useState<ChatMessage | null>(null);
  const [reply, setReply] = useState('');
  const [showNewChatButton, setShowNewChatButton] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    // Mensajes de ejemplo eliminados para usar datos reales
  ]);

  const [groupedChats, setGroupedChats] = useState<GroupedChat[]>([
    {
      id: '1',
      userId: 'user1',
      username: 'Juan Pérez',
      name: 'Consulta sobre cursos',
      message: '¿Tienen cursos de desarrollo web?',
      timestamp: '2024-01-20T10:30:00',
      status: 'unread'
    },
    {
      id: '2',
      userId: 'user2',
      username: 'María García',
      name: 'Problema técnico',
      message: 'No puedo acceder a mi cuenta',
      timestamp: '2024-01-20T11:15:00',
      status: 'read'
    }
  ]);

  useEffect(() => {
    const allMessages = chatService.getAllMessages();
    setMessages(allMessages);

    // Agrupar mensajes por usuario
    const groupedMessages = allMessages.reduce<Map<string, GroupedChat>>((acc, msg) => {
      const existing = acc.get(msg.userId);
      const newUnreadCount = existing ?
        existing.unreadCount + (msg.status === 'unread' ? 1 : 0) :
        (msg.status === 'unread' ? 1 : 0);

      acc.set(msg.userId, {
        userId: msg.userId,
        username: msg.username,
        lastMessage: msg,
        unreadCount: newUnreadCount
      });
      return acc;
    }, new Map());

    setGroupedChats(Array.from(groupedMessages.values()));

    const messageHandler = (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
      setGroupedChats(prev => {
        const existing = prev.find(chat => chat.userId === msg.userId);
        if (existing) {
          return prev.map(chat =>
            chat.userId === msg.userId ? {
              ...chat,
              lastMessage: msg,
              unreadCount: chat.unreadCount + (msg.status === 'unread' ? 1 : 0)
            } : chat
          );
        } else {
          return [...prev, {
            userId: msg.userId,
            username: msg.username,
            lastMessage: msg,
            unreadCount: msg.status === 'unread' ? 1 : 0
          }];
        }
      });
    };

    const unsubscribe = chatService.onMessage(messageHandler);
    return () => unsubscribe();
  }, []);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selectedChat) return;

    try {
      await chatService.sendMessage({
        userId: selectedChat.userId,
        username: 'Admin',
        name: `Re: ${selectedChat.name}`,
        message: reply
      });
      setReply('');
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  const handleDeleteChat = (userId: string) => {
    chatService.deleteConversation(userId);
    setSelectedChat(null);
    setShowNewChatButton(true);
    setMessages(prev => prev.filter(msg => msg.userId !== userId));
    setGroupedChats(prev => prev.filter(chat => chat.userId !== userId));
  };

  return (
    <>
      <div className="container-custom py-8">
        <div className="glass-card rounded-xl p-6">
          <h1 className="text-3xl font-bold text-gradient mb-6">Panel de Chat</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Lista de mensajes */}
            <div className="md:col-span-1 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Mensajes</h2>
              {groupedChats.map((chat) => (
                <div
                  key={chat.userId}
                  onClick={() => setSelectedChat(chat.lastMessage)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${selectedChat?.userId === chat.userId ? 'bg-primary/20 neon-border' : 'bg-secondary/50 hover:bg-secondary'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{chat.username}</span>
                    <div className="flex items-center gap-2">
                      {chat.unreadCount > 0 && (
                        <span className="px-2 py-1 text-xs bg-primary/30 rounded-full">
                          {chat.unreadCount}
                        </span>
                      )}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChat(chat.userId);
                        }}
                        variant="ghost"
                        className="p-2 hover:bg-destructive/20 rounded-full"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"/>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                      </Button>
                    </div>
                  </div>
                  {chat.lastMessage && (
                    <>
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(chat.lastMessage.timestamp).toLocaleString()}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Área de chat */}
            <div className="md:col-span-2">
              {showNewChatButton ? (
                <div className="flex items-center justify-center h-full">
                  <Button
                    onClick={() => setShowNewChatButton(false)}
                    className="glow-effect"
                  >
                    Iniciar Nuevo Chat
                  </Button>
                </div>
              ) : selectedChat ? (
                <div className="space-y-4">
                  <div className="space-y-4 max-h-[400px] overflow-y-auto p-4 bg-secondary/20 rounded-lg">
                    {messages
                      .filter(msg => msg.userId === selectedChat.userId)
                      .map(msg => (
                        <ChatMessage
                          key={msg.id}
                          message={msg.message}
                          timestamp={msg.timestamp}
                          sender={msg.username}
                          isAdmin={msg.username === 'Admin'}
                          status={msg.status}
                        />
                      ))
                    }
                  </div>

                  <form onSubmit={handleReply} className="space-y-4">
                    <Input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Escribe tu respuesta..."
                      className="bg-secondary/50"
                    />
                    <Button type="submit" className="w-full glow-effect">
                      Enviar Respuesta
                    </Button>
                  </form>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}