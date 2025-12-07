import prisma from "@/lib/prisma";
import KoMatchDay from "@/components/KoMatchDay";

export default async function KoMatchesPage() {
  const matches = await prisma.knockoutMatch.findMany({
    include: { homeTeam: true, awayTeam: true },
  });

  return (
    <>
      <h2 className="text-center mt-5 space-y-7">Knockout Matches</h2>
      <div className="flex mx-auto">
        <KoMatchDay matches={matches} />
      </div>
    </>
  );
}
