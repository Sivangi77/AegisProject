import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Headphones, Settings2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useFocusStore } from '../../store/focusStore';

const Focus = () => {
  // 25 minutes default
  const DEFAULT_TIME = 25 * 60;
  
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isActive, setIsActive] = useState(false);
  const { saveSession } = useFocusStore();

  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Timer finished naturally!
      setIsActive(false);
      
      // Calculate minutes elapsed (if we allow custom times later, this is safer)
      const minutesCompleted = Math.floor(DEFAULT_TIME / 60);
      saveSession(minutesCompleted, "Deep Work Session");
      
      // Reset for next session
      setTimeLeft(DEFAULT_TIME);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, saveSession, DEFAULT_TIME]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const stopTimerEarly = () => {
    setIsActive(false);
    // If they stop early, we can optionally save the partial session, but usually Pomodoro is all-or-nothing
    setTimeLeft(DEFAULT_TIME);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  // Calculate progress for the ring
  const progressPercent = ((DEFAULT_TIME - timeLeft) / DEFAULT_TIME) * 100;

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-3xl p-12 w-full max-w-2xl flex flex-col items-center relative overflow-hidden shadow-2xl"
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
        <p className="text-muted-foreground mb-12">Stay focused and earn productivity points</p>

        <div className="relative flex items-center justify-center w-72 h-72 mb-12">
          {/* Background Ring */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="144"
              cy="144"
              r="130"
              className="stroke-secondary fill-none"
              strokeWidth="8"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="144"
              cy="144"
              r="130"
              className="stroke-primary fill-none transition-all duration-1000 ease-linear"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 130}
              strokeDashoffset={2 * Math.PI * 130 * (1 - progressPercent / 100)}
              strokeLinecap="round"
            />
          </svg>
          
          <span className="text-7xl font-bold tracking-tighter tabular-nums text-foreground z-10">
            {minutes}:{seconds}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={stopTimerEarly}
            className="p-4 rounded-2xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors shadow-sm"
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
