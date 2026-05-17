import { useState } from 'react';

export interface GoalRecord {
  key: string;
  title: string;
  type: string;
  targetValue: number;
  currentValue: number;
  deadline: string;
  status: string;
}

const initialGoals: GoalRecord[] = [
  { key: '1', title: 'Giảm 5kg', type: 'Giảm cân', targetValue: 5, currentValue: 2, deadline: '2026-06-30', status: 'Đang thực hiện' },
  { key: '2', title: 'Tăng cơ tay', type: 'Tăng cơ', targetValue: 4, currentValue: 3, deadline: '2026-08-15', status: 'Đang thực hiện' },
  { key: '3', title: 'Chạy 5km liên tục', type: 'Cải thiện sức bền', targetValue: 5, currentValue: 5, deadline: '2026-07-10', status: 'Đã đạt' },
];

export default () => {
  const [goals, setGoals] = useState<GoalRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fitness_goals');
      return saved ? JSON.parse(saved) : initialGoals;
    }
    return initialGoals;
  });

  const saveToStorage = (data: GoalRecord[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fitness_goals', JSON.stringify(data));
    }
  };

  const addGoal = (record: Omit<GoalRecord, 'key'>) => {
    const newRecord: GoalRecord = { ...record, key: `${Date.now()}` };
    const updated = [newRecord, ...goals];
    setGoals(updated);
    saveToStorage(updated);
  };

  const updateGoal = (key: string, record: GoalRecord) => {
    const updated = goals.map((item) => (item.key === key ? record : item));
    setGoals(updated);
    saveToStorage(updated);
  };

  const deleteGoal = (key: string) => {
    const updated = goals.filter((item) => item.key !== key);
    setGoals(updated);
    saveToStorage(updated);
  };

  const getGoals = () => goals;

  const getActiveGoals = () => goals.filter((item) => item.status === 'Đang thực hiện');

  const getAchievedGoals = () => goals.filter((item) => item.status === 'Đã đạt');

  const getCompletionPercentage = () => {
    if (goals.length === 0) return 0;
    const achieved = getAchievedGoals().length;
    return Math.round((achieved / goals.length) * 100);
  };

  const getAverageProgress = () => {
    if (goals.length === 0) return 0;
    const totalProgress = goals.reduce((sum, goal) => sum + Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)), 0);
    return Math.round(totalProgress / goals.length);
  };

  return {
    goals: getGoals(),
    addGoal,
    updateGoal,
    deleteGoal,
    getActiveGoals,
    getAchievedGoals,
    getCompletionPercentage,
    getAverageProgress,
  };
};
