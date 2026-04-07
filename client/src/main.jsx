import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster 
          position="bottom-right" 
          toastOptions={{ style: { background: '#111', color: '#f0f0f0', border: '1px solid #222' } }} 
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

