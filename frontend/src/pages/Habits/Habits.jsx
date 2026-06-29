import { Activity, Flame, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const HabitCard = ({ title, streak, completedToday }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="glass p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden group cursor-pointer border border-border hover:border-orange-500/50"
  >
    <div className="flex justify-between items-start z-10">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${completedToday ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-secondary text-muted-foreground'}`}>
          <Flame className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{streak} day streak</p>
        </div>
      </div>
      
      <button className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${completedToday ? 'border-orange-500 bg-orange-500' : 'border-border hover:border-orange-500/50'}`}>
        {completedToday && <div className="w-3 h-3 bg-white rounded-full" />}
      </button>
    </div>
    
    {/* Heatmap placeholder */}
    <div className="mt-2 flex gap-1 justify-between z-10">
      {[...Array(7)].map((_, i) => (
        <div 
          key={i} 
          className={`h-8 flex-1 rounded-md ${i < 4 || i === 6 ? 'bg-orange-500/80' : 'bg-secondary'}`}
        />
      ))}
    </div>
  </motion.div>
);

const Habits = () => {
  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
          <p className="text-muted-foreground mt-1">Build consistency everyday</p>
        </div>
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-orange-500/25 transition-transform hover:scale-105 active:scale-95 font-medium">
          <Plus className="w-5 h-5" />
          New Habit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <HabitCard title="Morning Workout" streak={12} completedToday={true} />
        <HabitCard title="Read 10 Pages" streak={5} completedToday={false} />
        <HabitCard title="Meditation" streak={30} completedToday={true} />
        <HabitCard title="Code 1 Hour" streak={2} completedToday={false} />
      </div>
    </div>
  );
};

export default Habits;
