import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar as CalendarIcon, Clock, AlignLeft, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalendarStore } from '../../store/calendarStore';
import toast from 'react-hot-toast';

const EventModal = ({ isOpen, onClose, selectedDate, eventToEdit = null }) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const { addEvent, updateEvent } = useCalendarStore();

  useEffect(() => {
    if (eventToEdit) {
      setValue('title', eventToEdit.title);
      setValue('description', eventToEdit.description);
      setValue('date', new Date(eventToEdit.date).toISOString().split('T')[0]);
      setValue('startTime', eventToEdit.startTime || '');
      setValue('endTime', eventToEdit.endTime || '');
      setValue('type', eventToEdit.type || 'event');
    } else if (selectedDate) {
      reset();
      setValue('date', selectedDate.toISOString().split('T')[0]);
    }
  }, [eventToEdit, selectedDate, isOpen, setValue, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      if (eventToEdit) {
        await updateEvent(eventToEdit._id, data);
        toast.success('Event updated!');
      } else {
        await addEvent(data);
        toast.success('Event created!');
      }
      onClose();
      reset();
    } catch (error) {
      toast.error('Failed to save event');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="flex justify-between items-center p-6 border-b border-border bg-secondary/30">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              {eventToEdit ? 'Edit Event' : 'New Event'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Event Title</label>
              <input 
                {...register('title', { required: true })}
                className="w-full p-3 bg-secondary rounded-xl border border-border focus:ring-2 focus:ring-primary/50 outline-none"
                placeholder="Team Standup"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-muted-foreground" /> Description
              </label>
              <textarea 
                {...register('description')}
                className="w-full p-3 bg-secondary rounded-xl border border-border focus:ring-2 focus:ring-primary/50 outline-none resize-none h-24"
                placeholder="Event details or meeting links..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input 
                  type="date"
                  {...register('date', { required: true })}
                  className="w-full p-3 bg-secondary rounded-xl border border-border focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" /> Type
                </label>
                <select 
                  {...register('type')}
                  className="w-full p-3 bg-secondary rounded-xl border border-border focus:ring-2 focus:ring-primary/50 outline-none"
                >
                  <option value="event">Event</option>
                  <option value="meeting">Meeting</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" /> Start Time
                </label>
                <input 
                  type="time"
                  {...register('startTime')}
                  className="w-full p-3 bg-secondary rounded-xl border border-border focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <input 
                  type="time"
                  {...register('endTime')}
                  className="w-full p-3 bg-secondary rounded-xl border border-border focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors font-medium border border-border"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-xl shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95 font-medium"
              >
                {eventToEdit ? 'Save Changes' : 'Create Event'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EventModal;
