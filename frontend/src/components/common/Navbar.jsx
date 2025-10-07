import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { ShieldCheck, UserCircle, Bell, LayoutDashboard, List, LogOut, LogIn, UserPlus } from 'lucide-react';

const NavItem = ({ to, icon, children }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive ? 'bg-primary-100 text-primary-700' : 'text-text-secondary hover:bg-slate-100'
        }`
      }
    >
        {icon}
        {children}
    </NavLink>
);


const Navbar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <header className="bg-surface/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <Link to="/" className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-primary-600" />
                  <span className="text-xl font-bold text-text-primary">AI Assitance - QMS System</span>
                </Link>
                {/* Show navigation links only if the user is logged in */}
                {user && (
                    <nav className="hidden md:flex items-center gap-2">
                        <NavItem to="/" icon={<LayoutDashboard size={16}/>}>Dashboard</NavItem>
                        <NavItem to="/events" icon={<List size={16}/>}>Event List</NavItem>
                    </nav>
                )}
            </div>
            <div className="flex items-center gap-4">
              {/* This is the conditional logic */}
              {user ? (
                // If user is logged in, show user info and logout button
                <>
                  <Bell className="w-6 h-6 text-text-secondary hover:text-primary-600 cursor-pointer transition-colors" />
                  <div className="w-px h-6 bg-border"></div>
                  <div className="flex items-center gap-2">
                    <UserCircle className="w-8 h-8 text-text-secondary" />
                    <div className='hidden sm:flex flex-col'>
                      <span className="text-sm font-medium text-text-primary leading-tight">{user.email}</span>
                      <span className="text-xs text-text-secondary leading-tight">{user.role}</span>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="btn btn-secondary p-2" title="Logout">
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                // If user is logged out, show Login and Sign Up links
                <div className='flex items-center gap-2'>
                    <Link to="/login" className="btn btn-secondary">
                        <LogIn size={16} /> Login
                    </Link>
                    <Link to="/signup" className="btn btn-primary">
                        <UserPlus size={16} /> Sign Up
                    </Link>
                </div>
              )}
            </div>
          </div>
        </header>
    );
};

export default Navbar;