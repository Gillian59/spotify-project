import React from "react";
import NavSideBar from "./NavSideBar";
import TracksList from "./TracksList";

const MainContainer: React.FC = ({ children }) => {
  return (
    <>
      <div className="App">
        <NavSideBar />
        <TracksList tracksNamesList={["piste 1", "piste 2", "piste 3"]} />
      </div>
      {children}
    </>
  );
};

export default MainContainer;
