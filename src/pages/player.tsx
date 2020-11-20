import { NextPage, GetServerSidePropsContext } from "next";
import useSpotifyPlayer from "../hooks/useSpotifyPlayer";
import Cookies from "cookies";
import useSWR from "swr";
import { Layout } from "../components/Layout";
import React from "react";
import { SpotifyState, SpotifyUser, SpotifyTrack, TracksListItem, Albums } from "../types/spotify";
import ProgressBar from "react-bootstrap/ProgressBar";
import TracksList from "../components/TracksList";
import MusicControls from "../components/MusicControls";
import MainContainer from "../components/MainContainer";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStepForward, faStepBackward, faRandom, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { faPauseCircle, faPlayCircle } from "@fortawesome/free-regular-svg-icons";
import NavSideBar from "../components/NavSideBar";
import { userInfo } from "os";
import { getDisplayName } from "next/dist/next-server/lib/utils";
interface Props {
  user: SpotifyUser;
  accessToken: string;
}

const play = (
  accessToken: string,
  deviceId: string,
  currentTrackInfos: SpotifyTrack | undefined,
  positionInMusic: number,
) => {
  return fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      uris: [`spotify:track:${currentTrackInfos ? currentTrackInfos.id : "1lCRw5FEZ1gPDNPzy1K4zW"}`],
      position_ms: positionInMusic,
    }),
  });
};

