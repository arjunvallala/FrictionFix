import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/auth/LoginPage';
import { AppShell } from './components/layout/AppShell';

const MainContent: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <LoginPage />;
  }

  return <AppShell />;
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
