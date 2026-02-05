<script setup>
import { ref, onMounted } from 'vue';
import { useExpenseStore } from '../stores/expenses';
import { useAuthStore } from '../stores/auth';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Card from 'primevue/card';
import Select from 'primevue/select';
import Chart from 'primevue/chart';

import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
const toast = useToast();
const confirm = useConfirm();

const chartOptions = ref({
    plugins: {
        legend: {
            labels: {
                usePointStyle: true,
                color: 'var(--p-text-color)'
            }
        }
    }
});

const store = useExpenseStore();
const auth = useAuthStore();

const expenseDialog = ref(false);
const submitted = ref(false);
const expense = ref({});

const isDark = ref(document.documentElement.classList.contains('p-dark'));

const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle('p-dark');

    isDark.value = html.classList.contains('p-dark');

    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

onMounted(() => {
    store.fetchExpenses();
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('p-dark');
        isDark.value = true;
    }
});

const openNew = () => {
    expense.value = { title: '', amount: null, date: new Date() };
    submitted.value = false;
    expenseDialog.value = true;
};

const editExpense = (data) => {
    expense.value = { ...data };
    expenseDialog.value = true;
};

const saveExpense = async () => {
    submitted.value = true;
    if (expense.value.title && expense.value.amount) {
        try {
            if (expense.value.id) {
                await store.updateExpense(expense.value);
                toast.add({ severity: 'success', summary: 'Обновлено', detail: 'Запись изменена', life: 3000 });
            } else {
                await store.addExpense(expense.value);
                toast.add({ severity: 'success', summary: 'Успех', detail: 'Расход добавлен', life: 3000 });
            }
            expenseDialog.value = false;
        } catch (e) {
            toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось сохранить', life: 3000 });
        }
    }
};

const deleteExpense = (id) => {
    confirm.require({
        message: 'Вы уверены, что хотите удалить эту запись?',
        header: 'Подтверждение удаления',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Отмена',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Удалить',
            severity: 'danger'
        },
        accept: async () => {
            try {
                await store.removeExpense(id);
                toast.add({
                    severity: 'info',
                    summary: 'Удалено',
                    detail: 'Запись успешно стерта',
                    life: 3000
                });
            } catch (e) {
                toast.add({
                    severity: 'error',
                    summary: 'Ошибка',
                    detail: 'Не удалось удалить запись',
                    life: 3000
                });
            }
        },
        reject: () => {
        }
    });
};

const formatCurrency = (value) => value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
const formatDate = (date) => new Date(date).toLocaleDateString('ru-RU');

const categories = ref([
    { name: 'Продукты', value: 'Продукты' },
    { name: 'Транспорт', value: 'Транспорт' },
    { name: 'Развлечения', value: 'Развлечения' },
    { name: 'Жилье', value: 'Жилье' },
    { name: 'Здоровье', value: 'Здоровье' },
    { name: 'Другое', value: 'Другое' }
]);
</script>

<template>
    <div class="container">
        <div class="grid-layout">
            <div class="chart-section mb-4">
                <Card>
                    <template #title>Аналитика по категориям</template>
                    <template #content>
                        <div class="flex justify-center">
                            <div v-if="store.expenses.length === 0">Добавьте расходы, чтобы увидеть статистику</div>
                            <Chart v-else type="pie" :data="store.chartData" :options="chartOptions"
                                class="w-full md:w-[20rem]" />
                        </div>
                    </template>
                </Card>
            </div>
            <Card>
                <template #title>
                    <div class="header-flex">
                        <div class="flex align-items-center gap-2">
                            <span>Мои Расходы</span>
                            <p>Количество записей: {{ store.expenses.length }}</p>
                            <Button :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'" severity="secondary" text
                                @click="toggleDarkMode" />
                            <Button icon="pi pi-sign-out" severity="secondary" text @click="auth.logout"
                                title="Выйти" />
                        </div>
                        <Button label="Добавить" icon="pi pi-plus" @click="openNew" />
                    </div>
                </template>

                <template #content>
                    <DataTable :value="store.expenses" stripedRows tableStyle="min-width: 50rem">
                        <Column field="title" header="Название"></Column>
                        <Column field="amount" header="Сумма">
                            <template #body="slotProps">
                                {{ formatCurrency(slotProps.data.amount) }}
                            </template>
                        </Column>
                        <Column field="date" header="Дата">
                            <template #body="slotProps">
                                {{ formatDate(slotProps.data.date) }}
                            </template>
                        </Column>
                        <Column field="category" header="Категория" sortable></Column>
                        <Column header="Действия">
                            <template #body="slotProps">
                                <Button icon="pi pi-pencil" class="mr-2" severity="info" text rounded
                                    @click="editExpense(slotProps.data)" />
                                <Button icon="pi pi-trash" severity="danger" text rounded
                                    @click="deleteExpense(slotProps.data.id)" />
                            </template>
                        </Column>
                    </DataTable>
                </template>
            </Card>

            <Dialog v-model:visible="expenseDialog" :style="{ width: '450px' }" header="Детали расхода" :modal="true">
                <div class="field mt-4">
                    <label for="title" class="font-bold">Название</label>
                    <InputText id="title" v-model.trim="expense.title" required autofocus fluid />
                </div>

                <div class="field">
                    <label for="amount" class="font-bold">Сумма</label>
                    <InputNumber id="amount" v-model="expense.amount" mode="currency" currency="RUB" locale="ru-RU"
                        fluid />
                </div>

                <div class="field">
                    <label for="date" class="font-bold">Дата</label>
                    <DatePicker v-model="expense.date" showIcon fluid dateFormat="dd.mm.yy" />
                </div>

                <div class="field">
                    <label for="category" class="font-bold">Категория</label>
                    <Select id="category" v-model="expense.category" :options="categories" optionLabel="name"
                        optionValue="value" placeholder="Выберите категорию" fluid />
                </div>

                <template #footer>
                    <Button label="Отмена" icon="pi pi-times" text @click="expenseDialog = false" />
                    <Button label="Сохранить" icon="pi pi-check" @click="saveExpense" />
                </template>
            </Dialog>
        </div>
    </div>
</template>

<style>
.grid-layout {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

@media (min-width: 1024px) {
    .grid-layout {
        flex-direction: row;
        align-items: flex-start;
    }
}

.mb-4 {
    margin-bottom: 1rem;
}

.justify-center {
    display: flex;
    justify-content: center;
}

.w-full {
    width: 100%;
    max-width: 300px;
}

.container {
    max-width: 900px;
    margin: 2rem auto;
}

.header-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.field {
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.mr-2 {
    margin-right: 0.5rem;
}
</style>