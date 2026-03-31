"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Send, User, Search, MessageSquare, MoreVertical, 
  Phone, Video, Info, CheckCheck, Loader2, ArrowLeft,
  Circle
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

// --- Static Data for Mockup ---
const STATIC_CHATS = [
  { 
    id: 1, 
    name: "Saby-Store Hub", 
    last_msg: "Your order #882 has been confirmed!", 
    time: "2m ago", 
    unread: 2, 
    online: true,
    avatar: null
  },
  { 
    id: 2, 
    name: "Logistics Support", 
    last_msg: "I'll check the shipping status for you.", 
    time: "1h ago", 
    unread: 0, 
    online: false,
    avatar: null
  },
  { 
    id: 3, 
    name: "Premium Admin", 
    last_msg: "Welcome to the management console.", 
    time: "Yesterday", 
    unread: 0, 
    online: true,
    avatar: null
  }
];

const STATIC_MESSAGES = {
  1: [
    { id: 101, sender: 'them', content: "Hello! How can we help you today?", time: "10:05 AM" },
    { id: 102, sender: 'me', content: "Hi, I'm checking on my latest order status.", time: "10:06 AM" },
    { id: 103, sender: 'them', content: "Checking... Your order #882 has been confirmed!", time: "10:07 AM" },
    { id: 104, sender: 'them', content: "It will be dispatched within 24 hours.", time: "10:07 AM" },
  ],
  2: [
    { id: 201, sender: 'me', content: "Is express shipping available for district 7?", time: "昨天" },
    { id: 202, sender: 'them', content: "I'll check the shipping status for you.", time: "昨天" },
  ],
  3: [
    { id: 301, sender: 'them', content: "Welcome to the management console.", time: "Monday" },
  ]
};

export default function ChatPage() {
  const [selectedId, setSelectedId] = useState(1);
  const [msgInput, setMsgInput] = useState("");
  const [messages, setMessages] = useState(STATIC_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const selectedChat = STATIC_CHATS.find(c => c.id === selectedId);
  const chatHistory = messages[selectedId] || [];

  useEffect(() => {
    if (hasMounted) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, hasMounted]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      content: msgInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages({
      ...messages,
      [selectedId]: [...chatHistory, newMsg]
    });
    setMsgInput("");

    // Mock response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply = {
        id: Date.now() + 1,
        sender: 'them',
        content: "Got it! Our team is processing your request. 👌",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => ({
        ...prev,
        [selectedId]: [...(prev[selectedId] || []), reply]
      }));
    }, 1500);
  };

  if (!hasMounted) return <div className="h-[calc(100vh-140px)] bg-slate-50 rounded-2xl animate-pulse" />;

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-[500px] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden font-sans text-slate-900">
      
      {/* ... (rest of the component remains the same) ... */}
      
      {/* (Bottom of the component) */}
      <div className={`flex-1 flex flex-col bg-white ${!selectedId ? 'hidden md:flex' : 'flex'}`}>
        {selectedChat ? (
          <>
            {/* Window Header */}
            <header className="p-4 border-b border-slate-50 flex items-center justify-between bg-white relative z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedId(null)}
                  className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-600">
                    <User size={18} />
                  </div>
                  {selectedChat.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">{selectedChat.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedChat.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                      {selectedChat.online ? 'Online now' : 'Currently away'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                 <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all"><Phone size={16} /></button>
                 <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all"><Video size={16} /></button>
                 <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all"><Info size={16} /></button>
              </div>
            </header>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/10 custom-scrollbar">
              <div className="flex justify-center mb-6">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] bg-white px-3 py-1 rounded-full border border-slate-50">
                   Secure End-to-End Encryption
                </span>
              </div>
              
              {chatHistory.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] md:max-w-[70%] ${msg.sender === 'me' ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className={`p-3 rounded-2xl text-[12px] font-bold leading-relaxed shadow-sm border ${
                      msg.sender === 'me' 
                        ? 'bg-slate-900 text-white border-slate-800 rounded-br-none' 
                        : 'bg-white text-slate-700 border-slate-100 rounded-bl-none'
                    }`}>
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 px-1">
                      <p className="text-[9px] font-bold text-slate-400">{msg.time}</p>
                      {msg.sender === 'me' && <CheckCheck size={10} className="text-indigo-400" />}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-white border border-slate-100 p-2.5 rounded-2xl rounded-bl-none flex gap-1 items-center">
                      <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" />
                      <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce delay-75" />
                      <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce delay-150" />
                   </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-50">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-1.5 focus-within:border-indigo-200 focus-within:bg-white transition-all">
                <input 
                  type="text" 
                  value={msgInput}
                  onChange={e => setMsgInput(e.target.value)}
                  placeholder="Draft your message..." 
                  className="flex-1 bg-transparent border-none outline-none px-3 text-[12px] font-bold text-slate-900 placeholder:text-slate-300"
                />
                <button 
                  type="submit"
                  disabled={!msgInput.trim()}
                  className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-md shadow-slate-100 disabled:opacity-30 disabled:hover:bg-slate-900"
                >
                  <Send size={14} className="ml-0.5" />
                </button>
              </div>
              <div className="mt-2 text-center text-[8px] font-black text-slate-300 uppercase tracking-widest">
                Press Enter to dispatch message
              </div>
            </form>
          </>
        ) : (
          /* Empty Selection State */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/20">
             <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 flex items-center justify-center text-slate-100 mb-6 shadow-sm">
                <MessageSquare size={32} />
             </div>
             <h3 className="text-base font-bold text-slate-900">Communication Hub</h3>
             <p className="text-xs text-slate-400 font-medium max-w-xs mt-1.5">
                Select a verified conversation from the terminal to begin secure communication with shop owners.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}