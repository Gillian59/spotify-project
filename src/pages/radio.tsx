import React from "react";
import Link from "next/link";
import Leftbloc from "../components/LeftBloc";

const Radio = () => {
  return (
    <div>
      <Leftbloc />
      <Link href="/" passHref>
        home
      </Link>
    </div>
  );
};

export default Radio;
