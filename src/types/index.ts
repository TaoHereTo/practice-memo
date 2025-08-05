export interface PracticeRecord {
    id: string;
    practiceId: string;
    content?: string;
    score: number;
    timestamp: number;
    duration?: number; // 用于远离手机和心灵小憩
    meditationDuration?: number; // 用于心灵小憩
}

export interface PracticeData {
    id: string;
    tabTitle: string;
    title: string;
    content: string;
}

export interface PhoneAwayState {
    isRunning: boolean;
    startTime: number | null;
    pausedTime: number;
    totalTime: number;
}

export interface MeditationState {
    isRunning: boolean;
    startTime: number | null;
    duration: number;
    remainingTime: number;
}

export type TimeRange = 'today' | 'week' | 'month'; 