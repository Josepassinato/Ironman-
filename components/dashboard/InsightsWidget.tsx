
import React from 'react';
import { Insight } from '../../types';

const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.657a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 14.95a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM4 10a1 1 0 01-1 1H2a1 1 0 110-2h1a1 1 0 011 1zM10 18a1 1 0 001-1v-1a1 1 0 10-2 0v1a1 1 0 001 1zM8.94 6.06a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707z" />
        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.5 12a.5.5 0 01.5-.5h8a.5.5 0 010 1H6a.5.5 0 01-.5-.5z" />
    </svg>
);

const InsightsWidget: React.FC<{ insights: Insight[]; isLoading: boolean }> = ({ insights, isLoading }) => {

    const getCategoryStyles = (category: Insight['category']) => {
        switch (category) {
            case 'Strategic': return 'border-l-purple-400 bg-purple-500/10 text-purple-400';
            case 'Productivity': return 'border-l-green-400 bg-green-500/10 text-green-400';
            case 'Personal': return 'border-l-yellow-400 bg-yellow-500/10 text-yellow-400';
            default: return 'border-l-slate-500 bg-slate-500/10 text-slate-400';
        }
    };
    
    return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6 shadow-lg">
            <h2 className="text-xl font-bold font-orbitron text-slate-100 mb-4">Strategic Insights</h2>
            {isLoading ? (
                 <div className="space-y-4 animate-pulse">
                    <div className="h-16 bg-slate-700 rounded"></div>
                    <div className="h-16 bg-slate-700 rounded"></div>
                 </div>
            ) : (
                <div className="space-y-4">
                    {insights.length > 0 ? insights.map(insight => (
                        <div key={insight.id} className={`p-4 rounded-md border-l-4 ${getCategoryStyles(insight.category)}`}>
                            <p className="font-semibold text-xs uppercase tracking-wider mb-1">{insight.category}</p>
                            <p className="text-sm text-slate-300">{insight.text}</p>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center text-center text-slate-500 py-6">
                            <LightbulbIcon />
                            <p className="mt-2">Awaiting data for new insights.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InsightsWidget;
