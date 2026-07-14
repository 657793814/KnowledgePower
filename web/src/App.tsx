import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import GraphPage from './pages/GraphPage';
import KnowledgeDetail from './pages/KnowledgeDetail';
import SearchPage from './pages/SearchPage';
import AdminDashboard from './pages/admin/Dashboard';
import KnowledgeEdit from './pages/admin/KnowledgeEdit';
import PracticePage from './pages/exam/PracticePage';
import StatsPage from './pages/exam/StatsPage';
import WrongBookPage from './pages/exam/WrongBookPage';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<GraphPage />} />
        <Route path="/graph/:domain" element={<GraphPage />} />
        <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/exam/practice" element={<PracticePage />} />
        <Route path="/exam/stats" element={<StatsPage />} />
        <Route path="/exam/wrong-book" element={<WrongBookPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/knowledge/edit/:id" element={<KnowledgeEdit />} />
        <Route path="/admin/knowledge/create" element={<KnowledgeEdit />} />
      </Route>
    </Routes>
  );
}
