import { useEffect, useState } from "react";
import logger from "../utils/logger";

type PlayerEventCallback = (args: State) => void;

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

type State = {
  message: string;
  device_id: string;
  paused: boolean;
};

const useSpotifyPlayer = (accessToken?: string): [string, any] => {
  const [deviceId, setDeviceId] = useState("");
  const [player, setPlayer] = useState(null);

  const basicErrorHandling: PlayerEventCallback = (message) => {
    console.error(message);
  };

  const initPlayer: PlayerEventCallback = ({ device_id }) => {
    logger.log("Ready with Device ID", device_id);
    fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        device_ids: [device_id],
      }),
    }).then(() => {
      setDeviceId(device_id);
    });
  };

  const deviceDisconnected: PlayerEventCallback = ({ device_id }) => {
    logger.log("Device ID has gone offline", device_id);
  };

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    logger.log("🔑 Access Token\n", accessToken, "\n🔑");

    window.onSpotifyWebPlaybackSDKReady = (): void => {
      const player = new window.Spotify.Player({
        name: "Spot-next",
        getOAuthToken: (cb: (accessToken: string) => void): void => {
          cb(accessToken || "");
        },
        volume: 0.5,
      });

      setDeviceId(player._options.id);

      player.addListener("initialization_error", basicErrorHandling);
      player.addListener("authentication_error", basicErrorHandling);
      player.addListener("account_error", basicErrorHandling);
      player.addListener("playback_error", basicErrorHandling);
      player.addListener("ready", initPlayer);
      player.addListener("not_ready", deviceDisconnected);
      player.connect();
      setPlayer(player);
    };

    const script = document.createElement("script");

    script.id = "spotify-player";
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [accessToken]);

  return [deviceId, player];
};

export default useSpotifyPlayer;
