import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Navbar = () => {
  const router = useRouter();
  return (
    <div>
      <ul className="flex gap-3 font-bold">
        <li
          className={router.pathname == "/" ? " text-yellow-500 font-bold" : ""}
        >
          <Link href="/">Ton Raff</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
