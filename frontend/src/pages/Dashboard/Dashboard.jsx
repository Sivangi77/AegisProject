import { useEffect, useState } from 'react';
import { Target, Zap, Clock, TrendingUp, Sparkles, Loader2, CheckCircle2, Circle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import StatCard from '../../components/cards/StatCard';
import { useDashboardStore } from '../../store/dashboardStore';
import { useTaskStore } from '../../store/taskStore';

const Dashboard = () => {
  const { dashboardData, loading, fetchDashboard } = useDashboardStore();
  const { updateTask } = useTaskStore(); // To allow completing tasks right from the dashboard
  
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [generatedSchedule, setGeneratedSchedule] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleTaskComplete = async (taskId) => {
    await updateTask(taskId, { status: 'done' });
    fetchDashboard(); // Refresh dashboard stats after completing task
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading || !dashboardData) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const { user, stats, todayTasks, upcomingDeadlines } = dashboardData;

  return (
    <motion.div 
      className="space-y-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Good Morning, {user?.name || 'User'}</h1>
          <p className="text-muted-foreground mt-1">Here's your productivity overview for today.</p>
        </div>
        
        <button 
          onClick={() => window.location.href = '/ai-assistant'}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 font-medium"
        >
          <Sparkles className="w-4 h-4" />
          AI Daily Briefing
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <StatCard 
            title="Productivity Score" 
            value={user.productivityScore.toString()} 
            icon={Zap} 
            trend="up" 
            trendValue={`Lvl ${user.level}`} 
            color="purple" 
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard 
            title="Tasks Completed" 
            value={stats.completedTasks.toString()} 
            icon={Target} 
            trend="up" 
            trendValue={`${stats.todayTasksCount} Today`} 
            color="green" 
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard 
            title="Focus Hours" 
            value={`${stats.focusHours}h`} 
            icon={Clock} 
            color="blue" 
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard 
            title="Habit Streak" 
            value={`${stats.habitsStreak} Days`} 
            icon={TrendingUp} 
            color="orange" 
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-1">
          {/* Replaced generic TaskListWidget with live Today Tasks */}
          <div className="glass rounded-2xl border border-border p-5 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Today's Tasks
              </h3>
              <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                {todayTasks.length} left
              </span>
            </div>
            
            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
              {todayTasks.map((task) => (
                <div key={task._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors group border border-transparent hover:border-border">
                  <button 
                    onClick={() => handleTaskComplete(task._id)}
                    className="text-muted-foreground hover:text-green-500 transition-colors"
                  >
                    <Circle className="w-5 h-5" />
                  </button>
                  <div className="flex-1 truncate">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{task.estimatedTimeMinutes} mins</p>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                    task.priority === 'urgent' ? 'bg-red-500/10 text-red-500' :
                    task.priority === 'high' ? 'bg-orange-500/10 text-orange-500' :
                    task.priority === 'low' ? 'bg-green-500/10 text-green-500' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}

              {todayTasks.length === 0 && (
                <div className="h-full min-h-[150px] flex flex-col items-center justify-center text-muted-foreground text-sm opacity-60">
                  <CheckCircle2 className="w-8 h-8 mb-2 opacity-50" />
                  All caught up for today!
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="lg:col-span-2">
          {/* Upcoming Deadlines & AI Suggestions */}
          <div className="glass rounded-2xl p-6 h-full flex flex-col border border-border">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Upcoming Deadlines
            </h3>
            
            <div className="space-y-4">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map(task => (
                  <div key={task._id} className="p-4 rounded-xl border border-border bg-card/50 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">Due: {new Date(task.deadline).toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 bg-secondary rounded-lg text-sm font-medium">
                      {task.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border">
                  <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p>Your schedule is clear! No upcoming deadlines found.</p>
                </div>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-border flex justify-between items-center">
              <div>
                <h4 className="font-medium text-sm">AI Smart Schedule</h4>
                <p className="text-xs text-muted-foreground">Let AI optimize your focus blocks</p>
              </div>
              <button 
                onClick={async () => {
                   setIsScheduleModalOpen(true);
                   setScheduleLoading(true);
                   try {
                     const { auth } = await import('../../services/firebase/config');
                     const token = auth.currentUser.uid;
                     const res = await fetch('http://localhost:5000/api/ai/schedule', {
                        headers: { 'Authorization': `Bearer ${token}` }
                     });
                     const data = await res.json();
                     if (res.ok && data.data) {
                        setGeneratedSchedule(data.data);
                     } else {
                        const errorMsg = data.error || "Failed to generate schedule.";
                        setGeneratedSchedule(errorMsg);
                        toast.error(errorMsg);
                     }
                   } catch(e) {
                     setGeneratedSchedule("Error connecting to AI service.");
                     toast.error("AI service is currently unavailable");
                   } finally {
                     setScheduleLoading(false);
                   }
                }}
                disabled={scheduleLoading}
                className={`px-4 py-2 rounded-xl transition-colors font-medium text-sm text-foreground ${scheduleLoading ? 'bg-secondary/50 cursor-not-allowed opacity-50' : 'bg-secondary hover:bg-secondary/80'}`}
              >
                {scheduleLoading ? 'Generating...' : 'Generate Schedule'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isScheduleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/30">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Smart Schedule
                </h3>
                <button onClick={() => setIsScheduleModalOpen(false)} className="p-1 hover:bg-secondary rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                {scheduleLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                    <p>AEGIS is analyzing your tasks and calendar...</p>
                  </div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {generatedSchedule}
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-border flex justify-end bg-secondary/30">
                <button 
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
