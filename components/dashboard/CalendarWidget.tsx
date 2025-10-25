
import React from 'react';
import { CalendarEvent } from '../../types';

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
);

const CalendarWidget: React.FC<{ events: CalendarEvent[]; isLoading: boolean }> = ({ events, isLoading }) => {
    return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6 shadow-lg">
            <h2 className="text-xl font-bold font-orbitron text-slate-100 mb-4">Upcoming Schedule</h2>
             {isLoading ? (
                 <div className="space-y-4 animate-pulse">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-16 bg-slate-700 rounded"></div>
                        <div className="h-6 bg-slate-700 rounded w-full"></div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-16 bg-slate-700 rounded"></div>
                        <div className="h-6 bg-slate-700 rounded w-full"></div>
                    </div>
                 </div>
            ) : (
                <div className="space-y-4">
                    {events.length > 0 ? events.map(event => (
                        <div key={event.id} className="flex items-start gap-4">
                            <div className="text-center font-semibold bg-slate-700/50 rounded-md p-2 w-24 flex-shrink-0">
                                <p className="text-cyan-400 text-sm">{event.time.split(' ')[0]}</p>
                                <p className="text-xs text-slate-400">{event.time.split(' at ')[1]}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-200">{event.title}</h3>
                                <p className="text-sm text-slate-400">With: {event.participants.join(', ')}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center text-center text-slate-500 py-6">
                            <CalendarIcon />
                            <p className="mt-2">Your schedule is clear.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CalendarWidget;
