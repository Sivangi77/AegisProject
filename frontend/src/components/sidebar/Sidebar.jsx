import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Focus, 
  Target, 
  Activity, 
  PieChart, 
  Settings, 
  Bot 
} from 'lucide-react';
import { cn } from '@/utils/cn';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
  { name: 'Focus Mode', path: '/focus', icon: Focus },
  { name: 'Goals', path: '/goals', icon: Target },
  { name: 'Habits', path: '/habits', icon: Activity },
  { name: 'Analytics', path: '/analytics', icon: PieChart },
  { name: 'AI Assistant', path: '/ai-assistant', icon: Bot },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-border bg-card hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          AEGIS
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            location.pathname.startsWith('/settings')
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
          )}
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
