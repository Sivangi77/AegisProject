import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, GripVertical, CheckCircle2, Circle, Clock, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import TaskModal from '../../components/tasks/TaskModal';

const Column = ({ title, tasks, status, onEdit, onDelete, onStatusChange }) => {
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
              key={task._id}
              className="glass p-4 rounded-xl hover:border-primary/50 transition-colors group relative"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-start gap-3">
                  <button onClick={() => onStatusChange(task, status === 'done' ? 'todo' : 'done')} className="mt-0.5 text-muted-foreground hover:text-primary transition-colors">
                    {status === 'done' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}
                  </button>
                  <div className={status === 'done' ? 'opacity-60 line-through' : ''}>
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    {task.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}
                  </div>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(task)} className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-primary">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(task._id)} className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                    task.priority === 'urgent' ? 'bg-red-500/10 text-red-500' :
                    task.priority === 'high' ? 'bg-orange-500/10 text-orange-500' :
                    task.priority === 'low' ? 'bg-green-500/10 text-green-500' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {task.estimatedTimeMinutes}m
                </div>
              </div>
            </motion.div>
          ))}
          {tasks.length === 0 && (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm opacity-50 pt-10">
              No tasks here
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Tasks = () => {
  const { tasks, loading, fetchTasks, deleteTask, updateTask } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    await updateTask(task._id, { status: newStatus });
  };

  const openNewModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and prioritize your work</p>
        </div>
        
        <button 
          onClick={openNewModal}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 font-medium"
        >
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-start">
        <Column title="To Do" tasks={todoTasks} status="todo" onEdit={handleEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />
        <Column title="In Progress" tasks={inProgressTasks} status="in-progress" onEdit={handleEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />
        <Column title="Done" tasks={doneTasks} status="done" onEdit={handleEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default Tasks;
