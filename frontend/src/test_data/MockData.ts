import type { Week } from "../types";

export const mockWeeks: Week[] = [
  {
    start: "2 Septembre",
    days: [
      {
        label: "Lundi 2 Septembre",
        timeslots: [
          { time: "18h00", teams: [] },
          { time: "19h00", teams: ["Équipe A"] },
          { time: "20h00", teams: ["Équipe B", "Équipe C"] },
        ],
      },
      {
        label: "Jeudi 5 Septembre",
        timeslots: [
          { time: "18h00", teams: [] },
          { time: "19h00", teams: ["Équipe D"] },
          { time: "20h00", teams: [] },
        ],
      },
    ],
  },
  {
    start: "9 Septembre",
    days: [
      {
        label: "Lundi 9 Septembre",
        timeslots: [
          { time: "18h00", teams: ["Équipe A"] },
          { time: "19h00", teams: ["Équipe B"] },
          { time: "20h00", teams: [] },
        ],
      },
      {
        label: "Jeudi 12 Septembre",
        timeslots: [
          { time: "18h00", teams: [] },
          { time: "19h00", teams: ["Équipe E"] },
          { time: "20h00", teams: ["Équipe F", "Équipe G"] },
        ],
      },
    ],
  },
];
