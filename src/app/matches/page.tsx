import prisma from "@/lib/prisma";
import MatchDay from "@/components/MatchDay";
import DatePicker from "@/components/DatePicker";

export default async function MatchesPage() {
  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
  });

  return (
    <>
      <div className="text-center mt-5 space-y-7">
        <DatePicker />
      </div>
      <div className="flex mx-auto">
        <MatchDay matches={matches} />
      </div>
    </>
  );
}
