"use client";

import ExploreBtnMatch from "./ExploreBtnMatch";
import type { MatchWithTeams } from "@/lib/types";

export default function MatchDay({ matches }: { matches: MatchWithTeams[] }) {
  return (
    <ul className="list-none p-0 m-0 mx-auto">
      {matches.map((match) => (
        <li key={match.id}>
          <ExploreBtnMatch match={match} />
        </li>
      ))}
    </ul>
  );
}
