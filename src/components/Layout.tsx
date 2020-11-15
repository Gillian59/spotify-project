import React from "react";
import Head from "next/head";

type Props = {
  isLoggedIn: boolean;
  spotifyLoginUrl?: string;
};

const NavBar: React.FC<Props> = ({ isLoggedIn, spotifyLoginUrl }) => {
  return (
    <nav>
      <p>
        <a href="/">home</a>
      </p>
      {isLoggedIn ? (
        <>
          <p>
            <a href="/api/logout">logout</a>
          </p>
        </>
      ) : (
        <p>
          <a href={spotifyLoginUrl}>login</a>
        </p>
      )}
    </nav>
  );
};

export const Layout: React.FC<Props> = ({ children, isLoggedIn, spotifyLoginUrl }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <NavBar isLoggedIn={isLoggedIn} spotifyLoginUrl={spotifyLoginUrl} />
      <main>{children}</main>
    </>
  );
};
