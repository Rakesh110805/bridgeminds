import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/student/Dashboard';
import Ask from './pages/student/Ask';
import Packs from './pages/student/Packs';
import Chat from './pages/student/Chat';
import Mentors from './pages/student/Mentors';
import MentorLayout from './layouts/MentorLayout';
import MentorDashboard from './pages/mentor/Dashboard';
import MentorUpload from './pages/mentor/Upload';
import MentorStudents from './pages/mentor/Students';
import MentorSettings from './pages/mentor/Settings';
import MentorAnalytics from './pages/mentor/Analytics';

function App() {
  return (
    <div className="min-h-screen bg-ink font-sans text-paper">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route path="/student" element={
          <ProtectedRoute role="STUDENT">
            <StudentLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="ask" element={<Ask />} />
          <Route path="packs" element={<Packs />} />
          <Route path="chat" element={<Chat />} />
          <Route path="mentors" element={<Mentors />} />
        </Route>

        {/* Mentor Routes */}
        <Route path="/mentor" element={
          <ProtectedRoute role="MENTOR">
            <MentorLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<MentorDashboard />} />
          <Route path="students" element={<MentorStudents />} />
          <Route path="upload" element={<MentorUpload />} />
          <Route path="settings" element={<MentorSettings />} />
          <Route path="analytics" element={<MentorAnalytics />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
