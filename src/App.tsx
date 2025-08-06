import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { PracticePage } from './components/PracticePage';
import { StatisticsPage } from './components/statistics/StatisticsPage';
import { MoodPage } from './components/practices/MoodPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'practice' | 'statistics' | 'mood'>('practice');

  return (
    <div style={{ backgroundColor: '#F3F4F6' }}>
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <main style={{ backgroundColor: '#F3F4F6', paddingBottom: '120px' }}>
        {currentPage === 'practice' && <PracticePage />}
        {currentPage === 'mood' && <MoodPage />}
        {currentPage === 'statistics' && <StatisticsPage />}
      </main>
    </div>
  );
}

export default App;
