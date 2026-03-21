import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App'; 
import 'primeflex/primeflex.css';
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

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