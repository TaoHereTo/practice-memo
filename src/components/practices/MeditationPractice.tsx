import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import type { MeditationState, PracticeRecord } from '../../types';
import { storageService } from '../../services/storage';

interface MeditationPracticeProps {
    practiceId: string;
    title: string;
    content: string;
}

export const MeditationPractice: React.FC<MeditationPracticeProps> = ({
    practiceId,
    content
}) => {
    const [state, setState] = useState<MeditationState>({
        isRunning: false,
        startTime: null,
        duration: 0,
        remainingTime: 0
    });

    const [showDurationSelect, setShowDurationSelect] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState('5');
    const [showSuccess, setShowSuccess] = useState(false);

    // 格式化时间显示
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // 计时器效果
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (state.isRunning && state.remainingTime > 0) {
            interval = setInterval(() => {
                setState(prev => {
                    const newRemainingTime = prev.remainingTime - 1;
                    if (newRemainingTime <= 0) {
                        // 冥想完成
                        handleComplete();
                        return {
                            ...prev,
                            isRunning: false,
                            remainingTime: 0
                        };
                    }
                    return {
                        ...prev,
                        remainingTime: newRemainingTime
                    };
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [state.isRunning, state.remainingTime]);

    const handleStartMeditation = () => {
        const duration = parseInt(selectedDuration) || 5;
        setState({
            isRunning: true,
            startTime: Date.now(),
            duration: duration * 60,
            remainingTime: duration * 60
        });
        setShowDurationSelect(false);
    };

    const handlePause = () => {
        setState(prev => ({
            ...prev,
            isRunning: false
        }));
    };

    const handleResume = () => {
        setState(prev => ({
            ...prev,
            isRunning: true
        }));
    };

    const handleComplete = () => {
        if (state.duration > 0) {
            // 计算得分：每分钟1分
            const score = Math.floor(state.duration / 60);

            const record: PracticeRecord = {
                id: Date.now().toString(),
                practiceId,
                score,
                timestamp: Date.now(),
                duration: state.duration,
                meditationDuration: state.duration
            };

            storageService.saveRecord(record);

            // 重置状态
            setState({
                isRunning: false,
                startTime: null,
                duration: 0,
                remainingTime: 0
            });
        }
    };

    const handleManualComplete = () => {
        const record: PracticeRecord = {
            id: Date.now().toString(),
            practiceId,
            score: 1,
            timestamp: Date.now()
        };

        storageService.saveRecord(record);

        // 触发全局事件，通知其他组件有新记录
        const event = new CustomEvent('recordAdded', { detail: record });
        window.dispatchEvent(event);

        // 显示成功动画
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, 2000);
    };

    const handleGiveUp = () => {
        setState({
            isRunning: false,
            startTime: null,
            duration: 0,
            remainingTime: 0
        });
    };

    return (
        <div className="record-center">
            {/* 描述 */}
            <div className="text-muted-foreground mb-6 text-center">{content}</div>

            {/* 计时器显示 */}
            {state.duration > 0 && (
                <div className="mb-6">
                    <div className="text-4xl font-mono font-bold text-blue-500 mb-2 number">
                        {formatTime(state.remainingTime)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        总时长: <span className="number">{formatTime(state.duration)}</span>
                    </div>
                </div>
            )}

            {/* 控制按钮 */}
            <div className="button-center">
                {!state.isRunning && state.duration === 0 && (
                    <>
                        <Dialog open={showDurationSelect} onOpenChange={setShowDurationSelect}>
                            <DialogTrigger asChild>
                                <Button size="lg">
                                    开始冥想
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>选择心灵小憩时长</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                                            时长（分钟）
                                        </label>
                                        <Input
                                            value={selectedDuration}
                                            onChange={(e) => setSelectedDuration(e.target.value)}
                                            type="number"
                                            placeholder="请输入时长"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowDurationSelect(false)}
                                            className="flex-1"
                                        >
                                            取消
                                        </Button>
                                        <Button
                                            onClick={handleStartMeditation}
                                            className="flex-1"
                                        >
                                            开始
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Button
                            onClick={handleManualComplete}
                            disabled={showSuccess}
                            className="success-button"
                            size="lg"
                        >
                            {showSuccess ? '✓ 保存成功' : '我已完成其他心灵小憩，直接+1分'}
                        </Button>
                    </>
                )}

                {state.isRunning && (
                    <>
                        <Button
                            variant="outline"
                            onClick={handlePause}
                            size="lg"
                        >
                            暂停
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleGiveUp}
                            size="lg"
                        >
                            放弃
                        </Button>
                    </>
                )}

                {!state.isRunning && state.duration > 0 && state.remainingTime > 0 && (
                    <>
                        <Button
                            onClick={handleResume}
                            size="lg"
                        >
                            继续冥想
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleGiveUp}
                            size="lg"
                        >
                            放弃
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}; 