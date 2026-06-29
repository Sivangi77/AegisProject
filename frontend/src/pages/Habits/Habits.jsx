import { useState, useEffect } from 'react';
import { Flame, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabitStore } from '../../store/habitStore';
import { isSameDay, subDays } from 'date-fns';

const HabitCard = ({ habit, onToggle, onDelete }) => {
  const today = new Date();
  const completedToday = habit.history.some(date => isSameDay(new Date(date), today));
  
  // Generate last 7 days for heatmap
  const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(today, 6 - i));
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="glass p-5 rounded-2xl flex flex-col gap-4 relative group cursor-pointer border border-border hover:border-orange-500/50"
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(habit._id); }}
        className="absolute top-4 right-12 p-1.5 bg-red-500/10 text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 z-20"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="flex justify-between items-start z-10" onClick={() => onToggle(habit._id)}>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl transition-all ${completedToday ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-secondary text-muted-foreground group-hover:text-orange-500'}`}>
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{habit.title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{habit.streak} day streak</p>
          </div>
        </div>
        
        <button className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${completedToday ? 'border-orange-500 bg-orange-500' : 'border-border group-hover:border-orange-500/50'}`}>
          {completedToday && <div className="w-3 h-3 bg-white rounded-full" />}
        </button>
      </div>
      
      {/* Real Heatmap */}
      <div className="mt-2 flex gap-1 justify-between z-10">
        {last7Days.map((date, i) => {
          const isCompleted = habit.history.some(hDate => isSameDay(new Date(hDate), date));
          return (
            <div 
              key={i} 
              className={`h-8 flex-1 rounded-md transition-colors ${isCompleted ? 'bg-orange-500/80' : 'bg-secondary'}`}
              title={date.toDateString()}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

const Habits = () => {
  const { habits, fetchHabits, createHabit, toggleHabit, deleteHabit } = useHabitStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createHabit(newTitle);
    setIsCreating(false);
    setNewTitle('');
  };

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
          <p className="text-muted-foreground mt-1">Build consistency everyday</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-orange-500/25 transition-transform hover:scale-105 active:scale-95 font-medium"
        >
          <Plus className="w-5 h-5" />
          New Habit
        </button>
      </div>

      {isCreating && (
        <motion.form 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-2xl mb-8 flex gap-4 items-end border border-orange-500/30"
          onSubmit={handleCreate}
        >
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Habit Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-secondary rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. Morning Workout"
            />
          </div>
          <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600">
            Save
          </button>
          <button type="button" onClick={() => setIsCreating(false)} className="bg-secondary px-6 py-2 rounded-lg font-medium hover:bg-secondary/80">
            Cancel
          </button>
        </motion.form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {habits.map((habit) => (
            <HabitCard 
              key={habit._id} 
              habit={habit} 
              onToggle={toggleHabit}
              onDelete={deleteHabit}
            />
          ))}
        </AnimatePresence>
        
        {habits.length === 0 && !isCreating && (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            No habits yet. Start small and build momentum!
          </div>
        )}
      </div>
    </div>
  );
};

export default Habits;
