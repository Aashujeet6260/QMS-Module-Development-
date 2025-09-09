import React from 'react';
import { Outlet } from 'react-router-dom'; // 1. Import Outlet
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Navbar />
      <main className="flex-grow w-full container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet /> {/* 2. Use Outlet instead of children */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;