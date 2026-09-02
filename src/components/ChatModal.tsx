import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Phone, ShieldCheck, CheckCheck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'seeker' | 'companion';
  text: string;
  time: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingCode?: string;
  otherPartyName: string;
  otherPartyPhone?: string;
  otherPartyAvatar?: string;
  currentRole: 'seeker' | 'companion';
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  bookingCode = 'CK-DIRECT',
  otherPartyName,
  otherPartyPhone,
  otherPartyAvatar,
  currentRole,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(`ck_chat_${bookingCode}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: '1',
        sender: currentRole === 'companion' ? 'seeker' : 'companion',
        text: `Hi ${currentRole === 'companion' ? otherPartyName : 'there'}! Looking forward to our session together.`,
        time: 'Just now',
      },
    ];
  });

  const [inputMsg, setInputMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputMsg).trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: currentRole,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem(`ck_chat_${bookingCode}`, JSON.stringify(updated));
    setInputMsg('');

    // Simulate instant companion/seeker reply if 1st message
    if (messages.length <= 2) {
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: currentRole === 'seeker' ? 'companion' : 'seeker',
          text: currentRole === 'seeker' 
            ? "Got it! I am ready and will coordinate our exact arrival. See you soon!"
            : "Awesome, thank you for confirming! Excited to meet.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        const withReply = [...updated, autoReply];
        setMessages(withReply);
        localStorage.setItem(`ck_chat_${bookingCode}`, JSON.stringify(withReply));
      }, 1000);
    }
  };

  if (!isOpen) return null;

  const quickReplies = [
    "I'll be on time! ☕",
    "Confirmed location 📍",
    "Which cafe do you prefer?",
    "Looking forward to meeting!",
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[190] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-3xl max-w-md w-full h-[580px] border border-pink-200 shadow-apple-float flex flex-col overflow-hidden">
        
        {/* Top Chat Header */}
        <div className="p-4 bg-[#fdf8f8] border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-pink-200">
              <img
                src={otherPartyAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={otherPartyName}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-[#1d1d1f]">{otherPartyName}</h4>
                <ShieldCheck className="w-3.5 h-3.5 text-[#0071e3]" />
              </div>
              <span className="text-[10px] text-emerald-600 font-bold block">Online &bull; Aadhaar Verified</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {otherPartyPhone && otherPartyPhone !== 'Protected' && (
              <a
                href={`tel:${otherPartyPhone}`}
                className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition shadow-xs"
                title={`Call ${otherPartyName}`}
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 text-[#1d1d1f] flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3 bg-[#fffafa]/50">
          <div className="text-center my-2">
            <span className="text-[10px] bg-pink-100/60 text-[#86868b] px-3 py-1 rounded-full font-mono">
              Encrypted Booking Chat &bull; {bookingCode}
            </span>
          </div>

          {messages.map((m) => {
            const isMe = m.sender === currentRole;
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-[#0071e3] text-white rounded-br-xs'
                      : 'bg-white border border-pink-100 text-[#1d1d1f] rounded-bl-xs'
                  }`}
                >
                  {m.text}
                </div>
                <div className="flex items-center gap-1 mt-0.5 px-1 text-[10px] text-[#86868b]">
                  <span>{m.time}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-[#0071e3]" />}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reply Chips */}
        <div className="p-2 border-t border-pink-100 bg-white flex gap-1.5 overflow-x-auto no-scrollbar">
          {quickReplies.map((qr, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(qr)}
              className="text-[11px] font-medium bg-pink-50 hover:bg-pink-100 text-[#1d1d1f] px-3 py-1 rounded-full whitespace-nowrap border border-pink-200 transition"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-white border-t border-pink-100 flex items-center gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={`Message ${otherPartyName}...`}
            className="flex-1 bg-[#fdf8f8] border border-pink-200 rounded-full px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputMsg.trim()}
            className="w-10 h-10 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white flex items-center justify-center transition disabled:opacity-40 shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
