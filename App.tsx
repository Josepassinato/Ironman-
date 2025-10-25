import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './services/firebase';
import { DashboardData, getDashboardDataForToday } from './services/firestoreService';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ConversationalUI from './components/ConversationalUI';
import DataSourceInput from './components/DataSourceInput';
import Notification from './components/Notification';

type View = 'dashboard' | 'chat';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const data = await getDashboardDataForToday(currentUser.uid);
        setDashboardData(data);
        if (!data) {
           const lastReminderDate = localStorage.getItem('lastReminderDate');
           const today = new Date().toISOString().split('T')[0];
           if (lastReminderDate !== today) {
              setShowReminder(true);
              localStorage.setItem('lastReminderDate', today);
           }
        }
      } else {
        setDashboardData(null);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if ('launchQueue' in window && user) {
      (window as any).launchQueue.setConsumer(async (launchParams: { files: any[] }) => {
        if (!launchParams.files || launchParams.files.length === 0) return;
        const fileHandle = launchParams.files[0];
        const file = await fileHandle.getFile();
        const text = await file.text();
        // This is a simplified path for share target; a full implementation
        // would trigger the same generation logic as in DataSourceInput
        console.log("Shared file received:", text);
      });
    }
  }, [user]);

  const handleDataGenerated = (data: DashboardData) => {
    setDashboardData(data);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const renderView = () => {
    if (isAuthLoading) {
      return (
        <div className="flex items-center justify-center h-full">
            <div className="w-16 h-16 border-4 border-cyan-400 border-dashed rounded-full animate-spin"></div>
        </div>
      );
    }

    if (!user) {
        return <DataSourceInput onDataGenerated={handleDataGenerated} />;
    }

    switch (currentView) {
      case 'dashboard':
        return dashboardData ? (
          <Dashboard dashboardData={dashboardData} user={user} />
        ) : (
          <DataSourceInput onDataGenerated={handleDataGenerated} />
        );
      case 'chat':
        return <ConversationalUI />;
      default:
        return dashboardData ? (
          <Dashboard dashboardData={dashboardData} user={user} />
        ) : (
          <DataSourceInput onDataGenerated={handleDataGenerated} />
        );
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen flex selection:bg-cyan-400/20">
      <Sidebar 
        user={user} 
        onLogout={handleLogout}
        currentView={currentView} 
        setCurrentView={setCurrentView} 
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {renderView()}
      </main>
      <Notification
        show={showReminder}
        onClose={() => setShowReminder(false)}
        message="Sir, a gentle reminder to provide the daily WhatsApp summary for a complete operational overview."
      />
    </div>
  );
};

export default App;
