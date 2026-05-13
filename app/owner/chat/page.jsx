"use client";

import React, { useState, useEffect } from "react";
import ConversationList from "@/components/chat/ConversationList";
import ChatWindow from "@/components/chat/ChatWindow";
import { request } from "@/util/request";

export default function OwnerChatPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState({ id: null, name: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await request("/chat/conversations", 'GET');
      if (res.success) {
        setConversations(res.data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-160px)] gap-6">
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
  );
}
