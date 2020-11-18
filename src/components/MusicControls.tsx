import React from "react";
import Player from "../pages/player";
import { SpotifyUser } from "../types/spotify";

interface Props {
  user: SpotifyUser;
  accessToken: string;
}

const MusicControls: React.FC<Props> = ({ user, accessToken }) => {
  return (
    <div className="musicControls">
      MusicControls
      <Player user={user} accessToken={accessToken} />
    </div>
  );
};

export default MusicControls;
