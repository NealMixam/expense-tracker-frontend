import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from 'primereact/card';
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
import { Button } from 'primereact/button';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { Avatar } from 'primereact/avatar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { useAuthStore } from '../store/authStore';
import { useExpenseStore, CurrencyCode } from '../store/expenseStore';

interface SettingsViewProps {
  isDark: boolean;
  toggleTheme: (e: InputSwitchChangeEvent) => void;
}

interface ProfileFormData {
  username: string;
  email: string;
  newPassword?: string;
}

const SettingsView: React.FC<SettingsViewProps> = ({ isDark, toggleTheme }) => {
  const { user, updateProfile } = useAuthStore();
  const { currency, setCurrency } = useExpenseStore();
  const toast = useRef<Toast>(null);

  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    username: user?.username || '',
    email: user?.email || '',
    newPassword: '',
  });

  const currencyOptions: { label: string; value: CurrencyCode }[] = [
    { label: 'RUB (₽)', value: 'RUB' },
    { label: 'USD ($)', value: 'USD' },
    { label: 'EUR (€)', value: 'EUR' },
    { label: 'GEL (₾)', value: 'GEL' },
  ];

  const handleSaveProfile = async () => {
    try {
      await updateProfile(formData);
      toast.current?.show({
        severity: 'success',
        summary: 'Успех',
        detail: 'Профиль обновлен',
        life: 3000,
      });
      setShowEditDialog(false);
      setFormData((prev) => ({ ...prev, newPassword: '' }));
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не удалось сохранить данные',
        life: 3000,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Toast ref={toast} />
      <h1 className="text-3xl font-bold mb-4">Настройки</h1>

      <div className="grid">
        <div className="col-12">
          <Card title="Предпочтения" className="shadow-2 mb-4">
            <div className="flex flex-column gap-3">
              <div className="flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <span className="font-bold">Основная валюта</span>
                  <p className="text-500 m-0 text-sm">В этой валюте отображаются итоги.</p>
                </div>
                <SelectButton
                  value={currency}
                  options={currencyOptions}
                  onChange={(e: SelectButtonChangeEvent) => e.value && setCurrency(e.value as CurrencyCode)}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="col-12 md:col-6">
          <Card title="Мой профиль" className="shadow-2 h-full">
            <div className="flex align-items-center mb-4">
              <Avatar
                icon="pi pi-user"
                size="xlarge"
                shape="circle"
                className="bg-primary text-white mr-3"
              />
              <div>
                <p className="text-xl font-bold m-0">{user?.username || 'Пользователь'}</p>
                <p className="text-500 m-0">{user?.email || 'email не указан'}</p>
              </div>
            </div>
            <Button
              label="Редактировать профиль"
              icon="pi pi-user-edit"
              text
              className="p-0"
              onClick={() => setShowEditDialog(true)}
            />
          </Card>
        </div>

        <div className="col-12 md:col-6">
          <Card title="Интерфейс" className="shadow-2 h-full">
            <div className="flex align-items-center justify-content-between">
              <div className="flex align-items-center">
                <i className={`pi ${isDark ? 'pi-moon' : 'pi-sun'} mr-3 text-xl text-primary`}></i>
                <span>Тёмная тема</span>
              </div>
              <InputSwitch checked={isDark} onChange={toggleTheme} />
            </div>
          </Card>
        </div>
      </div>

      <Dialog
        header="Редактирование профиля"
        visible={showEditDialog}
        style={{ width: '90vw', maxWidth: '400px' }}
        onHide={() => setShowEditDialog(false)}
        footer={
          <div className="pt-3">
            <Button
              label="Отмена"
              icon="pi pi-times"
              onClick={() => setShowEditDialog(false)}
              className="p-button-text"
            />
            <Button label="Сохранить" icon="pi pi-check" onClick={handleSaveProfile} autoFocus />
          </div>
        }
      >
        <div className="flex flex-column gap-4 pt-3">
          <span className="p-float-label">
            <InputText
              id="username"
              className="w-full"
              value={formData.username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData({ ...formData, username: e.target.value })
              }
            />
            <label htmlFor="username">Имя пользователя</label>
          </span>
          <span className="p-float-label">
            <InputText
              id="email"
              className="w-full"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <label htmlFor="email">Email</label>
          </span>
          <span className="p-float-label">
            <Password
              id="password"
              value={formData.newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData({ ...formData, newPassword: e.target.value })
              }
              toggleMask
              className="w-full"
              inputClassName="w-full"
            />
            <label htmlFor="password">Новый пароль (если нужно)</label>
          </span>
        </div>
      </Dialog>
    </motion.div>
  );
};

export default SettingsView;