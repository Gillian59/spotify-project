import Cookies from "cookies";
import { GetServerSideProps } from "next";
import useSWR from "swr";
import { Layout } from "../components/Layout";

type IndexProps = {
  spotifyLoginUrl?: string;
};

const Index: React.FC<IndexProps> = ({ spotifyLoginUrl }) => {
  const { data } = useSWR("/api/get-user-info");
  const user = data;

  return (
    <Layout isLoggedIn={user !== undefined} spotifyLoginUrl={spotifyLoginUrl}>
      <h1>Home page</h1>
      <p>{user && user.display_name}</p>
    </Layout>
  );
};
export default Index;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const accessToken = cookies.get("spot-next");
  if (accessToken) {
    return {
      props: {},
      redirect: {
        permanent: false,
        destination: "/player",
      },
    };
  } else {
    const spotifyLoginUrl = new URL("https://accounts.spotify.com/authorize");

    spotifyLoginUrl.searchParams.append("client_id", process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "");
    spotifyLoginUrl.searchParams.append("redirect_uri", process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "");
    spotifyLoginUrl.searchParams.append("response_type", "code");
    spotifyLoginUrl.searchParams.append(
      "scope",
      [
        "user-read-private",
        "user-read-email",
        "playlist-read-private",
        "user-read-playback-state",
        "user-modify-playback-state",
        "streaming",
      ].join(" "),
    );

    return {
      props: {
        spotifyLoginUrl: spotifyLoginUrl.toString(),
      },
    };
  }
};
