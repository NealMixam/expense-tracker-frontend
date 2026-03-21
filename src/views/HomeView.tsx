import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { useExpenseStore, Expense } from '../store/expenseStore';
import { motion } from 'framer-motion';

type ExpenseFormData = Omit<Expense, 'id' | 'userId'> & { id?: number };

const HomeView: React.FC = () => {
  const {
    expenses,
    loading,
    fetchExpenses,
    addExpense,
    updateExpense,
    removeExpense,
    getChartData,
    formatAmount,
    currency,
  } = useExpenseStore();

  const toast = useRef<Toast>(null);
  
  const [displayDialog, setDisplayDialog] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  
  const initialExpenseState: ExpenseFormData = {
    title: '',
    amount: 0,
    category: 'Другое',
    date: new Date(),
  };

  const [expense, setExpense] = useState<ExpenseFormData>(initialExpenseState);

  const categories: string[] = ['Продукты', 'Транспорт', 'Развлечения', 'Жилье', 'Здоровье', 'Другое'];

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const openNew = () => {
    setExpense(initialExpenseState);
    setIsEdit(false);
    setDisplayDialog(true);
  };

  const handleSave = async () => {
    if (!expense.title || !expense.amount) return;
    
    try {
      if (isEdit && expense.id) {
        await updateExpense(expense.id, expense as Expense);
      } else {
        await addExpense(expense as Expense);
      }
      
      toast.current?.show({ severity: 'success', summary: 'Успех', detail: 'Данные сохранены' });
      setDisplayDialog(false);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Ошибка', detail: 'Ошибка сохранения' });
    }
  };

  const actionTemplate = (rowData: Expense) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        onClick={() => {
          setExpense({ ...rowData });
          setIsEdit(true);
          setDisplayDialog(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        onClick={() => {
          confirmDialog({
            message: 'Удалить запись?',
            header: 'Подтверждение',
            acceptLabel: 'Да',
            rejectLabel: 'Нет',
            accept: () => removeExpense(rowData.id),
          });
        }}
      />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="grid mb-4">
        <div className="col-12 lg:col-4">
          <Card className="h-full flex align-items-center justify-content-center shadow-2">
            <div className="text-center">
              <span className="block text-500 font-medium mb-3 text-xl">Общий расход</span>
              <div className="text-primary font-bold text-4xl">
                {formatAmount(expenses.reduce((acc, curr) => acc + curr.amount, 0))}
              </div>
            </div>
          </Card>
        </div>
        <div className="col-12 lg:col-8">
          <Card title="Аналитика категорий" className="shadow-2">
            <div className="flex justify-content-center">
              {expenses.length > 0 ? (
                <Chart
                  type="doughnut"
                  data={getChartData()}
                  options={{ maintainAspectRatio: false, aspectRatio: 1.5 }}
                  style={{ width: '100%', maxHeight: '250px' }}
                />
              ) : (
                <p className="text-500">Нет данных</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Card title="История операций" className="shadow-2">
        <DataTable
          value={expenses}
          loading={loading}
          paginator
          rows={5}
          responsiveLayout="stack"
          breakpoint="960px"
          header={
            <Button label="Добавить расход" icon="pi pi-plus" onClick={openNew} size="small" />
          }
        >
          <Column field="title" header="Название" sortable />
          <Column field="category" header="Категория" sortable />
          <Column 
            field="amount" 
            header="Сумма" 
            body={(r: Expense) => formatAmount(r.amount)} 
            sortable 
          />
          <Column
            field="date"
            header="Дата"
            body={(r: Expense) => new Date(r.date).toLocaleDateString()}
            sortable
          />
          <Column body={actionTemplate} header="Действия" />
        </DataTable>
      </Card>

      <Dialog
        visible={displayDialog}
        header={isEdit ? 'Редактировать' : 'Новый расход'}
        onHide={() => setDisplayDialog(false)}
        style={{ width: '90vw', maxWidth: '400px' }}
      >
        <div className="flex flex-column gap-4 pt-3">
          <span className="p-float-label">
            <InputText
              id="title"
              className="w-full"
              value={expense.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setExpense({ ...expense, title: e.target.value })
              }
            />
            <label htmlFor="title">Название</label>
          </span>
          <span className="p-float-label">
            <InputNumber
              id="amount"
              className="w-full"
              value={expense.amount}
              onValueChange={(e: InputNumberValueChangeEvent) => 
                setExpense({ ...expense, amount: e.value || 0 })
              }
              mode="currency"
              currency={currency}
              locale={currency === 'RUB' ? 'ru-RU' : 'en-US'}
            />
            <label htmlFor="amount">Сумма</label>
          </span>
          <Dropdown
            value={expense.category}
            options={categories}
            onChange={(e: DropdownChangeEvent) => 
              setExpense({ ...expense, category: e.value })
            }
            placeholder="Выберите категорию"
            className="w-full"
          />
          <Button
            label="Сохранить"
            icon="pi pi-check"
            onClick={handleSave}
            className="w-full mt-2"
          />
        </div>
      </Dialog>
    </motion.div>
  );
};

export default HomeView;