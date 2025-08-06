import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { PracticePage } from './components/PracticePage';
import { StatisticsPage } from './components/statistics/StatisticsPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'practice' | 'statistics'>('practice');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F3F4F6' }}>
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <main className="min-h-screen fade-in" style={{ backgroundColor: '#F3F4F6', paddingBottom: '120px' }}>
        {currentPage === 'practice' && <PracticePage />}
        {currentPage === 'statistics' && <StatisticsPage />}
      </main>
    </div>
  );
}

export default App;
