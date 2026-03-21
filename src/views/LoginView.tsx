import React, { useState, FormEvent } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const LoginView: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(username, password);
      navigate('/');
    } catch {
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-column gap-2 w-full">
            <label htmlFor="password">Пароль</label>
            <Password
              id="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              toggleMask
              feedback={false}
              className="w-full"
              inputClassName="w-full"
              required
            />
          </div>
          {error && <Message severity="error" text={error} />}
          <Button label="Войти" icon="pi pi-sign-in" loading={loading} type="submit" />
          <div className="text-center mt-2">
            Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginView;