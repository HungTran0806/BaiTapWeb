export type WorkSchedule = {
  day: string;
  startTime: string;
  endTime: string;
};

export interface Staff {
  id: number;
  name: string;
  maxCustomersPerDay: number;
  schedules: WorkSchedule[];
};

export interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
};

export type AppointmentStatus =
  | 'CHỜ DUYỆT'
  | 'XÁC NHẬN'
  | 'HOÀN THÀNH'
  | 'HỦY';

export interface Appointment {
  id: number;
  customerName: string;
  staffId: number;
  serviceId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
};

export interface Review {
  id: number;
  appointmentId: number;
  staffId: number;
  rating: number;
  comment: string;
  reply?: string;
};