import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, LogOut, User, Settings as SettingsIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  
  const { user, logout } = useAuthStore();
  const { tasks, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Upcoming deadlines (next 3 days)
  const upcomingDeadlines = tasks
    .filter(t => t.status !== 'done' && t.deadline)
    .filter(t => {
      const diff = new Date(t.deadline) - new Date();
      return diff >= 0 && diff <= 3 * 24 * 60 * 60 * 1000;
    })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const initials = user?.displayName 
    ? user.displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : user?.email ? user.email.substring(0, 2).toUpperCase() : 'US';

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-muted-foreground hover:bg-secondary rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden sm:flex items-center relative">
          <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search tasks, goals..." 
            className="pl-9 pr-4 py-2 bg-secondary border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 text-muted-foreground hover:bg-secondary rounded-full relative"
          >
            <Bell className="w-5 h-5" />
            {upcomingDeadlines.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-card animate-pulse"></span>
            )}
          </button>
          
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden py-2 z-50">
              <div className="px-4 py-2 border-b border-border flex justify-between items-center">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{upcomingDeadlines.length} new</span>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {upcomingDeadlines.length > 0 ? (
                  upcomingDeadlines.map(task => (
                    <div key={task._id} className="px-4 py-3 border-b border-border/50 hover:bg-secondary/50 cursor-pointer">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-red-500 font-medium mt-1">Due: {new Date(task.deadline).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    <p className="text-sm">You're all caught up!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-md cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              initials
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden py-1 z-50">
              <div className="px-4 py-3 border-b border-border bg-secondary/50">
                <p className="text-sm font-medium truncate">{user?.displayName || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              
              <div className="py-1">
                <Link 
                  to="/profile" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  Profile
                </Link>
                <Link 
                  to="/settings" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                >
                  <SettingsIcon className="w-4 h-4 text-muted-foreground" />
                  Settings
                </Link>
              </div>
              
              <div className="border-t border-border py-1">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
