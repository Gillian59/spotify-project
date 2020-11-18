import { NextPage, GetServerSidePropsContext } from "next";
import useSpotifyPlayer from "../hooks/useSpotifyPlayer";
import Cookies from "cookies";
import useSWR from "swr";
import { Layout } from "../components/Layout";
import React from "react";
import { SpotifyState, SpotifyUser, SpotifyTrack } from "../types/spotify";
import ProgressBar from "react-bootstrap/ProgressBar";
import MusicControls from "../components/MusicControls";
import MainContainer from "../components/MainContainer";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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

const next = (accessToken: string, deviceId: string, currentTrackInfos: SpotifyTrack | undefined) => {
  return fetch(`https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      uris: [`spotify:track:${currentTrackInfos ? currentTrackInfos.id : "1lCRw5FEZ1gPDNPzy1K4zW"}`],
    }),
  });
};
const previous = (accessToken: string, deviceId: string, currentTrackInfos: SpotifyTrack | undefined) => {
  return fetch(`https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      uris: [`spotify:track:${currentTrackInfos ? currentTrackInfos.id : "1lCRw5FEZ1gPDNPzy1K4zW"}`],
    }),
  });
};
const getAlbumTracks = async (accessToken: string, id: string) => {
  return await fetch(`https://api.spotify.com/v1/albums/${id}/tracks`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const Player: NextPage<Props> = ({ accessToken }) => {
  const { data, error } = useSWR("/api/get-user-info");
  const [paused, setPaused] = React.useState(false);
  const [currentTrack, setCurrentTrack] = React.useState("");
  const [artisteName, setArtisteName] = React.useState("");
  // const [tracksList, setTracksList] = React.useState([]);
  // const [albumImg, setAlbumImg] = React.useState("");
  const [deviceId, player] = useSpotifyPlayer(accessToken);
  const [currentTrackInfos, setCurrentTrackInfos] = React.useState<SpotifyTrack>();
  const [positionInMusic, setPositionInMusic] = React.useState<number>(0);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  React.useEffect(() => {
    getAlbumTracks(accessToken, "6akEvsycLGftJxYudPjmqK").then(async (response) => {
      const { items: tracks } = await response.json();
      console.log(tracks);
      // return setTracksList(tracks);
    });

    const playerStateChanged = (state: SpotifyState) => {
      setPaused(state.paused);
      setCurrentTrack(state.track_window.current_track.name);
      setArtisteName(state.track_window.current_track.artists[0].name);
      // setAlbumImg(state.track_window.current_track.album.images[0].url);
      setCurrentTrackInfos(state.track_window.current_track);
      setPositionInMusic(state.position);
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
    isPlaying &&
      currentTrackInfos &&
      positionInMusic <= currentTrackInfos.duration_ms &&
      setTimeout(() => setPositionInMusic(positionInMusic + 1000), 1000);
  }, [positionInMusic, isPlaying]);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const calculateInfo = (positionInMusic / (currentTrackInfos ? currentTrackInfos.duration_ms : 1)) * 100;

  return (
    <Layout isLoggedIn={true}>
      <MainContainer>
        <MusicControls>
          <Row id="musicControlsContainer">
            <Col md={2} id="song-and-artiste">
              <small>{currentTrack}</small>
              <small>{artisteName}</small>
            </Col>
            <Col md={8}>
              {/* <img src={albumImg} alt={albumImg} /> */}
              <button
                onClick={() => {
                  previous(accessToken, deviceId, currentTrackInfos);
                }}
              >
                previous
              </button>
              <button
                onClick={() => {
                  paused
                    ? (play(accessToken, deviceId, currentTrackInfos, positionInMusic), setIsPlaying(true))
                    : (pause(accessToken, deviceId), setIsPlaying(false));
                }}
              >
                {paused ? "play" : "pause"}
              </button>
              <button
                onClick={() => {
                  next(accessToken, deviceId, currentTrackInfos);
                }}
              >
                next
              </button>
              <ProgressBar now={calculateInfo} />
            </Col>
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
