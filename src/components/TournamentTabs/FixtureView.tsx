import Link from "next/link";

export default async function FixtureView({
  tournamentId,
}: {
  tournamentId: string;
}) {
  return (
    <div className="flex flex-col items-center text-center mt-5 gap-3 w-[250px] mx-auto">
      <Link
        href={`/groupmatches?tournamentId=${tournamentId}`}
        id="explore-btn"
      >
        <span className="text-center">Group Matches</span>
      </Link>
      <Link href={`/komatches?tournamentId=${tournamentId}`} id="explore-btn">
        <span className="text-center">Knockout Matches</span>
      </Link>
    </div>
  );
}
