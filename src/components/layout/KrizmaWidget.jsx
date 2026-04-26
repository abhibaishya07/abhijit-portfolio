import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Hi there! 💖 I'm **Krizma**, your Kivara Beauty support assistant. How can I help you today?\n\nYou can ask me about:\n- 📦 Order status or tracking\n- 🔄 Returns & refunds\n- 🚚 Shipping times\n- 🛍️ Product authenticity",
};

function renderText(text) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('- ') || line.startsWith('• ')) {
      const content = line.slice(2);
      const parts = content.split(/\*\*(.*?)\*\*/g);
      return (
        <li key={i} className="flex gap-2 items-start">
          <span className="text-lb-rose flex-shrink-0 mt-0.5">•</span>
          <span>{parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}</span>
        </li>
      );
    }
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const renderedLine = parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p);
    if (line.trim() === '') return <br key={i} />;
    return <span key={i} className="block leading-relaxed">{renderedLine}</span>;
  });
}

export default function KrizmaWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const newMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const { data } = await axios.post(`/api/krizma/chat`, {
        messages: newMessages.filter(m => m.role !== 'assistant' || m !== WELCOME_MESSAGE).map(m => ({
          role: m.role,
          content: m.content,
        })),
      });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please email us at **support@kivarabeauty.com** and we'll get back to you shortly! 💌"
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      
      {/* Chat Window */}
      {isOpen && (
        <div
          className="w-[360px] h-[520px] flex flex-col rounded-2xl shadow-2xl shadow-pink-300/30 border border-lb-border overflow-hidden"
          style={{ animation: 'fadeSlideUp 0.25s ease-out' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-lb-rose to-lb-mauve px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">💬</div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">Krizma</p>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block animate-pulse" />
                  <span className="text-white/70 text-[10px]">Support Agent · Online</span>
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10 p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-lb-white/80 px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-lb-rose to-lb-mauve flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1">K</div>
                )}
                <div className={`max-w-[76%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-lb-rose text-white rounded-tr-sm'
                    : 'bg-white border border-lb-border text-gray-700 rounded-tl-sm shadow-sm'
                }`}>
                  <ul className="list-none space-y-1">{renderText(msg.content)}</ul>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-lb-rose to-lb-mauve flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">K</div>
                <div className="bg-white border border-lb-border px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map(d => (
                      <div key={d} className="w-1.5 h-1.5 bg-lb-rose rounded-full animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Bar */}
          <div className="bg-white border-t border-lb-border px-4 py-3 flex gap-2 items-center flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your message…"
              disabled={isTyping}
              className="flex-1 text-xs rounded-lg border border-lb-border px-3 py-2.5 focus:outline-none focus:border-lb-rose text-gray-700 placeholder-gray-400 bg-lb-white disabled:opacity-60 transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 flex-shrink-0 rounded-lg bg-lb-rose hover:bg-lb-mauve disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-lb-border/50 px-4 py-2 text-center flex-shrink-0">
            <p className="text-[10px] text-gray-400">
              Powered by Kivara AI · <Link to="/faq" onClick={() => setIsOpen(false)} className="text-lb-rose hover:underline">FAQ</Link> · <Link to="/policies" onClick={() => setIsOpen(false)} className="text-lb-rose hover:underline">Policies</Link>
            </p>
          </div>
        </div>
      )}

      {/* Floating Bubble Button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-lb-rose to-lb-mauve shadow-lg shadow-pink-400/40 hover:shadow-xl hover:shadow-pink-400/50 hover:scale-105 transition-all duration-200 flex items-center justify-center text-white text-2xl relative"
        aria-label="Open Krizma Support Chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        )}
        {/* Badge dot */}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
