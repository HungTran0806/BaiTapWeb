import { useState } from 'react';

export interface HealthRecord {
  key: string;
  date: string;
  weight: number;
  height: number;
  restingHeartRate: number;
  sleepHours: number;
}

const initialHealthRecords: HealthRecord[] = [
  { key: '1', date: '2026-05-01', weight: 72, height: 175, restingHeartRate: 62, sleepHours: 7.5 },
  { key: '2', date: '2026-05-08', weight: 71.5, height: 175, restingHeartRate: 60, sleepHours: 7 },
  { key: '3', date: '2026-05-15', weight: 71, height: 175, restingHeartRate: 59, sleepHours: 7.2 },
];

export default () => {
  const [records, setRecords] = useState<HealthRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fitness_health');
      return saved ? JSON.parse(saved) : initialHealthRecords;
    }
    return initialHealthRecords;
  });

  const saveToStorage = (data: HealthRecord[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fitness_health', JSON.stringify(data));
    }
  };

  const calculateBMI = (weight: number, height: number) => {
    const meters = height / 100;
    return Number((weight / (meters * meters)).toFixed(1));
  };

  const addRecord = (record: Omit<HealthRecord, 'key'>) => {
    const newRecord: HealthRecord = { ...record, key: `${Date.now()}` };
    const updated = [newRecord, ...records];
    setRecords(updated);
    saveToStorage(updated);
  };

  const updateRecord = (key: string, record: HealthRecord) => {
    const updated = records.map((item: HealthRecord) => (item.key === key ? record : item));
    setRecords(updated);
    saveToStorage(updated);
  };

  const deleteRecord = (key: string) => {
    const updated = records.filter((item: HealthRecord) => item.key !== key);
    setRecords(updated);
    saveToStorage(updated);
  };

  const getRecords = () => records;

  const getWeightTrend = () => {
    return [...records]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item) => ({
        date: item.date,
        weight: item.weight,
      }));
  };

  const getLatestWeight = () => {
    const sorted = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sorted.length > 0 ? sorted[0].weight : 0;
  };

  const getWeightChange = () => {
    const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (sorted.length < 2) return 0;
    return sorted[0].weight - sorted[sorted.length - 1].weight;
  };

  return {
    records: getRecords(),
    addRecord,
    updateRecord,
    deleteRecord,
    calculateBMI,
    getWeightTrend,
    getLatestWeight,
    getWeightChange,
  };
};
