import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import WorkspaceLayout from './layouts/WorkspaceLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Workspace from './pages/Workspace';
import PromptLibrary from './pages/PromptLibrary';
import Projects from './pages/Projects';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/workspace"
            element={
              <ProtectedRoute>
                <WorkspaceLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Workspace />} />
            <Route path="library" element={<PromptLibrary />} />
            <Route path="projects" element={<Projects />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/dashboard" element={<Navigate to="/workspace" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
