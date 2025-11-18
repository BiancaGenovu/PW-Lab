export interface PilotMeta {
  id: number;
  firstName: string;
  lastName: string;
}

export interface CircuitMeta {
  id: number;
  name: string;
}

export interface TimeModel {
  id: number;
  lapTimeMs: number;
  createdAt: string | Date;
  pilot: PilotMeta;
  circuit: CircuitMeta;
}
