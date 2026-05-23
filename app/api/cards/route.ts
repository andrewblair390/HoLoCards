import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Card from '@/models/card';
import mongoose from 'mongoose';

export const runtime = 'nodejs';

const poolFilters: Record<string, string[]> = {
  pokemon: ['pokemon', 'pokémon', 'pkmn'],
  yugioh: ['yugioh', 'yu-gi-oh', 'yu-gi-oh!', 'ygo'],
  magic: ['magic', 'magic the gathering', 'magic: the gathering', 'mtg'],
};

const poolFields = ['game', 'tcg', 'cardGame', 'card_game', 'card-game', 'franchise'];

function buildPoolMatch(pool: string | null) {
  if (!pool || pool === 'all') {
    return null;
  }

  const values = poolFilters[pool.toLowerCase()];
  if (!values) {
    return null;
  }

  return {
    $or: poolFields.flatMap((field) =>
      values.map((value) => ({
        [field]: new RegExp(`^${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
      })),
    ),
  };
}

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const countParam = searchParams.get('count');
    const count = countParam ? Math.max(1, Math.min(Number(countParam) || 0, 10)) : 0;
    const poolMatch = buildPoolMatch(searchParams.get('pool'));
    const excludeIds = searchParams
      .getAll('exclude')
      .flatMap((value) => value.split(','))
      .filter((value) => mongoose.Types.ObjectId.isValid(value))
      .map((value) => new mongoose.Types.ObjectId(value));

    if (count > 0) {
      const cards = await Card.aggregate([
        ...(poolMatch ? [{ $match: poolMatch }] : []),
        ...(excludeIds.length ? [{ $match: { _id: { $nin: excludeIds } } }] : []),
        { $sample: { size: count } },
      ]);

      return NextResponse.json({ success: true, data: count === 1 ? cards[0] ?? null : cards });
    }

    // Fetch all cards from the 'Cards' collection
    const cards = poolMatch ? await Card.find(poolMatch) : await Card.find({});

    return NextResponse.json({ success: true, data: cards });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to fetch cards';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
