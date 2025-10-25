import React from 'react';
import { User } from 'firebase/auth';

// SVG Icons
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);
const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);


interface SidebarProps {
  user: User | null;
  onLogout: () => void;
  currentView: 'dashboard' | 'chat';
  setCurrentView: (view: 'dashboard' | 'chat') => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 transition-all duration-200 ease-in-out rounded-lg ${
        isActive
          ? 'bg-cyan-500/20 text-cyan-300'
          : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
      }`}
    >
      {icon}
      <span className="ml-4 font-semibold text-sm">{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, currentView, setCurrentView }) => {
  return (
    <nav className="w-64 bg-slate-900/70 backdrop-blur-sm border-r border-slate-700/50 p-6 flex-shrink-0 flex flex-col">
      <div className="flex items-center mb-12">
        <div className="w-10 h-10 border-2 border-cyan-400 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-cyan-400 rounded-full animate-pulse"></div>
        </div>
        <h1 className="text-xl font-bold ml-4 font-orbitron text-slate-100 tracking-wider">
          IRON MAN
        </h1>
      </div>
      <div className="space-y-4">
        {user && (
          <>
            <NavItem
              icon={<DashboardIcon />}
              label="Dashboard"
              isActive={currentView === 'dashboard'}
              onClick={() => setCurrentView('dashboard')}
            />
            <NavItem
              icon={<ChatIcon />}
              label="Conversational UI"
              isActive={currentView === 'chat'}
              onClick={() => setCurrentView('chat')}
            />
          </>
        )}
      </div>
      <div className="mt-auto">
        {user && (
            <div className="text-center mb-4 border-t border-slate-700/50 pt-4">
                <p className="text-sm font-semibold text-slate-300 truncate">{user.displayName || 'Sir'}</p>
                <button onClick={onLogout} className="text-xs text-slate-400 hover:text-cyan-400 transition-colors flex items-center justify-center w-full mt-2">
                    <LogoutIcon />
                    <span className="ml-2">Logout</span>
                </button>
            </div>
        )}
        <div className="text-center text-xs text-slate-500">
            <p>J.A.R.V.I.S. v2.5</p>
            <p>&copy; {new Date().getFullYear()} Stark Industries</p>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
