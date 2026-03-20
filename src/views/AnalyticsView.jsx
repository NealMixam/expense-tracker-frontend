import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { ProgressBar } from 'primereact/progressbar';
import { Dropdown } from 'primereact/dropdown';
import { useExpenseStore } from '../store/expenseStore';

const AnalyticsView = () => {
  const { expenses } = useExpenseStore();
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [topCategories, setTopCategories] = useState([]);
  
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const periods = [
    { label: 'За всё время', value: 'all' },
    { label: 'За месяц', value: 'month' },
    { label: 'За неделю', value: 'week' }
  ];

  useEffect(() => {
    if (expenses.length === 0) return;

    const now = new Date();
    const filteredExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      if (selectedPeriod === 'month') {
        return expDate > new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      }
      if (selectedPeriod === 'week') {
        return expDate > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }
      return true; // 'all'
    });

    if (filteredExpenses.length === 0) {
      setChartData({});
      setTopCategories([]);
      return;
    }

    const categoriesMap = {};
    filteredExpenses.forEach(exp => {
      categoriesMap[exp.category] = (categoriesMap[exp.category] || 0) + Number(exp.amount);
    });

    const totalAmount = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    const sortedCategories = Object.entries(categoriesMap)
      .map(([name, value]) => ({
        name,
        value,
        percentage: ((value / totalAmount) * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);

    setTopCategories(sortedCategories);

    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: Object.keys(categoriesMap),
      datasets: [{
        data: Object.values(categoriesMap),
        backgroundColor: [
          documentStyle.getPropertyValue('--blue-500'), 
          documentStyle.getPropertyValue('--yellow-500'), 
          documentStyle.getPropertyValue('--green-500'),
          documentStyle.getPropertyValue('--pink-500'),
          documentStyle.getPropertyValue('--purple-500')
        ]
      }]
    };

    setChartData(data);
    setChartOptions({
      plugins: {
        legend: { labels: { color: documentStyle.getPropertyValue('--text-color') } }
      },
      maintainAspectRatio: false,
      aspectRatio: 0.8
    });
  }, [expenses, selectedPeriod]); 

  const currentTotal = topCategories.reduce((sum, cat) => sum + cat.value, 0); 

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex align-items-center justify-content-between mb-4">
        <h1 className="text-3xl font-bold m-0">Аналитика</h1>
        <Dropdown 
          value={selectedPeriod} 
          options={periods} 
          onChange={(e) => setSelectedPeriod(e.value)} 
          placeholder="Выберите период"
          className="w-full md:w-15rem"
        />
      </div>
      
      <div className="grid">
        <div className="col-12 md:col-4">
          <Card title="Итог за период" className="h-full">
            <p className="m-0 text-3xl font-bold text-primary">
              {topCategories.length > 0 
                ? Object.values(chartData.datasets?.[0]?.data || []).reduce((a, b) => a + b, 0).toLocaleString('ru-RU') 
                : 0} ₽
            </p>
          </Card>
        </div>

        <div className="col-12 md:col-8">
          <Card title="Детализация">
            {topCategories.length > 0 ? (
              <>
                <div className="flex justify-content-center mb-4">
                  <Chart type="pie" data={chartData} options={chartOptions} style={{ width: '250px' }} />
                </div>

                <div className="mt-4">
                  <h4 className="mb-3">Топ-3 категорий</h4>
                  {topCategories.map((cat, index) => (
                    <div key={cat.name} className="mb-3">
                      <div className="flex justify-content-between mb-1">
                        <span>{cat.name}</span>
                        <span className="text-600 font-bold">{cat.value.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <ProgressBar value={cat.percentage} showValue={false} style={{ height: '6px' }} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-5">
                <i className="pi pi-filter-slash text-4xl text-400 mb-3"></i>
                <p className="text-500">За этот период операций не найдено</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsView;