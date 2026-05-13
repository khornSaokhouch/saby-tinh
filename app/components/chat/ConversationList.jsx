"use client";

import React from "react";
import { Search, User as UserIcon } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

const ConversationList = ({ conversations, selectedId, onSelect, loading }) => {
  const { user } = useUserStore();
  const userId = user?.id;
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredConversations = conversations.filter((conv) => {
    const partner = parseInt(conv.sender_id) === parseInt(userId) ? conv.receiver : conv.sender;
    const partnerName = partner.owned_store?.name || partner.name;
    return partnerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           conv.message.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden font-sans">
      <div className="p-4 border-b border-slate-50">
        <h2 className="text-xl font-black text-slate-900 mb-4 tracking-tight">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/20 outline-none text-[11px] font-bold text-slate-900 placeholder:text-slate-300 transition-all uppercase tracking-wider"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-slate-100"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <p className="text-xs font-bold uppercase tracking-widest">{searchTerm ? "No matches found" : "No messages yet"}</p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const partner = parseInt(conv.sender_id) === parseInt(userId) ? conv.receiver : conv.sender;
            const partnerName = partner.owned_store?.name || partner.name;
            const isSelected = selectedId === partner.id;
            
            return (
              <button
                key={conv.id}
                onClick={() => onSelect(partner.id, partnerName)}
                className={`w-full p-4 flex items-center gap-3 transition-all text-left border-b border-slate-50 relative group ${
                  isSelected 
                  ? "bg-indigo-50/30" 
                  : "hover:bg-slate-50"
                }`}
              >
                {isSelected && (
                  <div className="absolute left-0 inset-y-2 w-1 bg-indigo-600 rounded-r-full"></div>
                )}
                
                <div className="relative shrink-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isSelected ? "bg-white shadow-md border-indigo-100 border text-indigo-600" : "bg-slate-50 border border-slate-100 text-slate-400 group-hover:scale-105"
                  }`}>
                    <UserIcon size={22} strokeWidth={isSelected ? 3 : 2} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className={`text-[13px] font-black truncate tracking-tight transition-colors ${isSelected ? "text-indigo-600" : "text-slate-900"}`}>
                      {partnerName}
                    </h4>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter tabular-nums">
                      {new Date(conv.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className={`text-[11px] font-medium truncate ${isSelected ? "text-indigo-400" : "text-slate-400"}`}>
                    {conv.message}
                  </p>
                </div>
                
                {!conv.is_read && parseInt(conv.receiver_id) === parseInt(userId) && (
                    <div className="w-2 h-2 bg-indigo-600 rounded-full shadow-sm shadow-indigo-500/20 shrink-0"></div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
