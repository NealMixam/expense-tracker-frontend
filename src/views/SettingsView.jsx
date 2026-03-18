import { motion } from 'framer-motion';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
const SettingsView = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-4">Настройки</h1>
      <Card>
        <h3>Профиль</h3>
        <p className="text-600">Управление вашими личными данными и предпочтениями.</p>
        <Divider />
        <h3>Уведомления</h3>
        <p className="text-600">Настройка лимитов и предупреждений о расходах.</p>
      </Card>
    </motion.div>
  );
};

export default SettingsView;
