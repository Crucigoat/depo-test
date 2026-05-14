export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'perso' | 'boulot' | 'sport' | 'mental';
  targetDate: string; // ISO date YYYY-MM-DD
  createdAt: string;
}
