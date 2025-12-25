"use client";

import ExploreBtnMatch from "./ExploreBtnGroupMatch";
import type { GroupMatchWithTeams } from "@/lib/types";

export default function MatchDay({
  groupMatches,
}: {
  groupMatches: GroupMatchWithTeams[];
}) {
  return (
    <ul className="list-none p-0 m-0 mx-auto">
      {groupMatches.map((groupMatch) => (
        <li key={groupMatch.id}>
          <ExploreBtnMatch groupMatch={groupMatch} />
        </li>
      ))}
    </ul>
  );
}
