import type { PracticeRecord } from '../types';

const STORAGE_KEY = 'practice_memo_records';

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
    }
}; 