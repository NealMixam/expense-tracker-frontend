import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import { PrivateRoute } from './components/PrivateRoute';
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./index.css";

function App() {

    const [isDark, setIsDark] = useState(
        localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
    useEffect(() => {
    const html = document.documentElement;

    let themeLink = document.getElementById('theme-link');
    
    if (!themeLink) {
        themeLink = document.createElement('link');
        themeLink.id = 'theme-link';
        themeLink.rel = 'stylesheet';
        document.head.appendChild(themeLink);
    }

    if (isDark) {
        html.classList.add('p-dark');
        themeLink.href = '/node_modules/primereact/resources/themes/lara-dark-blue/theme.css';
        localStorage.setItem('theme', 'dark');
    } else {
        html.classList.remove('p-dark');
        themeLink.href = '/node_modules/primereact/resources/themes/lara-light-blue/theme.css';
        localStorage.setItem('theme', 'light');
    }
}, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <PrimeReactProvider value={{ ripple: true }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginView />} />
                    <Route 
                        path="/" 
                        element={
                            <PrivateRoute>
                                <HomeView isDark={isDark} toggleTheme={toggleTheme} />
                            </PrivateRoute>
                        } 
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </PrimeReactProvider>
    );
}

export default App;