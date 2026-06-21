import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Search } from './pages/Search';
import { ArtistDashboard } from './pages/ArtistDashboard';
import { BrideDashboard } from './pages/BrideDashboard';
import { AppProvider } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <AppProvider>
      <Router>
        <ErrorBoundary>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<Search />} />
            <Route path="/artist" element={<ArtistDashboard />} />
            <Route path="/bride" element={<BrideDashboard />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </AppProvider>
  );
}

export default App;
