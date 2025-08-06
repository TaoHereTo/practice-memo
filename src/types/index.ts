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

// PANAS 20项评估的数据结构
export interface PANASScores {
    // 原始评分 (1-5分)
    rawScores: {
        [key: string]: number; // 20个词项的评分
    };

    // 计算后的指标
    paScore: number;        // 积极情感总分 (10-50)
    naScore: number;        // 消极情感总分 (10-50)

    // 六个细分维度
    focusEngagement: number;    // 专注与投入
    vitalityEnthusiasm: number; // 活力与热情
    confidenceStrength: number; // 自信与力量
    anxietyFear: number;        // 焦虑与恐惧
    irritabilityHostility: number; // 烦躁与敌意
    guiltShame: number;         // 自责与羞愧
}

// 情绪象限
export type EmotionQuadrant = 'energetic' | 'mixed' | 'exhausted' | 'calm';

// 每日情绪回顾记录
export interface DailyMoodReview {
    id: string;
    date: string; // YYYY-MM-DD格式
    panasScores: PANASScores;
    quadrant: EmotionQuadrant;
    dominantPositive: string; // 最高的积极维度
    dominantNegative: string; // 最高的消极维度
    recommendations: string[]; // 今日宜忌建议
    timestamp: number;
}

// EMA实时情绪捕捉记录
export interface EMARecord {
    id: string;
    timestamp: number;
    moodValence: number;    // 情绪效价 (-1 to 1)
    moodArousal: number;    // 唤醒度 (-1 to 1)
    activities: string[];   // 当前活动
    socialContext: string;  // 社交环境
}

// EMA设置
export interface EMASettings {
    enabled: boolean;
    activeHours: {
        start: string; // HH:mm格式
        end: string;   // HH:mm格式
    };
    frequency: 'low' | 'medium' | 'high'; // 3次/天, 5次/天, 8次/天
    lastNotificationTime?: number;
}

// 保持向后兼容的旧心情记录接口
export interface MoodRecord {
    id: string;
    mood: 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad';
    note?: string;
    timestamp: number;
    timeOfDay: string; // 记录的时间点，如 "morning", "afternoon", "evening", "night"
}

export type MoodType = 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad'; 