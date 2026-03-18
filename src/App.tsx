import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Layout from './components/Layout/Layout';

// ייבוא כל הדפים
import Login from './pages/auth/Login';
import Register from './pages/auth/Register'; // דף ההרשמה החדש
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets/Tickets';
import TicketDetails from './pages/Tickets/TicketDetails';
import CreateTicket from './pages/Tickets/CreateTicket';
import Users from './pages/Admin/Users';
import AdminCreateUser from './pages/Admin/AdminCreateUser';
import Profile from './pages/auth/Profile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* דפים ציבוריים */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* דפים מוגנים לכולם */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />
            <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetails /></ProtectedRoute>} />
            
            {/* הגנה ספציפית: רק לקוח יכול לפתוח פנייה */}
            <Route path="/tickets/new" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CreateTicket />
              </ProtectedRoute>
            } />

            {/* הגנה ספציפית: רק מנהל יכול לראות רשימת משתמשים וליצור צוות */}
            <Route path="/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Users />
              </ProtectedRoute>
            } />

            <Route path="/admin/create-user" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCreateUser />
              </ProtectedRoute>
            } />

            {/* ברירת מחדל ו-404 */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<div style={{ textAlign: 'center', padding: '50px' }}><h1>404</h1><p>הדף לא נמצא</p></div>} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;