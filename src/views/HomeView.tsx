import React, { useEffect, useState, useRef, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { useExpenseStore, Expense, ExpenseFormData } from '../store/expenseStore';
import { motion } from 'framer-motion';
import { ExpenseForm } from './ExpenseForm';

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
  const [currentExpense, setCurrentExpense] = useState<ExpenseFormData | null>(null);

  const totalAmount = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const chartData = useMemo(() => {
    return getChartData();
  }, [expenses, getChartData]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const openNew = () => {
    setCurrentExpense({ title: '', amount: 0, category: 'Другое', date: new Date() });
    setIsEdit(false);
    setDisplayDialog(true);
  };

  const handleSave = async (formData: ExpenseFormData) => {
    if (!formData.title || !formData.amount) return;

    try {
      if (isEdit && formData.id) {
        await updateExpense(formData.id, formData as Expense);
      } else {
        await addExpense(formData as Expense);
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
        rounded text
        onClick={() => {
          setCurrentExpense({ ...rowData });
          setIsEdit(true);
          setDisplayDialog(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        rounded text severity="danger"
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
                {formatAmount(totalAmount)}
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
                  data={chartData}
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
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          className="p-datatable-sm"
          rows={5}
          responsiveLayout="stack"
          breakpoint="960px"
          header={
            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
              <h3 className="m-0 text-xl">Операции</h3>
              <Button
                label="Добавить расход"
                icon="pi pi-plus"
                onClick={openNew}
                className="w-full md:w-auto"
                size="small"
              />
            </div>
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
        blockScroll
      >
        {displayDialog && currentExpense && (
          <ExpenseForm
            initialData={currentExpense}
            currency={currency}
            onSave={handleSave}
          />
        )}
      </Dialog>
    </motion.div>
  );
};

export default HomeView;