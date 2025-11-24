enum stage {
  group,
  knockout,
}

export interface Team {
  id: number;
  name: string;
  logoUrl: string;
}

export interface Match {
  id: number;
  date: string;
  stage: stage;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
}
