import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import EventListPage from './pages/EventListPage';
import CreateEventPage from './pages/CreateEventPage';
import EventDetailPage from './pages/EventDetailPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loadUserFromToken } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // On app start, try to load user from token in local storage
    dispatch(loadUserFromToken());
  }, [dispatch]);

  return (
    <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/events" element={<EventListPage />} />
              <Route path="/events/new" element={<CreateEventPage />} />
              <Route path="/events/edit/:eventId" element={<CreateEventPage />} />
              <Route path="/events/:eventId" element={<EventDetailPage />} />
            </Route>
          </Route>

        </Routes>
    </Router>
  );
}

export default App;