import prisma from "@/lib/prisma";
import ExploreTournament from "../components/ExploreTournament";

export default async function Home() {
  const tournaments = await prisma.tournament.findMany();

  return (
    <section>
      <h1 className="text-center">Welcome to our site! </h1>
      <p className="text-center mt-4"> Good luck! </p>

      <div className="text-center space-y-4">
        <p>Select your tournament:</p>
        {tournaments.map((tournament) => (
          <ExploreTournament key={tournament.id} tournament={tournament} />
        ))}
      </div>
    </section>
  );
}
