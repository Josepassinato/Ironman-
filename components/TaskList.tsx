import React, { useState, useEffect } from 'react';
import { Task } from '../../types';

const TaskItem: React.FC<{ task: Task; onToggle: (id: string) => void }> = ({ task, onToggle }) => {
    const sourceColor = task.source === 'Email' ? 'text-blue-400' : 'text-green-400';
    return (
        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-md transition-colors hover:bg-slate-800/70">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => onToggle(task.id)}
                    className="h-5 w-5 rounded bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                />
                <label className={`ml-3 ${task.isCompleted ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                    {task.text}
                </label>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full bg-slate-700 ${sourceColor}`}>
                {task.source}
            </span>
        </div>
    );
};

interface TaskListProps {
  initialTasks: Task[];
  isLoading: boolean;
  onTasksUpdate: (tasks: Task[]) => void;
}

const TaskList: React.FC<TaskListProps> = ({ initialTasks, isLoading, onTasksUpdate }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    const handleToggleTask = (id: string) => {
        const updatedTasks = tasks.map(task => 
            task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
        );
        setTasks(updatedTasks);
        onTasksUpdate(updatedTasks);
    };

    const completedTasks = tasks.filter(t => t.isCompleted).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6 shadow-lg">
            <h2 className="text-xl font-bold font-orbitron text-slate-100 mb-4">Actionable Tasks</h2>
            {isLoading ? (
                 <div className="space-y-3 animate-pulse">
                    <div className="h-10 bg-slate-700 rounded"></div>
                    <div className="h-10 bg-slate-700 rounded"></div>
                    <div className="h-10 bg-slate-700 rounded"></div>
                </div>
            ) : (
                <>
                    <div className="mb-4">
                        <div className="flex justify-between mb-1 text-sm text-slate-400">
                            <span>Progress</span>
                            <span>{completedTasks} / {totalTasks} Completed</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2.5">
                            <div className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                        {tasks.length > 0 ? tasks.map(task => (
                            <TaskItem key={task.id} task={task} onToggle={handleToggleTask} />
                        )) : <p className="text-slate-500 text-center py-4">All clear, sir. No pending tasks.</p>}
                    </div>
                </>
            )}
        </div>
    );
};

export default TaskList;
