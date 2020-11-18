import React from "react";

type tracksListProps = {
  tracksNamesList: string[];
};

const TracksList: React.FC<tracksListProps> = ({ tracksNamesList }) => {
  return (
    <div className="tracksList">
      <ul>
        {tracksNamesList.map((trackName) => {
          return <li key={trackName}>{trackName}</li>;
        })}
      </ul>
    </div>
  );
};

export default TracksList;
