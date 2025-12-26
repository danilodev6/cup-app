"use client";

import ExploreBtnKoMatch from "./ExploreBtnKoMatch";
import type { KnockoutTieWithLegs } from "@/lib/types";

export default function KoMatchDay({
  koMatches,
}: {
  koMatches: KnockoutTieWithLegs[];
}) {
  return (
    <ul className="list-none p-0 m-0 mx-auto">
      {koMatches.map((koMatch) => (
        <li key={koMatch.id}>
          <ExploreBtnKoMatch koMatch={koMatch} />
        </li>
      ))}
    </ul>
  );
}
