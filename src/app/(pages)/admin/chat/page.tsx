"use client";
import { useEffect, useState, useRef } from "react";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import { io, Socket } from "socket.io-client";
import { Search, Send, User, MessageCircle } from "lucide-react";
import axiosInstance from "@/services/axiosInstance";

interface Conversation {
  _id: string;
  session_id: string;
  participant_name: string;
  last_message: string;
  unread_admin: number;
  updatedAt: string;
}

interface Message {
  _id: string;
  conversation_id: string;
  sender_type: 'client' | 'admin';
  text: string;
  createdAt: string;
}

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await axiosInstance.get("/admin/chats");
      if (res.data.code === 200) {
        setConversations(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async (session_id: string) => {
    try {
      const res = await axiosInstance.get(`/admin/chats/${session_id}/messages`);
      if (res.data.code === 200) {
        setMessages(res.data.data);
        
        // Mark as read locally
        setConversations(prev => prev.map(c => 
          c.session_id === session_id ? { ...c, unread_admin: 0 } : c
        ));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Socket setup
  useEffect(() => {
    const newSocket = io("http://localhost:4000"); // Should use env var in prod
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("join_admin");
    });

    newSocket.on("new_conversation", (conv: Conversation) => {
      setConversations(prev => {
        const exists = prev.find(c => c._id === conv._id);
        if (exists) return prev;
        return [conv, ...prev];
      });
    });

    newSocket.on("conversation_updated", (conv: Conversation) => {
      setConversations(prev => {
        const filtered = prev.filter(c => c._id !== conv._id);
        return [conv, ...filtered];
      });
    });

    newSocket.on("receive_message", (msg: Message & { session_id: string }) => {
      // If the message belongs to the currently active chat
      setActiveChat(currentActive => {
        if (currentActive && currentActive.session_id === msg.session_id) {
          setMessages(prev => [...prev, msg]);
          // Notify server we read it if we are looking at it
          if (msg.sender_type === 'client') {
             newSocket.emit("mark_read", { session_id: msg.session_id, reader: 'admin' });
          }
        }
        return currentActive;
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectChat = (conv: Conversation) => {
    setActiveChat(conv);
    fetchMessages(conv.session_id);
    if (socket && conv.unread_admin > 0) {
      socket.emit("mark_read", { session_id: conv.session_id, reader: 'admin' });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeChat || !socket) return;

    socket.emit("send_message", {
      session_id: activeChat.session_id,
      text: inputValue,
      sender_type: 'admin'
    });

    setInputValue("");
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredConversations = conversations.filter(c => 
    c.participant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.session_id.includes(searchQuery)
  );

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <AdminPageHeader
        title="Live Chat"
        subTitle="Tương tác và hỗ trợ khách hàng trực tuyến."
      />

      <div className="flex-1 flex bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-4">
        {/* Left Sidebar: Conversations */}
        <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Tìm khách hàng..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-sm transition-all outline-none border"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">
                Không có cuộc trò chuyện nào.
              </div>
            ) : (
              filteredConversations.map(conv => (
                <button
                  key={conv._id}
                  onClick={() => handleSelectChat(conv)}
                  className={`w-full text-left p-4 flex items-start gap-3 border-b border-slate-100 hover:bg-indigo-50/50 transition-colors ${
                    activeChat?._id === conv._id ? 'bg-indigo-50 border-indigo-100' : 'bg-white'
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-slate-500" />
                    </div>
                    {conv.unread_admin > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                        {conv.unread_admin > 9 ? '9+' : conv.unread_admin}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-semibold text-slate-800 text-sm truncate">
                        {conv.participant_name}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                        {formatTime(conv.updatedAt)}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${conv.unread_admin > 0 ? 'text-slate-800 font-semibold' : 'text-slate-500'}`}>
                      {conv.last_message || 'Bắt đầu cuộc trò chuyện...'}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Area: Chat Box */}
        <div className="flex-1 flex flex-col bg-white">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{activeChat.participant_name}</h3>
                    <p className="text-xs text-slate-500">ID: {activeChat.session_id.substring(0, 8)}...</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col gap-4">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-400 text-sm my-auto">
                    Chưa có tin nhắn nào. Bắt đầu hỗ trợ khách hàng ngay!
                  </div>
                ) : (
                  messages.map(msg => {
                    const isAdmin = msg.sender_type === 'admin';
                    return (
                      <div key={msg._id} className={`flex flex-col max-w-[70%] ${isAdmin ? 'self-end items-end' : 'self-start items-start'}`}>
                        <div className={`p-3 rounded-2xl text-sm ${
                          isAdmin 
                            ? 'bg-indigo-600 text-white rounded-tr-sm' 
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1">{formatTime(msg.createdAt)}</span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="Nhập câu trả lời..."
                    className="flex-1 px-4 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl transition-all outline-none border"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
                  >
                    <span>Gửi</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-600 mb-1">Live Chat Support</h3>
              <p className="text-sm">Chọn một cuộc trò chuyện để bắt đầu hỗ trợ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
