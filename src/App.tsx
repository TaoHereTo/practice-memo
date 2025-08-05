import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { PracticePage } from './components/PracticePage';
import { StatisticsPage } from './components/statistics/StatisticsPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'practice' | 'statistics'>('practice');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <main className="min-h-screen pt-4">
        {currentPage === 'practice' && <PracticePage />}
        {currentPage === 'statistics' && <StatisticsPage />}
      </main>
    </div>
  );
}

export default App;
