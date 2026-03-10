import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/student/Dashboard';
import Ask from './pages/student/Ask';
import Packs from './pages/student/Packs';
import Chat from './pages/student/Chat';
import MentorLayout from './layouts/MentorLayout';
import MentorDashboard from './pages/mentor/Dashboard';
import MentorUpload from './pages/mentor/Upload';

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
          <Route path="chat/:mentorId" element={<Chat />} />
        </Route>

        {/* Mentor Routes */}
        <Route path="/mentor" element={
          <ProtectedRoute role="MENTOR">
            <MentorLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<MentorDashboard />} />
          <Route path="upload" element={<MentorUpload />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
