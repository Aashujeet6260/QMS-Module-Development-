import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, LogIn } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, status, error } = useSelector((state) => state.auth);
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-primary-600" />
            <span className="text-2xl font-bold text-text-primary">AIVOA QMS</span>
          </div>
        </div>
        <div className="card p-8">
          <h2 className="text-center text-2xl font-bold mb-1">Welcome Back!</h2>
          <p className="text-center text-text-secondary mb-6">Please sign in to continue.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required autoComplete="email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" required autoComplete="current-password" />
            </div>
            {error && <p className="text-sm text-danger text-center">{error}</p>}
            <button type="submit" className="btn btn-primary w-full" disabled={status === 'loading'}>
              <LogIn size={16} />
              {status === 'loading' ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-text-secondary mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;