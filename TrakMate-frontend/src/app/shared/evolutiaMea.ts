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
  last: number;
  best: number;
  diff: number;
}

export interface EvolutionStats {
  totalRuns: number;
  bestTime: number;
  worstTime: number;
  avgTime: number;
  lastTime: number;
  consistency: number;
  improvement: number;
  sectorComparison: {
    sector1: SectorComparison;
    sector2: SectorComparison;
    sector3: SectorComparison;
  };
}

export interface EvolutionResponse {
  times: TimeRecord[];
  stats: EvolutionStats | null;
  pilot: PilotMeta;
  circuit: CircuitMeta;
  message?: string;
}