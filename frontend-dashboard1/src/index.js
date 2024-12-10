// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './UserContext'; // Import UserProvider correctly



// Create a root for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component wrapped with UserProvider
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);

// Measure performance if needed
reportWebVitals();
