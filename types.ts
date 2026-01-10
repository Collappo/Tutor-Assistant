
export type ThemeColor = 'blue' | 'emerald' | 'amber' | 'violet';

export interface Student {
  id: string;
  name: string;
  subject: string;
  contact: string;
  level: string;
}

export interface Lesson {
  id: string;
  studentId: string;
  date: string;
  time: string;
  duration: number; // minutes
  topic?: string; // opcjonalne
  price: number; // price for this specific lesson
  status: 'planned' | 'completed' | 'cancelled';
  notes?: string;
  groupId?: string; // identyfikator serii lekcji
}

export interface AppState {
  students: Student[];
  lessons: Lesson[];
  theme: ThemeColor;
}
