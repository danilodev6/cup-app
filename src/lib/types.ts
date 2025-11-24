enum stage {
  group,
  knockout,
}

export interface Match {
  id: number;
  date: string;
  stage: stage;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}
