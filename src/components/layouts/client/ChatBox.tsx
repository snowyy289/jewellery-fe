"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Diamond } from "lucide-react";
import { io, Socket } from "socket.io-client";

interface Message {
  text: string;
  sender: 'user' | 'bot';
  time: Date;
}

export default function ChatBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { text: "Chào bạn! Jewelry Eco có thể giúp gì cho bạn hôm nay?", sender: 'bot', time: new Date() }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [sessionId, setSessionId] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const isOpenRef = useRef(isOpen);
    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    // Initialize Socket and Session
    useEffect(() => {
        // Generate or get session ID
        let currentSessionId = localStorage.getItem("chat_session_id");
        if (!currentSessionId) {
            currentSessionId = "guest_" + Math.random().toString(36).substring(2, 15);
            localStorage.setItem("chat_session_id", currentSessionId);
        }
        setSessionId(currentSessionId);

        // Connect to Socket
        const newSocket = io("http://localhost:4000"); // Use env var in prod
        setSocket(newSocket);

        newSocket.on("connect", () => {
            newSocket.emit("join_chat", { session_id: currentSessionId });
        });

        newSocket.on("chat_history", (history: any[]) => {
            if (history.length > 0) {
                const formattedMessages = history.map(msg => ({
                    text: msg.text,
                    sender: msg.sender_type === 'client' ? 'user' : 'bot',
                    time: new Date(msg.createdAt)
                }));
                setMessages(formattedMessages);
            }
        });

        newSocket.on("receive_message", (msg: any) => {
            // Check if it's not our own message echoed back (client sender)
            if (msg.sender_type === 'admin') {
                setMessages(prev => [...prev, { text: msg.text, sender: 'bot', time: new Date(msg.createdAt) }]);
                setIsTyping(false); // Stop typing indicator if it was on
                
                // Mark as read
                if (isOpenRef.current) {
                    newSocket.emit("mark_read", { session_id: currentSessionId, reader: 'client' });
                }
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !socket) return;

        const newMsg = { text: inputValue, sender: 'user' as const, time: new Date() };
        setMessages(prev => [...prev, newMsg]);
        setInputValue("");
        
        // Show typing indicator to simulate waiting for admin
        setIsTyping(true);

        socket.emit("send_message", {
            session_id: sessionId,
            text: newMsg.text,
            sender_type: 'client'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl mb-4 overflow-hidden border border-stone-200 flex flex-col h-[500px] animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                                <Diamond className="w-5 h-5 text-gold" />
                            </div>
                            <div>
                                <h3 className="font-serif font-bold tracking-wider">Jewelry Eco</h3>
                                <p className="text-[10px] text-white/70 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Đang hoạt động
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 bg-stone-50 flex flex-col gap-4">
                        <div className="text-center">
                            <span className="text-[10px] text-stone-400 uppercase tracking-widest bg-stone-200/50 px-3 py-1 rounded-full">Hôm nay</span>
                        </div>
                        
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                                <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-stone-900 text-white rounded-tr-sm' : 'bg-white border border-stone-200 text-stone-800 rounded-tl-sm shadow-sm'}`}>
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-stone-400 mt-1">{formatTime(msg.time)}</span>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex flex-col max-w-[80%] self-start items-start">
                                <div className="p-4 rounded-2xl bg-white border border-stone-200 rounded-tl-sm shadow-sm flex items-center gap-1">
                                    <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-stone-100">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <input 
                                type="text" 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Nhập tin nhắn..." 
                                className="flex-1 bg-stone-100 border-transparent focus:bg-white focus:border-gold focus:ring-0 text-sm rounded-full px-4 py-2 outline-none transition-all border"
                            />
                            <button 
                                type="submit" 
                                disabled={!inputValue.trim()}
                                className="w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center hover:bg-gold transition-colors disabled:opacity-50 disabled:hover:bg-stone-900"
                            >
                                <Send className="w-4 h-4 ml-1" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-gold hover:scale-110 transition-all duration-300 relative group animate-in zoom-in"
                >
                    <MessageCircle className="w-6 h-6" />
                    {/* Unread badge logic could go here */}
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">1</span>
                    
                    {/* Tooltip */}
                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-stone-900 text-xs font-bold px-3 py-2 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap border border-stone-100">
                        Chat với chúng tôi
                        <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white border-r border-t border-stone-100 rotate-45"></div>
                    </div>
                </button>
            )}
        </div>
    );
}
