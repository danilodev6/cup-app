"use client";

import ExploreBtn from "./ExploreBtn";
import type { MatchWithTeams } from "@/lib/types";

export default function MatchDay({ matches }: { matches: MatchWithTeams[] }) {
  return (
    <ul className="list-none p-0 m-0">
      {matches.map((match) => (
        <li key={match.id}>
          <ExploreBtn match={match} />
        </li>
      ))}
    </ul>
  );
}
