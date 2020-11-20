import React from "react";
import { Albums, TracksListItem } from "../types/spotify";

const TracksList: React.FC = (props) => {
  const { tracksList } = props as TracksListItem;
  const { albumImg } = props as Albums;
  const styles = {
    main: {
      border: "2px solid black",
      textAlign: "center" as const,
    },
    global: { width: "-webkit-fill-available" },
    titre: {
      textAlign: "center" as const,
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
  console.log(albumImg);

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
