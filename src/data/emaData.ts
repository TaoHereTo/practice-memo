// EMA实时情绪捕捉的选项数据

// 活动选项
export const activityOptions = [
    { key: 'work_study', label: '工作/学习', icon: '💼' },
    { key: 'commute', label: '通勤/路上', icon: '🚗' },
    { key: 'eating', label: '吃饭/喝水', icon: '🍽️' },
    { key: 'housework', label: '家务/杂事', icon: '🧹' },
    { key: 'leisure', label: '休闲/娱乐', icon: '🎮' },
    { key: 'social', label: '社交/聊天', icon: '💬' },
    { key: 'exercise', label: '运动', icon: '🏃' },
    { key: 'rest', label: '休息/发呆', icon: '😴' }
];

// 社交环境选项
export const socialContextOptions = [
    { key: 'alone', label: '独自一人', icon: '🧘' },
    { key: 'with_partner', label: '和伴侣', icon: '💑' },
    { key: 'with_family_friends', label: '和家人/朋友', icon: '👨‍👩‍👧‍👦' },
    { key: 'with_colleagues', label: '和同事/同学', icon: '👔' },
    { key: 'in_crowd', label: '在人群中', icon: '👥' }
];

// 情绪关键词选项（备选方案）
export const moodKeywords = [
    { key: 'happy', label: '开心', color: '#10B981' },
    { key: 'calm', label: '平静', color: '#6B7280' },
    { key: 'focused', label: '专注', color: '#3B82F6' },
    { key: 'tired', label: '疲惫', color: '#F59E0B' },
    { key: 'anxious', label: '焦虑', color: '#EF4444' },
    { key: 'irritated', label: '烦躁', color: '#DC2626' }
];

// EMA提醒频率设置
export const frequencySettings = {
    low: { count: 3, label: '低频 (3次/天)' },
    medium: { count: 5, label: '中频 (5次/天)' },
    high: { count: 8, label: '高频 (8次/天)' }
};

// 生成随机提醒时间
export function generateRandomTimes(
    startHour: number,
    endHour: number,
    count: number
): number[] {
    const times: number[] = [];
    const totalMinutes = (endHour - startHour) * 60;
    const interval = totalMinutes / count;

    for (let i = 0; i < count; i++) {
        // 在每个时间段内随机选择一个时间点
        const baseMinutes = i * interval;
        const randomOffset = Math.random() * interval * 0.8; // 80%的随机范围，避免过于接近边界
        const totalMinutesFromStart = baseMinutes + randomOffset;

        const hour = Math.floor(totalMinutesFromStart / 60) + startHour;
        const minute = Math.floor(totalMinutesFromStart % 60);

        // 转换为时间戳（今天的这个时间）
        const today = new Date();
        const timeToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, minute);
        times.push(timeToday.getTime());
    }

    return times.sort((a, b) => a - b);
}