import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../../store/taskStore';
import toast from 'react-hot-toast';

const TaskModal = ({ isOpen, onClose, taskToEdit = null }) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const { addTask, updateTask } = useTaskStore();

  useEffect(() => {
    if (taskToEdit) {
      setValue('title', taskToEdit.title);
      setValue('description', taskToEdit.description);
      setValue('priority', taskToEdit.priority);
      setValue('status', taskToEdit.status);
      setValue('estimatedTimeMinutes', taskToEdit.estimatedTimeMinutes);
      setValue('deadline', taskToEdit.deadline ? new Date(taskToEdit.deadline).toISOString().slice(0, 16) : '');
    } else {
      reset();
    }
  }, [taskToEdit, isOpen, setValue, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      if (taskToEdit) {
        await updateTask(taskToEdit._id, data);
        toast.success('Task updated!');
      } else {
        await addTask(data);
        toast.success('Task created!');
      }
      onClose();
      reset();
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="flex justify-between items-center p-6 border-b border-border">
            <h2 className="text-xl font-bold">{taskToEdit ? 'Edit Task' : 'New Task'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input 
                {...register('title', { required: true })}
                className="w-full p-3 bg-secondary rounded-xl border border-border focus:ring-2 focus:ring-primary/50 outline-none"
                placeholder="What needs to be done?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea 
                {...register('description')}
                className="w-full p-3 bg-secondary rounded-xl border border-border focus:ring-2 focus:ring-primary/50 outline-none min-h-[100px]"
                placeholder="Add some details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select 
                  {...register('status')}
                  className="w-full p-3 bg-secondary rounded-xl border border-border focus:ring-2 focus:ring-primary/50 outline-none"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select 
                  {...register('priority')}
                  className="w-full p-3 bg-secondary rounded-xl border border-border focus:ring-2 focus:ring-primary/50 outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input 
                  type="datetime-local"
                  {...register('deadline')}
                  className="w-full p-3 bg-secondary rounded-xl border border-border focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Est. Time (mins)</label>
                <input 
                  type="number"
                  {...register('estimatedTimeMinutes')}
                  className="w-full p-3 bg-secondary rounded-xl border border-border focus:ring-2 focus:ring-primary/50 outline-none"
                  placeholder="30"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 hover:bg-secondary rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 font-medium"
              >
                {taskToEdit ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;
