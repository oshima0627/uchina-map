import Link from "next/link";
import {
  Baby,
  CloudRain,
  Map as MapIcon,
  Sparkles,
  ArrowRight,
  Sun,
  Heart,
  Car,
  Waves,
  Fish,
  Utensils,
  TreePine,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { SpotCard } from "@/components/spot-card";
import { HomeSearch } from "@/components/home-search";
import { SPOTS } from "@/data/spots";
import {
  AGE_LABELS,
  CATEGORIES,
  CATEGORY_EMOJIS,
  CATEGORY_LABELS,
  CITIES,
  CITY_LABELS,
  type AgeTag,
  type Spot,
} from "@/lib/types";

const HERO_STATS = [
  { value: SPOTS.length, label: "スポット" },
  { value: CITIES.length, label: "市町村" },
  {
    value: SPOTS.filter((s) => s.features.hasNursingRoom).length,
    label: "授乳室あり",
  },
];

// Quick scenarios — mixed-axis shortcuts in horizontal scroll
const SCENE_CHIPS: Array<{ href: string; Icon: LucideIcon; label: string }> = [
  { href: "/spots?feature=rainOk", Icon: CloudRain, label: "雨でもOK" },
  { href: "/spots?age=0", Icon: Heart, label: "0歳と一緒" },
  { href: "/spots?feature=strollerFriendly", Icon: Wind, label: "ベビーカー" },
  { href: "/spots?feature=hasParking", Icon: Car, label: "駐車場あり" },
  { href: "/spots?category=beach", Icon: Waves, label: "ビーチ" },
  { href: "/spots?category=aquarium", Icon: Fish, label: "水族館" },
  { href: "/spots?category=restaurant", Icon: Utensils, label: "ランチ" },
  { href: "/spots?category=park", Icon: TreePine, label: "大型遊具" },
];

const AGE_CARDS: Array<{
  tag: AgeTag;
  display: string;
  suffix: string;
  desc: string;
  gradient: string;
}> = [
  {
    tag: "0",
    display: "0",
    suffix: "歳",
    desc: "授乳室・オムツ替え重視",
    gradient: "from-[#ffe1e4] to-[#ffd1bd]",
  },
  {
    tag: "1-3",
    display: "1-3",
    suffix: "歳",
    desc: "ベビーカーOK・近場",
    gradient: "from-[#fff4cc] to-[#fde0a0]",
  },
  {
    tag: "4-6",
    display: "4-6",
    suffix: "歳",
    desc: "遊具・体験型施設",
    gradient: "from-[#d6f3f7] to-[#a8dadc]",
  },
  {
    tag: "school",
    display: "6+",
    suffix: "歳〜",
    desc: "1日遊べる施設",
    gradient: "from-[#cce8ec] to-[#7dd3e0]",
  },
];

export default function HomePage() {
  const featuredSpots = SPOTS.slice(0, 6);

  // Curated collections (build-time)
  const collectionRain = SPOTS.filter(
    (s) => s.features.rainOk && s.features.isIndoor,
  )
    .sort((a, b) => b.durationMin - a.durationMin)
    .slice(0, 4);

  const collectionBaby = SPOTS.filter(
    (s) => s.ageTags.includes("0") && s.features.hasNursingRoom,
  ).slice(0, 4);

  const collectionAllDay = SPOTS.filter(
    (s) => s.durationMin >= 180 && s.features.hasParking,
  )
    .sort((a, b) => b.durationMin - a.durationMin)
    .slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden flex flex-col min-h-[calc(100svh-3.5rem)]">
        {/* Background photo — Okinawa beach */}
        <img
          src="/spots/豊崎海浜公園 美らSUNビーチ.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        {/* Color tint to keep brand palette */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#226574]/60 via-[#3db8c9]/25 to-[#f4e5c2]/15"
          aria-hidden
        />
        {/* Dark overlays for text contrast (top + bottom) */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-noise opacity-15 mix-blend-overlay"
          aria-hidden
        />

        {/* Okinawan decorative motifs (subtle) */}
        <span
          aria-hidden
          className="absolute bottom-24 left-4 md:bottom-28 md:left-12 text-3xl md:text-5xl opacity-25 pointer-events-none select-none animate-float"
          style={{ animationDelay: "1.2s" }}
        >
          🐠
        </span>
        <span
          aria-hidden
          className="hidden md:inline absolute top-[35%] right-[12%] text-3xl opacity-20 pointer-events-none select-none animate-float"
          style={{ animationDelay: "2s" }}
        >
          🐢
        </span>

        <div className="relative flex-1 grid place-items-center w-full">
          <div className="mx-auto max-w-5xl px-4 py-8 md:py-10 w-full">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-dark text-white text-[11px] font-medium tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                めんそーれ｜沖縄本島南部・親子のお出かけ
              </span>
              <h1 className="mt-4 text-[2.5rem] md:text-6xl font-black text-white text-balance leading-[1.05] tracking-[-0.03em] drop-shadow-md">
                <span className="block">子連れOKが、</span>
                <span className="block text-gradient-ocean">一目でわかる。</span>
              </h1>
              <p className="mt-4 text-white/95 text-balance md:text-lg leading-relaxed max-w-xl drop-shadow-md">
                うちなーの子連れOKスポットを、地図と設備フィルタで。
              </p>

              <div className="mt-5 max-w-xl">
                <HomeSearch />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
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

              <dl className="mt-6 grid grid-cols-3 gap-2 max-w-md">
                {HERO_STATS.map(({ value, label }) => (
                  <div
                    key={label}
                    className="rounded-2xl glass px-3 py-2 text-charcoal"
                  >
                    <dt className="text-[10px] font-medium tracking-wider uppercase text-charcoal/60">
                      {label}
                    </dt>
                    <dd className="text-lg md:text-xl font-black tracking-tight">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <svg
          className="block w-full h-8 md:h-12 -mb-px relative shrink-0"
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
            icon={<Heart className="w-5 h-5" />}
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

      {/* Scene chips — お出かけ中のショートカット */}
      <section
        className="mx-auto max-w-5xl mt-6 md:mt-8"
        aria-label="シーン別ショートカット"
      >
        <div className="overflow-x-auto px-4 pb-2 scroll-smooth-momentum">
          <ul className="flex gap-2 min-w-max">
            {SCENE_CHIPS.map(({ href, Icon, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group inline-flex items-center gap-2 h-10 pl-3 pr-4 rounded-full bg-card border border-border text-charcoal text-sm font-semibold shadow-soft hover:shadow-card hover:border-primary-300 transition"
                >
                  <span
                    aria-hidden
                    className="grid place-items-center w-6 h-6 rounded-full bg-primary-50 text-primary-700 group-hover:bg-primary-100 transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Age section — 年齢別おでかけ */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <SectionHeader eyebrow="By Age" title="年齢で選ぶ" />
        <ul className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {AGE_CARDS.map(({ tag, display, suffix, desc, gradient }) => {
            const count = SPOTS.filter((s) => s.ageTags.includes(tag)).length;
            return (
              <li key={tag}>
                <Link
                  href={`/spots?age=${tag}`}
                  className={`group relative block rounded-2xl bg-gradient-to-br ${gradient} p-5 min-h-[160px] shadow-card hover:shadow-pop hover:-translate-y-0.5 transition-all overflow-hidden`}
                >
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/40 blur-2xl group-hover:scale-110 transition-transform"
                    aria-hidden
                  />
                  <div className="relative">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-charcoal/55">
                      Age
                    </span>
                    <div className="mt-1 flex items-baseline gap-1 text-charcoal">
                      <span className="text-[2.75rem] md:text-5xl font-black tracking-[-0.04em] tabular-nums leading-none">
                        {display}
                      </span>
                      <span className="text-sm font-bold pb-1">{suffix}</span>
                    </div>
                  </div>
                  <p className="relative text-[11px] text-charcoal/75 mt-3 leading-snug">
                    {desc}
                  </p>
                  <div className="relative mt-3 flex items-center justify-between">
                    <span className="text-[11px] font-bold tabular-nums text-charcoal/65">
                      {count}件
                    </span>
                    <ArrowRight className="w-4 h-4 text-charcoal/55 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-5xl px-4 pb-2">
        <SectionHeader eyebrow="Browse" title="カテゴリで探す" />
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
      <section className="mx-auto max-w-5xl px-4 py-10">
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
      <section className="mx-auto max-w-5xl px-4 py-6">
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

      {/* Curated collections */}
      <CollectionSection
        eyebrow="Rainy Day"
        title="雨でも飽きない屋内施設"
        description="梅雨や台風の日も、子供が思い切り遊べる屋内スポット。"
        icon={<CloudRain className="w-5 h-5" />}
        allHref="/spots?feature=rainOk"
        spots={collectionRain}
        accent="sand"
      />
      <CollectionSection
        eyebrow="Baby"
        title="赤ちゃんと行ける安心スポット"
        description="授乳室・オムツ替え台完備で、ベビーカーで入れる施設だけ。"
        icon={<Baby className="w-5 h-5" />}
        allHref="/spots?age=0"
        spots={collectionBaby}
        accent="coral"
      />
      <CollectionSection
        eyebrow="All Day"
        title="1日たっぷり遊べる"
        description="滞在時間3時間以上＋駐車場あり。家族でゆったり過ごせる施設。"
        icon={<Sun className="w-5 h-5" />}
        allHref="/spots?feature=hasParking"
        spots={collectionAllDay}
        accent="primary"
      />
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

function CollectionSection({
  eyebrow,
  title,
  description,
  icon,
  allHref,
  spots,
  accent,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  allHref: string;
  spots: Spot[];
  accent: "sand" | "coral" | "primary";
}) {
  if (spots.length === 0) return null;
  const accentClasses = {
    sand: "bg-sand-light text-primary-700",
    coral: "bg-hibiscus/10 text-hibiscus",
    primary: "bg-primary-50 text-primary-700",
  };
  return (
    <section className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex items-end justify-between gap-3 mb-5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className={`grid place-items-center w-7 h-7 rounded-lg ${accentClasses[accent]}`}
            >
              {icon}
            </span>
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-primary-700">
              {eyebrow}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-charcoal tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-charcoal/75 mt-1 text-balance">
            {description}
          </p>
        </div>
        <Link
          href={allHref}
          className="text-sm text-primary-700 hover:text-primary-800 font-medium inline-flex items-center gap-1 whitespace-nowrap shrink-0"
        >
          すべて見る
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {spots.map((spot) => (
          <SpotCard key={spot.id} spot={spot} />
        ))}
      </div>
    </section>
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
      <div
        className="absolute -top-12 -right-10 w-32 h-32 rounded-full bg-white/15 blur-2xl group-hover:scale-110 transition-transform"
        aria-hidden
      />
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
        <p
          className={`font-black text-balance leading-tight ${big ? "text-xl" : "text-base"}`}
        >
          {label}
        </p>
        <p className="text-[11px] opacity-80 mt-0.5">{desc}</p>
      </div>
    </Link>
  );
}
