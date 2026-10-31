import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/navbar';
import Hero from './components/hero';
import Facts from './components/facts';
import Career from './components/career';
import Game from './components/game';
import Footer from './components/footer';
import './App.css';
import './theme.css';        // must come after App.css
import './responsive.css';   // must come after theme.css

function App() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/facts" element={<Facts />} />
        <Route path="/career" element={<Career />} />
        <Route path="/game" element={<Game />} />
      </Routes>
      {!isHome && <Footer />}
    </>
  );
}

export default App;