import React from "react";
import MusicControls from "./MusicControls";
import Nav from "./Nav";
import TracksList from "./TracksList";

const MainContainer: React.FC = () => {
  return (
    <>
      <div className="App">
        <Nav />
        <TracksList tracksNamesList={["piste 1", "piste 2", "piste 3"]} />
        {/* <TracksList tracksNamesList={[]} /> */}
      </div>
      <MusicControls />
    </>
  );
};

export default MainContainer;
