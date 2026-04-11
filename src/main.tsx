import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css';
import './index.css';
import App from './App'; 

const container = document.getElementById('root');

if (!container) {
  throw new Error('Не удалось найти корневой элемент с id "root". Проверьте index.html');
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);