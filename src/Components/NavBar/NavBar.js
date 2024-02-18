import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="flex items-center justify-center gap-10 py-4 bg-stone-900">
      <Link href="/">Home</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/gallery">Gallery</Link>
      <Link href="/aboutUs">About Us</Link>
      <Link href="/contactUs">Contact Us</Link>
      <Link href="/login">Log In</Link>
    </nav>
  );
};

export default NavBar;
