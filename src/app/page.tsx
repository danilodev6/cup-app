import DatePicker from "../components/DatePicker";
import MatchDay from "../components/MatchDay";
import prisma from "@/lib/prisma";

export default async function Home() {
  const tournament = await prisma.tournament.findFirst();
  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
  });

  return (
    <section>
      <h1 className="text-center">Welcome to a new Cup! </h1>
      <h2 className="text-center mb-5">{tournament?.name} Cup</h2>
      <p className="text-center"> Good luck! </p>

      <div className="text-center mt-5 space-y-7">
        <DatePicker />
      </div>
      <MatchDay matches={matches} />
    </section>
  );
}
