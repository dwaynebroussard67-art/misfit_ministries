import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ForgeProvider } from './lib/ForgeContext';
import Nav from './components/Nav';
import ForgePanel from './components/ForgePanel';
import PersistentBar from './components/PersistentBar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import About from './pages/About';
import WarRoom from './pages/WarRoom';
import Armory from './pages/Armory';
import Contact from './pages/Contact';
import Welcome from './pages/Welcome';
import NotesFromTheKing from './pages/NotesFromTheKing';
import ThatsWhatLoveDoes from './pages/ThatsWhatLoveDoes';
import FirstResponders from './pages/FirstResponders';
import Community from './pages/Community';

export default function App() {
  return (
    <ForgeProvider>
      <BrowserRouter>
        <Nav />
        <ForgePanel />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/war-room" element={<WarRoom />} />
          <Route path="/armory" element={<Armory />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/welcome/:type" element={<Welcome />} />
          <Route path="/notes-from-the-king" element={<NotesFromTheKing />} />
          <Route path="/thats-what-love-does" element={<ThatsWhatLoveDoes />} />
          <Route path="/first-responders" element={<FirstResponders />} />
          <Route path="/community" element={<Community />} />
        </Routes>
        <PersistentBar />
      </BrowserRouter>
    </ForgeProvider>
  );
}
