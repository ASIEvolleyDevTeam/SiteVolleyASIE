export interface Slot {
  id: number;
  terrain: string;
  teams: string[];
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
