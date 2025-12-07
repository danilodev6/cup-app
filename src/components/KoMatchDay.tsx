"use client";

import KoExploreBtn from "./KoExploreBtn";
import type { KnockoutMatchWithTeams } from "@/lib/types";

export default function KoMatchDay({
  matches,
}: {
  matches: KnockoutMatchWithTeams[];
}) {
  return (
    <ul className="list-none p-0 m-0 mx-auto">
      {matches.map((match) => (
        <li key={match.id}>
          <KoExploreBtn match={match} />
        </li>
      ))}
    </ul>
  );
}
