import React from 'react';
import { useApp } from '../../context/AppContext';
import { LoginPage } from '../../pages/LoginPage';
import { SignupPage } from '../../pages/SignupPage';
import { ForgotPasswordPage } from '../../pages/ForgotPasswordPage';
import { AnimatePresence } from 'motion/react';
import { PageWrapper } from '../layout/PageWrapper';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard Layout Component
 * Enforces mandatory Firebase Authentication (Login/Signup) before rendering application children.
 * Styled in the Warm Ivory studio aesthetic.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { currentUser, currentPath } = useApp();
  const path = currentPath || '/';

  // If user is not authenticated via Firebase Auth or session, render login/signup gateway
  if (!currentUser) {
    let AuthScreen = <LoginPage />;
    if (path === '/signup') {
      AuthScreen = <SignupPage />;
    } else if (path === '/forgot-password') {
      AuthScreen = <ForgotPasswordPage />;
    }

    return (
      <AnimatePresence mode="wait">
        <PageWrapper key={path}>{AuthScreen}</PageWrapper>
      </AnimatePresence>
    );
  }

  // User is authenticated -> render children routes
  return <>{children}</>;
};

export default AuthGuard;
