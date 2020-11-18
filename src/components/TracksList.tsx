import React from "react";
import { Artist, TracksListItem } from "../types/spotify";

type TracksListProps = {
  tracksList: TracksListItem[];
};

const TracksList: React.FC<TracksListProps> = ({ tracksList }) => {
  console.log("TrackNAMELIST @@@@@", tracksList);
  return (
    <div className="tracksList">
      <ul>
        {tracksList.map((track) => {
          let artists = "";
          track.artists.forEach((artist) => {
            artists += artist.name + "";
          });
          return (
            <>
              {/* <li key={track.id}>{track.name}</li> */}
              <table>
                <tr>
                  <th>{track.track_number}</th>
                  <th>{track.name}</th>
                </tr>
                <tr>
                  <td>{artists}</td>
                </tr>
              </table>
            </>
          );
        })}
      </ul>
    </div>
  );
};

export default TracksList;
