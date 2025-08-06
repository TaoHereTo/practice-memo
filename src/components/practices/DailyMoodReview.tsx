import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Slider } from '../ui/slider';
import type { DailyMoodReview } from '../../types';
import { panasItems, ratingLabels, quadrantInfo, dimensionNames } from '../../data/panasData';
import { EmotionAnalysisService } from '../../services/emotionAnalysis';
import { generateRecommendations } from '../../data/recommendations';
import { storageService } from '../../services/storage';

export const DailyMoodReviewComponent: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [scores, setScores] = useState<{ [key: string]: number }>({});
    const [isCompleted, setIsCompleted] = useState(false);
    const [todayReview, setTodayReview] = useState<DailyMoodReview | null>(null);

    const today = new Date().toISOString().split('T')[0];

    // 检查今日是否已完成评估
    useEffect(() => {
        const existingReview = storageService.getDailyReviewByDate(today);
        if (existingReview) {
            setTodayReview(existingReview);
            setIsCompleted(true);
        }
    }, [today]);

    // 处理评分变化
    const handleScoreChange = (itemKey: string, score: number) => {
        setScores(prev => ({
            ...prev,
            [itemKey]: score
        }));

        // 添加数字变化动效
        const scoreElement = document.querySelector(`[data-score="${itemKey}"]`);
        if (scoreElement) {
            scoreElement.classList.add('changed');
            setTimeout(() => {
                scoreElement.classList.remove('changed');
            }, 400);
        }
    };

    // 提交评估
    const handleSubmit = () => {
        // 计算PANAS指标
        const panasScores = EmotionAnalysisService.calculatePANASScores(scores);

        // 判定象限
        const quadrant = EmotionAnalysisService.determineQuadrant(panasScores.paScore, panasScores.naScore);

        // 找出主导维度
        const dominantPositive = EmotionAnalysisService.getDominantPositiveDimension(panasScores);
        const dominantNegative = EmotionAnalysisService.getDominantNegativeDimension(panasScores);

        // 生成建议
        const recommendations = generateRecommendations(quadrant, dominantPositive, dominantNegative);

        // 创建每日回顾记录
        const review: DailyMoodReview = {
            id: `review_${today}_${Date.now()}`,
            date: today,
            panasScores,
            quadrant,
            dominantPositive,
            dominantNegative,
            recommendations,
            timestamp: Date.now()
        };

        // 保存到本地存储
        storageService.saveDailyReview(review);

        setTodayReview(review);
        setIsCompleted(true);
        setCurrentStep(0);
    };

    // 重新评估
    const handleRetake = () => {
        setIsCompleted(false);
        setTodayReview(null);
        setScores({});
        setCurrentStep(0);
    };

    // 如果已完成评估，显示结果
    if (isCompleted && todayReview) {
        return (
            <div className="space-y-6">
                {/* 情绪总览 */}
                <div className="card-container">
                    <Card className="glassmorphism">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center justify-between">
                                今日情绪总览
                                <Button
                                    onClick={handleRetake}
                                    variant="outline"
                                    size="sm"
                                    className="text-sm"
                                >
                                    重新评估
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center mb-6">
                                <div
                                    className="inline-block px-6 py-3 rounded-full text-white font-medium mb-4 animate-slide-in shadow-lg hover:shadow-xl transition-shadow duration-300"
                                    style={{ backgroundColor: quadrantInfo[todayReview.quadrant].color }}
                                >
                                    {quadrantInfo[todayReview.quadrant].name}
                                </div>
                                <p className="text-sm text-muted mb-4">
                                    {quadrantInfo[todayReview.quadrant].description}
                                </p>
                                <p className="text-foreground leading-relaxed">
                                    {EmotionAnalysisService.generateEmotionReport(
                                        todayReview.quadrant,
                                        todayReview.dominantPositive,
                                        todayReview.dominantNegative
                                    )}
                                </p>
                            </div>

                            {/* 情绪指标 */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="text-center p-4 bg-green-50 rounded-xl">
                                    <div className="text-2xl font-bold text-green-600">
                                        {todayReview.panasScores.paScore}
                                    </div>
                                    <div className="text-sm text-green-700">积极情感</div>
                                </div>
                                <div className="text-center p-4 bg-red-50 rounded-xl">
                                    <div className="text-2xl font-bold text-red-600">
                                        {todayReview.panasScores.naScore}
                                    </div>
                                    <div className="text-sm text-red-700">消极情感</div>
                                </div>
                            </div>

                            {/* 细分维度 */}
                            <div className="space-y-2 mb-6">
                                <h4 className="font-medium text-foreground">情绪构成详情</h4>
                                <div className="text-sm text-muted">
                                    <p>主导积极维度: <span className="font-medium text-green-600">
                                        {dimensionNames[todayReview.dominantPositive as keyof typeof dimensionNames]}
                                    </span></p>
                                    <p>主导消极维度: <span className="font-medium text-red-600">
                                        {dimensionNames[todayReview.dominantNegative as keyof typeof dimensionNames]}
                                    </span></p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 今日宜忌 */}
                <div className="card-container">
                    <Card className="glassmorphism">
                        <CardHeader>
                            <CardTitle className="text-foreground">今日宜忌</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {todayReview.recommendations.map((rec, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-xl transition-all duration-300 hover:scale-102 hover:shadow-md animate-slide-in ${rec.startsWith('宜👍')
                                            ? 'bg-green-50 border-l-4 border-green-400 hover:bg-green-100'
                                            : 'bg-red-50 border-l-4 border-red-400 hover:bg-red-100'
                                            }`}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <p className="text-sm text-foreground leading-relaxed">{rec}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        );
    }

    // 评估界面
    const itemsPerStep = 4;
    const totalSteps = Math.ceil(panasItems.length / itemsPerStep);
    const currentItems = panasItems.slice(currentStep * itemsPerStep, (currentStep + 1) * itemsPerStep);
    const progress = ((currentStep + 1) / totalSteps) * 100;

    return (
        <div className="space-y-6">
            {/* 进度指示器 */}
            <div className="card-container">
                <Card className="glassmorphism">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">
                                评估进度: {currentStep + 1} / {totalSteps}
                            </span>
                            <span className="text-sm text-muted">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-primary h-2 rounded-full progress-bar"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 评估说明 */}
            <div className="card-container">
                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle className="text-foreground">每日情绪回顾</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted mb-4">
                            请根据今天一整天的感受，对以下词语进行评分：
                        </p>
                        <div className="flex justify-between text-xs text-center mb-4 px-2">
                            {ratingLabels.map((label) => (
                                <div key={label.value} className="text-muted flex-1">
                                    <div className="font-medium">{label.value}</div>
                                    <div className="text-xs">{label.label}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 当前步骤的评估项目 */}
            <div className="card-container">
                <Card className="glassmorphism">
                    <CardContent className="pt-6">
                        <div className="space-y-8">
                            {currentItems.map((item) => (
                                <div key={item.key} className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="font-medium text-foreground text-lg">
                                            {item.label}
                                        </label>
                                        <span
                                            className="text-lg font-bold text-primary score-number"
                                            data-score={item.key}
                                        >
                                            {scores[item.key] || 1}
                                        </span>
                                    </div>
                                    <div className="px-2">
                                        <Slider
                                            value={scores[item.key] || 1}
                                            onChange={(value) => handleScoreChange(item.key, value)}
                                            min={1}
                                            max={5}
                                            step={1}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 导航按钮 */}
            <div className="flex justify-between">
                <Button
                    onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                    disabled={currentStep === 0}
                    variant="outline"
                >
                    上一步
                </Button>

                {currentStep === totalSteps - 1 ? (
                    <Button
                        onClick={handleSubmit}
                        disabled={panasItems.some(item => !scores[item.key])}
                        className="custom-button"
                    >
                        完成评估
                    </Button>
                ) : (
                    <Button
                        onClick={() => setCurrentStep(prev => prev + 1)}
                        disabled={currentItems.some(item => !scores[item.key])}
                        className="custom-button"
                    >
                        下一步
                    </Button>
                )}
            </div>
        </div>
    );
};