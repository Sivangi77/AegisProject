import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

const data = [
  { name: 'Mon', focus: 4, tasks: 5 },
  { name: 'Tue', focus: 3, tasks: 4 },
  { name: 'Wed', focus: 6, tasks: 8 },
  { name: 'Thu', focus: 5, tasks: 6 },
  { name: 'Fri', focus: 7, tasks: 9 },
  { name: 'Sat', focus: 2, tasks: 2 },
  { name: 'Sun', focus: 1, tasks: 1 },
];

const Analytics = () => {
  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">Review your productivity trends</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-2xl border border-border"
        >
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary" />
            Focus Hours (This Week)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                <Tooltip 
                  cursor={{ fill: 'var(--secondary)' }}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                />
                <Bar dataKey="focus" fill="url(#colorFocus)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-2xl border border-border"
        >
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-500" />
            Tasks Completed
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="tasks" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
