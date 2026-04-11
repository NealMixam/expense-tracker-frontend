import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { ExpenseFormData } from '../store/expenseStore';

interface ExpenseFormProps {
  initialData: ExpenseFormData;
  currency: string;
  onSave: (data: ExpenseFormData) => void;
}

const CATEGORIES = ['Продукты', 'Транспорт', 'Развлечения', 'Жилье', 'Здоровье', 'Другое'];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialData, currency, onSave }) => {
  const [formData, setFormData] = useState<ExpenseFormData>(initialData);

  return (
    <div className="flex flex-column gap-5 pt-5">
      <span className="p-float-label">
        <InputText
          id="title"
          className="w-full"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <label htmlFor="title">Название</label>
      </span>

      <span className="p-float-label">
        <InputNumber
          id="amount"
          className="w-full"
          value={formData.amount}
          onValueChange={(e: InputNumberValueChangeEvent) =>
            setFormData({ ...formData, amount: e.value || 0 })
          }
          mode="currency"
          currency={currency}
          locale={currency === 'RUB' ? 'ru-RU' : 'en-US'}
        />
        <label htmlFor="amount">Сумма</label>
      </span>

      <Dropdown
        value={formData.category}
        options={CATEGORIES}
        onChange={(e: DropdownChangeEvent) => setFormData({ ...formData, category: e.value })}
        placeholder="Выберите категорию"
        className="w-full"
      />

      <Button
        label="Сохранить"
        icon="pi pi-check"
        onClick={() => onSave(formData)}
        className="w-full mt-2"
      />
    </div>
  );
};