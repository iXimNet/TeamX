import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AppLayout from './layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProjectBoardPage from './pages/ProjectBoardPage';
import ProjectWBSPage from './pages/ProjectWBSPage';
import ProjectGanttPage from './pages/ProjectGanttPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="projects/:projectId/board" element={<ProjectBoardPage />} />
            <Route path="projects/:projectId/wbs" element={<ProjectWBSPage />} />
            <Route path="projects/:projectId/gantt" element={<ProjectGanttPage />} />
          </Route>
        </Route>

      </Routes>
    </AuthProvider>
  );
}

export default App;
