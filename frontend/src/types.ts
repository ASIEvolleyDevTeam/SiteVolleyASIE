export interface Slot {
  id: number;
  day: string;
  terrain: string;
  teams: string[];
  week_start_date: string;
}

export interface Day {
  label: string;
  terrainslots: Slot[];
}

export interface Week {
  id: number;
  start_date: string; // backend renvoie bien "start_date"
  days: Day[];
}
