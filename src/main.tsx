import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './AuthContext';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for offline support
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content available, refresh to update.');
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
