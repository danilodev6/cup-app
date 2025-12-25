import Link from "next/link";
import Image from "next/image";

const NavBar = () => {
  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image
            src="/icons/cup-logo.png"
            alt="logo-cup"
            width={30}
            height={30}
          />
          MyName
        </Link>

        <ul>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
