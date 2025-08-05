import React, { useState, useEffect } from 'react';
import { Button, Textarea } from 'tdesign-mobile-react';
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
            <div className="text-gray-600 mb-6 text-center w-full">{content}</div>

            {/* 输入区域 */}
            <div className="space-y-4 mb-6 w-full">
                <Textarea
                    placeholder="在这里记录你的想法..."
                    value={input}
                    onChange={(value) => setInput(String(value))}
                    maxlength={500}
                    autosize={{ minRows: 4, maxRows: 8 }}
                    className="mb-4 w-full"
                    style={{ width: '100%', minWidth: '100%' }}
                />
                <div className="button-center w-full">
                    <Button
                        theme="primary"
                        size="large"
                        disabled={!input.trim()}
                        onClick={handleSubmit}
                        style={{ minWidth: '200px', width: 'auto' }}
                    >
                        记录并+1分
                    </Button>
                </div>
            </div>
        </div>
    );
}; 