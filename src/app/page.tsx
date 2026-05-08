import Link from "next/link";
import {
  Baby,
  CloudRain,
  Map as MapIcon,
  Sparkles,
  ArrowRight,
  Search,
  Sun,
} from "lucide-react";
import { SpotCard } from "@/components/spot-card";
import { HomeSearch } from "@/components/home-search";
import { SPOTS } from "@/data/spots";
import {
  CATEGORIES,
  CATEGORY_EMOJIS,
  CATEGORY_LABELS,
  CITIES,
  CITY_LABELS,
} from "@/lib/types";

const HERO_STATS = [
  { value: SPOTS.length, label: "スポット" },
  { value: CITIES.length, label: "市町村" },
  {
    value: SPOTS.filter((s) => s.features.hasNursingRoom).length,
    label: "授乳室あり",
  },
];

export default function HomePage() {
  const featuredSpots = SPOTS.slice(0, 6);
  const rainOkSpots = SPOTS.filter((s) => s.features.rainOk).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-ocean-deep" aria-hidden />
        <div className="absolute inset-0 bg-noise opacity-25 mix-blend-overlay" aria-hidden />

        <div className="relative mx-auto max-w-5xl px-4 pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-dark text-white text-[11px] font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              沖縄本島南部・在住者向け
            </span>
            <h1 className="mt-5 text-[2.25rem] md:text-6xl font-black text-white text-balance leading-[1.05] tracking-[-0.03em]">
              <span className="block">「授乳室ある？」</span>
              <span className="block">「ベビーカーで入れる？」</span>
              <span className="block text-gradient-ocean">が一目でわかる。</span>
            </h1>
            <p className="mt-5 text-white/95 text-balance md:text-lg leading-relaxed max-w-xl">
              沖縄の子連れOKスポットを、地図と設備フィルタで。
              親が本当に欲しい情報だけを集めました。
            </p>

            <div className="mt-7 max-w-xl">
              <HomeSearch />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Link
                href="/recommend"
                className="inline-flex items-center gap-1.5 px-4 h-10 rounded-full bg-white text-charcoal text-sm font-bold shadow-soft hover:shadow-pop transition"
              >
                <Sparkles className="w-4 h-4 text-hibiscus" />
                今日どこ？
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center gap-1.5 px-4 h-10 rounded-full glass-dark text-white text-sm font-bold hover:bg-white/15 transition"
              >
                <MapIcon className="w-4 h-4" />
                地図で見る
              </Link>
            </div>

            {/* stats strip */}
            <dl className="mt-8 grid grid-cols-3 gap-2 max-w-md">
              {HERO_STATS.map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-2xl glass px-3 py-2.5 text-charcoal"
                >
                  <dt className="text-[10px] font-medium tracking-wider uppercase text-charcoal/60">
                    {label}
                  </dt>
                  <dd className="text-xl font-black tracking-tight">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <svg
          className="block w-full h-10 md:h-14 -mb-px relative"
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1080,0 1200,40 L1200,80 L0,80 Z"
            fill="var(--color-background)"
          />
        </svg>
      </section>

      {/* Bento — こんなニーズに */}
      <section className="mx-auto max-w-5xl px-4 mt-2 md:mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <BentoCard
            href="/spots?feature=rainOk"
            tone="primary"
            icon={<CloudRain className="w-5 h-5" />}
            label="雨の日OK"
            desc="屋内・屋根付きスポット"
            count={SPOTS.filter((s) => s.features.rainOk).length}
            big
          />
          <BentoCard
            href="/spots?feature=hasNursingRoom"
            tone="sand"
            icon={<Baby className="w-5 h-5" />}
            label="授乳室あり"
            desc="0歳から安心"
            count={SPOTS.filter((s) => s.features.hasNursingRoom).length}
          />
          <BentoCard
            href="/spots?age=0"
            tone="coral"
            icon={<Sun className="w-5 h-5" />}
            label="0歳と行ける"
            desc="赤ちゃんと一緒に"
            count={SPOTS.filter((s) => s.ageTags.includes("0")).length}
          />
          <BentoCard
            href="/map"
            tone="sky"
            icon={<MapIcon className="w-5 h-5" />}
            label="地図で見る"
            desc="ピンで一覧"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <SectionHeader
          eyebrow="Browse"
          title="カテゴリで探す"
        />
        <ul className="mt-5 grid grid-cols-4 md:grid-cols-8 gap-2">
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <Link
                href={`/spots?category=${cat}`}
                className="group flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl bg-card border border-border hover:border-primary-300 hover:bg-primary-50/50 transition shadow-soft hover:shadow-card"
              >
                <span
                  className="text-2xl transition-transform group-hover:scale-110"
                  aria-hidden
                >
                  {CATEGORY_EMOJIS[cat]}
                </span>
                <span className="text-[11px] font-bold text-charcoal text-center leading-tight">
                  {CATEGORY_LABELS[cat]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Areas */}
      <section className="mx-auto max-w-5xl px-4 pb-2">
        <SectionHeader eyebrow="Areas" title="エリアで探す" />
        <ul className="mt-5 flex flex-wrap gap-2">
          {CITIES.map((city) => (
            <li key={city}>
              <Link
                href={`/spots?city=${city}`}
                className="inline-flex items-center px-4 h-10 rounded-full bg-card hover:bg-primary-50 text-charcoal text-sm font-medium border border-border hover:border-primary-300 transition shadow-soft"
              >
                {CITY_LABELS[city]}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured spots */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-end justify-between gap-3">
          <SectionHeader eyebrow="Featured" title="おすすめスポット" />
          <Link
            href="/spots"
            className="text-sm text-primary-700 hover:text-primary-800 font-medium inline-flex items-center gap-1 whitespace-nowrap"
          >
            すべて見る
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredSpots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </section>

      {/* Rain OK */}
      <section className="mx-auto max-w-5xl px-4 pb-12">
        <div className="rounded-3xl gradient-sand p-5 md:p-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl" aria-hidden />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-white/80 text-primary-700 shadow-soft">
                <CloudRain className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold tracking-wider uppercase text-charcoal/60">
                Rainy Day
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-charcoal tracking-tight">
              雨の日でも遊べるスポット
            </h2>
            <p className="text-sm text-charcoal/75 mt-1.5 mb-5">
              台風や雨の日も、子供が思い切り遊べる屋内施設。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {rainOkSpots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-primary-700">
        {eyebrow}
      </span>
      <h2 className="mt-1 text-2xl md:text-3xl font-black text-charcoal tracking-tight">
        {title}
      </h2>
    </div>
  );
}

function BentoCard({
  href,
  tone,
  icon,
  label,
  desc,
  count,
  big = false,
}: {
  href: string;
  tone: "primary" | "sand" | "coral" | "sky";
  icon: React.ReactNode;
  label: string;
  desc: string;
  count?: number;
  big?: boolean;
}) {
  const tones = {
    primary: "bg-gradient-to-br from-[#3db8c9] to-[#62cad6] text-white",
    sand: "bg-gradient-to-br from-[#fbf2d7] to-[#f4e5c2] text-charcoal",
    coral: "gradient-coral text-white",
    sky: "bg-gradient-to-br from-[#a8dadc] to-[#cce8ec] text-charcoal",
  };
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-2xl p-4 shadow-card hover:shadow-pop transition ${
        big ? "col-span-2 md:col-span-2 row-span-1" : ""
      } ${tones[tone]}`}
    >
      <div className="absolute -top-12 -right-10 w-32 h-32 rounded-full bg-white/15 blur-2xl group-hover:scale-110 transition-transform" aria-hidden />
      <div className="relative flex items-start justify-between gap-2">
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40">
          {icon}
        </span>
        {typeof count === "number" && (
          <span className="px-2 py-0.5 rounded-full bg-white/30 backdrop-blur-sm text-[11px] font-bold tabular-nums">
            {count}件
          </span>
        )}
      </div>
      <div className="relative mt-4">
        <p className={`font-black text-balance leading-tight ${big ? "text-xl" : "text-base"}`}>
          {label}
        </p>
        <p className="text-[11px] opacity-80 mt-0.5">{desc}</p>
      </div>
    </Link>
  );
}
