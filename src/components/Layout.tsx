import React from "react";
import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

type Props = {
  isLoggedIn: boolean;
  spotifyLoginUrl?: string;
  UserName: string;
  // tracksList: [];
};

export const NavBar: React.FC<Props> = ({ isLoggedIn, spotifyLoginUrl, UserName }) => {
  return (
    <>
      <nav id="navbar">
        <Link href="/" passHref>
          <a id="spotify-logo-container">
            <img src="/logo.png" alt="logo spotify" id="spotify-logo" />
          </a>
        </Link>
        {isLoggedIn ? (
          <>
            <p className="navbar-items">
              <FontAwesomeIcon className="icon" icon={faUser} size={"1x"} />
              <a className="UserName">{UserName}</a>
              <a href="/api/logout">logout</a>
            </p>
          </>
        ) : (
          <p className="navbar-items">
            <a href={spotifyLoginUrl}>login</a>
          </p>
        )}
      </nav>
    </>
  );
};

export const Layout: React.FC<Props> = ({ children, isLoggedIn, spotifyLoginUrl, UserName }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <NavBar isLoggedIn={isLoggedIn} spotifyLoginUrl={spotifyLoginUrl} UserName={UserName} />
      <main>{children}</main>
    </>
  );
};
