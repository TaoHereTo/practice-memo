import type { PANASScores, EmotionQuadrant } from '../types';
import { panasItems, dimensionNames } from '../data/panasData';

// PANAS评分计算服务
export class EmotionAnalysisService {
    // 计算PANAS各项指标
    static calculatePANASScores(rawScores: { [key: string]: number }): PANASScores {
        // 计算积极情感总分 (PA)
        const positiveItems = panasItems.filter(item => item.type === 'positive');
        const paScore = positiveItems.reduce((sum, item) => sum + (rawScores[item.key] || 0), 0);

        // 计算消极情感总分 (NA)
        const negativeItems = panasItems.filter(item => item.type === 'negative');
        const naScore = negativeItems.reduce((sum, item) => sum + (rawScores[item.key] || 0), 0);

        // 计算六个细分维度
        const dimensions = {
            focusEngagement: this.calculateDimensionScore(rawScores, 'focusEngagement'),
            vitalityEnthusiasm: this.calculateDimensionScore(rawScores, 'vitalityEnthusiasm'),
            confidenceStrength: this.calculateDimensionScore(rawScores, 'confidenceStrength'),
            anxietyFear: this.calculateDimensionScore(rawScores, 'anxietyFear'),
            irritabilityHostility: this.calculateDimensionScore(rawScores, 'irritabilityHostility'),
            guiltShame: this.calculateDimensionScore(rawScores, 'guiltShame')
        };

        return {
            rawScores,
            paScore,
            naScore,
            ...dimensions
        };
    }

    // 计算单个维度得分
    private static calculateDimensionScore(rawScores: { [key: string]: number }, dimension: string): number {
        const items = panasItems.filter(item => item.dimension === dimension);
        return items.reduce((sum, item) => sum + (rawScores[item.key] || 0), 0);
    }

    // 判定情绪象限
    static determineQuadrant(paScore: number, naScore: number): EmotionQuadrant {
        const paThreshold = 30; // 以30分为分界线
        const naThreshold = 30;

        if (paScore >= paThreshold && naScore < naThreshold) {
            return 'energetic'; // 活力四射区
        } else if (paScore >= paThreshold && naScore >= naThreshold) {
            return 'mixed'; // 悲喜交加区
        } else if (paScore < paThreshold && naScore >= naThreshold) {
            return 'exhausted'; // 心力交瘁区
        } else {
            return 'calm'; // 心如止水区
        }
    }

    // 找出主导的积极维度
    static getDominantPositiveDimension(scores: PANASScores): string {
        const positiveDimensions = {
            focusEngagement: scores.focusEngagement,
            vitalityEnthusiasm: scores.vitalityEnthusiasm,
            confidenceStrength: scores.confidenceStrength
        };

        return Object.keys(positiveDimensions).reduce((a, b) =>
            positiveDimensions[a as keyof typeof positiveDimensions] >
                positiveDimensions[b as keyof typeof positiveDimensions] ? a : b
        );
    }

    // 找出主导的消极维度
    static getDominantNegativeDimension(scores: PANASScores): string {
        const negativeDimensions = {
            anxietyFear: scores.anxietyFear,
            irritabilityHostility: scores.irritabilityHostility,
            guiltShame: scores.guiltShame
        };

        return Object.keys(negativeDimensions).reduce((a, b) =>
            negativeDimensions[a as keyof typeof negativeDimensions] >
                negativeDimensions[b as keyof typeof negativeDimensions] ? a : b
        );
    }

    // 生成情绪报告描述
    static generateEmotionReport(quadrant: EmotionQuadrant, dominantPositive: string, dominantNegative: string): string {
        const positiveLabel = dimensionNames[dominantPositive as keyof typeof dimensionNames];
        const negativeLabel = dimensionNames[dominantNegative as keyof typeof dimensionNames];

        switch (quadrant) {
            case 'energetic':
                return `今天你处于活力四射的状态，主要体现在${positiveLabel}方面。这是一个充满正能量的时期，适合进行各种挑战和创造性活动。`;

            case 'mixed':
                return `今天你的情绪比较复杂，既有${positiveLabel}的积极能量，也伴随着${negativeLabel}的困扰。这种状态需要你巧妙地平衡和转化情绪能量。`;

            case 'exhausted':
                return `今天你可能感到心力交瘁，主要困扰来自${negativeLabel}。这是一个需要自我关怀和温柔对待自己的时期，首要任务是恢复能量。`;

            case 'calm':
                return `今天你处于相对平静的状态。这是一个很好的休养生息时期，适合进行反思、规划和为下一次起飞做准备。`;

            default:
                return '今天的情绪状态比较平衡，适合进行常规的活动和任务。';
        }
    }
}