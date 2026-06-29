import { Target, Flag, TrendingUp, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const GoalCard = ({ title, progress, deadline, type }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="glass p-5 rounded-2xl flex flex-col gap-4 border-l-4"
    style={{ borderColor: type === 'long' ? '#3b82f6' : type === 'medium' ? '#8b5cf6' : '#10b981' }}
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Flag className="w-3 h-3" /> {deadline}
        </p>
      </div>
      <div className="p-2 bg-secondary rounded-lg">
        <Target className="w-5 h-5 text-primary" />
      </div>
    </div>
    
    <div>
      <div className="flex justify-between text-sm mb-1 font-medium">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  </motion.div>
);

const Goals = () => {
  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground mt-1">Track your long-term objectives</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 font-medium">
          <Plus className="w-5 h-5" />
          New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GoalCard title="Launch Startup MVP" progress={75} deadline="Dec 2026" type="long" />
        <GoalCard title="Read 24 Books" progress={30} deadline="Dec 2026" type="long" />
        <GoalCard title="Complete React Course" progress={90} deadline="Aug 2026" type="medium" />
        <GoalCard title="Gym 4x a Week" progress={100} deadline="This Week" type="short" />
      </div>
    </div>
  );
};

export default Goals;
