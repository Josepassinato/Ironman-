
export interface Task {
  id: string;
  text: string;
  isCompleted: boolean;
  source: 'Email' | 'WhatsApp' | 'Manual';
}

export interface CalendarEvent {
  id: string;
  time: string;
  title: string;
  participants: string[];
}

export interface Insight {
  id:string;
  text: string;
  category: 'Strategic' | 'Productivity' | 'Personal';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
