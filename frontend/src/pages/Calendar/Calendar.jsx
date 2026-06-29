import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Trash2, Edit2, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalendarStore } from '../../store/calendarStore';
import { useTaskStore } from '../../store/taskStore';
import EventModal from '../../components/calendar/EventModal';
import toast from 'react-hot-toast';
import { auth } from '../../services/firebase/config';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month', 'agenda'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  
  const { events, loading: eventsLoading, fetchEvents, deleteEvent } = useCalendarStore();
  const { tasks, loading: tasksLoading, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchEvents();
    fetchTasks();
  }, [fetchEvents, fetchTasks]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const jumpToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  const handleAddEvent = (day) => {
    setSelectedDate(day);
    setEventToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (e, event) => {
    e.stopPropagation();
    setEventToEdit(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(id);
      toast.success('Event deleted');
    }
  };

  // Combine Tasks with deadlines and Calendar Events
  const combinedItems = [
    ...events.map(e => ({ ...e, isTask: false, sortDate: new Date(e.date) })),
    ...tasks.filter(t => t.deadline).map(t => ({ 
      ...t, 
      isTask: true, 
      date: t.deadline, 
      sortDate: new Date(t.deadline),
      type: 'task' 
    }))
  ].sort((a, b) => a.sortDate - b.sortDate);

  const getItemsForDay = (day) => {
    return combinedItems.filter(item => isSameDay(item.sortDate, day));
  };

  // Generate Month Grid
  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
        <div className="flex bg-secondary rounded-lg p-1">
          <button onClick={prevMonth} className="p-1.5 hover:bg-card rounded-md transition-colors"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={jumpToToday} className="px-3 py-1 text-sm font-medium hover:bg-card rounded-md transition-colors">Today</button>
          <button onClick={nextMonth} className="p-1.5 hover:bg-card rounded-md transition-colors"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex bg-secondary rounded-xl p-1">
          <button 
            onClick={() => setView('month')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'month' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Month
          </button>
          <button 
            onClick={() => setView('agenda')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'agenda' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Agenda
          </button>
        </div>
        <button 
          onClick={() => handleAddEvent(selectedDate)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 font-medium"
        >
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = [];
    let startDate = startOfWeek(currentDate);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-semibold text-sm py-3 text-muted-foreground border-b border-border">
          {format(addDays(startDate, i), 'EEE')}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const items = getItemsForDay(day);

        days.push(
          <div
            key={day}
            onClick={() => handleDateClick(cloneDay)}
            onDoubleClick={() => handleAddEvent(cloneDay)}
            className={`min-h-[120px] p-2 border-r border-b border-border/50 relative cursor-pointer transition-colors ${
              !isSameMonth(day, monthStart) ? 'bg-secondary/20 text-muted-foreground/50' : 'hover:bg-secondary/30'
            } ${isSameDay(day, selectedDate) ? 'bg-primary/5' : ''}`}
          >
            <div className="flex justify-between items-start">
              <span className={`w-7 h-7 flex items-center justify-center text-sm rounded-full ${
                isToday(day) ? 'bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20' : 
                isSameDay(day, selectedDate) ? 'border border-primary text-primary' : 'font-medium'
              }`}>
                {formattedDate}
              </span>
              {items.length > 3 && (
                <span className="text-[10px] text-muted-foreground">+{items.length - 3} more</span>
              )}
            </div>

            <div className="mt-2 space-y-1">
              {items.slice(0, 3).map((item, idx) => (
                <div 
                  key={idx} 
                  className={`text-xs px-2 py-1 rounded truncate flex items-center gap-1.5 ${
                    item.isTask 
                      ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20' 
                      : item.type === 'meeting' ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20' : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${item.isTask ? 'bg-orange-500' : item.type === 'meeting' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                  {item.startTime && <span className="font-semibold opacity-70">{item.startTime}</span>}
                  {item.title}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="grid grid-cols-7" key={day}>{days}</div>);
      days = [];
    }
    return <div className="border-t border-l border-border/50 rounded-2xl overflow-hidden glass">{rows}</div>;
  };

  const renderAgenda = () => {
    // Group combinedItems by Date
    const grouped = combinedItems.reduce((acc, item) => {
      const dateStr = format(item.sortDate, 'yyyy-MM-dd');
      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(item);
      return acc;
    }, {});

    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));

    if (sortedDates.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground glass rounded-2xl border border-border border-dashed">
          <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
          <h3 className="text-xl font-medium">No Upcoming Events</h3>
          <p className="mt-2">You have a completely free schedule!</p>
        </div>
      );
    }

    return (
      <div className="space-y-8 pb-12">
        {sortedDates.map(dateStr => {
          const dateObj = parseISO(dateStr);
          return (
            <div key={dateStr} className="relative pl-8">
              {/* Timeline line */}
              <div className="absolute left-2.5 top-8 bottom-[-2rem] w-px bg-border"></div>
              
              <div className="flex items-center gap-4 mb-4 relative">
                <div className="absolute left-[-2rem] w-5 h-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  {format(dateObj, 'EEEE, MMMM d, yyyy')}
                  {isToday(dateObj) && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Today</span>}
                </h3>
              </div>

              <div className="space-y-3">
                {grouped[dateStr].map(item => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={item._id} 
                    className="glass p-4 rounded-2xl border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl flex-shrink-0 ${
                        item.isTask ? 'bg-orange-500/10 text-orange-500' : 
                        item.type === 'meeting' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {item.isTask ? <Sparkles className="w-6 h-6" /> : 
                         item.type === 'meeting' ? <CalendarIcon className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{item.title}</h4>
                        {item.description && <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>}
                        
                        <div className="flex items-center gap-3 mt-2 text-xs font-medium">
                          {item.startTime && (
                            <span className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-foreground">
                              <Clock className="w-3 h-3" /> {item.startTime} {item.endTime ? `- ${item.endTime}` : ''}
                            </span>
                          )}
                          <span className={`uppercase px-2 py-1 rounded-md ${
                            item.isTask ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-500/10 text-blue-600'
                          }`}>
                            {item.isTask ? `Task Deadline` : item.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {!item.isTask && (
                      <div className="flex sm:flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => handleEditEvent(e, item)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-primary transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => handleDeleteEvent(e, item._id)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSidebar = () => {
    const selectedItems = getItemsForDay(selectedDate);
    
    return (
      <div className="w-full lg:w-80 flex flex-col gap-6">
        {/* Sync Card */}
        <div className="glass p-5 rounded-2xl border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-semibold">Google Calendar</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Sync your external meetings automatically.</p>
          <button 
            onClick={async () => {
              try {
                toast.loading('Redirecting to Google...', { id: 'gcal' });
                const user = auth.currentUser;
                const res = await fetch('http://localhost:5000/api/calendar/auth-url', {
                  headers: { 'Authorization': `Bearer ${user.uid}` }
                });
                const data = await res.json();
                if (data.success) {
                  toast.success('Redirecting...', { id: 'gcal' });
                  window.location.href = data.url;
                } else {
                  toast.error('Failed to get auth URL', { id: 'gcal' });
                }
              } catch (e) {
                toast.error('Connection error', { id: 'gcal' });
              }
            }}
            className="w-full py-2 bg-secondary hover:bg-secondary/80 text-foreground font-medium rounded-xl transition-colors border border-border"
          >
            Connect Account
          </button>
        </div>

        {/* Selected Date Details */}
        <div className="glass p-5 rounded-2xl border border-border flex-1">
          <h3 className="font-bold text-lg mb-1">{format(selectedDate, 'EEEE')}</h3>
          <p className="text-primary font-medium text-sm mb-6">{format(selectedDate, 'MMMM d, yyyy')}</p>
          
          <div className="space-y-3">
            {selectedItems.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No events scheduled.</p>
            ) : (
              selectedItems.map(item => (
                <div key={item._id} className="p-3 bg-secondary/50 rounded-xl border border-border">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm pr-2">{item.title}</h4>
                    {item.startTime && <span className="text-xs font-semibold whitespace-nowrap">{item.startTime}</span>}
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    item.isTask ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-500/10 text-blue-600'
                  }`}>
                    {item.isTask ? 'Task' : 'Event'}
                  </span>
                </div>
              ))
            )}
          </div>
          
          <button 
            onClick={() => handleAddEvent(selectedDate)}
            className="w-full mt-6 py-2 border-2 border-dashed border-primary/50 text-primary hover:bg-primary/5 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add to {format(selectedDate, 'MMM d')}
          </button>
        </div>
      </div>
    );
  };

  if (eventsLoading && events.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full">
      {renderHeader()}
      
      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        <div className="flex-1 flex flex-col">
          {view === 'month' ? (
            <div className="flex-1">
              {renderDays()}
              {renderCells()}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
              {renderAgenda()}
            </div>
          )}
        </div>
        
        {renderSidebar()}
      </div>

      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        eventToEdit={eventToEdit}
      />
    </div>
  );
};

export default Calendar;
