export interface Slot {
  time: string;
  teams: string[];
}

export interface Day {
  label: string;
  timeslots: Slot[];
}

export interface Week {
  start: string; // e.g. "2 Septembre"
  days: Day[];
}
