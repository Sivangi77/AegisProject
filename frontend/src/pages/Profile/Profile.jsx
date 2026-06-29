import { useAuthStore } from '../../store/authStore';
import { User, Mail, Award, Zap, LogOut, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const initials = user.displayName 
    ? user.displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : user.email ? user.email.substring(0, 2).toUpperCase() : 'US';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-1 glass rounded-2xl p-6 border border-border flex flex-col items-center text-center"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-4xl shadow-xl mb-4">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <h2 className="text-xl font-bold">{user.displayName || 'AEGIS User'}</h2>
          <p className="text-muted-foreground flex items-center justify-center gap-1 mt-1 text-sm">
            <Mail className="w-4 h-4" /> {user.email}
          </p>
          
          <div className="w-full mt-6 space-y-3">
            <button className="w-full py-2 bg-secondary hover:bg-secondary/80 rounded-xl font-medium transition-colors border border-border flex items-center justify-center gap-2">
              <User className="w-4 h-4" /> Edit Profile
            </button>
            <button 
              onClick={logout}
              className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </motion.div>

        {/* Stats Card */}
        <div className="md:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 border border-border"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" /> AEGIS Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                <p className="text-muted-foreground text-sm font-medium mb-1">Productivity Score</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">{user.productivityScore || 0}</span>
                  <span className="text-sm text-green-500 mb-1 flex items-center"><Zap className="w-3 h-3" /> Level {user.level || 1}</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                <p className="text-muted-foreground text-sm font-medium mb-1">Account Provider</p>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold capitalize">{user.provider || 'Email/Password'}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 border border-border"
          >
            <h3 className="text-lg font-bold mb-4">Connected Integrations</h3>
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-border">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Google Calendar</p>
                  <p className="text-xs text-muted-foreground">{user.googleCalendarTokens ? 'Connected' : 'Not connected'}</p>
                </div>
              </div>
              <button 
                onClick={() => window.location.href = '/calendar'}
                className="px-4 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors"
              >
                Manage
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
