"use client";

import ExploreBtnKoMatch from "./ExploreBtnKoMatch";
import type { KnockoutTieWithLegs } from "@/lib/types";

export default function KoMatchDay({
  koMatches,
}: {
  koMatches: KnockoutTieWithLegs[];
}) {
  return (
    <ul className="list-none p-0 m-0 mx-auto flex flex-col items-center">
      {koMatches.map((koMatch) => (
        <li key={koMatch.id} className="w-full flex justify-center">
          <ExploreBtnKoMatch koMatch={koMatch} />
        </li>
      ))}
    </ul>
  );
}
