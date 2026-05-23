import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LeaderboardEntry from '@/models/leaderboard';

export const runtime = 'nodejs';

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, ' ').slice(0, 32);
}

function toLeaderboardEntry(entry: {
  playerName: string;
  bestScore: number;
  updatedAt?: Date;
}) {
  return {
    playerName: entry.playerName,
    bestScore: entry.bestScore,
    updatedAt: entry.updatedAt?.toISOString() ?? null,
  };
}

export async function GET() {
  try {
    await connectDB();

    const entries = await LeaderboardEntry.find({})
      .sort({ bestScore: -1, updatedAt: 1 })
      .limit(10)
      .lean();

    return NextResponse.json({
      success: true,
      data: entries.map(toLeaderboardEntry),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to fetch leaderboard';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const playerName = normalizeName(String(body.playerName ?? ''));
    const score = Number(body.score);

    if (!playerName) {
      return NextResponse.json(
        { success: false, error: 'Player name is required.' },
        { status: 400 },
      );
    }

    if (!Number.isInteger(score) || score < 0) {
      return NextResponse.json(
        { success: false, error: 'Score must be a non-negative whole number.' },
        { status: 400 },
      );
    }

    const normalizedName = playerName.toLowerCase();
    const entry = await LeaderboardEntry.findOneAndUpdate(
      { normalizedName },
      {
        $setOnInsert: { normalizedName },
        $set: { playerName },
        $max: { bestScore: score },
      },
      { new: true, upsert: true },
    ).lean();

    const entries = await LeaderboardEntry.find({})
      .sort({ bestScore: -1, updatedAt: 1 })
      .limit(10)
      .lean();

    return NextResponse.json({
      success: true,
      data: toLeaderboardEntry(entry),
      leaderboard: entries.map(toLeaderboardEntry),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to update leaderboard';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
