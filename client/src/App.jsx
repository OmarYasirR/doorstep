import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import PropertyDetail from './pages/PropertyDetail';
import AgentProfile from './pages/AgentProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import Saved from './pages/Saved';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/agents/:id" element={<AgentProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute roles={['agent', 'admin']}><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
