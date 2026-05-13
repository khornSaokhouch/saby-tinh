"use client";

import React, { useState, useEffect, Suspense } from "react";
import ConversationList from "@/components/chat/ConversationList";
import ChatWindow from "@/components/chat/ChatWindow";
import { useSearchParams } from "next/navigation";
import { request } from "@/util/request";

function ChatContent() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get("receiverId") || searchParams.get("vendorId");
  const queryName = searchParams.get("name");

  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState({ 
    id: queryId || null, 
    name: queryName || "Loading..." 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (queryId) {
      setSelectedChat({ id: queryId, name: queryName || "Store" });
    }
  }, [queryId, queryName]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await request("/chat/conversations", 'GET');
      if (res.success) {
        setConversations(res.data);
        // If no queryId, select the first conversation
        if (!queryId && res.data.length > 0) {
          const firstConv = res.data[0];
          const partner = firstConv.sender_id === firstConv.user_id ? firstConv.receiver : firstConv.sender;
          const partnerName = partner.owned_store?.name || partner.name;
          setSelectedChat({ id: partner.id, name: partnerName });
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex h-[calc(100vh-220px)] gap-6">
        <div className="w-80 flex-shrink-0">
          <ConversationList
            conversations={conversations}
            selectedId={selectedChat.id}
            onSelect={(id, name) => setSelectedChat({ id, name })}
            loading={loading}
          />
        </div>
        <div className="flex-1">
          <ChatWindow
            receiverId={selectedChat.id}
            receiverName={selectedChat.name}
          />
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-400 font-black uppercase tracking-widest text-[10px]"> Initializing Secure Terminal...</div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
