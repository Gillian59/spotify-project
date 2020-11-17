import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Nav = () => {
  const router = useRouter();
  const styles = {
    logo: {
      width: "80%",
      padding: "1.5rem 1.5rem",
    },
    homelogo: {
      color: "#FFF",
      width: "5%",
      padding: "1.5rem 1.5rem",
    },

    link: {
      color: "grey",
    },
    active: {
      background: "rgba(221, 221, 221, 0.2)",
      color: "#FFF",
    },
  };
  return (
    <div className="navBar">
      <div className="logo">
        <img src="logo.png" alt="logo spotify" style={styles.logo} />
      </div>

      <ul>
        <Link href="/" passHref>
          <li style={router.pathname === "/" ? styles.active : styles.link}>
            {/* <img src="homeLogo.jpg" alt="HomeLogo" /> */}
            Accueil
          </li>
        </Link>
        <Link href="/parcourir" passHref>
          <li style={router.pathname === "/parcourir" ? styles.active : styles.link}>Parcourir</li>
        </Link>
        <Link href="/radio" passHref>
          <li style={router.pathname === "/radio" ? styles.active : styles.link}>Radio</li>
        </Link>
      </ul>
      <div className="pictureAlbum">image album</div>
    </div>
  );
};

export default Nav;
