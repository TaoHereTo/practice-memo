import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { PracticePage } from './components/PracticePage';
import { StatisticsPage } from './components/statistics/StatisticsPage';
import { MoodPage } from './components/practices/MoodPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'practice' | 'statistics' | 'mood'>('practice');

  const renderPage = () => {
    switch (currentPage) {
      case 'practice':
        return <PracticePage />;
      case 'statistics':
        return <StatisticsPage />;
      case 'mood':
        return <MoodPage />;
      default:
        return <PracticePage />;
    }
  };

  return (
    <div className="App">
      {/* 演示说明 */}
      <div className="md:hidden fixed top-4 left-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">流体融合导航栏演示</h3>
        <p className="text-xs text-gray-600">
          点击底部导航栏的不同按钮，观察黑色胶囊的流体融合动画效果。
          这个效果使用了SVG滤镜和高斯模糊来模拟真实的流体融合。
        </p>
      </div>

      {/* 主要内容 */}
      <div className="content-area">
        {renderPage()}
      </div>

      {/* 导航栏 */}
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}

export default App;
