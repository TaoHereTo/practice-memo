import React, { useState } from 'react';
import { DailyMoodReviewComponent } from './DailyMoodReview';
import { EMACapture } from './EMACapture';
import { MoodVisualization } from './MoodVisualization';

export const MoodPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('daily-review');

    return (
        <div className="mobile-container content-area main-content px-4 md:px-8">
            {/* 顶部标题区 */}
            <div className="text-center mb-6">
                <h1 className="main-title text-foreground mb-2">高级情绪洞察</h1>
                <p className="text-muted leading-relaxed">
                    深度洞察情绪变化，发现内心的真实状态
                </p>
            </div>

            {/* 情绪功能切换指示器 */}
            <div className="flex justify-center space-x-2 mb-6">
                <button
                    onClick={() => setActiveTab('daily-review')}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${activeTab === 'daily-review'
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'text-muted hover:text-foreground'
                        }`}
                    style={activeTab !== 'daily-review' ? { backgroundColor: 'rgb(231, 240, 255)' } : {}}
                >
                    每日回顾
                </button>
                <button
                    onClick={() => setActiveTab('ema-capture')}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${activeTab === 'ema-capture'
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'text-muted hover:text-foreground'
                        }`}
                    style={activeTab !== 'ema-capture' ? { backgroundColor: 'rgb(231, 240, 255)' } : {}}
                >
                    实时捕捉
                </button>
                <button
                    onClick={() => setActiveTab('visualization')}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${activeTab === 'visualization'
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'text-muted hover:text-foreground'
                        }`}
                    style={activeTab !== 'visualization' ? { backgroundColor: 'rgb(231, 240, 255)' } : {}}
                >
                    数据洞察
                </button>
            </div>

            {/* 内容区域 */}
            {activeTab === 'daily-review' && <DailyMoodReviewComponent />}
            {activeTab === 'ema-capture' && <EMACapture />}
            {activeTab === 'visualization' && <MoodVisualization />}
        </div>
    );
}; 