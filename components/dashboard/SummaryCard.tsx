
import React from 'react';

const SummaryCard: React.FC<{ summary: string; isLoading: boolean }> = ({ summary, isLoading }) => {
    return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6 shadow-lg">
            <h2 className="text-xl font-bold font-orbitron text-slate-100 mb-4">End of Day Summary</h2>
            {isLoading ? (
                <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                </div>
            ) : (
                <div className="prose prose-invert prose-sm text-slate-300 max-w-none">
                    <ul className="space-y-2">
                        {summary.split('\n').map((item, index) => {
                             if (item.trim().startsWith('*') || item.trim().startsWith('-')) {
                                return <li key={index}>{item.replace(/[*-]\s*/, '')}</li>;
                             }
                             return null;
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SummaryCard;
