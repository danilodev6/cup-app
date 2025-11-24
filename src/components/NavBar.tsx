import Link from "next/link";

const NavBar = () => {
  return (
    <header>
      <nav>
        <Link href="/">Logo</Link>

        <ul>
          <Link href="/">Home</Link>
          <Link href="/">Table</Link>
          <Link href="/">Knockout</Link>
          <Link href="/">Teams</Link>
          <Link href="/">Stats</Link>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
