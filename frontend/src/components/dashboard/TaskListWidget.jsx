import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const dummyTasks = [
  { id: 1, title: 'Finish AI Agent Implementation', priority: 'urgent', time: '2h', completed: false },
  { id: 2, title: 'Review PR for Dashboard', priority: 'high', time: '30m', completed: false },
  { id: 3, title: 'Weekly Sync Prep', priority: 'medium', time: '1h', completed: true },
];

const TaskListWidget = () => {
  return (
    <div className="glass rounded-2xl p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Today's Focus</h3>
        <button className="text-sm text-primary hover:underline">View All</button>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {dummyTasks.map((task, i) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer group"
          >
            <button className="text-muted-foreground hover:text-primary transition-colors">
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <Circle className="w-5 h-5 group-hover:text-primary" />
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {task.title}
              </p>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
              <Clock className="w-3 h-3" />
              {task.time}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TaskListWidget;
