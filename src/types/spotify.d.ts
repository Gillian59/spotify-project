// Keep in mind that this has been make from studying a console.log output
// Don't put too much faith in it

type SpotifyTrack = {
  id: string;
  uri: string;
  type: "track" | "album" | "artist" | "user";
  linked_from_uri: any;
  linked_from: {
    uri: string | null;
    id: string | null;
  };
  media_type: string;
  name: string;
  duration_ms: number;
  artists: {
    name: string;
    uri: string;
  }[];
  album: {
    uri: string;
    name: string;
    images: {
      url: string;
      height: number;
      width: number;
    }[];
  };
};
export type SpotifyState = {
  context: {
    uri: string | null;
    metadata: any;
  };
  bitrate: number;
  position: number;
  duration: number;
  paused: boolean;
  shuffle: boolean;
  repeat_mode: number;
  track_window: {
    current_track: SpotifyTrack;
    next_tracks: SpotifyTrack[];
    previous_tracks: SpotifyTrack[];
  };
  timestamp: number;
  restrictions: {
    disallow_pausing_reasons: string[];
    disallow_skipping_prev_reasons: string[];
  };
  disallows: {
    pausing: boolean;
    skipping_prev: boolean;
  };
};

export type SpotifyUser = {
  accessToken: string;
  display_name: string;
  email?: string;
  explicit_content?: Record<string, unknown>;
  external_urls?: Record<string, unknown>;
  followers?: Record<string, unknown>;
  href?: string;
  id?: string;
  images?: Record<string, unknown>[];
  product?: string;
  type?: string;
  uri?: string;
};