const pause = (accessToken: string, deviceId: string) => {
  return fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const shuffle = (accessToken: string, isShuffle: boolean) => {
  isShuffle = !isShuffle;
  return fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${isShuffle}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const repeat = (accessToken: string, repeatMod: string) => {
  return fetch(`https://api.spotify.com/v1/me/player/repeat?state=${repeatMod}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const next = (accessToken: string, deviceId: string) => {
  return fetch(`https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const previous = (accessToken: string, deviceId: string) => {
  return fetch(`https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const getAlbumTracks = async (accessToken: string, id: string) => {
  return Promise.all([
    fetch(`https://api.spotify.com/v1/albums/${id}/tracks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
    fetch(`https://api.spotify.com/v1/albums/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  ]);
};

const Player: NextPage<Props> = ({ accessToken }) => {
  const { data, error } = useSWR("/api/get-user-info");
  const [paused, setPaused] = React.useState(false);
  const [currentTrack, setCurrentTrack] = React.useState("");
  const [artisteName, setArtisteName] = React.useState("");
  const [tracksList, setTracksList] = React.useState([]);
  const [albumImg, setAlbumImg] = React.useState<Albums>();
  const [songImg, setSongImg] = React.useState<string>("");
  const [deviceId, player] = useSpotifyPlayer(accessToken);
  const [currentTrackInfos, setCurrentTrackInfos] = React.useState<SpotifyTrack>();
  const [positionInMusic, setPositionInMusic] = React.useState<number>(0);
  const [isShuffle, setIsShuffle] = React.useState<boolean>(false);
  const [repeatMod, setRepeatMod] = React.useState<string>("off");
  const [repeatCode, setRepeatCode] = React.useState<number>();
  const [albumId, setAlbumId] = React.useState<string>("6akEvsycLGftJxYudPjmqK");

  React.useEffect(() => {
    const playerStateChanged = (state: SpotifyState) => {
      setPaused(state.paused);
      setCurrentTrack(state.track_window.current_track.name);
      setArtisteName(state.track_window.current_track.artists[0].name);
      // setAlbumImg(state.track_window.current_track.album.images[0].url);
      setSongImg(state.track_window.current_track.album.images[0].url);
      setCurrentTrackInfos(state.track_window.current_track);
      setPositionInMusic(state.position);
      setIsShuffle(state.shuffle);
      setRepeatCode(state.repeat_mode);
      setAlbumId(state.track_window.current_track.album.uri.split(":")[2]);
    };

    if (player) {
      player.addListener("player_state_changed", playerStateChanged);
    }
    return () => {
      if (player) {
        player.removeListener("player_state_changed", playerStateChanged);
      }
    };
  }, [player]);

  React.useEffect(() => {
    getAlbumTracks(accessToken, albumId).then(async ([response1, response2]) => {
      const { items: tracks } = await response1.json();
      const album = await response2.json();
      const formatedTracks = tracks.map((track: TracksListItem) => {
        return {
          id: track.id,
          name: track.name,
          track_number: track.track_number,
          href: track.href,
          artists: track.artists,
        };
      });
      setTracksList(formatedTracks);
      setAlbumImg(album);
    });
  }, [albumId]);

  React.useEffect(() => {
    let handler: NodeJS.Timeout;
    if (!paused && currentTrackInfos && positionInMusic <= currentTrackInfos.duration_ms) {
      handler = setTimeout(() => {
        setPositionInMusic(positionInMusic + 1000);
      }, 1000);
    }
    return () => {
      if (handler) {
        clearTimeout(handler);
      }
    };
  }, [positionInMusic, paused, currentTrackInfos]);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const calculateInfo = (positionInMusic / (currentTrackInfos ? currentTrackInfos.duration_ms : 1)) * 100;

  const showTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = parseInt(((time % 60000) / 1000).toFixed(0));
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const sendRepeatMod = () => {
    if (repeatMod === "off") {
      setRepeatMod("context");
    } else if (repeatMod === "context") {
      setRepeatMod("track");
    } else {
      setRepeatMod("off");
    }
    repeat(accessToken, repeatMod);
  };
  console.log("poopopoooooooooo", data.display_name);

  return (
    <Layout isLoggedIn={true} UserName={data.display_name}>
      <MainContainer>
        <div className="MainContainer">
          <NavSideBar songImg={songImg} />
          <TracksList tracksList={tracksList ? tracksList : undefined} albumImg={albumImg ? albumImg : undefined} />
        </div>
        <MusicControls>
          <Row id="musicControlsContainer">
            <Col md={2} id="song-and-artiste">
              <small className="track-text-info">{currentTrack}</small>
              <small className="track-text-info">{artisteName}</small>
            </Col>
            <Col md={1}></Col>
            <Col md={6} id="progress-bar-and-buttons">
              <div id="lecteur-buttons">
                <button
                  id={isShuffle ? "shuffle-btn-on" : "shuffle-btn-off"}
                  onClick={() => {
                    shuffle(accessToken, isShuffle);
                  }}
                >
                  <FontAwesomeIcon className="icon" icon={faRandom} />
                </button>
                <button
                  className="lecteur-btn"
                  onClick={() => {
                    previous(accessToken, deviceId);
                  }}
                >
                  <FontAwesomeIcon className="icon" icon={faStepBackward} />
                </button>
                <button
                  id="lecteur-btn-play-pause"
                  onClick={() => {
                    paused
                      ? play(accessToken, deviceId, currentTrackInfos, positionInMusic)
                      : pause(accessToken, deviceId);
                  }}
                >
                  {paused ? (
                    <FontAwesomeIcon className="icon" icon={faPlayCircle} size={"2x"} />
                  ) : (
                    <FontAwesomeIcon className="icon" icon={faPauseCircle} size={"2x"} />
                  )}
                </button>
                <button
                  className="lecteur-btn"
                  onClick={() => {
                    next(accessToken, deviceId);
                  }}
                >
                  <FontAwesomeIcon className="icon" icon={faStepForward} />
                </button>

                <button
                  className="lecteur-btn"
                  id={`repeat-${repeatCode}`}
                  onClick={() => {
                    sendRepeatMod();
                  }}
                >
                  <FontAwesomeIcon className="icon" icon={faSyncAlt} />
                </button>
              </div>
              <Row id="progress-container">
                <small>{showTime(positionInMusic)}</small>
                <ProgressBar now={calculateInfo} id="progress-bar" />
                <small>{showTime(currentTrackInfos ? currentTrackInfos.duration_ms : 1)}</small>
              </Row>
            </Col>
            <Col md={3} />
          </Row>
        </MusicControls>
      </MainContainer>
    </Layout>
  );
};
export default Player;

export const getServerSideProps = async (context: GetServerSidePropsContext): Promise<unknown> => {
  const cookies = new Cookies(context.req, context.res);
  const accessToken = cookies.get("spot-next");
  if (accessToken) {
    return { props: { accessToken } };
  } else {
    return {
      props: {},
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
};
