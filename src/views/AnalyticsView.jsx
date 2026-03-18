import React from 'react';
import { motion } from 'framer-motion';
import { Card } from 'primereact/card';

const AnalyticsView = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-4">Аналитика</h1>
      <div className="grid">
        <div className="col-12 md:col-6 lg:col-4">
          <Card title="Расходы за месяц" subTitle="Общий итог">
            <p className="m-0 text-2xl font-bold text-primary">0.00 ₽</p>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsView;
