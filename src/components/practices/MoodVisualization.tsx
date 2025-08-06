import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import type { DailyMoodReview, EMARecord } from '../../types';
import { storageService } from '../../services/storage';
import { quadrantInfo } from '../../data/panasData';
import { activityOptions } from '../../data/emaData';

export const MoodVisualization: React.FC = () => {
    const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
    const [dailyReviews, setDailyReviews] = useState<DailyMoodReview[]>([]);
    const [emaRecords, setEMARecords] = useState<EMARecord[]>([]);

    useEffect(() => {
        // 获取指定时间范围的数据
        const now = Date.now();
        const daysBack = timeRange === 'week' ? 7 : 30;
        const startTime = now - (daysBack * 24 * 60 * 60 * 1000);

        // 获取每日回顾数据
        const reviews = storageService.getAllDailyReviews()
            .filter(review => new Date(review.date).getTime() >= startTime)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // 获取EMA记录
        const emaData = storageService.getEMARecordsByTimeRange(startTime, now);

        setDailyReviews(reviews);
        setEMARecords(emaData);
    }, [timeRange]);

    // 计算情绪趋势数据
    const getTrendData = () => {
        return dailyReviews.map(review => ({
            date: review.date,
            pa: review.panasScores.paScore,
            na: review.panasScores.naScore,
            quadrant: review.quadrant
        }));
    };

    // 计算活动情绪分析
    const getActivityMoodAnalysis = () => {
        const activityStats: { [key: string]: { count: number; totalValence: number; totalArousal: number } } = {};

        emaRecords.forEach(record => {
            record.activities.forEach(activity => {
                if (!activityStats[activity]) {
                    activityStats[activity] = { count: 0, totalValence: 0, totalArousal: 0 };
                }
                activityStats[activity].count++;
                activityStats[activity].totalValence += record.moodValence;
                activityStats[activity].totalArousal += record.moodArousal;
            });
        });

        return Object.entries(activityStats).map(([activity, stats]) => ({
            activity,
            avgValence: stats.totalValence / stats.count,
            avgArousal: stats.totalArousal / stats.count,
            count: stats.count,
            label: activityOptions.find(opt => opt.key === activity)?.label || activity
        })).sort((a, b) => b.avgValence - a.avgValence);
    };

    // 计算象限分布
    const getQuadrantDistribution = () => {
        const distribution: { [key: string]: number } = {
            energetic: 0,
            mixed: 0,
            exhausted: 0,
            calm: 0
        };

        dailyReviews.forEach(review => {
            distribution[review.quadrant]++;
        });

        return Object.entries(distribution).map(([quadrant, count]) => ({
            quadrant,
            count,
            percentage: dailyReviews.length > 0 ? (count / dailyReviews.length) * 100 : 0,
            ...quadrantInfo[quadrant as keyof typeof quadrantInfo]
        }));
    };

    const trendData = getTrendData();
    const activityAnalysis = getActivityMoodAnalysis();
    const quadrantDistribution = getQuadrantDistribution();

    return (
        <div className="space-y-6">
            {/* 时间范围选择 */}
            <div className="flex justify-center space-x-2">
                <Button
                    onClick={() => setTimeRange('week')}
                    variant={timeRange === 'week' ? 'default' : 'outline'}
                    size="sm"
                >
                    最近一周
                </Button>
                <Button
                    onClick={() => setTimeRange('month')}
                    variant={timeRange === 'month' ? 'default' : 'outline'}
                    size="sm"
                >
                    最近一月
                </Button>
            </div>

            {/* 情绪趋势图 */}
            <Card className="glassmorphism">
                <CardHeader>
                    <CardTitle className="text-foreground">情绪趋势</CardTitle>
                </CardHeader>
                <CardContent>
                    {trendData.length > 0 ? (
                        <div className="space-y-4">
                            {/* 简化的折线图 */}
                            <div className="relative h-32 border border-gray-200 rounded-lg p-4">
                                <div className="absolute inset-0 p-4">
                                    <div className="flex items-end justify-between h-full">
                                        {trendData.map((data) => (
                                            <div key={data.date} className="flex flex-col items-center space-y-1">
                                                {/* PA柱状图 */}
                                                <div
                                                    className="w-3 bg-green-400 rounded-t"
                                                    style={{ height: `${(data.pa / 50) * 60}px` }}
                                                    title={`积极情感: ${data.pa}`}
                                                />
                                                {/* NA柱状图 */}
                                                <div
                                                    className="w-3 bg-red-400 rounded-b"
                                                    style={{ height: `${(data.na / 50) * 60}px` }}
                                                    title={`消极情感: ${data.na}`}
                                                />
                                                <div className="text-xs text-muted transform rotate-45 origin-bottom-left">
                                                    {data.date.slice(-2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center space-x-4 text-sm">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-400 rounded" />
                                    <span>积极情感</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-red-400 rounded" />
                                    <span>消极情感</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted py-8">
                            暂无每日回顾数据
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 象限分布 */}
            <Card className="glassmorphism">
                <CardHeader>
                    <CardTitle className="text-foreground">情绪状态分布</CardTitle>
                </CardHeader>
                <CardContent>
                    {quadrantDistribution.some(q => q.count > 0) ? (
                        <div className="space-y-3">
                            {quadrantDistribution.filter(q => q.count > 0).map((quad) => (
                                <div key={quad.quadrant} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: quad.color }}
                                        />
                                        <span className="text-foreground">{quad.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium">{quad.count}天</div>
                                        <div className="text-xs text-muted">{quad.percentage.toFixed(1)}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted py-8">
                            暂无数据
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 活动情绪分析 */}
            <Card className="glassmorphism">
                <CardHeader>
                    <CardTitle className="text-foreground">活动情绪分析</CardTitle>
                </CardHeader>
                <CardContent>
                    {activityAnalysis.length > 0 ? (
                        <div className="space-y-3">
                            <div className="text-sm text-muted mb-4">
                                不同活动下的平均情绪状态（按愉快度排序）
                            </div>
                            {activityAnalysis.slice(0, 6).map((activity) => (
                                <div key={activity.activity} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                                    <div>
                                        <div className="font-medium text-foreground">{activity.label}</div>
                                        <div className="text-xs text-muted">{activity.count}次记录</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm">
                                            <span className={activity.avgValence >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                {activity.avgValence >= 0 ? '😊' : '😔'} {activity.avgValence.toFixed(1)}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted">
                                            {activity.avgArousal >= 0 ? '⚡' : '😴'} {activity.avgArousal.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted py-8">
                            暂无实时捕捉数据
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 数据统计 */}
            <Card className="glassmorphism">
                <CardHeader>
                    <CardTitle className="text-foreground">数据统计</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-xl">
                            <div className="text-2xl font-bold text-blue-600">{dailyReviews.length}</div>
                            <div className="text-sm text-blue-700">每日回顾</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-xl">
                            <div className="text-2xl font-bold text-purple-600">{emaRecords.length}</div>
                            <div className="text-sm text-purple-700">实时记录</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};