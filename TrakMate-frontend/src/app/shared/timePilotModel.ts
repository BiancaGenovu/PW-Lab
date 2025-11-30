export interface PilotMeta {
  id: number;
  firstName: string;
  lastName: string;
}

export interface CircuitMeta {
  id: number;
  name: string;
  country: string;
}

export interface TimeModel {
  id: number;
  sector1Ms: number;
  sector2Ms: number;
  sector3Ms: number;
  lapTimeMs: number; // calculat automat
  createdAt: string | Date;
  pilot: PilotMeta;
  circuit: CircuitMeta;
}