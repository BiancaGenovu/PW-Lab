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
  pilot: PilotMeta;
  circuit: CircuitMeta;
}

export interface SectorComparison {
  you: number;
  rival: number;
  diff: number;
  winner: 'you' | 'rival' | 'tie';
}

export interface ComparisonInsights {
  yourStrongSector: string | null;
  yourWeakSector: string | null;
  rivalWeakSector: string | null;
}

export interface ComparisonData {
  winner: 'you' | 'rival' | 'tie';
  timeDiff: number;
  sectorComparison: {
    sector1: SectorComparison;
    sector2: SectorComparison;
    sector3: SectorComparison;
  };
  insights: ComparisonInsights;
}

export interface PilotComparisonResponse {
  myTime: TimeRecord | null;
  rivalTime: TimeRecord | null;
  comparison: ComparisonData | null;
  message?: string;
}