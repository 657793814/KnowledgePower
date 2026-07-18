import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthProvider';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import GraphPage from './pages/GraphPage';
import CosmicHome from './pages/CosmicHome';
import KnowledgeDetail from './pages/KnowledgeDetail';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminDashboard from './pages/admin/Dashboard';
import AiSettingsPage from './pages/admin/AiSettingsPage';
import DocumentsPage from './pages/admin/DocumentsPage';
import KnowledgeEdit from './pages/admin/KnowledgeEdit';
import UsersPage from './pages/admin/UsersPage';
import PracticePage from './pages/exam/PracticePage';
import StatsPage from './pages/exam/StatsPage';
import WrongBookPage from './pages/exam/WrongBookPage';
import ModelTrainPage from './pages/exam/ModelTrainPage';
import AnimationDemo from './pages/AnimationDemo';
import InsightPage from './pages/InsightPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 独立页面（无侧边栏） */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<CosmicHome />} />

        {/* 主布局页面 */}
        <Route element={<MainLayout />}>
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/graph/:domain" element={<GraphPage />} />
          <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/exam/practice" element={<PracticePage />} />
          <Route path="/exam/stats" element={
            <ProtectedRoute>
              <StatsPage />
            </ProtectedRoute>
          } />
          <Route path="/exam/model-train" element={<ModelTrainPage />} />
          <Route path="/exam/wrong-book" element={
            <ProtectedRoute>
              <WrongBookPage />
            </ProtectedRoute>
          } />
          <Route path="/animation/demo" element={<AnimationDemo />} />
          <Route path="/insight" element={<InsightPage />} />
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/ai-settings" element={
            <ProtectedRoute requiredRole="admin">
              <AiSettingsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/documents" element={
            <ProtectedRoute requiredRole="admin">
              <DocumentsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/knowledge/edit/:id" element={
            <ProtectedRoute requiredRole="admin">
              <KnowledgeEdit />
            </ProtectedRoute>
          } />
          <Route path="/admin/knowledge/create" element={
            <ProtectedRoute requiredRole="admin">
              <KnowledgeEdit />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="admin">
              <UsersPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/users/create" element={
            <ProtectedRoute requiredRole="admin">
              <RegisterPage />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
