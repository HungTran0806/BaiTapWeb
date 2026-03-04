import React, { useState, useEffect } from 'react';

interface Subject {
  id: string;
  name: string;
}

interface Session {
  id: string;
  subjectId: string;
  date: string;
  time: string;
  duration: string;
  content: string;
  note: string;
}

interface Goal {
  id: string;
  subjectId: string;
  month: string;
  targetHours: string;
}
const StudyTracker = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeTab, setActiveTab] = useState('subjects');
  const [subjectForm, setSubjectForm] = useState<Subject>({ id: '', name: '' });
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [sessionForm, setSessionForm] = useState<Session>({
    id: '',
    subjectId: '',
    date: '',
    time: '',
    duration: '',
    content: '',
    note: ''
  });
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [goalForm, setGoalForm] = useState<Goal>({
    id: '',
    subjectId: '',
    month: '',
    targetHours: ''
  });
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  useEffect(() => {
    const savedSubjects = localStorage.getItem('subjects');
    const savedSessions = localStorage.getItem('sessions');
    const savedGoals = localStorage.getItem('goals');

    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);
  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);
  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);
  const handleAddSubject = () => {
    if (!subjectForm.name.trim()) {
      alert('Vui lòng nhập tên môn học!');
      return;
    }
    if (isEditingSubject) {
      setSubjects(subjects.map(s => s.id === subjectForm.id ? subjectForm : s));
    } else {
      const newSubject = { ...subjectForm, id: Date.now().toString() };
      setSubjects([...subjects, newSubject]);
    }
    setSubjectForm({ id: '', name: '' });
    setIsEditingSubject(false);
  };
  const handleEditSubject = (subject: Subject) => {
    setSubjectForm(subject);
    setIsEditingSubject(true);
  };
  const handleDeleteSubject = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa môn học này?')) {
      setSubjects(subjects.filter(s => s.id !== id));
      setSessions(sessions.filter(s => s.subjectId !== id));
      setGoals(goals.filter(g => g.subjectId !== id));
    }
  };
  const handleAddSession = () => {
    if (!sessionForm.subjectId || !sessionForm.date || !sessionForm.time || !sessionForm.duration) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    if (isEditingSession) {
      setSessions(sessions.map(s => s.id === sessionForm.id ? sessionForm : s));
    } else {
      const newSession = { ...sessionForm, id: Date.now().toString() };
      setSessions([...sessions, newSession]);
    }

    setSessionForm({ id: '', subjectId: '', date: '', time: '', duration: '', content: '', note: '' });
    setIsEditingSession(false);
  };
  const handleEditSession = (session: Session) => {
    setSessionForm(session);
    setIsEditingSession(true);
  };

  const handleDeleteSession = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa buổi học này?')) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };
  const handleAddGoal = () => {
    if (!goalForm.subjectId || !goalForm.month || !goalForm.targetHours) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (isEditingGoal) {
      setGoals(goals.map(g => g.id === goalForm.id ? goalForm : g));
    } else {
      const newGoal = { ...goalForm, id: Date.now().toString() };
      setGoals([...goals, newGoal]);
    }

    setGoalForm({ id: '', subjectId: '', month: '', targetHours: '' });
    setIsEditingGoal(false);
  };

  const handleEditGoal = (goal: Goal) => {
    setGoalForm(goal);
    setIsEditingGoal(true);
  };

  const handleDeleteGoal = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa mục tiêu này?')) {
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  const calculateProgress = (subjectId: string, month: string) => {
    const filteredSessions = sessions.filter(s => {
      if (s.subjectId !== subjectId) return false;
      const sessionMonth = s.date.substring(0, 7); 
      return sessionMonth === month;
    });

    return filteredSessions.reduce((total, s) => total + parseFloat(s.duration || '0'), 0);
  };

  const getSubjectName = (id: string) => {
    const subject = subjects.find(s => s.id === id);
    return subject ? subject.name : 'Không xác định';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}> Quản Lý Học Tập</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
        <button
          onClick={() => setActiveTab('subjects')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'subjects' ? '#4CAF50' : '#f0f0f0',
            color: activeTab === 'subjects' ? 'white' : '#333',
            cursor: 'pointer',
            borderRadius: '5px 5px 0 0',
            fontWeight: 'bold'
          }}
        >
          Môn Học
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'sessions' ? '#2196F3' : '#f0f0f0',
            color: activeTab === 'sessions' ? 'white' : '#333',
            cursor: 'pointer',
            borderRadius: '5px 5px 0 0',
            fontWeight: 'bold'
          }}
        >
          Lịch Học
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'goals' ? '#FF9800' : '#f0f0f0',
            color: activeTab === 'goals' ? 'white' : '#333',
            cursor: 'pointer',
            borderRadius: '5px 5px 0 0',
            fontWeight: 'bold'
          }}
        >
          Mục Tiêu
        </button>
      </div>

      {activeTab === 'subjects' && (
        <div>
          <h2>Quản Lý Môn Học</h2>
          <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Tên môn học"
              value={subjectForm.name}
              onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
              style={{ padding: '10px', width: '300px', marginRight: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <button
              onClick={handleAddSubject}
              style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {isEditingSubject ? 'Cập Nhật' : 'Thêm Môn'}
            </button>
            {isEditingSubject && (
              <button
                onClick={() => {
                  setSubjectForm({ id: '', name: '' });
                  setIsEditingSubject(false);
                }}
                style={{ padding: '10px 20px', background: '#999', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' }}
              >
                Hủy
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
            {subjects.map(subject => (
              <div key={subject.id} style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{subject.name}</h3>
                <button
                  onClick={() => handleEditSubject(subject)}
                  style={{ padding: '5px 10px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteSubject(subject.id)}
                  style={{ padding: '5px 10px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sessions' && (
        <div>
          <h2>Quản Lý Lịch Học</h2>
          <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '10px' }}>
              <select
                value={sessionForm.subjectId}
                onChange={(e) => setSessionForm({ ...sessionForm, subjectId: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Chọn môn học</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input
                type="date"
                value={sessionForm.date}
                onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input
                type="time"
                value={sessionForm.time}
                onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input
                type="number"
                placeholder="Thời lượng (giờ)"
                value={sessionForm.duration}
                onChange={(e) => setSessionForm({ ...sessionForm, duration: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <input
              type="text"
              placeholder="Nội dung đã học"
              value={sessionForm.content}
              onChange={(e) => setSessionForm({ ...sessionForm, content: e.target.value })}
              style={{ padding: '10px', width: '100%', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <textarea
              placeholder="Ghi chú"
              value={sessionForm.note}
              onChange={(e) => setSessionForm({ ...sessionForm, note: e.target.value })}
              style={{ padding: '10px', width: '100%', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
            />
            <button
              onClick={handleAddSession}
              style={{ padding: '10px 20px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {isEditingSession ? 'Cập Nhật' : 'Thêm Buổi Học'}
            </button>
            {isEditingSession && (
              <button
                onClick={() => {
                  setSessionForm({ id: '', subjectId: '', date: '', time: '', duration: '', content: '', note: '' });
                  setIsEditingSession(false);
                }}
                style={{ padding: '10px 20px', background: '#999', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' }}
              >
                Hủy
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sessions.map(session => (
              <div key={session.id} style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', color: '#2196F3' }}>{getSubjectName(session.subjectId)}</h3>
                    <p style={{ margin: '5px 0' }}><strong>Ngày:</strong> {session.date} - {session.time}</p>
                    <p style={{ margin: '5px 0' }}><strong>Thời lượng:</strong> {session.duration} giờ</p>
                    <p style={{ margin: '5px 0' }}><strong>Nội dung:</strong> {session.content}</p>
                    {session.note && <p style={{ margin: '5px 0' }}><strong>Ghi chú:</strong> {session.note}</p>}
                  </div>
                  <div>
                    <button
                      onClick={() => handleEditSession(session)}
                      style={{ padding: '5px 10px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      style={{ padding: '5px 10px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: MỤC TIÊU */}
      {activeTab === 'goals' && (
        <div>
          <h2>Mục Tiêu Học Tập</h2>
          <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '10px' }}>
              <select
                value={goalForm.subjectId}
                onChange={(e) => setGoalForm({ ...goalForm, subjectId: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Chọn môn học</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input
                type="month"
                value={goalForm.month}
                onChange={(e) => setGoalForm({ ...goalForm, month: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input
                type="number"
                placeholder="Mục tiêu (giờ)"
                value={goalForm.targetHours}
                onChange={(e) => setGoalForm({ ...goalForm, targetHours: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <button
              onClick={handleAddGoal}
              style={{ padding: '10px 20px', background: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {isEditingGoal ? 'Cập Nhật' : 'Thêm Mục Tiêu'}
            </button>
            {isEditingGoal && (
              <button
                onClick={() => {
                  setGoalForm({ id: '', subjectId: '', month: '', targetHours: '' });
                  setIsEditingGoal(false);
                }}
                style={{ padding: '10px 20px', background: '#999', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' }}
              >
                Hủy
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {goals.map(goal => {
              const progress = calculateProgress(goal.subjectId, goal.month);
              const percentage = (progress / parseFloat(goal.targetHours)) * 100;
              const isCompleted = progress >= parseFloat(goal.targetHours);

              return (
                <div key={goal.id} style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0', color: '#FF9800' }}>{getSubjectName(goal.subjectId)}</h3>
                      <p style={{ margin: '5px 0' }}><strong>Tháng:</strong> {goal.month}</p>
                      <p style={{ margin: '5px 0' }}><strong>Mục tiêu:</strong> {goal.targetHours} giờ</p>
                      <p style={{ margin: '5px 0' }}><strong>Đã học:</strong> {progress.toFixed(1)} giờ</p>
                    </div>
                    <div>
                      <button
                        onClick={() => handleEditGoal(goal)}
                        style={{ padding: '5px 10px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        style={{ padding: '5px 10px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                  
                  {/* Thanh tiến độ */}
                  <div style={{ background: '#e0e0e0', borderRadius: '10px', overflow: 'hidden', height: '20px', marginBottom: '5px' }}>
                    <div
                      style={{
                        background: isCompleted ? '#4CAF50' : '#FF9800',
                        height: '100%',
                        width: `${Math.min(percentage, 100)}%`,
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                  <p style={{ margin: '5px 0', textAlign: 'center', fontWeight: 'bold', color: isCompleted ? '#4CAF50' : '#FF9800' }}>
                    {isCompleted ? '✅ Đã hoàn thành!' : `${percentage.toFixed(1)}% - Chưa đạt mục tiêu`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyTracker;