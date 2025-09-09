import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, UserPlus } from 'lucide-react';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Operator');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signupUser({ email, password, role })).unwrap()
      .then(() => {
        setSignupSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      })
      .catch(() => {
        // Error is handled in the slice, this just prevents uncaught promise rejection
      });
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
          <h2 className="text-center text-2xl font-bold mb-1">Create an Account</h2>
          <p className="text-center text-text-secondary mb-6">Get started with the QMS platform.</p>
          
          {signupSuccess ? (
            <div className="text-center p-4 bg-green-100 text-green-800 rounded-lg">
                <h3 className="font-semibold">Registration Successful!</h3>
                <p>Redirecting you to the login page...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required autoComplete="email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" required autoComplete="new-password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary">Select Your Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="form-input">
                  <option>Operator</option>
                  <option>Investigator</option>
                  <option>QA Approver</option>
                </select>
              </div>
              {error && <p className="text-sm text-danger text-center">{error}</p>}
              <button type="submit" className="btn btn-primary w-full" disabled={status === 'loading'}>
                <UserPlus size={16} />
                {status === 'loading' ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-text-secondary mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;