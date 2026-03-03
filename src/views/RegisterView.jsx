import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const RegisterView = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const register = useAuthStore((state) => state.register);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Пароли не совпадают');
        }
        
        setLoading(true);
        setError('');
        try {
            await register(username, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка при регистрации');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Card title="Регистрация" style={{ width: '100%', maxWidth: '400px' }}>
                <form onSubmit={handleRegister} className="flex flex-column gap-3">
                    <div className="flex flex-column gap-2">
                        <label htmlFor="username">Логин</label>
                        <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="password">Пароль</label>
                        <InputText id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="confirmPassword">Повторите пароль</label>
                        <InputText id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    {error && <Message severity="error" text={error} />}
                    <Button label="Создать аккаунт" icon="pi pi-user-plus" loading={loading} type="submit" />
                    <div className="text-center mt-2">
                        Уже есть аккаунт? <Link to="/login">Войти</Link>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default RegisterView;