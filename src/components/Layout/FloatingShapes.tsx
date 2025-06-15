import React from 'react';
import { Atom, Calculator, Infinity, Zap, Triangle, Circle, Square } from 'lucide-react';

const FloatingShapes: React.FC = () => {
  const shapes = [
    { Icon: Atom, className: 'top-20 left-10 text-blue-200', size: 32 },
    { Icon: Calculator, className: 'top-40 right-20 text-purple-200', size: 28 },
    { Icon: Infinity, className: 'top-60 left-1/4 text-indigo-200', size: 36 },
    { Icon: Zap, className: 'bottom-40 right-10 text-violet-200', size: 30 },
    { Icon: Triangle, className: 'bottom-60 left-20 text-blue-300', size: 24 },
    { Icon: Circle, className: 'top-1/3 right-1/3 text-purple-300', size: 20 },
    { Icon: Square, className: 'bottom-20 left-1/2 text-indigo-300', size: 26 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {shapes.map(({ Icon, className, size }, index) => (
        <div
          key={index}
          className={`floating-shape ${className}`}
          style={{ animationDelay: `${index * 0.5}s` }}
        >
          <Icon size={size} />
        </div>
      ))}
      
      {/* 3D-like geometric shapes using CSS */}
      <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-br from-blue-200 to-purple-300 rounded-full opacity-20 floating-shape transform rotate-45"></div>
      <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-gradient-to-tr from-violet-200 to-indigo-300 opacity-15 floating-shape" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
      <div className="absolute top-1/2 right-1/6 w-14 h-14 bg-gradient-to-bl from-purple-200 to-blue-300 rounded-lg opacity-20 floating-shape transform rotate-12"></div>
    </div>
  );
};

export default FloatingShapes;