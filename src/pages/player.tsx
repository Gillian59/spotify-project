import { NextPage, GetServerSidePropsContext } from "next";
import useSpotifyPlayer from "../hooks/useSpotifyPlayer";
import Cookies from "cookies";
import useSWR from "swr";
import { Layout } from "../components/Layout";
import React from "react";
import { SpotifyState, SpotifyUser, SpotifyTrack } from "../types/spotify";
import { Lecteur } from "../components/LecteurFooter";
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
  const [albumTrack, setAlbumTrack] = React.useState("");
  // const [tracksList, setTracksList] = React.useState([]);
  const [albumImg, setAlbumImg] = React.useState("");
  const [deviceId, player] = useSpotifyPlayer(accessToken);
  const [currentTrackInfos, setCurrentTrackInfos] = React.useState<SpotifyTrack>();
  const [positionInMusic, setPositionInMusic] = React.useState<number>(0);

  React.useEffect(() => {
    getAlbumTracks(accessToken, "6akEvsycLGftJxYudPjmqK").then(async (response) => {
      const { items: tracks } = await response.json();
      console.log(tracks);
      // return setTracksList(tracks);
    });

    const playerStateChanged = (state: SpotifyState) => {
      setPaused(state.paused);
      setCurrentTrack(state.track_window.current_track.name);
      setAlbumTrack(state.track_window.current_track.album.name);
      setAlbumImg(state.track_window.current_track.album.images[0].url);
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

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  const user = data;

  return (
    <Layout isLoggedIn={true}>
      <h1>Player</h1>
      <p>Welcome {user && user.display_name}</p>
      <p>nom de la zic : {currentTrack}</p>

      <h4>{albumTrack}</h4>
      <img src={albumImg} alt="" />
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
            ? (play(accessToken, deviceId, currentTrackInfos, calculatedTime),
              setTimeStamp1(Date.now()),
              setCalculatedTime(calculatedTime + calculateTime()))
            : (pause(accessToken, deviceId), setTimeStamp2(Date.now()));
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
