import { NextPage, GetServerSidePropsContext } from "next";
import useSpotifyPlayer from "../hooks/useSpotifyPlayer";
import Cookies from "cookies";
import useSWR from "swr";
import { Layout } from "../components/Layout";
import React from "react";
import { SpotifyState, SpotifyUser, SpotifyTrack } from "../types/spotify";
import Lecteur from "../components/LecteurFooter";

interface Props {
  user: SpotifyUser;
  accessToken: string;
}

const play = (
  accessToken: string,
  deviceId: string,
  currentTrackInfos: SpotifyTrack | undefined,
  calculatedTime: number | undefined,
) => {
  return fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      uris: [`spotify:track:${currentTrackInfos ? currentTrackInfos.id : "1lCRw5FEZ1gPDNPzy1K4zW"}`],
      position_ms: calculatedTime,
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

const Player: NextPage<Props> = ({ accessToken }) => {
  const { data, error } = useSWR("/api/get-user-info");
  const [paused, setPaused] = React.useState(false);

  // const [next, setNext] = React.useState();
  // const [previous, setPrevious] = React.useState();

  const [currentTrack, setCurrentTrack] = React.useState("");
  const [deviceId, player] = useSpotifyPlayer(accessToken);
  const [currentTrackInfos, setCurrentTrackInfos] = React.useState<SpotifyTrack>();
  const [timeStamp1, setTimeStamp1] = React.useState<number | undefined>();
  const [timeStamp2, setTimeStamp2] = React.useState<number | undefined>();
  const [calculatedTime, setCalculatedTime] = React.useState<number>(0);

  React.useEffect(() => {
    const playerStateChanged = (state: SpotifyState) => {
      setPaused(state.paused);

      // setNext(state.track_window.next_tracks);
      // setPrevious(state.track_window.previous_tracks);

      setCurrentTrack(state.track_window.current_track.name);
      setCurrentTrackInfos(state.track_window.current_track);
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

  const calculateTime = (): number => {
    if (timeStamp1 && timeStamp2) {
      const calculated = timeStamp2 - timeStamp1;
      return calculated;
    } else {
      return 0;
    }
  };

  return (
    <Layout isLoggedIn={true}>
      <h1>Player</h1>
      <p>Welcome {user && user.display_name}</p>
      <p>{currentTrack}</p>
      <p>timeStamp1 : {timeStamp1}</p>
      <p>timeStamp2 : {timeStamp2}</p>
      <p>calculateTime func : {calculateTime()}</p>
      <p>calculatedTime : {calculatedTime}</p>
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
