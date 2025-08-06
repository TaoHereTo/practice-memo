import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { PracticeRecord } from '../../types';
import { storageService } from '../../services/storage';
import { practiceData } from '../../data/practiceData';

interface HistoryRecordsProps {
    practiceId: string;
}

export const HistoryRecords: React.FC<HistoryRecordsProps> = ({
    practiceId
}) => {
    const [records, setRecords] = useState<PracticeRecord[]>([]);
    const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());

    const practice = practiceData.find(p => p.id === practiceId);

    // 加载历史记录
    useEffect(() => {
        const loadRecords = () => {
            const practiceRecords = storageService.getRecordsByPractice(practiceId);
            setRecords(practiceRecords.sort((a, b) => b.timestamp - a.timestamp));
        };

        loadRecords();

        // 监听新记录添加事件
        const handleRecordAdded = () => {
            loadRecords();
        };

        window.addEventListener('recordAdded', handleRecordAdded);
        return () => {
            window.removeEventListener('recordAdded', handleRecordAdded);
        };
    }, [practiceId]);

    // 删除选中的记录
    const handleDeleteSelected = () => {
        if (selectedRecords.size === 0) {
            alert('请先选择要删除的记录');
            return;
        }

        if (confirm(`确定要删除选中的 ${selectedRecords.size} 条记录吗？`)) {
            selectedRecords.forEach(recordId => {
                storageService.deleteRecord(recordId);
            });
            setSelectedRecords(new Set());
            setRecords(prev => prev.filter(record => !selectedRecords.has(record.id)));
        }
    };



    // 切换记录选择状态
    const toggleRecordSelection = (recordId: string) => {
        const newSelected = new Set(selectedRecords);
        if (newSelected.has(recordId)) {
            newSelected.delete(recordId);
        } else {
            newSelected.add(recordId);
        }
        setSelectedRecords(newSelected);
    };

    // 格式化日期
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!practice) return null;

    return (
        <Card className="glassmorphism">
            <CardHeader>
                <CardTitle className="text-foreground">{practice.tabTitle} - 历史记录</CardTitle>
            </CardHeader>
            <CardContent>
                {records.length === 0 ? (
                    <div className="text-center text-muted py-8 text-lg">
                        暂无记录
                    </div>
                ) : (
                    <>
                        {/* 操作按钮 - 只保留删除选中 */}
                        <div className="history-actions mb-6 flex gap-3 flex-wrap">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteSelected}
                                disabled={selectedRecords.size === 0}
                                className="delete-button"
                            >
                                删除选中 ({selectedRecords.size})
                            </Button>
                        </div>

                        {/* 记录列表 */}
                        <div className="space-y-4">
                            {records.map((record) => (
                                <div
                                    key={record.id}
                                    className={`history-item ${selectedRecords.has(record.id) ? 'selected' : ''}`}
                                    onClick={() => toggleRecordSelection(record.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="text-sm text-muted mb-2">
                                                {formatDate(record.timestamp)}
                                            </div>
                                            {record.content && (
                                                <div className="text-sm leading-relaxed">{record.content}</div>
                                            )}
                                            <div className="text-xs text-tertiary mt-2 font-medium">
                                                得分: {record.score}分
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedRecords.has(record.id)}
                                                onChange={() => toggleRecordSelection(record.id)}
                                                className="w-5 h-5 accent-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}; 