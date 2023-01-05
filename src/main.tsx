import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import firebase from 'firebase/compat/app';
console.log(firebase);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
