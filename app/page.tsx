 "use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type LeaderboardEntry = {
  playerName: string;
  bestScore: number;
};

const playerNameStorageKey = "holocards.playerName";

export default function Home() {
  const [playerName, setPlayerName] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardMessage, setLeaderboardMessage] = useState("Loading scores...");

  useEffect(() => {
    const nameTimer = window.setTimeout(() => {
      const savedName = window.localStorage.getItem(playerNameStorageKey) ?? "";

      if (savedName) {
        setPlayerName(savedName);
        setNameDraft(savedName);
      }
    }, 0);

    async function loadLeaderboard() {
      try {
        const response = await fetch("/api/leaderboard", { cache: "no-store" });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.error ?? "Unable to load leaderboard.");
        }

        setLeaderboard(payload.data ?? []);
        setLeaderboardMessage(
          payload.data?.length ? "" : "No scores yet. Be the first on the board.",
        );
      } catch {
        setLeaderboardMessage("Leaderboard is unavailable right now.");
      }
    }

    void loadLeaderboard();

    return () => window.clearTimeout(nameTimer);
  }, []);

  function handleNameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextName = nameDraft.trim().replace(/\s+/g, " ").slice(0, 32);

    if (!nextName) {
      return;
    }

    window.localStorage.setItem(playerNameStorageKey, nextName);
    setPlayerName(nextName);
    setNameDraft(nextName);
    setIsEditingName(false);
  }

  return (
    <main className="relative box-border flex min-h-[100svh] overflow-hidden bg-[#12151a] px-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(0.75rem,1.6vw,1rem)] text-white">
      <div className="absolute inset-y-0 left-0 hidden w-[clamp(18.75rem,29vw,26.125rem)] overflow-hidden lg:block">
        <Image
          src="/figma/home-card-collage.png"
          alt=""
          fill
          priority
          sizes="29vw"
          className="object-cover object-left"
        />
      </div>
      <div className="absolute inset-y-0 right-0 hidden w-[clamp(17.5rem,27vw,24.313rem)] overflow-hidden lg:block">
        <Image
          src="/figma/home-card-collage.png"
          alt=""
          fill
          priority
          sizes="27vw"
          className="object-cover object-right"
        />
      </div>
      <div className="absolute inset-0 opacity-25 lg:hidden">
        <Image
          src="/figma/home-card-collage.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <section className="relative z-10 mx-auto flex min-h-[calc(100svh-clamp(1.5rem,3.2vw,2rem))] w-full max-w-[898px] flex-col items-center">
        <header className="flex w-full items-center gap-[clamp(0.5rem,1.2vw,1rem)] rounded-[clamp(1rem,2vw,1.563rem)] bg-[#464444] px-[clamp(0.75rem,2vw,1.75rem)] py-[clamp(0.6rem,1.3vw,0.95rem)] shadow-2xl shadow-black/40">
          <div className="relative h-[clamp(2.75rem,5.4vw,4.75rem)] w-[clamp(3rem,6vw,5.313rem)] shrink-0">
            <Image
              src="/figma/holo-pack-logo.png"
              alt="HoLo Packs logo"
              fill
              priority
              sizes="85px"
              className="object-contain"
            />
          </div>
          <p className="min-w-0 flex-1 whitespace-nowrap text-[clamp(1.75rem,5vw,4rem)] font-black leading-none tracking-normal">
            HoLo PACKS
          </p>
          {isEditingName ? (
            <form
              onSubmit={handleNameSubmit}
              className="flex min-w-[clamp(10rem,24vw,16rem)] shrink-0 items-center gap-2 rounded-[clamp(1rem,2vw,1.563rem)] bg-white/20 p-2"
            >
              <input
                value={nameDraft}
                onChange={(event) => setNameDraft(event.target.value)}
                maxLength={32}
                autoFocus
                aria-label="Player name"
                placeholder="Name"
                className="h-[clamp(2.25rem,4vw,3.25rem)] min-w-0 flex-1 rounded-[16px] border border-white/25 bg-white/85 px-3 text-sm font-black text-[#12151a] outline-none placeholder:text-zinc-500 focus:ring-4 focus:ring-white/35"
              />
              <button
                type="submit"
                className="h-[clamp(2.25rem,4vw,3.25rem)] rounded-[16px] bg-white px-3 text-sm font-black text-[#12151a] transition hover:bg-white/90"
              >
                Save
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingName(true)}
              className="h-[clamp(2.75rem,5vw,4.313rem)] max-w-[clamp(8rem,22vw,14rem)] shrink-0 truncate rounded-[clamp(1rem,2vw,1.563rem)] bg-white/35 px-[clamp(1rem,3.2vw,3rem)] text-[clamp(0.95rem,2vw,1.5rem)] font-black text-white transition hover:bg-white/45"
            >
              {playerName || "Login"}
            </button>
          )}
        </header>

        <div className="mt-[clamp(1rem,3.2vh,2rem)] text-center">
          <h1 className="text-[clamp(1.75rem,3.6vw,2.5rem)] font-black leading-tight tracking-normal">
            HIGHER OR LOWER,
            <br />
            GUESS THE PRICE
          </h1>
          <p className="mt-2 text-[clamp(0.95rem,1.6vw,1.25rem)] font-bold text-white/70">
            Choose between your favorite cards
          </p>
        </div>

        <div className="relative mt-[clamp(1rem,3vh,1.75rem)] flex min-h-[clamp(23rem,55svh,39.063rem)] w-full max-w-[clamp(20rem,36vw,29.313rem)] flex-1 items-start justify-center">
          <Image
            src="/figma/pack-glow.svg"
            alt=""
            width={789}
            height={945}
            className="absolute left-1/2 top-0 h-full w-[150%] max-w-none -translate-x-1/2 object-fill"
          />
          <div className="home-sparkles" aria-hidden="true">
            <span className="home-sparkle home-sparkle-1" />
            <span className="home-sparkle home-sparkle-2" />
            <span className="home-sparkle home-sparkle-3" />
            <span className="home-sparkle home-sparkle-4" />
            <span className="home-sparkle home-sparkle-5" />
            <span className="home-sparkle home-sparkle-6" />
            <span className="home-sparkle home-sparkle-7" />
            <span className="home-sparkle home-sparkle-8" />
          </div>
          <div className="relative h-[clamp(22rem,52svh,36.875rem)] w-full max-w-[clamp(16.5rem,29vw,23.188rem)] overflow-hidden">
            <Image
              src="/figma/holo-pack.png"
              alt="Blue holographic card pack"
              priority
              width={1080}
              height={720}
              sizes="1080px"
              className="absolute left-[-95.4%] top-[-11.57%] h-[121.91%] w-[290.57%] max-w-none drop-shadow-2xl"
            />
            <Link
              href="/game"
              className="absolute left-1/2 top-[19.5%] flex h-[clamp(3.25rem,6vw,4.313rem)] w-[clamp(11rem,18vw,14.125rem)] -translate-x-1/2 items-center justify-center rounded-[clamp(1rem,2vw,1.563rem)] bg-white/40 text-[clamp(1.5rem,3vw,2rem)] font-black text-white shadow-xl shadow-black/20 transition hover:bg-white/50 focus:outline-none focus:ring-4 focus:ring-white/40"
            >
              Play
            </Link>
          </div>
        </div>

        <section className="relative z-10 mb-[clamp(0.75rem,2vh,1.5rem)] grid w-full gap-3 rounded-[16px] bg-black/35 p-[clamp(0.9rem,2vw,1.25rem)] shadow-2xl shadow-black/30 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[clamp(1.15rem,2.5vw,1.75rem)] font-black tracking-normal">
              Leaderboard
            </h2>
            {playerName ? (
              <p className="max-w-[45%] truncate text-sm font-bold text-white/70">
                Playing as {playerName}
              </p>
            ) : null}
          </div>

          {leaderboard.length ? (
            <ol className="grid gap-2">
              {leaderboard.map((entry, index) => (
                <li
                  key={entry.playerName}
                  className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-[8px] bg-white/10 px-3 py-2 text-sm font-bold"
                >
                  <span className="text-white/60">#{index + 1}</span>
                  <span className="truncate">{entry.playerName}</span>
                  <span>{entry.bestScore}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="rounded-[8px] bg-white/10 px-3 py-2 text-sm font-bold text-white/70">
              {leaderboardMessage}
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
