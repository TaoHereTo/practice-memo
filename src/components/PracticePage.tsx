import React, { useState } from 'react';
import { Button } from 'tdesign-mobile-react';
import { PhoneAwayPractice } from './practices/PhoneAwayPractice';
import { TextInputPractice } from './practices/TextInputPractice';
import { MeditationPractice } from './practices/MeditationPractice';
import { HistoryRecords } from './practices/HistoryRecords';
import { practiceData } from '../data/practiceData';
import type { PracticeRecord } from '../types';

export const PracticePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('practice_1');

    // 监听新记录添加
    const handleRecordAdded = (record: PracticeRecord) => {
        // 记录已添加，这里可以触发其他逻辑
        console.log('新记录已添加:', record);
    };

    const renderPracticeContent = () => {
        const practice = practiceData.find(p => p.id === activeTab);
        if (!practice) return null;

        if (practice.id === 'practice_1') {
            return (
                <PhoneAwayPractice
                    practiceId={practice.id}
                    title={practice.title}
                    content={practice.content}
                />
            );
        } else if (['practice_2', 'practice_3', 'practice_4'].includes(practice.id)) {
            return (
                <TextInputPractice
                    practiceId={practice.id}
                    title={practice.title}
                    content={practice.content}
                    onRecordAdded={handleRecordAdded}
                />
            );
        } else if (practice.id === 'practice_5') {
            return (
                <MeditationPractice
                    practiceId={practice.id}
                    title={practice.title}
                    content={practice.content}
                />
            );
        }
        return null;
    };

    return (
        <div className="mobile-container content-area main-content pb-20 md:pb-6">
            {/* 顶部标题区 */}
            <div className="card">
                <div className="main-title">练习备忘录</div>
                <div className="text-center text-gray-600 leading-relaxed">
                    专注于漫长的、普通的日常，沉下心做好眼前最具体的事，然后，静待水到渠成。
                </div>
            </div>

            {/* 练习内容卡片 */}
            <div className="card">
                {/* 练习切换按钮 */}
                <div className="glassmorphism-tabbar mb-6">
                    <div className="flex overflow-x-auto no-scrollbar">
                        {practiceData.map((practice) => (
                            <Button
                                key={practice.id}
                                theme={activeTab === practice.id ? "primary" : "default"}
                                size="small"
                                onClick={() => setActiveTab(practice.id)}
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
                                {practice.tabTitle}
                            </Button>
                        ))}
                    </div>
                </div>
                {/* 练习内容 */}
                {renderPracticeContent()}
            </div>

            {/* 历史记录卡片 - 独立渲染 */}
            {['practice_2', 'practice_3', 'practice_4'].includes(activeTab) && (
                <HistoryRecords
                    practiceId={activeTab}
                    onRecordAdded={handleRecordAdded}
                />
            )}
        </div>
    );
}; 