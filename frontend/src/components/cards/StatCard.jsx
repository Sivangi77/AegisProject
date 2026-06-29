import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
  const colorMap = {
    blue: 'from-blue-500/20 to-blue-600/5 text-blue-500',
    purple: 'from-purple-500/20 to-purple-600/5 text-purple-500',
    green: 'from-emerald-500/20 to-emerald-600/5 text-emerald-500',
    orange: 'from-orange-500/20 to-orange-600/5 text-orange-500',
  };

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="glass p-6 rounded-2xl relative overflow-hidden group cursor-pointer"
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity group-hover:opacity-100", colorMap[color].split(' ').slice(0, 2).join(' '))} />
      
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", trend === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                {trend === 'up' ? '+' : '-'}{trendValue}
              </span>
              <span className="text-xs text-muted-foreground">vs last week</span>
            </div>
          )}
        </div>
        
        <div className={cn("p-3 rounded-xl bg-background shadow-sm border border-border", colorMap[color].split(' ')[2])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
