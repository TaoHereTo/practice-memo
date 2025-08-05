import React, { useState, useEffect } from 'react';
import { Button, Dialog } from 'tdesign-mobile-react';
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
            case 'week':
                const startOfWeek = new Date(startOfDay);
                startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
                return {
                    start: startOfWeek.getTime(),
                    end: now.getTime()
                };
            case 'month':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                return {
                    start: startOfMonth.getTime(),
                    end: now.getTime()
                };
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
                color: practice.id === 'practice_1' ? '#8884d8' :
                    practice.id === 'practice_2' ? '#82ca9d' :
                        practice.id === 'practice_3' ? '#ffc658' :
                            practice.id === 'practice_4' ? '#ff7300' : '#8dd1e1'
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

    const radarData = getRadarData();
    const pieData = getPieData();
    const trendData = getTrendData();

    const handleClearAllData = () => {
        setShowClearConfirm(true);
    };

    const handleClearConfirm = () => {
        storageService.clearAllData();
        setRecords([]);
        setTotalScore(0);
        setShowClearConfirm(false);

        // 触发全局事件，通知其他组件数据已清空
        const event = new CustomEvent('dataCleared');
        window.dispatchEvent(event);
    };

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto pb-20 md:pb-6">
            {/* 时间范围选择器 */}
            <div className="card">
                <div className="card-title">时间范围</div>
                <div className="glassmorphism-tabbar">
                    <div className="flex overflow-x-auto no-scrollbar">
                        {(['today', 'week', 'month'] as const).map((range) => (
                            <Button
                                key={range}
                                theme={timeRange === range ? "primary" : "default"}
                                size="small"
                                onClick={() => setTimeRange(range)}
                                style={{
                                    flex: '1 0 auto',
                                    fontSize: '12px',
                                    padding: '8px 4px',
                                    borderRadius: '8px',
                                    margin: '0 2px',
                                    whiteSpace: 'nowrap',
                                    minWidth: '0'
                                }}
                            >
                                {range === 'today' ? '今日' : range === 'week' ? '本周' : '本月'}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 总分卡片 */}
            <div className="card">
                <div className="card-title">总得分</div>
                <div className="text-center py-4">
                    <div className="text-4xl font-bold text-blue-500">{totalScore}</div>
                    <div className="text-sm text-gray-500">分</div>
                </div>
            </div>

            {/* 图表切换 */}
            <div className="card">
                <div className="card-title">数据图表</div>
                <div className="glassmorphism-tabbar">
                    <div className="flex overflow-x-auto no-scrollbar">
                        <Button
                            theme={activeChart === 'radar' ? "primary" : "default"}
                            size="small"
                            onClick={() => setActiveChart('radar')}
                            style={{
                                flex: '1 0 auto',
                                fontSize: '12px',
                                padding: '8px 4px',
                                borderRadius: '8px',
                                margin: '0 2px',
                                whiteSpace: 'nowrap',
                                minWidth: '0'
                            }}
                        >
                            练习分布
                        </Button>
                        <Button
                            theme={activeChart === 'pie' ? "primary" : "default"}
                            size="small"
                            onClick={() => setActiveChart('pie')}
                            style={{
                                flex: '1 0 auto',
                                fontSize: '12px',
                                padding: '8px 4px',
                                borderRadius: '8px',
                                margin: '0 2px',
                                whiteSpace: 'nowrap',
                                minWidth: '0'
                            }}
                        >
                            饼状图
                        </Button>
                        <Button
                            theme={activeChart === 'trend' ? "primary" : "default"}
                            size="small"
                            onClick={() => setActiveChart('trend')}
                            style={{
                                flex: '1 0 auto',
                                fontSize: '12px',
                                padding: '8px 4px',
                                borderRadius: '8px',
                                margin: '0 2px',
                                whiteSpace: 'nowrap',
                                minWidth: '0'
                            }}
                        >
                            得分趋势
                        </Button>
                    </div>
                </div>
            </div>

            {/* 图表区域 */}
            <div className="card">
                <div className="h-80">
                    {activeChart === 'radar' && (
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={radarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="practice" />
                                <PolarRadiusAxis />
                                <Radar
                                    name="得分"
                                    dataKey="score"
                                    stroke="#0052d9"
                                    fill="#0052d9"
                                    fillOpacity={0.6}
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
                                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <RechartsCell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    )}

                    {activeChart === 'trend' && (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#0052d9"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* 清空数据按钮 */}
            <div className="card">
                <div className="button-center">
                    <Button
                        theme="danger"
                        size="large"
                        onClick={handleClearAllData}
                        className="delete-button"
                    >
                        清空所有数据
                    </Button>
                </div>
            </div>

            {/* 清空确认对话框 */}
            <Dialog
                visible={showClearConfirm}
                onClose={() => setShowClearConfirm(false)}
                title="确认清空"
                content="确定要清空所有练习记录吗？此操作不可恢复，所有数据将被永久删除。"
                confirmBtn="清空"
                cancelBtn="取消"
                onConfirm={handleClearConfirm}
            />
        </div>
    );
}; 