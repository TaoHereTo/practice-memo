// PANAS 8项评估词汇数据
export const panasItems = [
    // 积极情感 (PA) - 4项
    { key: 'excited', label: '兴奋的', type: 'positive', dimension: 'vitalityEnthusiasm' },
    { key: 'enthusiastic', label: '富有激情的', type: 'positive', dimension: 'vitalityEnthusiasm' },
    { key: 'alert', label: '敏感的', type: 'positive', dimension: 'focusEngagement' },
    { key: 'attentive', label: '专注的', type: 'positive', dimension: 'focusEngagement' },

    // 消极情感 (NA) - 4项
    { key: 'distressed', label: '心烦意乱的', type: 'negative', dimension: 'irritabilityHostility' },
    { key: 'upset', label: '烦躁的', type: 'negative', dimension: 'irritabilityHostility' },
    { key: 'nervous', label: '紧张不安的', type: 'negative', dimension: 'anxietyFear' },
    { key: 'jittery', label: '心神不宁的', type: 'negative', dimension: 'anxietyFear' }
];

// 评分说明
export const ratingLabels = [
    { value: 1, label: '完全没有' },
    { value: 2, label: '有一点' },
    { value: 3, label: '中等程度' },
    { value: 4, label: '比较多' },
    { value: 5, label: '非常多' }
];

// 维度名称映射
export const dimensionNames = {
    focusEngagement: '专注与投入',
    vitalityEnthusiasm: '活力与热情',
    confidenceStrength: '自信与力量',
    anxietyFear: '焦虑与恐惧',
    irritabilityHostility: '烦躁与敌意',
    guiltShame: '自责与羞愧'
};

// 象限名称和描述
export const quadrantInfo = {
    energetic: {
        name: '活力四射区',
        description: '高积极情感 / 低消极情感',
        color: '#10B981'
    },
    mixed: {
        name: '悲喜交加区',
        description: '高积极情感 / 高消极情感',
        color: '#F59E0B'
    },
    exhausted: {
        name: '心力交瘁区',
        description: '低积极情感 / 高消极情感',
        color: '#EF4444'
    },
    calm: {
        name: '心如止水区',
        description: '低积极情感 / 低消极情感',
        color: '#6B7280'
    }
};