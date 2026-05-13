"use client";

import React, { useState, useEffect, useRef } from "react";
import echo from "@/util/echo";
import { request } from "@/util/request";
import { Send, User as UserIcon } from "lucide-react";

const ChatWindow = ({ receiverId, receiverName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (receiverId) {
      fetchMessages();
      
      const channel = echo.private(`chat.${receiverId}`);
      channel.listen("ChatMessageSent", (e) => {
        setMessages((prev) => [...prev, e]);
      });

      return () => {
        echo.leave(`chat.${receiverId}`);
      };
    }
  }, [receiverId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await request(`/chat/${receiverId}`, 'GET');
      if (res.success) {
        setMessages(res.data);
        // Mark as read
        await request(`/chat/read-all/${receiverId}`, 'POST');
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      receiver_id: receiverId,
      message: newMessage.trim(),
    };

    try {
      const res = await request("/chat", 'POST', messageData);
      if (res.success) {
        setMessages((prev) => [...prev, res.data]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!receiverId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500">
        <UserIcon size={64} className="mb-4 opacity-20" />
        <p>Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden font-sans">
      {/* Header */}
      <div className="p-4 border-b border-slate-50 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-lg">
            {receiverName ? receiverName[0].toUpperCase() : "U"}
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-sm tracking-tight leading-tight">{receiverName || "User"}</h3>
            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Online Now
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/30"
      >
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender_id !== parseInt(receiverId);
            return (
              <div 
                key={msg.id || index} 
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[75%] p-3.5 rounded-2xl shadow-sm transition-all ${
                    isMe 
                    ? "bg-white text-slate-800 border border-indigo-100 rounded-tr-none shadow-indigo-100/20" 
                    : "bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none shadow-slate-100/10"
                  }`}
                >
                  <p className="text-[14px] font-medium leading-relaxed tracking-tight">{msg.message}</p>
                  <span className={`text-[9px] mt-2 block opacity-40 font-black uppercase tracking-widest tabular-nums ${isMe ? "text-right" : ""}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-slate-50 bg-white relative z-10">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-slate-50 border-slate-100 rounded-2xl py-3.5 px-5 focus:ring-2 focus:ring-indigo-500/20 outline-none text-[13px] font-bold text-slate-800 placeholder-slate-300 transition-all"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-slate-900 hover:bg-indigo-600 disabled:opacity-30 text-white p-3.5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-slate-200/50"
          >
            <Send size={18} strokeWidth={3} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
