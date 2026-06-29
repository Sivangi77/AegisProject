import { useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const AI = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi John! I noticed your deadline for the AI Agent Implementation is approaching. Would you like me to break it down into smaller tasks or block out a 2-hour focus session in your calendar?", isAi: true }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if(!input.trim()) return;
    
    setMessages(prev => [...prev, { id: Date.now(), text: input, isAi: false }]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "I've analyzed your schedule. I can block out 2:00 PM to 4:00 PM today for this. Should I go ahead and update your calendar?", 
        isAi: true 
      }]);
    }, 1000);
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={cn("flex gap-4 max-w-[80%]", msg.isAi ? "self-start" : "self-end ml-auto")}
            >
              {msg.isAi && (
                <div className="w-10 h-10 rounded-full bg-primary/20 flex flex-shrink-0 items-center justify-center border border-primary/30">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
              )}
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                msg.isAi ? "bg-card border border-border" : "bg-primary text-primary-foreground"
              )}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="p-4 bg-card border-t border-border">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me to schedule tasks, analyze your workload, or find free time..."
              className="w-full bg-secondary border-none rounded-xl pl-4 pr-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button 
              type="submit"
              className="absolute right-2 p-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-transform hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AI;
