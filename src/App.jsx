import { Routes, Route } from 'react-router-dom';

import Navbar from './components/navbar';
import Hero from './components/hero';
import Facts from './components/facts';
import Career from './components/career';
import Game from './components/game';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/facts" element={<Facts />} />
        <Route path="/career" element={<Career />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </>
  );
}

export default App;