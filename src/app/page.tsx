import prisma from "@/lib/prisma";
import ExploreTournament from "../components/ExploreTournament";
import Link from "next/link";

export default async function Home() {
  const tournaments = await prisma.tournament.findMany();

  return (
    <section>
      <h1 className="text-center">Welcome to a new Cup! </h1>
      <p className="text-center mt-4"> Good luck! </p>

      <div className="text-center space-y-7">
        <p>Select your tournament:</p>
        {tournaments.map((tournament) => (
          <ExploreTournament key={tournament.id} tournament={tournament} />
        ))}
      </div>
      <Link href={"/matches"} className="mt-7" id="explore-btn">
        All matches
      </Link>
    </section>
  );
}
