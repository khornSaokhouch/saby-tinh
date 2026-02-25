// // components/ChatPage.jsx (Updated Design for UX)
// "use client";

// import React, { useEffect, useState, useMemo, useRef } from "react";
// import { useChatStore } from "../../stores/useChatStore";
// import { useAuthStore } from "../../stores/authStore";
// import { Send, User, ChevronLeft, MessageSquare } from 'lucide-react'; // Added icons

// // --- Helper Component: Chat List Item ---
// const ChatListItem = ({ chat, selected, onClick, currentUserId }) => {
//   const chatName = chat.name || "Unknown User";

//   return (
//       <div
//           key={chat.id}
//           className={`flex items-center p-3 mb-2 rounded-xl cursor-pointer transition-all duration-200 
//               ${selected ? "bg-indigo-600 text-white shadow-md" : "bg-white hover:bg-gray-100 text-gray-800"
//           }`}
//           onClick={() => onClick(chat.id)}
//       >
//           <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 overflow-hidden 
//               ${selected ? "bg-white text-indigo-600" : "bg-gray-200 text-gray-500"}`}
//           >
//               {chat.profile_image_url ? (
//                   <img
//                       src={chat.profile_image_url}
//                       alt={chatName}
//                       className="w-full h-full object-cover rounded-full"
//                   />
//               ) : (
//                   <span className="font-semibold">{chatName[0]}</span>
//               )}
//           </div>
//           <div className="flex-1 overflow-hidden">
//               <p className="font-semibold truncate">{chatName}</p>
//           </div>
//       </div>
//   );
// };


// // --- Main Component ---
// export default function ChatPage() {
//     const user = useAuthStore((state) => state.user);
//     const { chats, messages, fetchChats, fetchMessages, sendMessage, subscribeToUser } = useChatStore();

//     const [selectedUserId, setSelectedUserId] = useState(null);
//     const [content, setContent] = useState("");
//     const messagesEndRef = useRef(null);

//     // Memoized messages to prevent unnecessary re-renders
//     const chatMessages = useMemo(() => messages[selectedUserId] || [], [messages, selectedUserId]);
//     const selectedChatUser = useMemo(() => chats.find((c) => c.id === selectedUserId), [chats, selectedUserId]);

//     // Scroll to bottom when new messages arrive
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [chatMessages]);

//     // -------------------------------
//     // Lifecycle Effects
//     // -------------------------------
//     useEffect(() => {
//         if (user) subscribeToUser();
//     }, [user, subscribeToUser]);

//     useEffect(() => {
//         if (!user) return;
//         fetchChats();
//     }, [user, fetchChats]);

//     useEffect(() => {
//         if (!selectedUserId) return;
//         fetchMessages(selectedUserId);
//     }, [selectedUserId, fetchMessages]);

//     // -------------------------------
//     // Send a new message
//     // -------------------------------
//     const handleSend = async () => {
//         if (!content.trim() || !selectedUserId) return;
        
