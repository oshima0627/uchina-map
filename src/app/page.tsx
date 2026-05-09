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
  Gamepad2,
  ShoppingBag,
  BookOpen,
  Droplets,
  type LucideIcon,
} from "lucide-react";
import { SpotCard } from "@/components/spot-card";
import { HomeSearch } from "@/components/home-search";
import { SPOTS } from "@/data/spots";
import {
  AGE_LABELS,
  CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  CITIES,
  CITY_LABELS,
  type AgeTag,
  type Category,
  type Spot,
} from "@/lib/types";

const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  park: TreePine,
  indoor: Gamepad2,
  aquarium: Fish,
  beach: Waves,
  restaurant: Utensils,
  shopping: ShoppingBag,
  learning: BookOpen,
  onsen: Droplets,
};

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
  accent: string;
}> = [
  { tag: "0", display: "0", suffix: "歳", desc: "授乳室・オムツ替え重視", accent: "#e84855" },
  { tag: "1-3", display: "1〜3", suffix: "歳", desc: "ベビーカーOK・近場", accent: "#e89a2d" },
  { tag: "4-6", display: "4〜6", suffix: "歳", desc: "遊具・体験型施設", accent: "#3db8c9" },
  { tag: "school", display: "6", suffix: "歳〜", desc: "1日遊べる施設", accent: "#226574" },
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

      {/* Editorial needs — photo lead + 2 white text cards + thin map row */}
      <section className="mx-auto max-w-5xl px-4 mt-2 md:mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {/* Lead: real photo + overlay */}
          <Link
            href="/spots?feature=rainOk"
            className="group relative col-span-2 overflow-hidden rounded-3xl min-h-[200px] md:min-h-[260px]"
          >
            <img
              src="/spots/DMMかりゆし水族館.jpg"
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1d33]/90 via-[#0f1d33]/45 to-[#0f1d33]/10" />
            <div className="relative h-full p-5 md:p-6 flex flex-col justify-end text-white">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/75">
                  Rainy Day
                </span>
                <span className="h-px flex-1 bg-white/25" />
                <span className="text-[10px] tabular-nums font-medium text-white/75">
                  {SPOTS.filter((s) => s.features.rainOk).length} spots
                </span>
              </div>
              <h3 className="mt-2 text-2xl md:text-[2rem] font-black tracking-[-0.02em] leading-[1.15] text-balance">
                雨の日も、思い切り遊べる。
              </h3>
              <p className="mt-1.5 text-xs md:text-sm text-white/80 max-w-md">
                屋内・屋根付きで、天気を気にせずおでかけ。
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs md:text-sm font-bold">
                屋内スポットを見る
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          <EditorialBento
            href="/spots?feature=hasNursingRoom"
            eyebrow="Nursing"
            count={SPOTS.filter((s) => s.features.hasNursingRoom).length}
            title="授乳室あり"
            desc="0歳から安心"
            accent="#e89a2d"
          />
          <EditorialBento
            href="/spots?age=0"
            eyebrow="With Baby"
            count={SPOTS.filter((s) => s.ageTags.includes("0")).length}
            title="0歳と行ける"
            desc="赤ちゃんと一緒に"
            accent="#e84855"
          />
        </div>

        {/* Thin editorial map strip — replaces the bulky map bento */}
        <Link
          href="/map"
          className="group mt-3 md:mt-4 flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3.5 rounded-2xl bg-card border border-border hover:border-charcoal/30 hover:shadow-soft transition"
        >
          <span className="grid place-items-center w-10 h-10 rounded-xl border border-border bg-primary-50/50 text-primary-700">
            <MapIcon className="w-[18px] h-[18px]" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold tracking-[0.22em] uppercase text-primary-700">
              Map
            </span>
            <h3 className="text-[13px] md:text-sm font-black text-charcoal leading-tight">
              沖縄南部のスポットを地図で
            </h3>
          </div>
          <span className="text-[11px] tabular-nums font-bold text-charcoal/55">
            {SPOTS.length}件
          </span>
          <ArrowRight className="w-4 h-4 text-charcoal/45 transition-all group-hover:translate-x-1 group-hover:text-charcoal" />
        </Link>
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

      {/* Age section — editorial white cards with thin colored accent */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <SectionHeader eyebrow="By Age" title="年齢で選ぶ" />
        <ul className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {AGE_CARDS.map(({ tag, display, suffix, desc, accent }) => {
            const count = SPOTS.filter((s) => s.ageTags.includes(tag)).length;
            return (
              <li key={tag}>
                <Link
                  href={`/spots?age=${tag}`}
                  className="group relative block rounded-3xl bg-card p-5 min-h-[170px] border border-border hover:border-charcoal/30 hover:shadow-card transition overflow-hidden"
                >
                  <span
                    aria-hidden
                    className="absolute top-0 left-5 right-5 h-[3px] rounded-b-full"
                    style={{ background: accent }}
                  />
                  <span className="block text-[10px] font-bold tracking-[0.22em] uppercase text-charcoal/55">
                    Age
                  </span>
                  <div className="mt-1.5 flex items-baseline gap-1 text-charcoal">
                    <span className="text-[2.75rem] md:text-5xl font-black tracking-[-0.05em] tabular-nums leading-[0.9]">
                      {display}
                    </span>
                    <span className="text-sm font-bold pb-1 text-charcoal/65">
                      {suffix}
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal/70 mt-3 leading-snug">
                    {desc}
                  </p>
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                    <span className="text-[11px] font-bold tabular-nums text-charcoal/55">
                      {count}件
                    </span>
                    <ArrowRight className="w-4 h-4 text-charcoal/45 group-hover:translate-x-1 group-hover:text-charcoal transition-all" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Categories — editorial list with line icons + per-category counts */}
      <section className="mx-auto max-w-5xl px-4 pb-2">
        <SectionHeader eyebrow="Browse" title="カテゴリで探す" />
        <ul className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat];
            const color = CATEGORY_COLORS[cat];
            const count = SPOTS.filter((s) => s.category === cat).length;
            return (
              <li key={cat}>
                <Link
                  href={`/spots?category=${cat}`}
                  className="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border hover:border-charcoal/30 hover:shadow-soft transition"
                >
                  <span
                    aria-hidden
                    className="grid place-items-center w-9 h-9 rounded-xl shrink-0"
                    style={{
                      background: `${color}15`,
                      color,
                    }}
                  >
                    <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
                  </span>
                  <span className="flex-1 min-w-0 text-sm font-bold text-charcoal leading-tight">
                    {CATEGORY_LABELS[cat]}
                  </span>
                  <span className="text-[11px] tabular-nums font-bold text-charcoal/55">
                    {count}
                  </span>
                  <ArrowRight className="w-4 h-4 text-charcoal/40 transition-all group-hover:translate-x-0.5 group-hover:text-charcoal shrink-0" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Areas — pills with per-city counts and a thin separator */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <SectionHeader eyebrow="Areas" title="エリアで探す" />
        <ul className="mt-5 flex flex-wrap gap-2">
          {CITIES.map((city) => {
            const count = SPOTS.filter((s) => s.city === city).length;
            return (
              <li key={city}>
                <Link
                  href={`/spots?city=${city}`}
                  className="group inline-flex items-center gap-2.5 pl-4 pr-3 h-10 rounded-full bg-card text-charcoal border border-border hover:border-charcoal/30 hover:shadow-soft transition"
                >
                  <span className="text-sm font-medium">
                    {CITY_LABELS[city]}
                  </span>
                  <span className="pl-2.5 border-l border-border/70 text-[11px] tabular-nums font-bold text-charcoal/55">
                    {count}
                  </span>
                </Link>
              </li>
            );
          })}
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

function EditorialBento({
  href,
  eyebrow,
  count,
  title,
  desc,
  accent,
}: {
  href: string;
  eyebrow: string;
  count: number;
  title: string;
  desc: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="group relative bg-card rounded-3xl p-5 border border-border hover:border-charcoal/30 hover:shadow-card transition flex flex-col min-h-[200px] md:min-h-[260px] overflow-hidden"
    >
      <span
        aria-hidden
        className="absolute top-0 left-5 right-5 h-[3px] rounded-b-full"
        style={{ background: accent }}
      />
      <span className="block text-[10px] font-bold tracking-[0.22em] uppercase text-charcoal/55">
        {eyebrow}
      </span>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-[3rem] md:text-[3.75rem] font-black tabular-nums text-charcoal tracking-[-0.05em] leading-[0.85]">
          {count}
        </span>
        <span className="text-xs font-bold text-charcoal/55">件</span>
      </div>
      <div className="mt-auto pt-4">
        <h3 className="text-base font-black text-charcoal leading-tight">
          {title}
        </h3>
        <p className="text-[11px] text-charcoal/65 mt-0.5">{desc}</p>
      </div>
      <ArrowRight className="absolute bottom-5 right-5 w-4 h-4 text-charcoal/45 transition-all group-hover:translate-x-1 group-hover:text-charcoal" />
    </Link>
  );
}
