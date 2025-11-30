enum stage {
  group,
  knockout,
}

export interface Tournament {
  id: number;
  name: string;
  teamCount: number;
  Teams: Team[];
}

export interface Team {
  id: number;
  name: string;
  logoUrl: string;
  players?: Player[];
  group?: string;
}

export interface Match {
  id: number;
  date: string;
  stage: stage;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number;
  awayScore: number;
}

export interface Player {
  id: number;
  name: string;
  photoUrl: string;
  teamId: number;
  score: number;
  yellowCards: number;
  redCards: number;
}
