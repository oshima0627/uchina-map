import Link from "next/link";
import {
  Baby,
  CloudRain,
  Map as MapIcon,
  Sparkles,
  ArrowRight,
  Heart,
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

export default function HomePage() {
  const featuredSpots = SPOTS.slice(0, 6);
  const rainOkSpots = SPOTS.filter((s) => s.features.rainOk).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-ocean opacity-90" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_60%)]" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-12 md:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/30 backdrop-blur-sm text-white text-xs font-medium border border-white/40">
              <Sparkles className="w-3.5 h-3.5" />
              沖縄本島南部7市町村の親子向け情報
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-black text-white text-balance leading-[1.15] drop-shadow-sm">
              「授乳室ある？」<br className="md:hidden" />
              「ベビーカーで入れる？」<br />
              <span className="text-sand">が一目でわかる。</span>
            </h1>
            <p className="mt-4 text-white/95 text-balance md:text-lg leading-relaxed">
              沖縄県内の子連れで安心して行ける場所が、
              親目線の本当に欲しい情報付きで見つかります。
            </p>
            <div className="mt-6 max-w-xl">
              <HomeSearch />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/recommend"
                className="inline-flex items-center gap-1.5 px-4 h-10 rounded-full bg-white/95 text-primary-700 text-sm font-bold shadow-sm hover:bg-white transition"
              >
                <Sparkles className="w-4 h-4" />
                今日どこ行く？
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center gap-1.5 px-4 h-10 rounded-full bg-white/30 text-white text-sm font-bold border border-white/40 backdrop-blur-sm hover:bg-white/40 transition"
              >
                <MapIcon className="w-4 h-4" />
                地図で見る
              </Link>
            </div>
          </div>
        </div>
        {/* wave bottom */}
        <svg
          className="block w-full h-8 md:h-12 -mb-px"
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

      {/* Quick filters */}
      <section className="mx-auto max-w-5xl px-4 py-8">
        <h2 className="text-sm font-bold text-charcoal/70 mb-3">
          こんな日にぴったり
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickLink
            href="/spots?feature=rainOk"
            icon={<CloudRain className="w-5 h-5" />}
            label="雨の日OK"
            desc="屋内・屋根付き"
            tone="sand"
          />
          <QuickLink
            href="/spots?feature=hasNursingRoom"
            icon={<Baby className="w-5 h-5" />}
            label="授乳室あり"
            desc="0歳〜OK"
            tone="primary"
          />
          <QuickLink
            href="/spots?age=0"
            icon={<Heart className="w-5 h-5" />}
            label="0歳おでかけ"
            desc="赤ちゃん向け"
            tone="hibiscus"
          />
          <QuickLink
            href="/map"
            icon={<MapIcon className="w-5 h-5" />}
            label="地図で見る"
            desc="ピンで一覧"
            tone="primary"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-5xl px-4 py-6">
        <h2 className="text-xl font-bold mb-4">カテゴリで探す</h2>
        <ul className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <Link
                href={`/spots?category=${cat}`}
                className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-white border border-border hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <span className="text-2xl" aria-hidden>
                  {CATEGORY_EMOJIS[cat]}
                </span>
                <span className="text-[11px] font-medium text-charcoal text-center leading-tight">
                  {CATEGORY_LABELS[cat]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Areas */}
      <section className="mx-auto max-w-5xl px-4 py-6">
        <h2 className="text-xl font-bold mb-4">エリアで探す</h2>
        <ul className="flex flex-wrap gap-2">
          {CITIES.map((city) => (
            <li key={city}>
              <Link
                href={`/spots?city=${city}`}
                className="inline-flex items-center px-4 h-10 rounded-full bg-sand-light hover:bg-sand text-charcoal text-sm font-medium border border-sand-dark/30 transition-colors"
              >
                {CITY_LABELS[city]}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured spots */}
      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl font-bold">おすすめスポット</h2>
          <Link
            href="/spots"
            className="text-sm text-primary-700 hover:underline inline-flex items-center gap-1"
          >
            すべて見る <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredSpots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </section>

      {/* Rain OK section */}
      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="rounded-3xl gradient-sand p-5 md:p-8">
          <div className="flex items-center gap-3 mb-2">
            <CloudRain className="w-6 h-6 text-primary-700" />
            <h2 className="text-xl font-bold text-charcoal">
              雨の日でも遊べるスポット
            </h2>
          </div>
          <p className="text-sm text-charcoal/70 mb-4">
            台風や雨の日も、子供が思い切り遊べる屋内スポット。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {rainOkSpots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  label,
  desc,
  tone,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
  tone: "primary" | "sand" | "hibiscus";
}) {
  const tones = {
    primary: "bg-primary-50 border-primary-200 text-primary-800",
    sand: "bg-sand-light border-sand-dark/30 text-charcoal",
    hibiscus: "bg-hibiscus/10 border-hibiscus/30 text-hibiscus",
  };
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-4 rounded-2xl border transition-shadow hover:shadow-md ${tones[tone]}`}
    >
      <span className="grid place-items-center w-10 h-10 rounded-full bg-white/70 shadow-sm">
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-bold text-sm">{label}</span>
        <span className="block text-[11px] opacity-70">{desc}</span>
      </span>
    </Link>
  );
}
