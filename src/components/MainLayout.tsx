import React, { useState, ReactNode } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Ripple } from 'primereact/ripple';
import { useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { classNames } from 'primereact/utils';

interface MainLayoutProps {
  children: ReactNode;
  isDark: boolean;
  toggleTheme: () => void;
}

interface MenuItem {
  label: string;
  icon: string;
  to: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, isDark, toggleTheme }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { label: 'Дашборд', icon: 'pi pi-home', to: '/' },
    { label: 'Аналитика', icon: 'pi pi-chart-line', to: '/analytics' },
    { label: 'Настройки', icon: 'pi pi-cog', to: '/settings' },
  ];

  return (
    <div className="min-h-screen flex flex-column bg-surface-ground">
      <div className="surface-card py-3 px-3 md:px-5 flex align-items-center justify-content-between shadow-2 z-5">
        <div className="flex align-items-center">
          <Button icon="pi pi-bars" onClick={() => setVisible(true)} text className="mr-3" />
          <span className="text-xl font-bold text-primary logo-font">Money Tracker</span>
        </div>

        <div className="flex align-items-center gap-3">
          <Button
            icon={isDark ? 'pi pi-sun' : 'pi pi-moon'}
            rounded
            text
            severity="secondary"
            onClick={() => toggleTheme()} 
          />
          <Avatar icon="pi pi-user" shape="circle" className="bg-primary text-white" />
          <Button
            icon="pi pi-sign-out"
            text
            severity="danger"
            onClick={logout}
            className="p-0"
          />
        </div>
      </div>

      <Sidebar
        visible={visible}
        onHide={() => setVisible(false)}
        className="w-full md:w-20rem"
      >
        <div className="flex flex-column h-full">
          <div className="flex align-items-center justify-content-between px-3 py-4 mb-3 border-bottom-1 surface-border">
            <span className="text-2xl font-bold surface-800">Меню</span>
          </div>

          <div className="overflow-y-auto">
            <ul className="list-none p-3 m-0">
              {menuItems.map((item: MenuItem) => {
                const isActive = location.pathname === item.to;

                return (
                  <li key={item.label} className="mb-2">
                    <Link
                      to={item.to}
                      onClick={() => setVisible(false)}
                      style={{
                        backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                        textDecoration: 'none'
                      }}
                      className={classNames(
                        'p-ripple flex align-items-center cursor-pointer p-3 border-round transition-duration-150 w-full',
                        {
                          'hover:surface-hover': !isActive,
                        }
                      )}
                    >
                      <i
                        className={`${item.icon} mr-3 text-lg`}
                        style={{
                          color: isActive ? 'var(--primary-color)' : 'var(--text-color-secondary)',
                          transition: 'color 0.15s ease-in-out'
                        }}
                      ></i>

                      <span
                        className="font-medium"
                        style={{ color: isActive ? 'var(--primary-color)' : 'var(--text-color-secondary)' }}
                      >
                        {item.label}
                      </span>

                      {isActive && (
                        <div
                          className="ml-auto border-round"
                          style={{ width: '4px', height: '16px', backgroundColor: 'var(--primary-color)' }}
                        ></div>
                      )}

                      <Ripple />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-auto p-3 border-top-1 surface-border text-center surface-500">
            <p className="text-sm">Expense Tracker v1.0</p>
          </div>
        </div>
      </Sidebar>

      <div className="p-3 md:p-5 flex-1 overflow-y-auto">
        <div className="mx-auto" style={{ maxWidth: '1200px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;