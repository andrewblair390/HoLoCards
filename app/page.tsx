import Image from "next/image";
import Link from "next/link";

export default function Home() {
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
          <button
            type="button"
            className="h-[clamp(2.75rem,5vw,4.313rem)] shrink-0 rounded-[clamp(1rem,2vw,1.563rem)] bg-white/35 px-[clamp(1rem,3.2vw,3rem)] text-[clamp(0.95rem,2vw,1.5rem)] font-black text-white transition hover:bg-white/45"
          >
            Login
          </button>
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
      </section>
    </main>
  );
}