//         // Optimistic update (if your store supports it, otherwise await)
//         await sendMessage(selectedUserId, content.trim());
//         setContent("");
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === "Enter" && !e.shiftKey) {
//             e.preventDefault();
//             handleSend();
//         }
//     };

//     // -------------------------------
//     // Render UI
//     // -------------------------------
//     return (
//         <div className="max-w-full mx-auto p-6 flex h-[calc(100vh-6rem)] min-h-[600px] overflow-hidden">
            
//             {/* 1. Chat List (Sidebar) */}
//             <div className={`w-full md:w-1/3 flex-shrink-0 bg-white rounded-l-2xl shadow-xl p-4 overflow-y-auto 
//                 ${selectedUserId ? 'hidden md:block' : 'block'}`}
//             >
//                 <h2 className="text-2xl font-extrabold text-gray-800 mb-4 flex items-center border-b pb-3">
//                     <MessageSquare className="w-6 h-6 mr-3 text-indigo-500" />
//                     All Conversations
//                 </h2>
//                 <div className="space-y-2">
//                     {chats?.length ? (
//                         chats.map((c) => (
//                             <ChatListItem
//                                 key={c.id}
//                                 chat={c}
//                                 selected={c.id === selectedUserId}
//                                 onClick={setSelectedUserId}
//                                 currentUserId={user?.id}
//                             />
//                         ))
//                     ) : (
//                         <div className="text-center text-gray-500 p-10 mt-10 bg-gray-50 rounded-lg">
//                             <p>Start connecting to see chats here.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* 2. Chat Conversation */}
//             <div className={`flex-1 flex flex-col bg-white md:rounded-r-2xl shadow-xl 
//                 ${selectedUserId ? 'block' : 'hidden md:flex'}`
//             }>
//                 {selectedUserId ? (
//                     <>
//                         {/* Chat Header (Sticky) */}
//                         <div className="sticky top-0 bg-white border-b p-4 shadow-sm z-10 flex items-center">
//                             <button 
//                                 className="md:hidden mr-3 text-indigo-600 hover:text-indigo-800"
//                                 onClick={() => setSelectedUserId(null)}
//                                 aria-label="Back to Chat List"
//                             >
//                                 <ChevronLeft className="w-6 h-6" />
//                             </button>
//                             <h2 className="text-xl font-bold text-gray-800">
//                                 Chat with {selectedChatUser?.name || "User"}
//                             </h2>
//                         </div>

//                         {/* Message Area */}
//                         <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                             {chatMessages.length ? (
//                                 chatMessages.map((msg) => (
//                                     <div
//                                         key={msg.id}
//                                         className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}
//                                     >
//                                         <div
//                                             className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-md text-sm ${
//                                                 msg.sender_id === user?.id
//                                                     ? "bg-indigo-600 text-white rounded-br-none"
//                                                     : "bg-gray-100 text-gray-800 rounded-tl-none"
//                                             }`}
//                                         >
//                                             <p>{msg.content}</p>
//                                             {/* Optional Timestamp */}
//                                             {/* <span className={`block mt-1 text-xs ${msg.sender_id === user?.id ? "text-indigo-200" : "text-gray-500"}`}>
//                                                 {new Date(msg.created_at).toLocaleTimeString()} 
//                                             </span> */}
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="text-center text-gray-500 mt-20">
//                                     <p className="text-lg">Say hello to {selectedChatUser?.name || "User"}!</p>
//                                 </div>
//                             )}
//                             <div ref={messagesEndRef} />
//                         </div>

//                         {/* Message Input (Sticky Footer) */}
//                         <div className="sticky bottom-0 bg-white border-t p-4 flex items-center">
//                             <textarea
//                                 className="flex-1 border border-gray-300 rounded-xl p-3 resize-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 h-12 overflow-hidden"
//                                 value={content}
//                                 onChange={(e) => setContent(e.target.value)}
//                                 onKeyDown={handleKeyDown}
//                                 placeholder="Type your message here..."
//                                 rows={1}
//                             />
//                             <button
//                                 className="ml-3 w-12 h-12 bg-indigo-600 text-white p-3 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-300"
//                                 onClick={handleSend}
//                                 disabled={!content.trim()}
//                                 aria-label="Send message"
//                             >
//                                 <Send className="w-5 h-5" />
//                             </button>
//                         </div>
//                     </>
//                 ) : (
//                     <div className="flex flex-col items-center justify-center flex-1 text-gray-500 p-10">
//                         <MessageSquare className="w-16 h-16 mb-4 text-indigo-400" />
//                         <h3 className="text-xl font-semibold">Welcome to Chat</h3>
//                         <p>Select a conversation from the left to begin messaging.</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }


export default function ChatPage() {
    return (
        <div>
            <h1>Chat</h1>
        </div>
    );
}