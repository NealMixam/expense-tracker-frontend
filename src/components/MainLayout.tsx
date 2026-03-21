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
      <div className="surface-card py-3 px-5 flex align-items-center justify-content-between shadow-2 z-5">
        <div className="flex align-items-center">
          <Button icon="pi pi-bars" onClick={() => setVisible(true)} text className="mr-3" />
          <span className="text-xl font-bold text-primary">SmartExpense</span>
        </div>

        <div className="flex align-items-center gap-3">
          <Button
            icon={isDark ? 'pi pi-sun' : 'pi pi-moon'}
            rounded
            text
            severity="secondary"
            onClick={toggleTheme}
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
            <span className="text-2xl font-bold">Меню</span>
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
                      className={classNames(
                        'p-ripple flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full no-underline',
                        {
                          'bg-primary-50': isActive && !isDark,
                          'bg-primary-900': isActive && isDark,
                          'hover:surface-100': !isActive,
                        }
                      )}
                    >
                      <i
                        className={classNames(`${item.icon} mr-3 text-lg`, {
                          'text-primary font-bold': isActive,
                          'text-600': !isActive,
                        })}
                      ></i>

                      <span
                        className={classNames('font-medium', {
                          'text-primary font-bold': isActive,
                          'text-700': !isActive,
                        })}
                      >
                        {item.label}
                      </span>

                      {isActive && (
                        <div
                          className="ml-auto border-circle bg-primary"
                          style={{ width: '6px', height: '6px' }}
                        ></div>
                      )}

                      <Ripple />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="mt-auto p-3 border-top-1 surface-border text-center">
            <p className="text-sm text-500">Expense Tracker v1.0</p>
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