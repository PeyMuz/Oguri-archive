import { Routes, Route } from 'react-router-dom';

import Navbar from './components/navbar';
import Hero from './components/hero';
import Facts from './components/facts';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/facts" element={<Facts />} />
      </Routes>
    </>
  );
}

export default App;