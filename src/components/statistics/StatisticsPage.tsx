import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '../ui/carousel';
import type { TimeRange, PracticeRecord } from '../../types';
import { storageService } from '../../services/storage';
import { practiceData } from '../../data/practiceData';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell as RechartsCell } from 'recharts';

export const StatisticsPage: React.FC = () => {
    const [timeRange, setTimeRange] = useState<TimeRange>('today');
    const [records, setRecords] = useState<PracticeRecord[]>([]);
    const [totalScore, setTotalScore] = useState(0);
    const [activeChart, setActiveChart] = useState('radar');
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    // Carousel APIs
    const [timeRangeApi, setTimeRangeApi] = useState<CarouselApi>();
    const [chartApi, setChartApi] = useState<CarouselApi>();

    // 时间范围映射
    const timeRangeIndexMap = {
        'today': 0,
        'week': 1,
        'month': 2
    };
    const indexTimeRangeMap = ['today', 'week', 'month'] as const;

    // 图表类型映射
    const chartIndexMap = {
        'radar': 0,
        'pie': 1,
        'trend': 2
    };
    const indexChartMap = ['radar', 'pie', 'trend'] as const;

    // 时间范围 carousel 同步
    useEffect(() => {
        if (timeRangeApi) {
            timeRangeApi.scrollTo(timeRangeIndexMap[timeRange]);
        }
    }, [timeRange, timeRangeApi]);

    useEffect(() => {
        if (!timeRangeApi) return;
        const onSelect = () => {
            const selectedIndex = timeRangeApi.selectedScrollSnap();
            setTimeRange(indexTimeRangeMap[selectedIndex]);
        };
        timeRangeApi.on('select', onSelect);
        return () => {
            timeRangeApi.off('select', onSelect);
        };
    }, [timeRangeApi]);

    // 图表类型 carousel 同步
    useEffect(() => {
        if (chartApi) {
            chartApi.scrollTo(chartIndexMap[activeChart as keyof typeof chartIndexMap]);
        }
    }, [activeChart, chartApi]);

    useEffect(() => {
        if (!chartApi) return;
        const onSelect = () => {
            const selectedIndex = chartApi.selectedScrollSnap();
            setActiveChart(indexChartMap[selectedIndex]);
        };
        chartApi.on('select', onSelect);
        return () => {
            chartApi.off('select', onSelect);
        };
    }, [chartApi]);

    // 获取时间范围
    const getTimeRange = (range: TimeRange) => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (range) {
            case 'today':
                return {
                    start: startOfDay.getTime(),
                    end: now.getTime()
                };
            case 'week': {
                const startOfWeek = new Date(startOfDay);
                startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
                return {
                    start: startOfWeek.getTime(),
                    end: now.getTime()
                };
            }
            case 'month': {
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                return {
                    start: startOfMonth.getTime(),
                    end: now.getTime()
                };
            }
        }
    };

    // 加载数据
    useEffect(() => {
        const { start, end } = getTimeRange(timeRange);
        const timeRangeRecords = storageService.getRecordsByTimeRange(start, end);
        setRecords(timeRangeRecords);

        const total = timeRangeRecords.reduce((sum, record) => sum + record.score, 0);
        setTotalScore(total);
    }, [timeRange]);

    // 准备雷达图数据
    const getRadarData = () => {
        return practiceData.map(practice => {
            const practiceRecords = records.filter(r => r.practiceId === practice.id);
            const score = practiceRecords.reduce((sum, r) => sum + r.score, 0);
            return {
                practice: practice.tabTitle,
                score: score
            };
        });
    };

    // 准备饼状图数据
    const getPieData = () => {
        return practiceData.map(practice => {
            const practiceRecords = records.filter(r => r.practiceId === practice.id);
            const score = practiceRecords.reduce((sum, r) => sum + r.score, 0);
            return {
                name: practice.tabTitle,
                value: score,
                color: practice.id === 'practice_1' ? '#F5FF5B' :
                    practice.id === 'practice_2' ? '#5B8EFF' :
                        practice.id === 'practice_3' ? '#5BFFC2' :
                            practice.id === 'practice_4' ? '#FF6B6B' : '#A78BFA'
            };
        }).filter(item => item.value > 0);
    };

    // 准备趋势图数据
    const getTrendData = () => {
        const { start, end } = getTimeRange(timeRange);
        const days = Math.ceil((end - start) / (24 * 60 * 60 * 1000));
        const trendData = [];

        for (let i = 0; i < days; i++) {
            const dayStart = start + i * 24 * 60 * 60 * 1000;
            const dayEnd = dayStart + 24 * 60 * 60 * 1000;
            const dayRecords = storageService.getRecordsByTimeRange(dayStart, dayEnd);
            const dayScore = dayRecords.reduce((sum, r) => sum + r.score, 0);

            const date = new Date(dayStart);
            trendData.push({
                date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
                score: dayScore
            });
        }

        return trendData;
    };

    const handleClearAllData = () => {
        setShowClearConfirm(true);
    };

    const handleClearConfirm = () => {
        storageService.clearAllData();
        setRecords([]);
        setTotalScore(0);
        setShowClearConfirm(false);
    };

    const radarData = getRadarData();
    const pieData = getPieData();
    const trendData = getTrendData();

    return (
        <div className="mobile-container content-area main-content px-4 md:px-8">
            {/* 时间范围选择器 */}
            <div className="card-container">
                <Card className="glassmorphism mb-6">
                    <CardHeader>
                        <CardTitle className="text-foreground">时间范围</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* 时间范围切换指示器 */}
                        <div className="flex justify-center space-x-2 mb-4">
                            <button
                                onClick={() => setTimeRange('today')}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${timeRange === 'today'
                                    ? 'bg-primary text-primary-foreground shadow-lg'
                                    : 'text-muted hover:text-foreground'
                                    }`}
                                style={timeRange !== 'today' ? { backgroundColor: 'rgb(231, 240, 255)' } : {}}
                            >
                                今日
                            </button>
                            <button
                                onClick={() => setTimeRange('week')}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${timeRange === 'week'
                                    ? 'bg-primary text-primary-foreground shadow-lg'
                                    : 'text-muted hover:text-foreground'
                                    }`}
                                style={timeRange !== 'week' ? { backgroundColor: 'rgb(231, 240, 255)' } : {}}
                            >
                                本周
                            </button>
                            <button
                                onClick={() => setTimeRange('month')}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${timeRange === 'month'
                                    ? 'bg-primary text-primary-foreground shadow-lg'
                                    : 'text-muted hover:text-foreground'
                                    }`}
                                style={timeRange !== 'month' ? { backgroundColor: 'rgb(231, 240, 255)' } : {}}
                            >
                                本月
                            </button>
                        </div>

                        {/* 隐藏的轮播组件用于手势支持 */}
                        <div className="opacity-0 h-0 overflow-hidden">
                            <Carousel
                                setApi={setTimeRangeApi}
                                opts={{
                                    align: "start",
                                    dragFree: false,
                                    containScroll: "trimSnaps"
                                }}
                                className="w-full"
                            >
                                <CarouselContent className="-ml-0">
                                    <CarouselItem className="pl-0"><div>今日</div></CarouselItem>
                                    <CarouselItem className="pl-0"><div>本周</div></CarouselItem>
                                    <CarouselItem className="pl-0"><div>本月</div></CarouselItem>
                                </CarouselContent>
                            </Carousel>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 总分卡片 */}
            <div className="card-container">
                <Card className="glassmorphism mb-6">
                    <CardHeader>
                        <CardTitle className="text-foreground">总得分</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6">
                            <div className="text-6xl font-bold text-foreground mb-2">{totalScore}</div>
                            <div className="text-lg text-muted">分</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 图表切换 */}
            <div className="card-container">
                <Card className="glassmorphism mb-6">
                    <CardHeader>
                        <CardTitle className="text-foreground">数据图表</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* 图表类型切换指示器 */}
                        <div className="flex justify-center space-x-2 mb-4">
                            <button
                                onClick={() => setActiveChart('radar')}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${activeChart === 'radar'
                                    ? 'bg-primary text-primary-foreground shadow-lg'
                                    : 'text-muted hover:text-foreground'
                                    }`}
                                style={activeChart !== 'radar' ? { backgroundColor: 'rgb(231, 240, 255)' } : {}}
                            >
                                练习分布
                            </button>
                            <button
                                onClick={() => setActiveChart('pie')}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${activeChart === 'pie'
                                    ? 'bg-primary text-primary-foreground shadow-lg'
                                    : 'text-muted hover:text-foreground'
                                    }`}
                                style={activeChart !== 'pie' ? { backgroundColor: 'rgb(231, 240, 255)' } : {}}
                            >
                                饼状图
                            </button>
                            <button
                                onClick={() => setActiveChart('trend')}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${activeChart === 'trend'
                                    ? 'bg-primary text-primary-foreground shadow-lg'
                                    : 'text-muted hover:text-foreground'
                                    }`}
                                style={activeChart !== 'trend' ? { backgroundColor: 'rgb(231, 240, 255)' } : {}}
                            >
                                得分趋势
                            </button>
                        </div>

                        {/* 隐藏的轮播组件用于手势支持 */}
                        <div className="opacity-0 h-0 overflow-hidden">
                            <Carousel
                                setApi={setChartApi}
                                opts={{
                                    align: "start",
                                    dragFree: false,
                                    containScroll: "trimSnaps"
                                }}
                                className="w-full"
                            >
                                <CarouselContent className="-ml-0">
                                    <CarouselItem className="pl-0"><div>练习分布</div></CarouselItem>
                                    <CarouselItem className="pl-0"><div>饼状图</div></CarouselItem>
                                    <CarouselItem className="pl-0"><div>得分趋势</div></CarouselItem>
                                </CarouselContent>
                            </Carousel>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 图表区域 */}
            <div className="card-container">
                <Card className="glassmorphism mb-6">
                    <CardContent className="p-6">
                        <div className="h-80">
                            {activeChart === 'radar' && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={radarData}>
                                        <PolarGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                                        <PolarAngleAxis
                                            dataKey="practice"
                                            tick={{ fill: '#000000', fontSize: 12, fontWeight: 500 }}
                                        />
                                        <PolarRadiusAxis
                                            tick={{ fill: '#000000', fontSize: 10 }}
                                            axisLine={false}
                                        />
                                        <Radar
                                            name="得分"
                                            dataKey="score"
                                            stroke="rgb(225, 252, 74)"
                                            strokeWidth={3}
                                            fill="rgb(225, 252, 74)"
                                            fillOpacity={0.2}
                                            dot={{ fill: 'rgb(225, 252, 74)', strokeWidth: 2, r: 4 }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            )}

                            {activeChart === 'pie' && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent, value }) =>
                                                (value || 0) > 0 ? `${name}\n${value || 0}分 (${((percent || 0) * 100).toFixed(0)}%)` : ''
                                            }
                                            outerRadius={100}
                                            innerRadius={40}
                                            fill="#8884d8"
                                            dataKey="value"
                                            paddingAngle={2}
                                        >
                                            {pieData.map((entry, index) => (
                                                <RechartsCell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                    stroke="#FFFFFF"
                                                    strokeWidth={2}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#FFFFFF',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '12px',
                                                color: '#000000',
                                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                                            }}
                                            formatter={(value, name) => [`${value}分`, name]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}

                            {activeChart === 'trend' && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trendData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fill: '#000000', fontSize: 12 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fill: '#000000', fontSize: 12 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#FFFFFF',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '12px',
                                                color: '#000000',
                                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                                            }}
                                            formatter={(value) => [`${value}分`, '得分']}
                                            labelFormatter={(label) => `日期: ${label}`}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#5BFFC2"
                                            strokeWidth={4}
                                            dot={{ fill: '#5BFFC2', strokeWidth: 2, r: 6 }}
                                            activeDot={{ r: 8, stroke: '#5BFFC2', strokeWidth: 2 }}
                                            fill="url(#gradient)"
                                        />
                                        <defs>
                                            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#5BFFC2" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#5BFFC2" stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 清空数据按钮 */}
            <div className="card-container">
                <Card className="glassmorphism">
                    <CardContent className="p-6">
                        <div className="button-center">
                            <Button
                                variant="destructive"
                                onClick={handleClearAllData}
                                size="lg"
                                className="delete-button"
                            >
                                清空所有数据
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 清空确认对话框 */}
            <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-foreground">确认清空</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            确定要清空所有练习记录吗？此操作不可恢复，所有数据将被永久删除。
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowClearConfirm(false)}
                            className="custom-button secondary"
                        >
                            取消
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleClearConfirm}
                            className="delete-button"
                        >
                            清空
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}; 