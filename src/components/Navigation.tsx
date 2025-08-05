import React from 'react';

interface NavigationProps {
    currentPage: 'practice' | 'statistics';
    onPageChange: (page: 'practice' | 'statistics') => void;
}

// 自定义图标组件
const CustomIcon: React.FC<{ src: string; alt: string; isSidebar?: boolean }> = ({ src, alt, isSidebar = false }) => (
    <img
        src={src}
        alt={alt}
        style={{
            width: isSidebar ? '24px' : '28px',
            height: isSidebar ? '24px' : '28px',
            display: 'block',
            margin: '0 auto'
        }}
    />
);

export const Navigation: React.FC<NavigationProps> = ({
    currentPage,
    onPageChange
}) => {
    return (
        <>
            {/* 移动端底部导航 */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                <div className="flex bg-gray-100 p-1">
                    <button
                        className={`flex-1 flex flex-col items-center justify-center py-4 rounded-xl transition-all duration-200 ${currentPage === 'practice'
                            ? 'text-blue-600 bg-white shadow-sm'
                            : 'text-gray-600 hover:text-blue-500 hover:bg-white/50'
                            }`}
                        onClick={() => onPageChange('practice')}
                    >
                        <CustomIcon src="/icon1.png" alt="练习" />
                    </button>
                    <button
                        className={`flex-1 flex flex-col items-center justify-center py-4 rounded-xl transition-all duration-200 ${currentPage === 'statistics'
                            ? 'text-blue-600 bg-white shadow-sm'
                            : 'text-gray-600 hover:text-blue-500 hover:bg-white/50'
                            }`}
                        onClick={() => onPageChange('statistics')}
                    >
                        <CustomIcon src="/icon2.png" alt="统计" />
                    </button>
                </div>
            </div>

            {/* 桌面端侧边栏导航 */}
            <div className="hidden md:block fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-gray-800 mb-8">练习备忘录</h1>
                    <div className="space-y-2">
                        <button
                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${currentPage === 'practice'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            onClick={() => onPageChange('practice')}
                        >
                            <div className="flex items-center">
                                <CustomIcon src="/icon1.png" alt="练习" isSidebar={true} />
                                <span className="ml-3">练习</span>
                            </div>
                        </button>
                        <button
                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${currentPage === 'statistics'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            onClick={() => onPageChange('statistics')}
                        >
                            <div className="flex items-center">
                                <CustomIcon src="/icon2.png" alt="统计" isSidebar={true} />
                                <span className="ml-3">数据统计</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* 桌面端内容区域偏移 */}
            <div className="hidden md:block md:ml-64" />

            {/* 移动端底部间距 */}
            <div className="md:hidden h-20" />
        </>
    );
}; 