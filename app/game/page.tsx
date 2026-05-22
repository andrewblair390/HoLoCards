"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const cardPools = [
  {
    value: "all",
    label: "All cards",
    detail: "Use every priced card currently available in the database.",
  },
  {
    value: "pokemon",
    label: "Pokemon",
    detail: "Only compare Pokemon cards.",
  },
  {
    value: "yugioh",
    label: "Yu-Gi-Oh!",
    detail: "Only compare Yu-Gi-Oh! cards.",
  },
  {
    value: "magic",
    label: "Magic: The Gathering",
    detail: "Only compare Magic cards.",
  },
];

export default function GameSetupPage() {
  const router = useRouter();
  const [selectedPool, setSelectedPool] = useState(cardPools[0].value);

  function handlePlay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();
    if (selectedPool !== "all") {
      params.set("pool", selectedPool);
    }

    router.push(`/game/play${params.size ? `?${params.toString()}` : ""}`);
  }

  const activePool = cardPools.find((pool) => pool.value === selectedPool);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ccfbf1,transparent_32rem),linear-gradient(135deg,#f8fafc,#eef2ff_55%,#fdf2f8)] px-4 py-8 text-zinc-950 dark:bg-[radial-gradient(circle_at_top_left,#134e4a,transparent_30rem),linear-gradient(135deg,#09090b,#111827_58%,#18181b)] dark:text-zinc-50 sm:px-8 lg:px-12">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col justify-center gap-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
            HoLoCards
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-normal sm:text-6xl">
            Choose your card pool
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-zinc-600 dark:text-zinc-400">
            Select which database cards should appear in the higher-or-lower
            round, then start the game.
          </p>
        </div>

        <form
          onSubmit={handlePlay}
          className="grid gap-6 rounded-[8px] border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/70 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/30 sm:p-6"
        >
          <label className="grid gap-3">
            <span className="text-sm font-bold uppercase tracking-wide text-zinc-500">
              Card database pool
            </span>
            <select
              value={selectedPool}
              onChange={(event) => setSelectedPool(event.target.value)}
              className="h-14 rounded-[8px] border border-zinc-300 bg-white px-4 text-base font-bold text-zinc-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            >
              {cardPools.map((pool) => (
                <option key={pool.value} value={pool.value}>
                  {pool.label}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-[8px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xl font-black">{activePool?.label}</p>
            <p className="mt-2 text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-400">
              {activePool?.detail}
            </p>
          </div>

          <button
            type="submit"
            className="h-14 rounded-[8px] bg-zinc-950 px-5 text-base font-black text-white shadow-lg transition hover:bg-teal-700 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-teal-200"
          >
            Play
          </button>
        </form>
      </section>
    </main>
  );
}
