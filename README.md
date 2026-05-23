# HoLoCards

A Next.js higher-or-lower trading card price game.

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Set `MONGODB_URI` in `.env.local` to your MongoDB Atlas connection string:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/<database-name>?retryWrites=true&w=majority
```

Then run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Access

The app reads cards from the MongoDB collection named `Cards`.

Required card fields:

- `series`
- `name`
- `image-link`
- `price`

Optional fields used for game filtering:

- `game`
- `tcg`
- `cardGame`
- `card_game`
- `card-game`
- `franchise`

The leaderboard uses a separate collection named `Leaderboard`. You do not need
to create it manually; MongoDB/Mongoose creates it the first time a player score
is saved.

Leaderboard fields:

- `playerName`
- `normalizedName`
- `bestScore`
- `createdAt`
- `updatedAt`

## Sharing The Repo

`.env.local` is intentionally ignored by Git because it contains database credentials. Anyone who clones the repo needs their own `.env.local` with a valid `MONGODB_URI`.

For collaborators, create a MongoDB Atlas database user with only the permissions they need, then share that connection string outside GitHub.

## Vercel Deployment

Add `MONGODB_URI` to the Vercel project:

1. Go to the Vercel project dashboard.
2. Open Settings > Environment Variables.
3. Add `MONGODB_URI`.
4. Select the environments that need it, usually Production, Preview, and Development.
5. Redeploy the project after saving the variable.

If you use MongoDB Atlas, the Atlas Network Access list must also allow requests from Vercel. Vercel serverless functions use dynamic outbound IPs by default, so either:

- Allow access from anywhere in Atlas with `0.0.0.0/0` and use a strong database username/password, or
- Use Vercel Static IPs / another fixed-egress setup and allowlist those IPs in Atlas.

Do not commit a real MongoDB connection string to GitHub.
