import React from "react";
import Link from "next/link";
import MainContener from "../components/MainContainer";

const Radio = () => {
  return (
    <div>
      <MainContener />
      <Link href="/" passHref>
        home
      </Link>
    </div>
  );
};

export default Radio;
