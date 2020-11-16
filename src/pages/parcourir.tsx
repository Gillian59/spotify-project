import React from "react";
import Link from "next/link";
import Leftbloc from "../components/LeftBloc";

const Parcourir = () => {
  return (
    <div>
      <Leftbloc />
      <Link href="/" passHref>
        home
      </Link>
    </div>
  );
};

export default Parcourir;
