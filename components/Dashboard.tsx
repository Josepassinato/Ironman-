import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Task } from '../types';
import { DashboardData, updateTasksForToday } from '../services/firestoreService';
import SummaryCard from './dashboard/SummaryCard';
import TaskList from './dashboard/TaskList';
import CalendarWidget from './dashboard/CalendarWidget';
import InsightsWidget from './dashboard/InsightsWidget';

interface DashboardProps {
    dashboardData: DashboardData;
    user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ dashboardData, user }) => {
    const { summary, tasks, events, insights } = dashboardData;

    const handleUpdateTasks = (updatedTasks: Task[]) => {
       if (user) {
         updateTasksForToday(user.uid, updatedTasks);
       }
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-3xl font-bold font-orbitron text-slate-100">Dashboard</h1>
            </div>
            <p className="text-slate-400 mb-8">Here is your operational overview for today, sir.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <SummaryCard summary={summary} isLoading={false} />
                    <TaskList 
                      initialTasks={tasks} 
                      isLoading={false}
                      onTasksUpdate={handleUpdateTasks} 
                    />
                </div>
                <div className="lg:col-span-1 space-y-8">
                    <CalendarWidget events={events} isLoading={false} />
                    <InsightsWidget insights={insights} isLoading={false} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
