import { useState } from 'react';
import { MentorDashboard } from './components/MentorDashboard';
import { EntrepreneurDashboard } from './components/EntrepreneurDashboard';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './components/Home';
import { Login } from './components/Login/Login';
import { ResetPasswordPage } from './components/Login/pages/ResetPasswordPage.tsx'
import NavBarWrapper from './components/NavBar/NavBarWrapper';
import Footer from './components/Footer/Footer.tsx';
import { AddPost } from './components/Home/AddPost.tsx';
import About from './pages/About/About.tsx';
import ChatPage from './components/Chat/components/chat/ChatPage';
import { ProfilePage } from './components/Perfil/ProfilePage';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { PostsProvider } from './context/PostsContext.tsx';
import PrivateRoute from './components/PrivateRoutes.tsx';
import './App.css'

function AppContent() {
  const { user } = useAuth();
  const [selectedTag] = useState<string>('all');
  const location = useLocation();
  const currentUserId = user?.userId || null;

  const isLoginPage = location.pathname === '/';
  const isChatPage = location.pathname === '/messages';
  const isResetPasswordPage = location.pathname === '/reset-password';
  
  return (
    <div className='app-container'>
      {!isLoginPage && !isResetPasswordPage && <NavBarWrapper />}
      
      <main className={`app-main-content ${isChatPage ? 'chat-page' : ''}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/home" element={<PrivateRoute><Home name={user?.name ?? ''} rol={user?.role ?? ''} currentUserId={currentUserId} /></PrivateRoute>} />
          <Route path="/add-post" element={<PrivateRoute><AddPost /></PrivateRoute>} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/dashboard" element={<PrivateRoute><EntrepreneurDashboard /></PrivateRoute>} />
          <Route path="/mentor-dashboard" element={<PrivateRoute><MentorDashboard /></PrivateRoute>} />
          <Route path="/messages" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        </Routes>
      </main>
      
      {!isLoginPage && !isChatPage && !isResetPasswordPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <PostsProvider>
          <AppContent />
        </PostsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;