import React from 'react';

interface NavigationProps {
    currentPage: 'practice' | 'statistics' | 'mood';
    onPageChange: (page: 'practice' | 'statistics' | 'mood') => void;
}

// 练习图标组件
const PracticeIcon: React.FC<{ isSidebar?: boolean }> = ({ isSidebar = false }) => (
    <svg
        width={isSidebar ? "24" : "28"}
        height={isSidebar ? "24" : "28"}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: 'block', margin: '0 auto' }}
    >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
    </svg>
);

// 统计图标组件
const StatisticsIcon: React.FC<{ isSidebar?: boolean }> = ({ isSidebar = false }) => (
    <svg
        width={isSidebar ? "24" : "28"}
        height={isSidebar ? "24" : "28"}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: 'block', margin: '0 auto' }}
    >
        <path d="M3 3v18h18" />
        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
    </svg>
);

// 心情图标组件
const MoodIcon: React.FC<{ isSidebar?: boolean }> = ({ isSidebar = false }) => (
    <svg
        width={isSidebar ? "24" : "28"}
        height={isSidebar ? "24" : "28"}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: 'block', margin: '0 auto' }}
    >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
);

export const Navigation: React.FC<NavigationProps> = ({
    currentPage,
    onPageChange
}) => {
    return (
        <>
            {/* 移动端底部导航 */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
                <div className="bg-surface rounded-[40px] m-4 p-2 shadow-lg border border-border">
                    <div className="flex">
                        <button
                            className={`flex-1 flex flex-col items-center justify-center py-4 rounded-[32px] transition-all duration-200 ${currentPage === 'practice'
                                ? 'bg-foreground text-white shadow-lg'
                                : 'text-black hover:text-black hover:bg-accent'
                                }`}
                            onClick={() => onPageChange('practice')}
                        >
                            <PracticeIcon />
                            <span className="text-xs mt-1 font-medium">练习</span>
                        </button>
                        <button
                            className={`flex-1 flex flex-col items-center justify-center py-4 rounded-[32px] transition-all duration-200 ${currentPage === 'mood'
                                ? 'bg-foreground text-white shadow-lg'
                                : 'text-black hover:text-black hover:bg-accent'
                                }`}
                            onClick={() => onPageChange('mood')}
                        >
                            <MoodIcon />
                            <span className="text-xs mt-1 font-medium">情绪</span>
                        </button>
                        <button
                            className={`flex-1 flex flex-col items-center justify-center py-4 rounded-[32px] transition-all duration-200 ${currentPage === 'statistics'
                                ? 'bg-foreground text-white shadow-lg'
                                : 'text-black hover:text-black hover:bg-accent'
                                }`}
                            onClick={() => onPageChange('statistics')}
                        >
                            <StatisticsIcon />
                            <span className="text-xs mt-1 font-medium">统计</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 桌面端侧边栏导航 */}
            <div className="hidden md:block fixed left-0 top-0 h-full w-64 bg-surface border-r border-border">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-foreground mb-8">练习备忘录</h1>
                    <div className="space-y-3">
                        <button
                            className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${currentPage === 'practice'
                                ? 'bg-primary text-primary-foreground shadow-lg'
                                : 'text-muted hover:text-foreground hover:bg-accent'
                                }`}
                            onClick={() => onPageChange('practice')}
                        >
                            <div className="flex items-center">
                                <PracticeIcon isSidebar={true} />
                                <span className="ml-3 font-medium">练习</span>
                            </div>
                        </button>
                        <button
                            className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${currentPage === 'mood'
                                ? 'bg-primary text-primary-foreground shadow-lg'
                                : 'text-muted hover:text-foreground hover:bg-accent'
                                }`}
                            onClick={() => onPageChange('mood')}
                        >
                            <div className="flex items-center">
                                <MoodIcon isSidebar={true} />
                                <span className="ml-3 font-medium">情绪记录</span>
                            </div>
                        </button>
                        <button
                            className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${currentPage === 'statistics'
                                ? 'bg-primary text-primary-foreground shadow-lg'
                                : 'text-muted hover:text-foreground hover:bg-accent'
                                }`}
                            onClick={() => onPageChange('statistics')}
                        >
                            <div className="flex items-center">
                                <StatisticsIcon isSidebar={true} />
                                <span className="ml-3 font-medium">数据统计</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* 桌面端内容区域偏移 */}
            <div className="hidden md:block md:ml-64" />
        </>
    );
}; 