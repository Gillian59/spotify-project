# Spotify Next

This is a NextJS App using:
- [Spotify web playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/)
- [Spotify web API](https://developer.spotify.com/documentation/web-api/)
- [Spotify URIs](https://community.spotify.com/t5/Desktop-Windows/URI-Codes/td-p/4479486)

## Usage

### Installation

```bash
asdf install
yarn install
cp .env.local.sample .env.local
```

Create an application on [Spotify Dashboard](https://developer.spotify.com/dashboard/applications).
You will need a name and a description, here's an example:

- name: "My own player"
- description: "This is a player made for education purposes"

Get back the `client_id` and `client_secret`.

Add a `redirect_uri` in the settings: http://localhost:3000/api/callback.

Set all that information in the `.env.local` file.

You will need a Spotify premium account for this project, if you don't have one yet, ask us.

### Start

```bash
# Development mode
yarn dev

# Production mode
yarn start
```

### Build

```bash
yarn build
```

### Lint

You can use eslint to help you format your code.

```bash
yarn lint
```
