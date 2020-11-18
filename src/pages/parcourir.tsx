import React from "react";
import Link from "next/link";
import MainContainer from "../components/MainContainer";

const Parcourir = () => {
  return (
    <div>
      <MainContainer />
      <Link href="/" passHref>
        home
      </Link>
    </div>
  );
};

export default Parcourir;
