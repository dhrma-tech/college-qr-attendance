import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import TeacherSubjects from './pages/TeacherSubjects';
import AttendanceSessions from './pages/AttendanceSessions';
import LiveSession from './pages/LiveSession';
import StudentScanner from './pages/StudentScanner';
import StudentHistory from './pages/StudentHistory';
import Profile from './pages/Profile';
import HODDashboard from './pages/HODDashboard';
import HODReports from './pages/HODReports';

const Unauthorized = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-6xl font-black text-red-600">403</h1>
        <p className="text-slate-900 font-bold text-xl mt-4">Access Denied</p>
        <p className="text-slate-500 mt-2">You don't have the required permissions to view this resource.</p>
    </div>
);

const NotFound = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-6xl font-black text-primary-600">404</h1>
        <p className="text-slate-900 font-bold text-xl mt-4">Lost in Space?</p>
        <p className="text-slate-500 mt-2">The page you're looking for doesn't exist or has been moved.</p>
    </div>
);

const RoleDashboardRedirect = () => {
    const { user } = useAuth();
    if (user?.role === 'admin') return <AdminDashboard />;
    if (user?.role === 'hod') return <Navigate to="/hod/dashboard" replace />;
    if (user?.role === 'teacher') return <Navigate to="/teacher/sessions" replace />;
    if (user?.role === 'student') return <Navigate to="/student/scan" replace />;
    return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
    <ErrorBoundary>
        <Router>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                <Route element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route index element={<RoleDashboardRedirect />} />
                    
                    {/* Role-Based Redirect for Home Dashboard */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <RoleDashboardRedirect />
                        </ProtectedRoute>
                    } />
                    
                    {/* Admin Routes */}
                    <Route path="/admin">
                        <Route path="users" element={<ProtectedRoute roles={['admin', 'hod']}><AdminUsers /></ProtectedRoute>} />
                        <Route path="departments" element={<ProtectedRoute roles={['admin']}><div className="p-10 text-center text-slate-400 border-2 border-dashed rounded-2xl">Department Management (Seed Data Loaded)</div></ProtectedRoute>} />
                        <Route path="courses" element={<ProtectedRoute roles={['admin']}><div className="p-10 text-center text-slate-400 border-2 border-dashed rounded-2xl">Course Management (Seed Data Loaded)</div></ProtectedRoute>} />
                        <Route path="subjects" element={<ProtectedRoute roles={['admin']}><div className="p-10 text-center text-slate-400 border-2 border-dashed rounded-2xl">Subject Management (Seed Data Loaded)</div></ProtectedRoute>} />
                    </Route>

                    {/* Teacher Routes */}
                    <Route path="/teacher">
                        <Route path="subjects" element={<ProtectedRoute roles={['teacher']}><TeacherSubjects /></ProtectedRoute>} />
                        <Route path="sessions" element={<ProtectedRoute roles={['teacher']}><AttendanceSessions /></ProtectedRoute>} />
                        <Route path="session/:id" element={<ProtectedRoute roles={['teacher']}><LiveSession /></ProtectedRoute>} />
                    </Route>

                    {/* HOD Routes */}
                    <Route path="/hod">
                        <Route path="dashboard" element={<ProtectedRoute roles={['hod']}><HODDashboard /></ProtectedRoute>} />
                        <Route path="reports" element={<ProtectedRoute roles={['hod']}><HODReports /></ProtectedRoute>} />
                    </Route>

                    {/* Student Routes */}
                    <Route path="/student">
                        <Route path="scan" element={<ProtectedRoute roles={['student']}><StudentScanner /></ProtectedRoute>} />
                        <Route path="history" element={<ProtectedRoute roles={['student']}><StudentHistory /></ProtectedRoute>} />
                    </Route>

                    <Route path="/profile" element={<Profile />} />
                </Route>

                <Route path="*" element={<Navigate to="/404" replace />} />
                <Route path="/404" element={<NotFound />} />
            </Routes>
        </Router>
    </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
