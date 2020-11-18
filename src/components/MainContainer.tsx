import React from "react";
import NavSideBar from "./NavSideBar";

const MainContainer: React.FC = ({ children }) => {
  return (
    <>
      <div className="App">
        <NavSideBar />
      </div>
      {children}
    </>
  );
};

export default MainContainer;
