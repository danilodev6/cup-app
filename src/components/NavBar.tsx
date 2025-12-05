import Link from "next/link";
import Image from "next/image";

const NavBar = () => {
  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image
            src="/icons/logo-cup.png"
            alt="logo-cup"
            width={30}
            height={30}
          />
        </Link>

        <ul>
          <Link href="/">Home</Link>
          <Link href="/teams">Teams</Link>
          <Link href="/">Stats</Link>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
