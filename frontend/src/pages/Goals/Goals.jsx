import { useState, useEffect } from 'react';
import { Target, Flag, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoalStore } from '../../store/goalStore';
import { format } from 'date-fns';

const GoalCard = ({ goal, onDelete, onUpdateProgress }) => {
  const isCompleted = goal.status === 'completed' || goal.progress >= 100;
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className={`glass p-5 rounded-2xl flex flex-col gap-4 border-l-4 relative group ${isCompleted ? 'opacity-70 grayscale' : ''}`}
      style={{ borderColor: goal.type === 'long' ? '#3b82f6' : goal.type === 'medium' ? '#8b5cf6' : '#10b981' }}
    >
      <button 
        onClick={() => onDelete(goal._id)}
        className="absolute top-4 right-4 p-1.5 bg-red-500/10 text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="flex justify-between items-start pr-8">
        <div>
          <h3 className={`font-semibold text-lg ${isCompleted ? 'line-through' : ''}`}>{goal.title}</h3>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Flag className="w-3 h-3" /> {format(new Date(goal.deadline), 'MMM dd, yyyy')}
          </p>
        </div>
        <div className="p-2 bg-secondary rounded-lg">
          <Target className={`w-5 h-5 ${isCompleted ? 'text-gray-400' : 'text-primary'}`} />
        </div>
      </div>
      
      <div>
        <div className="flex justify-between text-sm mb-1 font-medium">
          <span>Progress</span>
          <span>{goal.progress}%</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={goal.progress}
          onChange={(e) => onUpdateProgress(goal._id, parseInt(e.target.value))}
          className="w-full accent-primary cursor-pointer mb-2"
        />
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300" 
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

const Goals = () => {
  const { goals, fetchGoals, createGoal, updateProgress, deleteGoal } = useGoalStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', deadline: '', type: 'medium' });

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.deadline) return;
    await createGoal(newGoal);
    setIsCreating(false);
    setNewGoal({ title: '', deadline: '', type: 'medium' });
  };

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground mt-1">Track your long-term objectives</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 font-medium"
        >
          <Plus className="w-5 h-5" />
          New Goal
        </button>
      </div>

      {isCreating && (
        <motion.form 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-2xl mb-8 flex gap-4 items-end border border-primary/30"
          onSubmit={handleCreate}
        >
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Goal Title</label>
            <input 
              type="text" 
              required
              className="w-full bg-secondary rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={newGoal.title}
              onChange={e => setNewGoal({...newGoal, title: e.target.value})}
              placeholder="e.g. Launch Startup MVP"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Deadline</label>
            <input 
              type="date" 
              required
              className="bg-secondary rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={newGoal.deadline}
              onChange={e => setNewGoal({...newGoal, deadline: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Type</label>
            <select 
              className="bg-secondary rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={newGoal.type}
              onChange={e => setNewGoal({...newGoal, type: e.target.value})}
            >
              <option value="short">Short Term</option>
              <option value="medium">Medium Term</option>
              <option value="long">Long Term</option>
            </select>
          </div>
          <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium">
            Save
          </button>
          <button type="button" onClick={() => setIsCreating(false)} className="bg-secondary px-6 py-2 rounded-lg font-medium hover:bg-secondary/80">
            Cancel
          </button>
        </motion.form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {goals.map((goal) => (
            <GoalCard 
              key={goal._id} 
              goal={goal} 
              onDelete={deleteGoal}
              onUpdateProgress={updateProgress}
            />
          ))}
        </AnimatePresence>
        
        {goals.length === 0 && !isCreating && (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            No goals set yet. Click "New Goal" to aim higher!
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
