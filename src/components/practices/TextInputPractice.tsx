import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import type { PracticeRecord } from '../../types';
import { storageService } from '../../services/storage';

interface TextInputPracticeProps {
    practiceId: string;
    title: string;
    content: string;
    onRecordAdded?: (record: PracticeRecord) => void;
}

export const TextInputPractice: React.FC<TextInputPracticeProps> = ({
    practiceId,
    content,
    onRecordAdded
}) => {
    const [input, setInput] = useState('');

    const handleSubmit = () => {
        if (input.trim()) {
            const record: PracticeRecord = {
                id: Date.now().toString(),
                practiceId,
                content: input.trim(),
                score: 1,
                timestamp: Date.now()
            };

            storageService.saveRecord(record);
            setInput('');

            // 通知父组件有新记录添加
            if (onRecordAdded) {
                onRecordAdded(record);
            }

            // 触发全局事件，通知其他组件有新记录
            const event = new CustomEvent('recordAdded', { detail: record });
            window.dispatchEvent(event);
        }
    };

    return (
        <div className="record-center w-full">
            {/* 描述 */}
            <div className="text-muted mb-6 text-center w-full text-lg leading-relaxed">{content}</div>

            {/* 输入区域 */}
            <div className="space-y-6 mb-6 w-full">
                <Textarea
                    placeholder="在这里记录你的想法..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    maxLength={500}
                    className="mb-4 w-full min-h-[120px] custom-textarea"
                />
                <div className="button-center w-full">
                    <Button
                        onClick={handleSubmit}
                        disabled={!input.trim()}
                        className="min-w-[200px] success-button"
                        variant="tertiary"
                    >
                        记录并+1分
                    </Button>
                </div>
            </div>
        </div>
    );
}; 