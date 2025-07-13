import './App.css';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { FreightQuotePage } from './pages/FreightQuotePage';
import { Navigation } from './components/Navigation';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <div className="w-full" style={{ backgroundColor: '#000000' }}>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/freight-quote" element={<FreightQuotePage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;