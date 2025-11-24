import ExploreBtn from "./ExploreBtn";
import type { Match } from "@/lib/types";

const mockMatches: Match[] = [
  {
    id: 1,
    date: "2024-06-15",
    stage: 0,
    homeTeam: {
      name: "Boca Juniors",
      logoUrl: "/club-logo/boca-juniors.png",
      id: 0,
    },
    awayTeam: {
      name: "Talleres Cordoba",
      logoUrl: "/club-logo/talleres.png",
      id: 1,
    },
    homeScore: 3,
    awayScore: 1,
  },
];

const MatchDay = () => {
  return (
    <ul className="list-none p-0 m-0">
      {mockMatches.map((m: Match) => (
        <li key={m.id}>
          <ExploreBtn
            id={m.id}
            date={m.date}
            stage={m.stage}
            homeTeam={m.homeTeam}
            awayTeam={m.awayTeam}
            homeScore={m.homeScore}
            awayScore={m.awayScore}
          />
        </li>
      ))}
    </ul>
  );
};

export default MatchDay;
