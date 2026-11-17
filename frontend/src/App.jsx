import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { DemoAuthProvider } from './context/DemoAuthContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <DemoAuthProvider>
        <AppRoutes />
      </DemoAuthProvider>
    </BrowserRouter>
  );
}
