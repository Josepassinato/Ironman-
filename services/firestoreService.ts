import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Task, CalendarEvent, Insight } from '../types';

export interface DashboardData {
    summary: string;
    tasks: Task[];
    events: CalendarEvent[];
    insights: Insight[];
}

const getTodaysDateString = () => new Date().toISOString().split('T')[0];

export const getDashboardDataForToday = async (uid: string): Promise<DashboardData | null> => {
    try {
        const dateString = getTodaysDateString();
        const docRef = doc(db, 'users', uid, 'dashboards', dateString);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as DashboardData;
        }
        return null;
    } catch (error) {
        console.error("Error fetching today's dashboard data:", error);
        return null;
    }
};

export const saveDashboardData = async (uid: string, data: DashboardData): Promise<void> => {
    try {
        const dateString = getTodaysDateString();
        const docRef = doc(db, 'users', uid, 'dashboards', dateString);
        await setDoc(docRef, data);
    } catch (error) {
        console.error("Error saving dashboard data:", error);
    }
};

export const updateTasksForToday = async (uid: string, tasks: Task[]): Promise<void> => {
     try {
        const dateString = getTodaysDateString();
        const docRef = doc(db, 'users', uid, 'dashboards', dateString);
        await updateDoc(docRef, { tasks });
    } catch (error) {
        console.error("Error updating tasks:", error);
    }
};
