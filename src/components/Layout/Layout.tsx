import React from 'react';
import Header from './Header';
import FloatingShapes from './FloatingShapes';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen relative">
      <FloatingShapes />
      <Header />
      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;