import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const LoginView = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Неверное имя пользователя или пароль');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Card title="Вход в систему" style={{ width: '100%', maxWidth: '400px' }}>
                <form onSubmit={handleLogin} className="flex flex-column gap-3">
                    <div className="flex flex-column gap-2">
                        <label htmlFor="username">Логин</label>
                        <InputText 
                            id="username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="password">Пароль</label>
                        <InputText 
                            id="password" 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    {error && <Message severity="error" text={error} />}
                    <Button label="Войти" icon="pi pi-sign-in" loading={loading} type="submit" />
                </form>
            </Card>
        </div>
    );
};

export default LoginView;