import type { PracticeRecord, MoodRecord, DailyMoodReview, EMARecord, EMASettings } from '../types';

const STORAGE_KEY = 'practice_memo_records';
const MOOD_STORAGE_KEY = 'practice_memo_mood_records';
const DAILY_REVIEW_KEY = 'practice_memo_daily_reviews';
const EMA_RECORDS_KEY = 'practice_memo_ema_records';
const EMA_SETTINGS_KEY = 'practice_memo_ema_settings';

export const storageService = {
    // 获取所有记录
    getAllRecords(): PracticeRecord[] {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('读取数据失败:', error);
            return [];
        }
    },

    // 保存记录
    saveRecord(record: PracticeRecord): void {
        try {
            const records = this.getAllRecords();
            records.push(record);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        } catch (error) {
            console.error('保存数据失败:', error);
        }
    },

    // 删除指定记录
    deleteRecord(recordId: string): void {
        try {
            const records = this.getAllRecords();
            const filteredRecords = records.filter(record => record.id !== recordId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
        } catch (error) {
            console.error('删除数据失败:', error);
        }
    },

    // 获取指定练习的记录
    getRecordsByPractice(practiceId: string): PracticeRecord[] {
        const records = this.getAllRecords();
        return records.filter(record => record.practiceId === practiceId);
    },

    // 获取指定时间范围的记录
    getRecordsByTimeRange(startTime: number, endTime: number): PracticeRecord[] {
        const records = this.getAllRecords();
        return records.filter(record =>
            record.timestamp >= startTime && record.timestamp <= endTime
        );
    },

    // 清除所有数据
    clearAllData(): void {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(MOOD_STORAGE_KEY);
        localStorage.removeItem(DAILY_REVIEW_KEY);
        localStorage.removeItem(EMA_RECORDS_KEY);
        localStorage.removeItem(EMA_SETTINGS_KEY);
    },

    // 心情记录相关方法
    // 获取所有心情记录
    getAllMoodRecords(): MoodRecord[] {
        try {
            const data = localStorage.getItem(MOOD_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('读取心情数据失败:', error);
            return [];
        }
    },

    // 保存心情记录
    saveMoodRecord(record: MoodRecord): void {
        try {
            const records = this.getAllMoodRecords();
            records.push(record);
            localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(records));
        } catch (error) {
            console.error('保存心情数据失败:', error);
        }
    },

    // 删除指定心情记录
    deleteMoodRecord(recordId: string): void {
        try {
            const records = this.getAllMoodRecords();
            const filteredRecords = records.filter(record => record.id !== recordId);
            localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(filteredRecords));
        } catch (error) {
            console.error('删除心情数据失败:', error);
        }
    },

    // 获取指定时间范围的心情记录
    getMoodRecordsByTimeRange(startTime: number, endTime: number): MoodRecord[] {
        const records = this.getAllMoodRecords();
        return records.filter(record =>
            record.timestamp >= startTime && record.timestamp <= endTime
        );
    },

    // 每日情绪回顾相关方法
    // 获取所有每日回顾
    getAllDailyReviews(): DailyMoodReview[] {
        try {
            const data = localStorage.getItem(DAILY_REVIEW_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('读取每日回顾数据失败:', error);
            return [];
        }
    },

    // 保存每日回顾
    saveDailyReview(review: DailyMoodReview): void {
        try {
            const reviews = this.getAllDailyReviews();
            // 如果同一天已有记录，替换它
            const existingIndex = reviews.findIndex(r => r.date === review.date);
            if (existingIndex >= 0) {
                reviews[existingIndex] = review;
            } else {
                reviews.push(review);
            }
            localStorage.setItem(DAILY_REVIEW_KEY, JSON.stringify(reviews));
        } catch (error) {
            console.error('保存每日回顾数据失败:', error);
        }
    },

    // 获取指定日期的每日回顾
    getDailyReviewByDate(date: string): DailyMoodReview | null {
        const reviews = this.getAllDailyReviews();
        return reviews.find(review => review.date === date) || null;
    },

    // EMA记录相关方法
    // 获取所有EMA记录
    getAllEMARecords(): EMARecord[] {
        try {
            const data = localStorage.getItem(EMA_RECORDS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('读取EMA数据失败:', error);
            return [];
        }
    },

    // 保存EMA记录
    saveEMARecord(record: EMARecord): void {
        try {
            const records = this.getAllEMARecords();
            records.push(record);
            localStorage.setItem(EMA_RECORDS_KEY, JSON.stringify(records));
        } catch (error) {
            console.error('保存EMA数据失败:', error);
        }
    },

    // 获取指定时间范围的EMA记录
    getEMARecordsByTimeRange(startTime: number, endTime: number): EMARecord[] {
        const records = this.getAllEMARecords();
        return records.filter(record =>
            record.timestamp >= startTime && record.timestamp <= endTime
        );
    },

    // EMA设置相关方法
    // 获取EMA设置
    getEMASettings(): EMASettings {
        try {
            const data = localStorage.getItem(EMA_SETTINGS_KEY);
            return data ? JSON.parse(data) : {
                enabled: false,
                activeHours: { start: '09:00', end: '23:00' },
                frequency: 'medium'
            };
        } catch (error) {
            console.error('读取EMA设置失败:', error);
            return {
                enabled: false,
                activeHours: { start: '09:00', end: '23:00' },
                frequency: 'medium'
            };
        }
    },

    // 保存EMA设置
    saveEMASettings(settings: EMASettings): void {
        try {
            localStorage.setItem(EMA_SETTINGS_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error('保存EMA设置失败:', error);
        }
    }
}; 