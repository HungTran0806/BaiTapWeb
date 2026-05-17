import { useState } from 'react';

export interface WorkoutRecord {
  key: string;
  date: string;
  exercise: string;
  type: string;
  duration: number;
  calories: number;
  notes: string;
  status: string;
}

const initialWorkouts: WorkoutRecord[] = [
  { key: '1', date: '2026-05-07', exercise: 'Chạy bộ', type: 'Cardio', duration: 45, calories: 420, notes: 'Nhịp tim ổn định', status: 'Hoàn thành' },
  { key: '2', date: '2026-05-09', exercise: 'Tạ tay', type: 'Strength', duration: 60, calories: 390, notes: 'Tăng sức mạnh tay', status: 'Hoàn thành' },
  { key: '3', date: '2026-05-11', exercise: 'Yoga thư giãn', type: 'Yoga', duration: 50, calories: 180, notes: 'Giãn cơ', status: 'Hoàn thành' },
  { key: '4', date: '2026-05-13', exercise: 'Tabata', type: 'HIIT', duration: 30, calories: 320, notes: 'Tập cường độ cao', status: 'Bỏ lỡ' },
  { key: '5', date: '2026-05-14', exercise: 'Plank và core', type: 'Other', duration: 35, calories: 210, notes: 'Tập cơ bụng', status: 'Hoàn thành' },
];

export default () => {
  const [workouts, setWorkouts] = useState<WorkoutRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fitness_workouts');
      return saved ? JSON.parse(saved) : initialWorkouts;
    }
    return initialWorkouts;
  });

  const saveToStorage = (data: WorkoutRecord[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fitness_workouts', JSON.stringify(data));
    }
  };

  const addWorkout = (record: Omit<WorkoutRecord, 'key'>) => {
    const newRecord: WorkoutRecord = { ...record, key: `${Date.now()}` };
    const updated = [newRecord, ...workouts];
    setWorkouts(updated);
    saveToStorage(updated);
  };

  const updateWorkout = (key: string, record: WorkoutRecord) => {
    const updated = workouts.map((item: WorkoutRecord) => (item.key === key ? record : item));
    setWorkouts(updated);
    saveToStorage(updated);
  };

  const deleteWorkout = (key: string) => {
    const updated = workouts.filter((item: WorkoutRecord) => item.key !== key);
    setWorkouts(updated);
    saveToStorage(updated);
  };

  const getWorkouts = () => workouts;

  const getTotalWorkouts = () => workouts.length;

  const getTotalCalories = () => workouts.reduce((sum: number, item: WorkoutRecord) => sum + item.calories, 0);

  const getCompletedWorkouts = () => workouts.filter((item: WorkoutRecord) => item.status === 'Hoàn thành').length;

  const getRecentWorkouts = (limit: number = 5) => {
    return [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit);
  };

  const getWorkoutsByMonth = () => {
    const weeks = { 'Tuần 1': 0, 'Tuần 2': 0, 'Tuần 3': 0, 'Tuần 4': 0 };
    workouts.forEach((item: WorkoutRecord) => {
      const day = parseInt(item.date.split('-')[2]);
      if (day <= 7) weeks['Tuần 1']++;
      else if (day <= 14) weeks['Tuần 2']++;
      else if (day <= 21) weeks['Tuần 3']++;
      else weeks['Tuần 4']++;
    });
    return weeks;
  };

  return { workouts: getWorkouts(), addWorkout, updateWorkout, deleteWorkout, getTotalWorkouts, getTotalCalories, getCompletedWorkouts, getRecentWorkouts, getWorkoutsByMonth };
};
