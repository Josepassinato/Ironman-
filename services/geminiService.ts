import { GoogleGenAI, GenerateContentResponse, Chat, Type } from "@google/genai";
import { Task, CalendarEvent, Insight, ChatMessage } from '../types';

let chatInstance: Chat | null = null;

const getAI = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const getChatInstance = (): Chat => {
    if (!chatInstance) {
        const ai = getAI();
        chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are J.A.R.V.I.S., a sophisticated AI personal assistant for a high-performance executive. You are proactive, intelligent, concise, and slightly witty, inspired by the character from Iron Man. Your purpose is to help the user manage their professional and personal life with utmost efficiency. When asked to perform a task, fulfill it directly. When chatting, maintain your persona.",
            },
        });
    }
    return chatInstance;
};

export const generateDailySummary = async (rawData: string): Promise<string> => {
    try {
        const ai = getAI();
        const prompt = `Act as J.A.R.V.I.S. Based on the following data from emails and WhatsApp, generate a concise, bulleted end-of-day summary for me. Highlight key decisions, new tasks, and upcoming appointments.\n\nData:\n${rawData}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating daily summary:", error);
        return "Sir, I seem to be having trouble accessing my cognitive circuits. Please try again later.";
    }
};

export const generateTasks = async (rawData: string): Promise<Task[]> => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following communication data, which is separated into sections for EMAIL and WHATSAPP. Extract all actionable tasks. Use the section headings (--- EMAIL DATA ---, --- WHATSAPP DATA ---) to correctly set the 'source' property for each task to either 'Email' or 'WhatsApp'. Provide the output as a JSON array of objects.\n\nData:\n${rawData}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            text: { type: Type.STRING },
                            isCompleted: { type: Type.BOOLEAN },
                            source: { type: Type.STRING, enum: ['Email', 'WhatsApp', 'Manual'] },
                        },
                        required: ["id", "text", "isCompleted", "source"],
                    },
                },
            },
        });
        
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating tasks:", error);
        return [];
    }
};


export const generateCalendarEvents = async (rawData: string): Promise<CalendarEvent[]> => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following communication data, separated by source, and extract all appointments or scheduled events. Provide the output as a JSON array of objects.\n\nData:\n${rawData}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            time: { type: Type.STRING, description: "e.g., 'Tomorrow at 10:00 AM' or 'Thursday at 1:00 PM'" },
                            title: { type: Type.STRING },
                            participants: { type: Type.ARRAY, items: { type: Type.STRING } },
                        },
                        required: ["id", "time", "title", "participants"],
                    },
                },
            },
        });
        
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating calendar events:", error);
        return [];
    }
};


export const generateInsights = async (rawData: string): Promise<Insight[]> => {
     try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the day's communications from email and WhatsApp, provide 2-3 strategic or productivity insights for an executive. Frame them as proactive suggestions. Provide the output as a JSON array of objects.\n\nData:\n${rawData}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            text: { type: Type.STRING },
                            category: { type: Type.STRING, enum: ['Strategic', 'Productivity', 'Personal'] },
                        },
                        required: ["id", "text", "category"],
                    },
                },
            },
        });
        
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating insights:", error);
        return [];
    }
};

export const streamChatResponse = async (
    message: string,
    onChunk: (text: string) => void
): Promise<void> => {
    try {
        const chat = getChatInstance();
        const result = await chat.sendMessageStream({ message });

        for await (const chunk of result) {
            onChunk(chunk.text);
        }
    } catch (error) {
        console.error("Error in streaming chat response:", error);
        onChunk("My apologies, sir. I'm encountering a communication issue.");
    }
};