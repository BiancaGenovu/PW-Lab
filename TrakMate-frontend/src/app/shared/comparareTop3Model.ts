export interface PilotMeta {
  id: number;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

export interface CircuitMeta {
  id: number;
  name: string;
  country: string;
}

export interface TimeRecord {
  id: number;
  sector1Ms: number;
  sector2Ms: number;
  sector3Ms: number;
  lapTimeMs: number;
  createdAt: string | Date;
  pilotId: number;
  pilot: PilotMeta;
  circuit?: CircuitMeta;
}

export interface MyPosition {
  position: number;
  time: TimeRecord;
  totalPilots: number;
}

export interface GapAnalysis {
  timeDiff: number;
  sector1Diff: number;
  sector2Diff: number;
  sector3Diff: number;
  percentageGap: string;
  closenessPercentage: string;
}

export interface Top3Response {
  top3: TimeRecord[];
  myPosition: MyPosition | null;
  gapAnalysis: GapAnalysis | null;
  circuit?: CircuitMeta;
  message?: string;
}