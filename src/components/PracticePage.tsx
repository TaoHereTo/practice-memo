import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from './ui/carousel';
import { PhoneAwayPractice } from './practices/PhoneAwayPractice';
import { TextInputPractice } from './practices/TextInputPractice';
import { MeditationPractice } from './practices/MeditationPractice';
import { EMACapture } from './practices/EMACapture';
import { HistoryRecords } from './practices/HistoryRecords';
import { practiceData } from '../data/practiceData';
import type { PracticeRecord } from '../types';

export const PracticePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('practice_1');
    const [api, setApi] = useState<CarouselApi>();

    // 页面索引映射
    const practiceIndexMap = practiceData.reduce((map, practice, index) => {
        map[practice.id] = index;
        return map;
    }, {} as Record<string, number>);

    const indexPracticeMap = practiceData.map(practice => practice.id);

    // 当 activeTab 改变时，滚动到对应的轮播项
    useEffect(() => {
        if (api) {
            api.scrollTo(practiceIndexMap[activeTab]);
        }
    }, [activeTab, api]);

    // 当轮播项改变时，更新当前页面状态
    useEffect(() => {
        if (!api) return;

        const onSelect = () => {
            const selectedIndex = api.selectedScrollSnap();
            setActiveTab(indexPracticeMap[selectedIndex]);
        };

        api.on('select', onSelect);
        return () => {
            api.off('select', onSelect);
        };
    }, [api]);

    // 监听新记录添加
    const handleRecordAdded = (record: PracticeRecord) => {
        // 记录已添加，这里可以触发其他逻辑
        console.log('新记录已添加:', record);
    };



    return (
        <div className="mobile-container content-area main-content px-2 md:px-8">
            {/* 顶部标题区 */}
            <div className="card-container">
                <Card className="glassmorphism mb-6">
                    <CardHeader className="text-center">
                        <CardTitle className="main-title text-foreground">练习备忘录</CardTitle>
                        <p className="text-muted leading-relaxed text-lg">
                            专注于漫长的、普通的日常，沉下心做好眼前最具体的事，然后，静待水到渠成。
                        </p>
                    </CardHeader>
                </Card>
            </div>

            {/* 练习内容卡片 */}
            <div className="card-container">
                <Card className="glassmorphism mb-6">
                    <CardContent className="p-4 md:p-6">
                        {/* 练习切换指示器 */}
                        <div className="flex justify-center space-x-1 mb-8 overflow-x-auto scrollbar-hide relative z-10 pb-2">
                            {practiceData.map((practice) => (
                                <button
                                    key={practice.id}
                                    onClick={() => setActiveTab(practice.id)}
                                    className={`px-2 py-1 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap flex-shrink-0 ${activeTab === practice.id
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted hover:text-foreground'
                                        }`}
                                    style={activeTab !== practice.id ? { backgroundColor: 'rgb(231, 240, 255)' } : {}}
                                >
                                    {practice.tabTitle}
                                </button>
                            ))}
                        </div>

                        {/* 练习内容轮播 */}
                        <Carousel
                            setApi={setApi}
                            opts={{
                                align: "start",
                                dragFree: false,
                                containScroll: "trimSnaps"
                            }}
                            className="w-full relative z-0"
                        >
                            <CarouselContent className="-ml-0">
                                {practiceData.map((practice) => (
                                    <CarouselItem key={practice.id} className="pl-0">
                                        <div>
                                            {practice.id === 'practice_1' ? (
                                                <PhoneAwayPractice
                                                    practiceId={practice.id}
                                                    title={practice.title}
                                                    content={practice.content}
                                                />
                                            ) : ['practice_2', 'practice_3', 'practice_4'].includes(practice.id) ? (
                                                <TextInputPractice
                                                    practiceId={practice.id}
                                                    title={practice.title}
                                                    content={practice.content}
                                                    onRecordAdded={handleRecordAdded}
                                                />
                                            ) : practice.id === 'practice_5' ? (
                                                <MeditationPractice
                                                    practiceId={practice.id}
                                                    title={practice.title}
                                                    content={practice.content}
                                                />
                                            ) : practice.id === 'practice_6' ? (
                                                <EMACapture
                                                    onRecordAdded={() => handleRecordAdded({} as PracticeRecord)}
                                                />
                                            ) : null}
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </CardContent>
                </Card>
            </div>

            {/* 历史记录卡片 - 独立渲染 */}
            {['practice_2', 'practice_3', 'practice_4'].includes(activeTab) && (
                <div>
                    <HistoryRecords
                        practiceId={activeTab}
                    />
                </div>
            )}
        </div>
    );
}; 