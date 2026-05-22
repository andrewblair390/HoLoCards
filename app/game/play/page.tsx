"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type ApiCard = {
  _id?: string;
  id?: string;
  name?: string;
  series?: string;
  image_url?: string;
  "image-link"?: string;
  price?: number | string;
};

type Card = {
  id: string;
  name: string;
  series?: string;
  imageUrl: string;
  price: number;
};

type Feedback = {
  kind: "correct" | "lose";
  title: string;
  detail: string;
} | null;

type LoadedCards = {
  cards: Card[];
  statusMessage: string | null;
};

const poolLabels: Record<string, string> = {
  all: "All Cards",
  pokemon: "Pokemon",
  yugioh: "Yu-Gi-Oh!",
  magic: "Magic: The Gathering",
};

function normalizeCard(card: ApiCard | null | undefined): Card | null {
  if (!card) {
    return null;
  }

  const id = card._id ?? card.id;
  const imageUrl = card.image_url ?? card["image-link"];
  const price = Number(card.price);

  if (!id || !card.name || !imageUrl || Number.isNaN(price)) {
    return null;
  }

  return {
    id,
    name: card.name,
    series: card.series,
    imageUrl,
    price,
  };
}

async function fetchRandomCard(
  pool: string,
  excludeIds: string[] = [],
): Promise<Card | null> {
  const params = new URLSearchParams({ count: "1" });

  if (pool !== "all") {
    params.set("pool", pool);
  }

  if (excludeIds.length) {
    params.set("exclude", excludeIds.join(","));
  }

  const response = await fetch(`/api/cards?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("The card database is not reachable yet.");
  }

  const payload = await response.json();
  return normalizeCard(payload.data);
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function GameCard({
  card,
  disabled,
  reveal,
  selected,
  onChoose,
}: {
  card: Card;
  disabled: boolean;
  reveal: boolean;
  selected: boolean;
  onChoose: (card: Card) => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChoose(card)}
      className="group flex min-h-[34rem] w-full animate-[fadeIn_.28s_ease-out] flex-col overflow-hidden rounded-[8px] border border-zinc-200 bg-white text-left shadow-xl shadow-zinc-200/70 transition duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl disabled:cursor-default disabled:hover:translate-y-0 disabled:hover:scale-100 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/30"
    >
      <div className="flex h-[26rem] w-full items-center justify-center bg-zinc-100 p-6 dark:bg-zinc-900">
        <Image
          src={card.imageUrl}
          alt={card.name}
          width={480}
          height={672}
          unoptimized
          className="h-full max-w-full object-contain drop-shadow-2xl transition duration-200 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-teal-700 dark:text-teal-300">
            {card.series ?? "Trading Card"}
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-tight text-zinc-950 dark:text-zinc-50">
            {card.name}
          </h2>
        </div>
        <div
          className={`rounded-[8px] border px-4 py-3 text-center text-lg font-bold transition ${
            reveal
              ? selected
                ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                : "border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              : "border-dashed border-zinc-300 bg-zinc-50 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
          }`}
        >
          {reveal ? formatPrice(card.price) : "Price hidden"}
        </div>
      </div>
    </button>
  );
}

function GamePageContent() {
  const searchParams = useSearchParams();
  const selectedPool = searchParams.get("pool") ?? "all";
  const poolLabel = poolLabels[selectedPool] ?? "Selected Cards";
  const [cards, setCards] = useState<Card[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResolving, setIsResolving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const isGameOver = feedback?.kind === "lose";
  const revealPrices = Boolean(feedback) || isResolving;

  const highCardId = useMemo(() => {
    if (cards.length !== 2) {
      return null;
    }

    return cards[0].price >= cards[1].price ? cards[0].id : cards[1].id;
  }, [cards]);

  const loadCards = useCallback(async (): Promise<LoadedCards> => {
    try {
      const first = await fetchRandomCard(selectedPool);
      if (!first) {
        return {
          cards: [],
          statusMessage: `No cards are available for ${poolLabel} yet.`,
        };
      }

      const second = await fetchRandomCard(selectedPool, [first.id]);
      if (!second) {
        return {
          cards: [first],
          statusMessage: `At least two ${poolLabel} cards are needed to start a round.`,
        };
      }

      return { cards: [first, second], statusMessage: null };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The card database is not reachable yet.";

      return { cards: [], statusMessage: message };
    }
  }, [poolLabel, selectedPool]);

  const startGame = useCallback(async () => {
    setIsLoading(true);
    setFeedback(null);
    setSelectedId(null);
    setScore(0);

    const nextGame = await loadCards();

    setCards(nextGame.cards);
    setStatusMessage(nextGame.statusMessage);
    setIsLoading(false);
  }, [loadCards]);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialCards() {
      const nextGame = await loadCards();

      if (!isMounted) {
        return;
      }

      setCards(nextGame.cards);
      setStatusMessage(nextGame.statusMessage);
      setIsLoading(false);
    }

    void loadInitialCards();

    return () => {
      isMounted = false;
    };
  }, [loadCards]);

  async function handleChoose(chosen: Card) {
    if (isResolving || isGameOver || cards.length !== 2 || !highCardId) {
      return;
    }

    const correct = chosen.id === highCardId;
    setSelectedId(chosen.id);

    if (!correct) {
      setFeedback({
        kind: "lose",
        title: "You Lose!",
        detail: `${chosen.name} was worth ${formatPrice(chosen.price)}.`,
      });
      return;
    }

    setIsResolving(true);
    setFeedback({
      kind: "correct",
      title: "Correct!",
      detail: `${chosen.name} stays on the board.`,
    });
    setScore((currentScore) => currentScore + 1);

    const replaceIndex = cards.findIndex((card) => card.id !== chosen.id);

    try {
      const replacement = await fetchRandomCard(selectedPool, [chosen.id]);

      if (!replacement) {
        window.setTimeout(() => {
          setFeedback({
            kind: "correct",
            title: "Correct!",
            detail: "No additional cards are available in the database yet.",
          });
          setSelectedId(null);
          setIsResolving(false);
        }, 650);
        return;
      }

      window.setTimeout(() => {
        setCards((currentCards) => {
          const nextCards = [...currentCards];
          nextCards[replaceIndex] = replacement;
          return nextCards;
        });
        setFeedback(null);
        setSelectedId(null);
        setIsResolving(false);
      }, 650);
    } catch {
      window.setTimeout(() => {
        setFeedback({
          kind: "correct",
          title: "Correct!",
          detail: "The next card could not be loaded from the database.",
        });
        setSelectedId(null);
        setIsResolving(false);
      }, 650);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ccfbf1,transparent_32rem),linear-gradient(135deg,#f8fafc,#eef2ff_55%,#fdf2f8)] px-4 py-6 text-zinc-950 dark:bg-[radial-gradient(circle_at_top_left,#134e4a,transparent_30rem),linear-gradient(135deg,#09090b,#111827_58%,#18181b)] dark:text-zinc-50 sm:px-8 lg:px-12">
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Link
          href="/game"
          className="w-fit rounded-[8px] border border-zinc-200 bg-white px-4 py-2 text-sm font-bold text-zinc-700 transition hover:border-teal-300 hover:text-teal-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-teal-700 dark:hover:text-teal-300"
        >
          Change mode
        </Link>
        <header className="flex flex-col gap-4 border-b border-zinc-200/80 pb-5 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
              Higher or Lower / {poolLabel}
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-normal sm:text-5xl">
              Which card costs more?
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-[8px] border border-zinc-200 bg-white px-4 py-3 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Score
              </p>
              <p className="text-3xl font-black">{score}</p>
            </div>
            <button
              type="button"
              onClick={startGame}
              className="rounded-[8px] bg-zinc-950 px-5 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-teal-700 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-teal-200"
            >
              Restart
            </button>
          </div>
        </header>

        {feedback ? (
          <div
            className={`rounded-[8px] px-5 py-4 shadow-lg ${
              feedback.kind === "correct"
                ? "bg-emerald-600 text-white"
                : "bg-rose-600 text-white"
            }`}
          >
            <p className="text-2xl font-black">{feedback.title}</p>
            <p className="mt-1 font-medium opacity-95">{feedback.detail}</p>
            {isGameOver ? (
              <button
                type="button"
                onClick={startGame}
                className="mt-4 rounded-[8px] bg-white px-5 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-50"
              >
                Restart
              </button>
            ) : null}
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex min-h-[32rem] items-center justify-center rounded-[8px] border border-zinc-200 bg-white/80 text-xl font-bold shadow-xl dark:border-zinc-800 dark:bg-zinc-950/80">
            Loading cards...
          </div>
        ) : cards.length < 2 ? (
          <div className="flex min-h-[32rem] flex-col items-center justify-center gap-4 rounded-[8px] border border-zinc-200 bg-white/80 px-6 text-center shadow-xl dark:border-zinc-800 dark:bg-zinc-950/80">
            <p className="text-2xl font-black">No round available yet</p>
            <p className="max-w-md text-base font-medium text-zinc-600 dark:text-zinc-400">
              {statusMessage ??
                `Add at least two ${poolLabel} cards to the database, then restart the game.`}
            </p>
            <button
              type="button"
              onClick={startGame}
              className="rounded-[8px] bg-zinc-950 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-teal-700 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-teal-200"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <GameCard
              card={cards[0]}
              disabled={isResolving || isGameOver}
              reveal={revealPrices}
              selected={selectedId === cards[0]?.id}
              onChoose={handleChoose}
            />
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-950 text-xl font-black text-white shadow-xl dark:bg-zinc-50 dark:text-zinc-950">
              VS
            </div>
            <GameCard
              card={cards[1]}
              disabled={isResolving || isGameOver}
              reveal={revealPrices}
              selected={selectedId === cards[1]?.id}
              onChoose={handleChoose}
            />
          </div>
        )}
      </section>
    </main>
  );
}

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-zinc-50 text-xl font-bold text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
          Loading game...
        </main>
      }
    >
      <GamePageContent />
    </Suspense>
  );
}
