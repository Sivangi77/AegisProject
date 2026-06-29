import { Bell, Search, Menu } from 'lucide-react';

const Navbar = () => {
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
        <button className="p-2 text-muted-foreground hover:bg-secondary rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-card"></span>
        </button>
        
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-md cursor-pointer">
          JD
        </div>
      </div>
    </header>
  );
};

export default Navbar;
