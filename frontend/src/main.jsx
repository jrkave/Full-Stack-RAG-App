import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthProvider.jsx';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import App from './App';
import './index.css';

// Alert Configuration
const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 2000,
  offset: '30px',
  transition: transitions.SCALE,
}

const AlertTemplate = ({ options, message }) => (
  <div className='text-sm rounded-md p-2 m-2 bg-lighter text-zinc-200 dark:bg-darker'>
      {options.type === 'info'}
      {options.type === 'success'}
      {options.type === 'error'}
      {message}
  </div>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AlertProvider template={AlertTemplate} {...options}>
      <AuthProvider>
          <App />
      </AuthProvider>
    </AlertProvider>
  </React.StrictMode>,
);