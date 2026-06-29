import { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, Loader2, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useAIStore } from '../../store/aiStore';
import ReactMarkdown from 'react-markdown';

const AI = () => {
  const { messages, loadingHistory, isTyping, fetchHistory, sendMessage } = useAIStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    
    const text = input.trim();
    setInput('');
    await sendMessage(text);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            Chief of Staff
          </h1>
          <p className="text-muted-foreground mt-1">Your autonomous productivity partner</p>
        </div>
      </div>

      <div className="flex-1 glass rounded-3xl border border-border overflow-hidden flex flex-col shadow-xl">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar flex flex-col">
          {loadingHistory ? (
            <div className="flex flex-1 items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center opacity-50 max-w-md mx-auto">
              <Bot className="w-16 h-16 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">How can I help you today?</h3>
              <p className="text-sm">Ask me to prioritize your tasks, analyze your upcoming week, or provide a coaching session.</p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg._id || index} 
                  className={cn("flex gap-4 max-w-[85%]", msg.role === 'model' ? "self-start" : "self-end ml-auto")}
                >
                  {msg.role === 'model' && (
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex flex-shrink-0 items-center justify-center border border-primary/30 mt-1">
                      <Bot className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed shadow-sm flex flex-col prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:text-white prose-a:text-blue-500",
                    msg.role === 'model' ? "bg-card border border-border text-foreground" : "bg-primary text-primary-foreground"
                  )}>
                    {msg.text ? (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    ) : (
                      <div className="flex gap-1 items-center h-5">
                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></span>
                      </div>
                    )}
                  </div>
                  
                  {msg.role === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-secondary flex flex-shrink-0 items-center justify-center border border-border mt-1">
                      <UserIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 bg-card/80 backdrop-blur-md border-t border-border">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              placeholder={isTyping ? "AI is thinking..." : "Ask me to schedule tasks, analyze your workload..."}
              className="w-full bg-secondary border border-border/50 rounded-xl pl-4 pr-14 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 transition-colors"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2.5 bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-white rounded-lg transition-transform hover:scale-105 active:scale-95"
            >
              {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AI;
