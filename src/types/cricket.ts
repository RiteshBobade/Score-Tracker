export interface BallEvent {
  type: 'RUN' | 'W' | 'WD' | 'NB';
  value?: number;
}

export interface TimelineEntry {
  overIndex: number;
  label: string;
  runsAdded: number;
  legalBall: boolean;
  wicketAdded: number;
}

export interface Innings {
  battingTeam: string;
  bowlingTeam: string;
  runs: number;
  wickets: number;
  balls: number;
  overs: string[][];
  timeline: TimelineEntry[];
}

export interface Match {
  started: boolean;
  ended: boolean;
  oversLimit: number;
  teamA: string;
  teamB: string;
  currentInnings: number;
  innings: Innings[];
}

export interface MatchSetup {
  teamA: string;
  teamB: string;
  overs: number;
}