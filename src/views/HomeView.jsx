import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useExpenseStore } from "../store/expenseStore";
import { useAuthStore } from "../store/authStore";
import { Chart } from "primereact/chart";
import { Card } from "primereact/card";

const HomeView = ({ isDark, toggleTheme }) => {
  const {
    expenses,
    loading,
    fetchExpenses,
    addExpense,
    updateExpense,
    removeExpense,
    getChartData
  } = useExpenseStore();
  const logout = useAuthStore((state) => state.logout);
  const toast = useRef(null);

  const [displayDialog, setDisplayDialog] = useState(false);
  const [expense, setExpense] = useState({
    title: "",
    amount: 0,
    category: "Другое",
    date: new Date(),
  });
  const [isEdit, setIsEdit] = useState(false);

  const categories = [
    "Продукты",
    "Транспорт",
    "Развлечения",
    "Жилье",
    "Здоровье",
    "Другое",
  ];

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const openNew = () => {
    setExpense({ title: "", amount: 0, category: "Другое", date: new Date() });
    setIsEdit(false);
    setDisplayDialog(true);
  };

  const handleSave = async () => {
    if (!expense.title || !expense.amount) return;
    try {
      if (isEdit) {
        await updateExpense(expense.id, expense);
        toast.current.show({
          severity: "success",
          summary: "Обновлено",
          detail: "Запись изменена",
        });
      } else {
        await addExpense(expense);
        toast.current.show({
          severity: "success",
          summary: "Успех",
          detail: "Расход добавлен",
        });
      }
      setDisplayDialog(false);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Ошибка",
        detail: "Ошибка сохранения",
      });
    }
  };

  const actionTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        onClick={() => {
          setExpense(rowData);
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
            message: "Удалить эту запись?",
            header: "Подтверждение",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Да",
            rejectLabel: "Нет",
            accept: () => removeExpense(rowData.id),
          });
        }}
      />
    </div>
  );

  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // Настройка стилей графика под тему
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");

    setChartOptions({
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
      maintainAspectRatio: false,
      aspectRatio: 0.8,
    });
  }, [isDark]); // Перерисовываем опции при смене темы

  const chartData = getChartData();

  return (
    <div className="p-4 mx-auto" style={{ maxWidth: "1000px" }}>
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="m-0 text-2xl font-bold">Трекер Расходов</h1>
        <div className="flex gap-2">
          <Button
            icon={isDark ? "pi pi-sun" : "pi pi-moon"}
            rounded
            text
            severity="secondary"
            onClick={toggleTheme}
            tooltip="Сменить тему"
          />
          <Button
            label="Добавить"
            icon="pi pi-plus"
            onClick={openNew}
            size="small"
          />
          <Button
            icon="pi pi-sign-out"
            severity="danger"
            text
            onClick={logout}
            size="small"
          />
        </div>
      </div>
      <div className="grid mb-4">
        <div className="col-12 md:col-6 lg:col-4 mx-auto">
          <Card title="Расходы по категориям" className="shadow-2">
            {expenses.length > 0 ? (
              <Chart
                type="pie"
                data={chartData}
                options={chartOptions}
                className="w-full"
                style={{ position: "relative", height: "300px" }}
              />
            ) : (
              <p className="text-center text-gray-500">
                Нет данных для анализа
              </p>
            )}
          </Card>
        </div>
      </div>

      <DataTable
        value={expenses}
        loading={loading}
        paginator
        rows={10}
        className="shadow-2"
      >
        <Column field="title" header="Название" sortable />
        <Column field="category" header="Категория" sortable />
        <Column
          field="amount"
          header="Сумма"
          body={(r) => `${r.amount.toLocaleString()} ₽`}
          sortable
        />
        <Column
          field="date"
          header="Дата"
          body={(r) => r.date.toLocaleDateString()}
          sortable
        />
        <Column body={actionTemplate} header="Действия" />
      </DataTable>

      <Dialog
        visible={displayDialog}
        header={isEdit ? "Редактировать" : "Новый расход"}
        onHide={() => setDisplayDialog(false)}
        style={{ width: "90vw", maxWidth: "400px" }}
      >
        <div className="flex flex-column gap-4 pt-3">
          <span className="p-float-label">
            <InputText
              id="title"
              className="w-full"
              value={expense.title}
              onChange={(e) =>
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
              onValueChange={(e) => setExpense({ ...expense, amount: e.value })}
              mode="currency"
              currency="RUB"
              locale="ru-RU"
            />
            <label htmlFor="amount">Сумма</label>
          </span>
          <Dropdown
            value={expense.category}
            options={categories}
            onChange={(e) => setExpense({ ...expense, category: e.value })}
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
    </div>
  );
};

export default HomeView;
