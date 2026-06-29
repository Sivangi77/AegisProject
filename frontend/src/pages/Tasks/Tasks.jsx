import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, GripVertical, CheckCircle2, Circle, Clock } from 'lucide-react';

const dummyBoard = {
  todo: [
    { id: '1', title: 'Setup Google Calendar Sync', priority: 'high', time: '2h' },
    { id: '2', title: 'Design DB Schema', priority: 'medium', time: '1h' }
  ],
  inProgress: [
    { id: '3', title: 'Implement AI Coach', priority: 'urgent', time: '4h' }
  ],
  done: [
    { id: '4', title: 'Project Scaffolding', priority: 'medium', time: '30m' }
  ]
};

const Column = ({ title, tasks, status }) => {
  return (
    <div className="flex flex-col bg-card/50 rounded-2xl border border-border p-4 min-h-[400px]">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        <span className="text-sm font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 space-y-3">
        <AnimatePresence>
          {tasks.map(task => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={task.id}
              className="glass p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors group"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h4 className="font-medium text-sm">{task.title}</h4>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                    task.priority === 'urgent' ? 'bg-red-500/10 text-red-500' :
                    task.priority === 'high' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {task.time}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Tasks = () => {
  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and prioritize your work</p>
        </div>
        
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 font-medium">
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        <Column title="To Do" tasks={dummyBoard.todo} status="todo" />
        <Column title="In Progress" tasks={dummyBoard.inProgress} status="in-progress" />
        <Column title="Done" tasks={dummyBoard.done} status="done" />
      </div>
    </div>
  );
};

export default Tasks;
