import React, { useState } from 'react';
import { signInWithPopup, User } from 'firebase/auth';
import { auth, googleProvider, microsoftProvider } from '../services/firebase';
import * as geminiService from '../services/geminiService';
import { DashboardData, saveDashboardData } from '../services/firestoreService';

interface DataSourceInputProps {
    onDataGenerated: (data: DashboardData) => void;
}

// Icon SVGs
const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
        <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.686H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
        <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.122 31.059-1.205 1.655C41.272 237.31 81.75 261.1 130.55 261.1" />
        <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.475.438C5.044 86.197 0 109.925 0 130.55s5.044 44.353 13.598 59.211l42.683-32.37z" />
        <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.052 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 81.75 0 41.272 23.79 13.826 62.821l42.683 32.37c10.445-31.56 39.746-54.722 74.041-54.722" />
    </svg>
);
const MicrosoftIcon = () => (
    <svg className="w-5 h-5 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21">
        <path fill="#f25022" d="M1 1h9v9H1z"/>
        <path fill="#00a4ef" d="M1 11h9v9H1z"/>
        <path fill="#7fba00" d="M11 1h9v9h-9z"/>
        <path fill="#ffb900" d="M11 11h9v9h-9z"/>
    </svg>
);
const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const MOCK_EMAIL_DATA = `
From: ariadne@starkindustries.com
To: tony@starkindustries.com
Subject: Project Chimera - Phase 3 Go/No-Go
Tony, The final simulation results for the Chimera energy distribution grid are in. We are seeing a 12% efficiency gain, but the resonance cascade at peak load is still a concern. General Ross is breathing down my neck. We need a final review for tomorrow, 10 AM. I've looped in Dr. Helen Cho. We need your sign-off. Best, Ariadne
---
From: happy.hogan@starkindustries.com
To: tony@starkindustries.com
Subject: RE: Security upgrade for the Malibu compound
Boss, The new perimeter defense drones are installed. Unit 7 is reporting a faulty targeting sensor. The vendor can have a replacement here by Thursday, meaning a potential blind spot for 48 hours. Should I re-task another unit to cover? Happy
---
From: legal@starkindustries.com
To: tony@starkindustries.com
Subject: URGENT: Accords Compliance Documentation
Mr. Stark, This is a final reminder that the quarterly Sokovia Accords compliance report is due by EOD Friday. We are missing your sign-off on the 'Enhanced Interrogation Technologies' disclosure. Please review and approve. Regards, Legal Dept.
`;

const DataSourceInput: React.FC<DataSourceInputProps> = ({ onDataGenerated }) => {
    const [user, setUser] = useState<User | null>(auth.currentUser);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [whatsappFile, setWhatsappFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setWhatsappFile(event.target.files[0]);
        }
    };

    const handleAuth = async (provider: 'google' | 'microsoft') => {
        try {
            const result = await signInWithPopup(auth, provider === 'google' ? googleProvider : microsoftProvider);
            setUser(result.user);
        } catch (error) {
            console.error(`Error with ${provider} sign-in:`, error);
            alert("Sir, I was unable to complete the connection. Please try again.");
        }
    };

    const handleSubmit = async () => {
        if (!whatsappFile || !user) {
            alert("Sir, please provide the WhatsApp data for a full analysis.");
            return;
        }

        setIsSubmitting(true);
        
        const whatsappContent = await whatsappFile.text();
        const combinedData = `
--- EMAIL DATA ---
${MOCK_EMAIL_DATA.trim()}
--- END EMAIL DATA ---

--- WHATSAPP DATA ---
${whatsappContent.trim()}
--- END WHATSAPP DATA ---
`;
        
        try {
            const [summary, tasks, events, insights] = await Promise.all([
                geminiService.generateDailySummary(combinedData),
                geminiService.generateTasks(combinedData),
                geminiService.generateCalendarEvents(combinedData),
                geminiService.generateInsights(combinedData),
            ]);

            const newDashboardData: DashboardData = { summary, tasks, events, insights };
            await saveDashboardData(user.uid, newDashboardData);
            onDataGenerated(newDashboardData);

        } catch (error) {
            console.error("Failed to generate and save dashboard data:", error);
            alert("My apologies, sir. There was an error in my cognitive analysis. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderLogin = () => (
        <div className="text-center">
             <h1 className="text-3xl font-bold font-orbitron text-slate-100 mb-2">J.A.R.V.I.S. Online</h1>
             <p className="text-slate-400 mb-8">Please authenticate to access the system.</p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button onClick={() => handleAuth('google')} className="font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center border bg-slate-700/50 hover:bg-slate-700 text-slate-200 border-slate-700 w-60">
                    <GoogleIcon /> Connect with Google
                 </button>
                 <button onClick={() => handleAuth('microsoft')} className="font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center border bg-slate-700/50 hover:bg-slate-700 text-slate-200 border-slate-700 w-64">
                    <MicrosoftIcon /> Connect with Microsoft
                 </button>
             </div>
        </div>
    );
    
    const renderDataInput = () => (
        <div className="text-center">
             <h1 className="text-3xl font-bold font-orbitron text-slate-100 mb-2">Generate Daily Briefing</h1>
             <p className="text-slate-400 mb-8">Sir, please provide the exported WhatsApp summary to proceed.</p>

             <div className="max-w-md mx-auto bg-slate-900/70 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-center mb-3">
                    <UploadIcon />
                    <h4 className="font-bold text-green-400">WhatsApp Data Upload</h4>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                    Export your chat to a `.txt` file from your device and upload it here.
                </p>
                <label htmlFor="whatsapp-upload" className="cursor-pointer text-sm font-semibold text-slate-900 bg-green-500 hover:bg-green-400 px-4 py-2 rounded-md transition-colors w-full inline-block">
                    {whatsappFile ? `Selected: ${whatsappFile.name.substring(0,25)}...` : 'Select .txt File'}
                </label>
                <input id="whatsapp-upload" type="file" accept=".txt,text/plain" className="hidden" onChange={handleFileChange} />
             </div>
             
             <button
                onClick={handleSubmit}
                className="mt-6 w-full max-w-md mx-auto bg-cyan-500 text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-cyan-400 transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!whatsappFile || isSubmitting}
            >
                {isSubmitting ? 'Analyzing...' : 'Generate Dashboard'}
            </button>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center h-full animate-fadeIn">
            <div className="w-full max-w-2xl bg-slate-800/50 rounded-lg border border-slate-700/50 p-8 shadow-2xl shadow-cyan-500/5">
                {user ? renderDataInput() : renderLogin()}
            </div>
        </div>
    );
};

export default DataSourceInput;
