import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { MessageModal } from '../ui/modal';
import type { MoodRecord, MoodType } from '../../types';
import { storageService } from '../../services/storage';

interface MoodRecordProps {
    onRecordAdded?: () => void;
}

const moodOptions: { value: MoodType; label: string; emoji: string; color: string }[] = [
    { value: 'very-happy', label: '非常开心', emoji: '😄', color: '#10B981' },
    { value: 'happy', label: '开心', emoji: '🙂', color: '#34D399' },
    { value: 'neutral', label: '一般', emoji: '😐', color: '#F59E0B' },
    { value: 'sad', label: '难过', emoji: '😔', color: '#F97316' },
    { value: 'very-sad', label: '很糟糕', emoji: '😢', color: '#EF4444' }
];

const timeOptions = [
    { value: 'morning', label: '早晨', icon: '🌅' },
    { value: 'afternoon', label: '下午', icon: '☀️' },
    { value: 'evening', label: '傍晚', icon: '🌆' },
    { value: 'night', label: '夜晚', icon: '🌙' }
];

export const MoodRecordComponent: React.FC<MoodRecordProps> = ({ onRecordAdded }) => {
    const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [note, setNote] = useState('');
    const [todayRecords, setTodayRecords] = useState<MoodRecord[]>([]);

    // 弹窗状态
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        type: 'info' as 'info' | 'success' | 'warning' | 'error'
    });

    // 获取今天的心情记录
    useEffect(() => {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        const endOfDay = startOfDay + 24 * 60 * 60 * 1000;

        const records = storageService.getMoodRecordsByTimeRange(startOfDay, endOfDay);
        setTodayRecords(records);
    }, []);

    // 自动设置当前时间段
    useEffect(() => {
        const hour = new Date().getHours();
        let timeOfDay = 'morning';

        if (hour >= 6 && hour < 12) timeOfDay = 'morning';
        else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon';
        else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
        else timeOfDay = 'night';

        setSelectedTime(timeOfDay);
    }, []);

    const handleSubmit = () => {
        if (!selectedMood || !selectedTime) {
            setModalConfig({
                title: '提示',
                message: '请选择心情和时间段',
                type: 'warning'
            });
            setShowModal(true);
            return;
        }

        const record: MoodRecord = {
            id: Date.now().toString(),
            mood: selectedMood,
            note: note.trim() || undefined,
            timestamp: Date.now(),
            timeOfDay: selectedTime
        };

        storageService.saveMoodRecord(record);

        // 重置表单
        setSelectedMood(null);
        setNote('');

        // 更新今日记录
        setTodayRecords(prev => [record, ...prev]);

        // 通知父组件
        onRecordAdded?.();

        setModalConfig({
            title: '成功',
            message: '心情记录已保存！',
            type: 'success'
        });
        setShowModal(true);
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getMoodLabel = (mood: MoodType) => {
        return moodOptions.find(option => option.value === mood)?.label || '';
    };

    const getTimeLabel = (timeOfDay: string) => {
        return timeOptions.find(option => option.value === timeOfDay)?.label || '';
    };

    return (
        <>
            <div className="space-y-6">
                {/* 心情选择 */}
                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle className="text-foreground">今天的心情如何？</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-5 gap-3">
                            {moodOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setSelectedMood(option.value)}
                                    className={`p-4 rounded-2xl border-2 mood-option ${selectedMood === option.value
                                        ? 'border-primary bg-primary/10 selected'
                                        : 'border-border hover:border-primary/50'
                                        }`}
                                    style={{ borderColor: selectedMood === option.value ? option.color : undefined }}
                                >
                                    <div className="text-3xl mb-2">{option.emoji}</div>
                                    <div className="text-xs font-medium text-foreground">{option.label}</div>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 时间选择 */}
                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle className="text-foreground">记录时间</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-4 gap-3">
                            {timeOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setSelectedTime(option.value)}
                                    className={`p-3 rounded-xl border-2 time-option ${selectedTime === option.value
                                        ? 'border-primary bg-primary/10 selected'
                                        : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{option.icon}</div>
                                    <div className="text-xs font-medium text-foreground">{option.label}</div>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 备注 */}
                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle className="text-foreground">备注（可选）</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="记录一下此刻的想法..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="custom-textarea min-h-[100px]"
                            maxLength={200}
                        />
                        <div className="text-xs text-muted mt-2 text-right">
                            {note.length}/200
                        </div>
                    </CardContent>
                </Card>

                {/* 提交按钮 */}
                <div className="button-center">
                    <Button
                        onClick={handleSubmit}
                        size="lg"
                        className="custom-button"
                        variant="default"
                        disabled={!selectedMood || !selectedTime}
                    >
                        记录心情
                    </Button>
                </div>

                {/* 今日记录 */}
                {todayRecords.length > 0 && (
                    <Card className="glassmorphism">
                        <CardHeader>
                            <CardTitle className="text-foreground">今日心情记录</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {todayRecords.map((record) => (
                                    <div key={record.id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">
                                                {moodOptions.find(option => option.value === record.mood)?.emoji}
                                            </span>
                                            <div>
                                                <div className="font-medium text-foreground">
                                                    {getMoodLabel(record.mood)}
                                                </div>
                                                <div className="text-xs text-muted">
                                                    {getTimeLabel(record.timeOfDay)} · {formatTime(record.timestamp)}
                                                </div>
                                            </div>
                                        </div>
                                        {record.note && (
                                            <div className="text-sm text-muted max-w-[150px] truncate">
                                                {record.note}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* 自定义弹窗 */}
            <MessageModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
            />
        </>
    );
}; 