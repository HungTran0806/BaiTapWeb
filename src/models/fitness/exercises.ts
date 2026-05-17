import { useState } from 'react';

export interface ExerciseItem {
  key: string;
  name: string;
  muscleGroup: string;
  difficulty: string;
  description: string;
  caloriesPerHour: number;
  details: string;
}

const initialExercises: ExerciseItem[] = [
  { key: '1', name: 'Đẩy ngực', muscleGroup: 'Chest', difficulty: 'Trung bình', description: 'Bài tập cho cơ ngực trước', caloriesPerHour: 480, details: 'Nằm trên ghế, dùng tạ đẩy thẳng lên, siết cơ ngực khi đưa tạ lên.' },
  { key: '2', name: 'Kéo xà', muscleGroup: 'Back', difficulty: 'Khó', description: 'Tập nhóm cơ lưng trên', caloriesPerHour: 520, details: 'Tay rộng, kéo người lên đến cằm qua thanh xà, kiểm soát khi hạ xuống.' },
  { key: '3', name: 'Squat', muscleGroup: 'Legs', difficulty: 'Trung bình', description: 'Tập chân và mông', caloriesPerHour: 560, details: 'Chân rộng bằng vai, hạ mông xuống, giữ lưng thẳng và đẩy lên bằng gót chân.' },
  { key: '4', name: 'Plank', muscleGroup: 'Core', difficulty: 'Dễ', description: 'Tập cơ bụng và core', caloriesPerHour: 300, details: 'Giữ thân thẳng, chống khuỷu tay và mũi chân trên sàn, siết cơ bụng.' },
];

export default () => {
  const [exercises, setExercises] = useState<ExerciseItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fitness_exercises');
      return saved ? JSON.parse(saved) : initialExercises;
    }
    return initialExercises;
  });

  const saveToStorage = (data: ExerciseItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fitness_exercises', JSON.stringify(data));
    }
  };

  const addExercise = (record: Omit<ExerciseItem, 'key'>) => {
    const newRecord: ExerciseItem = { ...record, key: `${Date.now()}` };
    const updated = [newRecord, ...exercises];
    setExercises(updated);
    saveToStorage(updated);
  };

  const updateExercise = (key: string, record: ExerciseItem) => {
    const updated = exercises.map((item: ExerciseItem) => (item.key === key ? record : item));
    setExercises(updated);
    saveToStorage(updated);
  };

  const deleteExercise = (key: string) => {
    const updated = exercises.filter((item: ExerciseItem) => item.key !== key);
    setExercises(updated);
    saveToStorage(updated);
  };

  const getExercises = () => exercises;

  const getExercisesByGroup = (group: string) => exercises.filter((item: ExerciseItem) => item.muscleGroup === group);

  const getExercisesByDifficulty = (difficulty: string) => exercises.filter((item: ExerciseItem) => item.difficulty === difficulty);

  return {
    exercises: getExercises(),
    addExercise,
    updateExercise,
    deleteExercise,
    getExercisesByGroup,
    getExercisesByDifficulty,
  };
};
