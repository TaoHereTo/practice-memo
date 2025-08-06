import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { PracticePage } from './components/PracticePage';
import { StatisticsPage } from './components/statistics/StatisticsPage';
import { MoodPage } from './components/practices/MoodPage';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from './components/ui/carousel';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'practice' | 'statistics' | 'mood'>('practice');
  const [api, setApi] = useState<CarouselApi>();

  // 页面索引映射
  const pageIndexMap = {
    'practice': 0,
    'mood': 1,
    'statistics': 2
  };

  const indexPageMap = ['practice', 'mood', 'statistics'] as const;

  // 当导航改变时，滚动到对应的轮播项
  useEffect(() => {
    if (api) {
      api.scrollTo(pageIndexMap[currentPage]);
    }
  }, [currentPage, api]);

  // 当轮播项改变时，更新当前页面状态
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      setCurrentPage(indexPageMap[selectedIndex]);
    };

    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F3F4F6' }}>
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <main className="min-h-screen" style={{ backgroundColor: '#F3F4F6', paddingBottom: '120px' }}>
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            dragFree: false,
            containScroll: "trimSnaps"
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            <CarouselItem className="pl-0">
              <PracticePage />
            </CarouselItem>
            <CarouselItem className="pl-0">
              <MoodPage />
            </CarouselItem>
            <CarouselItem className="pl-0">
              <StatisticsPage />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </main>
    </div>
  );
}

export default App;
