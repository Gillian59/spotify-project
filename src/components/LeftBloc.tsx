import React from "react";
import Nav from "./Nav";
//yarn add next-images

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const LeftBloc = () => {
  return (
    <div className="outerWrap">
      <div className="App">
        <Nav />
      </div>
      <div className="musicControls">music controls</div>
    </div>
  );
};

export default LeftBloc;
