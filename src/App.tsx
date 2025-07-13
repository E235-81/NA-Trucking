import './App.css';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ButtonShowcasePage } from './pages/ButtonShowcasePage';
import { SlugPage } from './pages/SlugPage';
import { Navigation } from './components/Navigation';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <div className="w-full" style={{ backgroundColor: '#000000' }}>
      <Navigation />
      <Routes>
        <Route path="/:slug" element={<SlugPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/buttons" element={<ButtonShowcasePage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;