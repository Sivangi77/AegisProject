import { Target, Zap, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '../../components/cards/StatCard';
import TaskListWidget from '../../components/dashboard/TaskListWidget';

const Dashboard = () => {
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

  return (
    <motion.div 
      className="space-y-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Good Morning, John</h1>
          <p className="text-muted-foreground mt-1">Here's your productivity overview for today.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 font-medium">
          <Sparkles className="w-4 h-4" />
          AI Daily Briefing
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <StatCard 
            title="Productivity Score" 
            value="85" 
            icon={Zap} 
            trend="up" 
            trendValue="12%" 
            color="purple" 
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard 
            title="Tasks Completed" 
            value="12" 
            icon={Target} 
            trend="up" 
            trendValue="3" 
            color="green" 
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard 
            title="Focus Hours" 
            value="4.5h" 
            icon={Clock} 
            trend="down" 
            trendValue="1h" 
            color="blue" 
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard 
            title="Habit Streak" 
            value="7 Days" 
            icon={TrendingUp} 
            color="orange" 
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <TaskListWidget />
        </motion.div>
        
        <motion.div variants={itemVariants} className="lg:col-span-2">
          {/* AI Suggestions / Schedule Placeholder */}
          <div className="glass rounded-2xl p-6 h-full min-h-[300px] flex flex-col justify-center items-center text-center border border-dashed border-primary/30 bg-primary/5">
            <Sparkles className="w-12 h-12 text-primary/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Schedule</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your AI assistant is analyzing your tasks and calendar to generate the optimal focus schedule for today.
            </p>
            <button className="mt-6 px-6 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl transition-colors font-medium">
              Generate Schedule
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
