import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageCircle, X, Send, Minimize2, Phone, Mail } from 'lucide-react';

interface Message {
  id: string;
  from: 'user' | 'support';
  text: string;
  time: string;
  userName?: string;
  guestLabel?: string;
}

export default function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      from: 'support',
      text: 'Hello! 👋 Welcome to Tide Home. How can we help you today?',
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [started, setStarted] = useState(false);
  const [unread, setUnread] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const msgsEnd = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`guest-${Date.now()}`);

  useEffect(() => {
    const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';
    const socket = io(`${apiUrl}/chat`, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('new-message', (msg: Message) => {
      if (msg.from === 'support') {
        setIsTyping(false);
        setMessages(m => [...m, msg]);
        if (!open || minimized) {
          setUnread(u => u + 1);
        }
      }
    });

    socket.on('support-typing', () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    });

    return () => { socket.disconnect(); };
  }, []);

  useEffect(() => {
    msgsEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const startChat = () => {
    if (!guestName.trim()) return;
    setStarted(true);
    socketRef.current?.emit('join', {
      userId: sessionId.current,
      userName: guestName,
      email: guestEmail,
      isGuest: true,
    });
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const msg: Message = {
      id: Date.now().toString(),
      from: 'user',
      text: input,
      time,
    };
    setMessages(m => [...m, msg]);
    socketRef.current?.emit('send-message', {
      userId: sessionId.current,
      userName: guestName,
      text: input,
      isGuest: true,
    });
    setInput('');
  };

  const quickMessages = [
    "I'd like to book a tour",
    'Tell me about care packages',
    'What are your visiting hours?',
    'I have a query about a resident',
  ];

  const handleQuickMessage = (text: string) => {
    if (!guestName.trim()) return;
    setStarted(true);
    socketRef.current?.emit('join', {
      userId: sessionId.current,
      userName: guestName,
      isGuest: true,
    });
    setTimeout(() => {
      const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      const msg: Message = { id: Date.now().toString(), from: 'user', text, time };
      setMessages(m => [...m, msg]);
      socketRef.current?.emit('send-message', {
        userId: sessionId.current,
        userName: guestName,
        text,
        isGuest: true,
      });
    }, 300);
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!open && unread > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold z-10">
            {unread}
          </div>
        )}
        <button
          onClick={() => { setOpen(!open); setMinimized(false); }}
          className="w-14 h-14 bg-tide-deep hover:bg-tide-mid rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
        >
          {open
            ? <X size={22} className="text-white" />
            : <MessageCircle size={22} className="text-white" />
          }
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div className={`fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-tide-deep/10 flex flex-col transition-all duration-300 ${minimized ? 'h-14' : 'h-[480px]'}`}>

          {/* Header */}
          <div className="bg-tide-deep rounded-t-2xl px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-tide-light flex items-center justify-center font-serif text-white text-sm">T</div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-tide-deep" />
              </div>
              <div>
                <div className="text-white text-sm font-medium">Tide Home Support</div>
                <div className="text-white/60 text-[10px]">Typically replies within minutes</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setMinimized(!minimized)} className="text-white/60 hover:text-white p-1 transition-colors">
                <Minimize2 size={14} />
              </button>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white p-1 transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {!started ? (
                /* Pre-chat form */
                <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto">
                  <div>
                    <div className="bg-tide-sand rounded-xl p-3 mb-4">
                      <p className="text-sm text-tide-deep leading-relaxed">
                        Before we start, please tell us your name so we can assist you better.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="form-label">Your name *</label>
                        <input
                          className="form-input"
                          placeholder="Ada Okafor"
                          value={guestName}
                          onChange={e => setGuestName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && startChat()}
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="form-label">Email (optional)</label>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="you@example.com"
                          value={guestEmail}
                          onChange={e => setGuestEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="text-[11px] text-tide-muted uppercase tracking-wider mb-2">Quick topics</div>
                    {quickMessages.map(q => (
                      <button
                        key={q}
                        onClick={() => handleQuickMessage(q)}
                        className="w-full text-left text-xs text-tide-mid bg-tide-foam hover:bg-tide-light/20 rounded-lg px-3 py-2 transition-colors"
                      >
                        {q} →
                      </button>
                    ))}
                    <button
                      onClick={startChat}
                      disabled={!guestName.trim()}
                      className="btn btn-primary w-full justify-center mt-2"
                    >
                      Start chat
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-gray-50/50">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                          msg.from === 'user'
                            ? 'bg-tide-deep text-white rounded-br-sm'
                            : 'bg-white border border-tide-deep/10 text-tide-deep rounded-bl-sm shadow-sm'
                        }`}>
                          {msg.text}
                          <div className={`text-[10px] mt-1 ${msg.from === 'user' ? 'text-white/50 text-right' : 'text-tide-muted'}`}>
                            {msg.time}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-tide-deep/10 rounded-xl rounded-bl-sm px-3 py-2 shadow-sm">
                          <div className="flex gap-1 items-center h-4">
                            <div className="w-1.5 h-1.5 bg-tide-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 bg-tide-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 bg-tide-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={msgsEnd} />
                  </div>

                  {/* Contact alternatives */}
                  <div className="px-3 py-2 bg-tide-sand/50 border-t border-tide-deep/5 flex items-center gap-3">
                    <a href="tel:+448001234567" className="flex items-center gap-1 text-[10px] text-tide-muted hover:text-tide-deep transition-colors">
                      <Phone size={10} /> Call us
                    </a>
                    <a href="mailto:hello@tidehome.co.uk" className="flex items-center gap-1 text-[10px] text-tide-muted hover:text-tide-deep transition-colors">
                      <Mail size={10} /> Email us
                    </a>
                    <span className="text-[10px] text-tide-muted ml-auto">🔒 Secure chat</span>
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t border-tide-deep/10 flex gap-2">
                    <input
                      className="form-input flex-1 py-2 text-sm"
                      placeholder="Type a message…"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMessage()}
                      autoFocus
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim()}
                      className="btn btn-primary px-3 py-2 flex-shrink-0"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}