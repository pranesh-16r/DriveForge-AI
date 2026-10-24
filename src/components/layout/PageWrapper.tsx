import React from 'react';
import { PageTransition } from '../ui/PageTransition';

export interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = '' }) => {
  return (
    <main className={`min-h-[calc(100vh-80px)] ${className}`}>
      <PageTransition preset="slideUp">
        {children}
      </PageTransition>
    </main>
  );
};

