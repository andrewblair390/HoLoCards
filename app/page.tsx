import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#12151a] px-4 py-4 text-white sm:px-6">
      <div className="absolute inset-y-0 left-0 hidden w-[29vw] min-w-[300px] overflow-hidden lg:block">
        <Image
          src="/figma/home-card-collage.png"
          alt=""
          fill
          priority
          sizes="29vw"
          className="object-cover object-left"
        />
      </div>
      <div className="absolute inset-y-0 right-0 hidden w-[27vw] min-w-[280px] overflow-hidden lg:block">
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

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[898px] flex-col items-center">
        <header className="flex w-full items-center gap-3 rounded-[25px] bg-[#464444] px-4 py-3 shadow-2xl shadow-black/40 sm:gap-4 sm:px-7">
          <div className="relative h-[52px] w-[58px] shrink-0 sm:h-[76px] sm:w-[85px]">
            <Image
              src="/figma/holo-pack-logo.png"
              alt="HoLo Packs logo"
              fill
              priority
              sizes="85px"
              className="object-contain"
            />
          </div>
          <p className="min-w-0 flex-1 text-3xl font-black tracking-normal sm:text-5xl lg:text-[64px]">
            HoLo PACKS
          </p>
          <button
            type="button"
            className="h-12 shrink-0 rounded-[25px] bg-white/35 px-5 text-base font-black text-white transition hover:bg-white/45 sm:h-[69px] sm:px-12 sm:text-2xl"
          >
            Login
          </button>
        </header>

        <div className="mt-8 text-center sm:mt-4">
          <h1 className="text-3xl font-black leading-tight tracking-normal sm:text-[40px]">
            HIGHER OR LOWER,
            <br />
            GUESS THE PRICE
          </h1>
          <p className="mt-2 text-base font-bold text-white/70 sm:text-xl">
            Choose between your favorite cards
          </p>
        </div>

        <div className="relative mt-8 flex min-h-[520px] w-full max-w-[469px] flex-1 items-start justify-center sm:mt-7 sm:min-h-[625px]">
          <Image
            src="/figma/pack-glow.svg"
            alt=""
            width={789}
            height={945}
            className="absolute left-1/2 top-0 h-full w-[150%] max-w-none -translate-x-1/2 object-fill"
          />
          <div className="relative h-[520px] w-full max-w-[371px] overflow-hidden sm:h-[590px]">
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
              className="absolute left-1/2 top-[19.5%] flex h-[69px] w-[226px] -translate-x-1/2 items-center justify-center rounded-[25px] bg-white/40 text-[32px] font-black text-white shadow-xl shadow-black/20 transition hover:bg-white/50 focus:outline-none focus:ring-4 focus:ring-white/40"
            >
              Play
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
