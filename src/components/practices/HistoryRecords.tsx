import React, { useState, useEffect, useRef } from 'react';
import { Button, Tag, Checkbox, Dialog } from 'tdesign-mobile-react';
import type { PracticeRecord } from '../../types';
import { storageService } from '../../services/storage';

interface HistoryRecordsProps {
    practiceId: string;
    onRecordAdded?: (record: PracticeRecord) => void;
}

export const HistoryRecords: React.FC<HistoryRecordsProps> = ({
    practiceId,
    onRecordAdded
}) => {
    const [records, setRecords] = useState<PracticeRecord[]>([]);
    const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const checkboxRef = useRef<HTMLDivElement>(null);

    // 加载历史记录
    useEffect(() => {
        const practiceRecords = storageService.getRecordsByPractice(practiceId);
        setRecords(practiceRecords.sort((a, b) => b.timestamp - a.timestamp));
    }, [practiceId]);

    // 监听新记录添加
    useEffect(() => {
        const handleStorageChange = () => {
            const practiceRecords = storageService.getRecordsByPractice(practiceId);
            setRecords(practiceRecords.sort((a, b) => b.timestamp - a.timestamp));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [practiceId]);

    // 监听父组件传递的新记录
    useEffect(() => {
        if (onRecordAdded) {
            const handleNewRecord = (record: PracticeRecord) => {
                if (record.practiceId === practiceId) {
                    setRecords(prev => [record, ...prev]);
                }
            };

            // 这里我们需要一个全局事件监听器来捕获新记录
            const handleGlobalRecordAdded = (event: CustomEvent) => {
                const record = event.detail;
                handleNewRecord(record);
            };

            window.addEventListener('recordAdded', handleGlobalRecordAdded as EventListener);
            return () => window.removeEventListener('recordAdded', handleGlobalRecordAdded as EventListener);
        }
    }, [practiceId, onRecordAdded]);

    // 检查checkbox的DOM结构
    useEffect(() => {
        if (checkboxRef.current) {
            console.log('Checkbox DOM structure:', checkboxRef.current.innerHTML);
            console.log('Checkbox classes:', checkboxRef.current.className);
        }
    }, []);

    const handleCheckboxChange = (recordId: string, checked: boolean) => {
        const newSelected = new Set(selectedRecords);
        if (checked) {
            newSelected.add(recordId);
        } else {
            newSelected.delete(recordId);
        }
        setSelectedRecords(newSelected);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRecords(new Set(records.map(record => record.id)));
        } else {
            setSelectedRecords(new Set());
        }
    };

    const handleDeleteClick = () => {
        if (selectedRecords.size === 0) return;
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        // 从存储中删除选中的记录
        selectedRecords.forEach(recordId => {
            storageService.deleteRecord(recordId);
        });

        // 从本地状态中移除选中的记录
        setRecords(prev => prev.filter(record => !selectedRecords.has(record.id)));
        setSelectedRecords(new Set());
        setShowDeleteConfirm(false);
    };

    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('zh-CN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (records.length === 0) {
        return null;
    }

    return (
        <>
            <div className="card w-full">
                <div className="flex justify-between items-center mb-4">
                    <div className="card-title">历史记录</div>
                    <div className="flex items-center gap-3">
                        <div ref={checkboxRef}>
                            <Checkbox
                                checked={selectedRecords.size === records.length && records.length > 0}
                                indeterminate={selectedRecords.size > 0 && selectedRecords.size < records.length}
                                onChange={handleSelectAll}
                                size="small"
                            >
                                全选
                            </Checkbox>
                        </div>
                        <Button
                            theme="danger"
                            size="small"
                            onClick={handleDeleteClick}
                            disabled={selectedRecords.size === 0}
                            className="delete-button"
                        >
                            {selectedRecords.size === 0 ? '删除' : `删除(${selectedRecords.size})`}
                        </Button>
                    </div>
                </div>
                <div className="space-y-0 max-h-60 overflow-y-auto w-full">
                    {records.map((record, index) => (
                        <div
                            key={record.id}
                            className={`history-item w-full ${selectedRecords.has(record.id) ? 'selected' : ''}`}
                        >
                            <div className="flex items-center gap-1 py-1">
                                <div className="flex-shrink-0">
                                    <Checkbox
                                        checked={selectedRecords.has(record.id)}
                                        onChange={(checked) => handleCheckboxChange(record.id, checked)}
                                        size="small"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-gray-500 number">
                                            {formatDate(record.timestamp)}
                                        </span>
                                        <Tag theme="primary" variant="light" className="flex-shrink-0">
                                            +<span className="number">{record.score}</span>分
                                        </Tag>
                                    </div>
                                    <p className="text-sm text-gray-800 break-words">{record.content}</p>
                                </div>
                            </div>
                            {index < records.length - 1 && <div className="divider my-0" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* 删除确认对话框 */}
            <Dialog
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="确认删除"
                content={`确定要删除选中的 ${selectedRecords.size} 条记录吗？此操作不可恢复。`}
                confirmBtn="删除"
                cancelBtn="取消"
                onConfirm={handleDeleteConfirm}
                theme="danger"
            />
        </>
    );
}; 