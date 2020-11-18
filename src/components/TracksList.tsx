import React from "react";
import { TracksListItem } from "../types/spotify";

type TracksListProps = {
  tracksList: TracksListItem[];
};

const TracksList: React.FC<TracksListProps> = ({ tracksList }) => {
  console.log("TrackNAMELIST @@@@@", tracksList);
  return (
    <div className="tracksList">
      <ul>
        {tracksList.map((track) => {
          return (
            <>
              <li key={track.id}>{track.name}</li>
            </>
          );
        })}
      </ul>
    </div>
  );
};

export default TracksList;
