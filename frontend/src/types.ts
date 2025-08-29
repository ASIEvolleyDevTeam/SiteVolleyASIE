export interface Slot {
  id: number;
  time: string;
  teams: string[];
}

export interface Day {
  label: string;
  timeslots: Slot[];
}

export interface Week {
  id: number;
  start_date: string; // backend renvoie bien "start_date"
  days: Day[];
}
