import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Headphones, Settings2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const Focus = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound or notification
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-3xl p-12 w-full max-w-2xl flex flex-col items-center relative overflow-hidden"
      >
        <div className="absolute top-6 right-6 flex gap-4">
          <button className="text-muted-foreground hover:text-foreground transition-colors p-2 bg-secondary rounded-full">
            <Headphones className="w-5 h-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors p-2 bg-secondary rounded-full">
            <Settings2 className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-2">Deep Work Session</h2>
        <p className="text-muted-foreground mb-12">Current Task: Finish AI Agent Implementation</p>

        <div className="relative flex items-center justify-center w-64 h-64 mb-12">
          {/* Decorative Rings */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <motion.div 
            className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent border-l-transparent"
            animate={{ rotate: isActive ? 360 : 0 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          
          <span className="text-7xl font-bold tracking-tighter tabular-nums text-foreground">
            {minutes}:{seconds}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={resetTimer}
            className="p-4 rounded-2xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            <Square className="w-6 h-6" />
          </button>
          
          <button 
            onClick={toggleTimer}
            className={cn(
              "p-6 rounded-3xl text-white shadow-xl transition-all hover:scale-105 active:scale-95",
              isActive 
                ? "bg-gradient-to-br from-red-500 to-orange-500 shadow-red-500/25" 
                : "bg-gradient-to-br from-blue-500 to-purple-500 shadow-blue-500/25"
            )}
          >
            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Focus;
