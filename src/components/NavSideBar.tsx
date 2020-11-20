import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

type NavSideBarProps = {
  songImg: string;
};

const NavSideBar: React.FC<NavSideBarProps> = ({ songImg }) => {
  const router = useRouter();
  const styles = {
    homelogo: {
      color: "#FFF",
      width: "5%",
      padding: "1.5rem 1.5rem",
    },
    logo: {
      width: "80%",
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
      <div className="pictureAlbum">
        <img id="songImg" src={songImg} alt="La photo de l'album ici" />
      </div>
    </div>
  );
};

export default NavSideBar;
