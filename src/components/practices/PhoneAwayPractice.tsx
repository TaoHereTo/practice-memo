import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import type { PhoneAwayState, PracticeRecord } from '../../types';
import { storageService } from '../../services/storage';

interface PhoneAwayPracticeProps {
    practiceId: string;
    title: string;
    content: string;
}

export const PhoneAwayPractice: React.FC<PhoneAwayPracticeProps> = ({
    practiceId,
    content
}) => {
    const [state, setState] = useState<PhoneAwayState>({
        isRunning: false,
        startTime: null,
        pausedTime: 0,
        totalTime: 0
    });

    const [displayTime, setDisplayTime] = useState('00:00:00');
    const [todayScore, setTodayScore] = useState(0);

    // 格式化时间显示
    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // 计算今日得分
    useEffect(() => {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        const endOfDay = startOfDay + 24 * 60 * 60 * 1000;

        const todayRecords = storageService.getRecordsByTimeRange(startOfDay, endOfDay);
        const score = todayRecords
            .filter(record => record.practiceId === practiceId)
            .reduce((sum, record) => sum + record.score, 0);

        setTodayScore(score);
    }, [practiceId]);

    // 计时器效果
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (state.isRunning && state.startTime) {
            interval = setInterval(() => {
                const currentTime = Date.now();
                const elapsed = Math.floor((currentTime - state.startTime!) / 1000) + state.pausedTime;
                setDisplayTime(formatTime(elapsed));
                setState(prev => ({ ...prev, totalTime: elapsed }));
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [state.isRunning, state.startTime, state.pausedTime]);

    const handleStart = () => {
        setState({
            isRunning: true,
            startTime: Date.now(),
            pausedTime: state.pausedTime,
            totalTime: state.totalTime
        });
    };

    const handlePause = () => {
        if (state.isRunning && state.startTime) {
            const currentTime = Date.now();
            const elapsed = Math.floor((currentTime - state.startTime) / 1000);
            const newPausedTime = state.pausedTime + elapsed;

            setState({
                isRunning: false,
                startTime: null,
                pausedTime: newPausedTime,
                totalTime: state.totalTime
            });
        }
    };

    const handleComplete = () => {
        if (state.totalTime > 0) {
            // 计算得分：每分钟1分
            const score = Math.floor(state.totalTime / 60);

            const record: PracticeRecord = {
                id: Date.now().toString(),
                practiceId,
                score,
                timestamp: Date.now(),
                duration: state.totalTime
            };

            storageService.saveRecord(record);

            // 重置状态
            setState({
                isRunning: false,
                startTime: null,
                pausedTime: 0,
                totalTime: 0
            });
            setDisplayTime('00:00:00');

            // 更新今日得分
            setTodayScore(prev => prev + score);
        }
    };

    return (
        <div className="record-center">
            {/* 描述 */}
            <div className="text-muted mb-6 text-center text-lg leading-relaxed">{content}</div>

            {/* 计时器显示 */}
            <div className="text-6xl font-mono font-bold text-foreground mb-3">
                {displayTime}
            </div>
            <div className="text-sm text-muted mb-6">
                今日累计得分: <span className="text-tertiary font-medium">{todayScore}</span>分
            </div>

            {/* 控制按钮 */}
            <div className="button-center">
                {!state.isRunning ? (
                    <Button
                        onClick={handleStart}
                        size="lg"
                        className="custom-button"
                        variant="default"
                    >
                        {state.totalTime > 0 ? '继续远离' : '开始远离'}
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        onClick={handlePause}
                        size="lg"
                        className="custom-button secondary"
                    >
                        暂停
                    </Button>
                )}

                {state.totalTime > 0 && (
                    <Button
                        onClick={handleComplete}
                        size="lg"
                        className="success-button"
                        variant="tertiary"
                    >
                        完成并记录
                    </Button>
                )}
            </div>
        </div>
    );
}; 