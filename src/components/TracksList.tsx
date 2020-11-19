import React from "react";
import { SpotifyTrack, TracksListItem } from "../types/spotify";

type TracksListProps = {
  tracksList: TracksListItem[];
  albumImg: SpotifyTrack | undefined;
};

const TracksList: React.FC<TracksListProps> = ({ tracksList, albumImg }) => {
  console.log("je veux voir ca ici:", albumImg.images[0].url);
  // console.log("TrackNAMELIST @@@@@", tracksList);

  const styles = {
    main: {
      border: "2px solid black",
      textAlign: "center",
    },
    global: { width: "-webkit-fill-available" },
    titre: {
      textAlign: "center",
      fontSize: "3vh",
    },
    topBarImg: {
      border: "2px solid black",
      margin: "3.5em",
      width: "200px",
      height: "200px",
      backgroundColor: "#DDD",
    },
    topBarTitre: {
      alignSelf: "center",
      fontSize: "xxx-large",
      justifyContent: "space-evenly",
    },
  };
  return (
    <>
      <div className="tracksList">
        <div className="topBarPlaylist">
          <div>
            <img src={albumImg.images[0].url} alt="dd" style={styles.topBarImg} />
          </div>

          <div style={styles.topBarTitre}>{albumImg?.name}</div>
        </div>
        <table style={styles.global}>
          <tr style={styles.titre}>
            <th>Num</th>
            <th>Artist</th>
            <th>Titre</th>
          </tr>
          {tracksList.map((track) => {
            return (
              <>
                {/* <li key={track.id}>{track.name}</li> */}
                <tr>
                  <td key={track.id} style={styles.main}>
                    {track.track_number}
                  </td>
                  <td style={styles.main}>{track.artists[0].name}</td>
                  <td style={styles.main}>{track.name}</td>
                </tr>
              </>
            );
          })}
        </table>
      </div>
    </>
  );
};

export default TracksList;
// <!-- Tableau simple avec en-tête -->
// <table>
//   <tr>
//     <th>Prénom</th>
//     <th>Nom</th>
//   </tr>
//   <tr>
//     <td>Jean</td>
//     <td>Dupont</td>
//   </tr>
//   <tr>
//     <td>Marion</td>
//     <td>Duval</td>
//   </tr>
// </table>
