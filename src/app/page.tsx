import DatePicker from "../components/DatePicker";
import MatchDay from "../components/MatchDay";

export default async function Home() {
  return (
    <section>
      <h1 className="text-center">
        Welcome to a new Cup! <br /> Tsuruga Cup{" "}
      </h1>
      <p className="text-center mt-5"> Good luck! </p>

      <div className="text-center mt-5 space-y-7">
        <DatePicker />
      </div>
      <MatchDay />
    </section>
  );
}
