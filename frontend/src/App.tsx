// import { useState } from 'react'
import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import Ranking from './pages/Ranking';
import GlobalCalendar from './pages/GlobalCalendar';
import TeamCalendar from './pages/TeamCalendar';
import Contact from './pages/Contact';
import Results from './pages/Results';
import ChampionshipRules from './pages/ChampionshipRules';
import ASIECup from './pages/ASIECup';
import PostponedMatches from './pages/PostponedMatches';
import Admin from './pages/Admin';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/global-calendar" element={<GlobalCalendar />} />
          <Route path="/team-calendar/:teamName" element={<TeamCalendar />} />
          <Route path="/results" element={<Results />} />
          <Route path="/postponed-matches" element={<PostponedMatches />} />
          <Route path="/asie-cup" element={<ASIECup />} />
          <Route path="/championship-rules" element={<ChampionshipRules />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
