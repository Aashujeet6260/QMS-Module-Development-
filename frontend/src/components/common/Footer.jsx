import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-text-secondary">
        &copy; {currentYear} AI Assitance - QMS System Module. All Rights Reserved. Version 1.0.0
      </div>
    </footer>
  );
};

export default Footer;