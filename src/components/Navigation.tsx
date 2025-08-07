import React, { useState, useEffect } from 'react';
import { Dock, DockIcon } from './magicui/dock';

interface NavigationProps {
    currentPage: 'practice' | 'statistics' | 'mood';
    onPageChange: (page: 'practice' | 'statistics' | 'mood') => void;
}

// 练习图标组件
const PracticeIcon: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => (
    <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isActive ? "white" : "currentColor"}
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
const StatisticsIcon: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => (
    <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isActive ? "white" : "currentColor"}
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
const MoodIcon: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => (
    <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isActive ? "white" : "currentColor"}
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
    const [activeIndex, setActiveIndex] = useState(() => {
        switch (currentPage) {
            case 'practice': return 0;
            case 'mood': return 1;
            case 'statistics': return 2;
            default: return 0;
        }
    });

    const navItems = [
        { key: 'practice', label: '练习', icon: PracticeIcon },
        { key: 'mood', label: '情绪', icon: MoodIcon },
        { key: 'statistics', label: '统计', icon: StatisticsIcon }
    ];

    const handleNavClick = (index: number, page: 'practice' | 'statistics' | 'mood') => {
        if (index === activeIndex) return;
        setActiveIndex(index);
        onPageChange(page);
    };

    useEffect(() => {
        // 同步外部页面变化
        const newIndex = navItems.findIndex(item => item.key === currentPage);
        if (newIndex !== -1 && newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    }, [currentPage]);

    return (
        <>
            {/* 移动端底部导航 - 使用Dock组件 */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
                <div className="relative bg-white/80 backdrop-blur-xl rounded-[40px] m-4 p-4 shadow-lg border border-gray-200">
                    <Dock
                        className="bg-transparent border-none shadow-none gap-6"
                        iconSize={60}
                        iconMagnification={70}
                        iconDistance={150}
                    >
                        {navItems.map((item, index) => {
                            const IconComponent = item.icon;
                            const isActive = index === activeIndex;

                            return (
                                <DockIcon
                                    key={item.key}
                                    className={`transition-all duration-300 ${isActive
                                            ? 'bg-black text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-100'
                                        } border border-gray-200 shadow-sm`}
                                    onClick={() => handleNavClick(index, item.key as 'practice' | 'statistics' | 'mood')}
                                >
                                    <div className="flex flex-col items-center justify-center">
                                        <IconComponent isActive={isActive} />
                                        <span className={`text-sm mt-2 font-medium ${isActive ? 'text-white' : 'text-gray-600'
                                            }`}>
                                            {item.label}
                                        </span>
                                    </div>
                                </DockIcon>
                            );
                        })}
                    </Dock>
                </div>
            </div>

            {/* 桌面端侧边栏导航 */}
            <div className="hidden md:block fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-black mb-8">练习备忘录</h1>
                    <div className="space-y-3">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            const isActive = item.key === currentPage;

                            return (
                                <button
                                    key={item.key}
                                    className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${isActive
                                            ? 'bg-green-400 text-black shadow-lg'
                                            : 'text-gray-600 hover:text-black hover:bg-gray-100'
                                        }`}
                                    onClick={() => onPageChange(item.key as 'practice' | 'statistics' | 'mood')}
                                >
                                    <div className="flex items-center">
                                        <IconComponent isActive={isActive} />
                                        <span className="ml-3 font-medium">{item.label}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 桌面端内容区域偏移 */}
            <div className="hidden md:block md:ml-64" />
        </>
    );
}; 