import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Phone,
  Globe,
  MapPin,
  Clock,
  Calendar,
  Banknote,
  Baby,
  CloudRain,
  Wind,
  Car,
  Volume2,
  Utensils,
  Accessibility,
  ToyBrick,
  Sparkles,
  Camera,
  Building,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdSlot } from "@/components/ads/ad-slot";
import { ADSENSE_SLOTS } from "@/lib/ads";
import { SpotCard } from "@/components/spot-card";
import { JsonLd } from "@/components/json-ld";
import { FavoriteButton } from "./favorite-button";
import { SpotMap } from "./spot-map";
import { SPOTS } from "@/data/spots";
import {
  pageMetadata,
  spotBreadcrumbJsonLd,
  spotDescription,
  spotFacilitySummary,
  spotJsonLd,
  spotOgImage,
} from "@/lib/seo";
import {
  AGE_LABELS,
  CATEGORY_COLORS,
  CATEGORY_EMOJIS,
  CATEGORY_LABELS,
  CITY_LABELS,
  type FacilityNote,
  type Spot,
} from "@/lib/types";
import { formatDuration, formatPrice } from "@/lib/utils";

export const dynamicParams = false;

const RELATED_LIMIT = 4;

/**
 * グループ内で自分の次から巡回して選ぶ。常に先頭から取ると
 * グループ末尾のスポットが誰からもリンクされない孤立ページになるため。
 */
function pickAround(group: Spot[], id: string) {
  const i = group.findIndex((s) => s.id === id);
  return [...group.slice(i + 1), ...group.slice(0, i)];
}

/**
 * 設備の有無を見出し付きの文章にする。
 * 「施設名＋キッズスペース」「施設名＋駐車場」のような検索で表示はされるものの、
 * ページ上に該当する文章が無くクリックされていなかったため、
 * データで裏の取れる範囲だけを文章化する（台数や料金は持っていないので書かない）。
 */
function facilityQa(spot: Spot): Array<{ q: string; a: string; note?: FacilityNote }> {
  const f = spot.features;
  const n = spot.name;
  const qa: Array<{ q: string; a: string; note?: FacilityNote }> = [];

  if (f.hasKidsSpace || f.hasPlayground) {
    const items = [
      f.hasKidsSpace ? "キッズスペース" : null,
      f.hasPlayground ? "遊具" : null,
    ].filter((v): v is string => v !== null);
    // 「那覇空港 キッズスペース」のように施設名に設備語が入る場合、
    // 「キッズスペースにキッズスペースはある？」になるのを避ける
    const nameHasItem = items.some((i) => n.includes(i));
    qa.push({
      q: nameHasItem ? `${n}はどんな遊び場？` : `${n}に${items.join("と")}はある？`,
      a:
        `${items.join("と")}があります。` +
        (f.noiseTolerant ? "多少にぎやかにしても気兼ねしにくい場所です。" : ""),
    });
  }

  const baby = [
    f.hasNursingRoom ? "授乳室" : null,
    f.hasDiaperTable ? "オムツ替え台" : null,
  ].filter(Boolean);
  qa.push({
    q: `${n}に授乳室・オムツ替え台はある？`,
    a:
      spot.nursingNote?.text ??
      (baby.length === 0
        ? "授乳室・オムツ替え台は確認できていません。"
        : `${baby.join("と")}があります。` +
          (f.hasMultipurposeToilet ? "多目的トイレも利用できます。" : "")),
    note: spot.nursingNote,
  });

  qa.push({
    q: `${n}に駐車場はある？`,
    a:
      spot.parkingNote?.text ??
      (!f.hasParking
        ? "専用の駐車場はありません。"
        : f.parkingFree
          ? f.parkingSpacious
            ? "無料の駐車場があります。駐車台数にゆとりがあります。"
            : "無料の駐車場があります。"
          : "駐車場がありますが、利用は有料です。"),
    note: spot.parkingNote,
  });

  qa.push({
    q: `${n}は雨の日でも遊べる？`,
    a: f.rainOk
      ? f.isIndoor
        ? "屋内なので雨の日でも遊べます。"
        : "雨の日でも利用できます。"
      : "屋外が中心のため、雨の日には向きません。",
  });

  qa.push({
    q: `${n}はベビーカーで行ける？`,
    a: f.strollerFriendly
      ? "ベビーカーで回れます。" + (f.strollerRental ? "ベビーカーの貸出もあります。" : "")
      : "ベビーカーでの移動には向きません。" +
        (f.strollerRental ? "ベビーカーの貸出があります。" : ""),
  });

  return qa;
}

/** 同じ市町村 → 同じカテゴリの順に関連スポットを選ぶ（重複は除く） */
function relatedSpots(spot: Spot) {
  const sameCity = pickAround(
    SPOTS.filter((s) => s.city === spot.city),
    spot.id,
  ).slice(0, RELATED_LIMIT);

  const shown = new Set([spot.id, ...sameCity.map((s) => s.id)]);
  const sameCategory = pickAround(
    SPOTS.filter((s) => s.category === spot.category),
    spot.id,
  )
    .filter((s) => !shown.has(s.id))
    .slice(0, RELATED_LIMIT);

  return { sameCity, sameCategory };
}

export function generateStaticParams() {
  return SPOTS.map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const spot = SPOTS.find((s) => s.id === id);
  if (!spot) return {};
  const facilities = spotFacilitySummary(spot).slice(0, 4);
  return pageMetadata({
    title: `${spot.name}（${CITY_LABELS[spot.city]}）の子連れ情報`,
    description: [
      `${spot.name}（${CITY_LABELS[spot.city]}）の子連れ情報。`,
      facilities.length > 0 ? `${facilities.join("・")}。` : "",
      spotDescription(spot),
    ].join(""),
    path: `/spots/${spot.id}/`,
    image: spotOgImage(spot),
    imageAlt: `${spot.name}の写真`,
  });
}

export default async function SpotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const spot = SPOTS.find((s) => s.id === id);
  if (!spot) notFound();

  const features = spot.features;
  const { sameCity, sameCategory } = relatedSpots(spot);

  const categoryColor = CATEGORY_COLORS[spot.category];
  const hasImage = !!spot.imageUrl;

  return (
    <article>
      <JsonLd data={spotJsonLd(spot)} />
      <JsonLd data={spotBreadcrumbJsonLd(spot)} />
      {/* Hero */}
      <div
        className="relative h-64 md:h-80 overflow-hidden bg-sand-light"
        style={
          hasImage
            ? undefined
            : {
                background: `radial-gradient(at 18% 18%, ${categoryColor}cc 0, transparent 55%), radial-gradient(at 82% 82%, ${categoryColor}55 0, transparent 50%), linear-gradient(160deg, ${categoryColor}22 0%, ${categoryColor}11 100%)`,
              }
        }
      >
        {hasImage ? (
          <>
            <img
              src={spot.imageUrl}
              alt={`${spot.name}の写真`}
              decoding="async"
              width={1200}
              height={640}
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30"
              aria-hidden
            />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" aria-hidden />
            <span
              className="absolute inset-0 grid place-items-center text-[8rem] md:text-[10rem] animate-float"
              aria-hidden
            >
              {spot.imageEmoji ?? CATEGORY_EMOJIS[spot.category]}
            </span>
          </>
        )}
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold glass-strong text-charcoal">
          <span
            aria-hidden
            className="w-2 h-2 rounded-full"
            style={{ background: categoryColor }}
          />
          {CATEGORY_LABELS[spot.category]}
        </span>
        <FavoriteButton id={spot.id} />
        {spot.imageCredit && (
          <a
            href={spot.imageCredit.source}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-dark text-white text-[10px] font-medium hover:bg-white/15 transition"
          >
            <Camera className="w-3 h-3" strokeWidth={2} />
            {spot.imageCredit.author}（{spot.imageCredit.license}）
          </a>
        )}
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-charcoal text-balance leading-tight">
            {spot.name}
          </h1>
          {spot.nameKana && (
            <p className="text-sm text-charcoal/70 mt-1">{spot.nameKana}</p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {spot.highlights.map((h) => (
              <Badge key={h} variant="sand">
                <Sparkles className="w-3 h-3" strokeWidth={2.25} />
                {h}
              </Badge>
            ))}
            {spot.ageTags.map((a) => (
              <Badge key={a} variant="primary">
                <Baby className="w-3 h-3" strokeWidth={2.25} />
                {AGE_LABELS[a]}
              </Badge>
            ))}
          </div>
        </header>

        {/* Top 5 child-friendly badges */}
        <section className="rounded-2xl bg-primary-50 border border-primary-200 p-4 mb-6">
          <h2 className="text-sm font-bold text-primary-800 mb-3">
            子連れ目線でチェック
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            <FeatureItem
              ok={features.hasNursingRoom || features.hasDiaperTable}
              icon={<Baby className="w-4 h-4" />}
              label={
                features.hasNursingRoom && features.hasDiaperTable
                  ? "授乳室・オムツ替え"
                  : features.hasNursingRoom
                    ? "授乳室あり"
                    : features.hasDiaperTable
                      ? "オムツ替え台"
                      : "授乳/オムツ替え"
              }
            />
            <FeatureItem
              ok={features.strollerFriendly}
              icon={<Wind className="w-4 h-4" />}
              label={features.strollerRental ? "ベビーカー貸出あり" : "ベビーカーOK"}
            />
            <FeatureItem
              ok={features.rainOk}
              icon={<CloudRain className="w-4 h-4" />}
              label={
                features.typhoonOk
                  ? "雨・台風OK"
                  : features.rainOk
                    ? "雨の日OK"
                    : features.isIndoor
                      ? "屋内"
                      : "屋外"
              }
            />
            <FeatureItem
              ok={features.hasParking}
              icon={<Car className="w-4 h-4" />}
              label={
                features.parkingFree
                  ? features.parkingSpacious
                    ? "駐車場無料・広い"
                    : "駐車場無料"
                  : "駐車場あり（有料）"
              }
            />
            <FeatureItem
              ok={!!features.hasKidsSpace || !!features.hasPlayground}
              icon={<ToyBrick className="w-4 h-4" />}
              label={features.hasKidsSpace ? "キッズスペース" : features.hasPlayground ? "遊具あり" : "遊具・キッズスペース"}
            />
            <FeatureItem
              ok={features.noiseTolerant}
              icon={<Volume2 className="w-4 h-4" />}
              label="泣いてもOK"
            />
          </div>
        </section>

        {/* Description */}
        <section className="mb-6">
          <p className="text-charcoal/85 leading-relaxed text-balance">
            {spot.description}
          </p>
        </section>

        {/* Detailed info */}
        <section className="rounded-2xl bg-white border border-border divide-y divide-border mb-6">
          <InfoRow
            icon={<MapPin className="w-4 h-4" />}
            label="住所"
            value={
              <span>
                {spot.address}
                <span className="text-charcoal/70 ml-2">（{CITY_LABELS[spot.city]}）</span>
              </span>
            }
          />
          {spot.floor && (
            <InfoRow
              icon={<Building className="w-4 h-4" />}
              label="フロア"
              value={spot.floor}
            />
          )}
          {spot.phone && (
            <InfoRow
              icon={<Phone className="w-4 h-4" />}
              label="電話"
              value={
                <a
                  href={`tel:${spot.phone}`}
                  className="text-primary-700 hover:underline"
                >
                  {spot.phone}
                </a>
              }
            />
          )}
          {spot.businessHours && (
            <InfoRow
              icon={<Clock className="w-4 h-4" />}
              label="営業時間"
              value={spot.businessHours}
            />
          )}
          {spot.closedDays.length > 0 && (
            <InfoRow
              icon={<Calendar className="w-4 h-4" />}
              label="定休日"
              value={spot.closedDays.join(" / ")}
            />
          )}
          <InfoRow
            icon={<Banknote className="w-4 h-4" />}
            label="料金"
            value={
              spot.price?.free || spot.price?.adult === 0 ? (
                <span className="text-primary-700 font-bold">無料</span>
              ) : (
                <span>
                  大人 {formatPrice(spot.price?.adult ?? 0)}
                  {typeof spot.price?.child === "number" &&
                    ` / 子供 ${formatPrice(spot.price.child)}`}
                  {typeof spot.price?.freeUnder === "number" &&
                    ` / ${spot.price.freeUnder}歳未満無料`}
                </span>
              )
            }
          />
          <InfoRow
            icon={<Clock className="w-4 h-4" />}
            label="滞在目安"
            value={formatDuration(spot.durationMin)}
          />
          {spot.websiteUrl && (
            <InfoRow
              icon={<Globe className="w-4 h-4" />}
              label="公式サイト"
              value={
                <a
                  href={spot.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-700 hover:underline truncate"
                >
                  {spot.websiteUrl.replace(/^https?:\/\//, "")}
                </a>
              }
            />
          )}
        </section>

        {/* Map */}
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3">地図</h2>
          <SpotMap lat={spot.lat} lng={spot.lng} name={spot.name} />
          <div className="grid grid-cols-2 gap-2 mt-3">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-11 rounded-full bg-primary text-white font-medium"
            >
              <MapPin className="w-4 h-4" /> Google Maps
            </a>
            <a
              href={`https://maps.apple.com/?ll=${spot.lat},${spot.lng}&q=${encodeURIComponent(spot.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-11 rounded-full bg-charcoal text-white font-medium"
            >
              <MapPin className="w-4 h-4" /> Apple Maps
            </a>
          </div>
        </section>

        {/* Detail features */}
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-3">設備・サービス</h2>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            <DetailItem ok={features.hasNursingRoom}>授乳室</DetailItem>
            <DetailItem ok={features.hasDiaperTable}>オムツ替え台</DetailItem>
            <DetailItem ok={features.hasMultipurposeToilet ?? false}>
              <span className="inline-flex items-center gap-1.5">
                <Accessibility className="w-3.5 h-3.5" /> 多目的トイレ
              </span>
            </DetailItem>
            <DetailItem ok={features.strollerFriendly}>ベビーカー可</DetailItem>
            <DetailItem ok={features.strollerRental}>ベビーカー貸出</DetailItem>
            <DetailItem ok={features.isIndoor}>屋内</DetailItem>
            <DetailItem ok={features.isOutdoor}>屋外</DetailItem>
            <DetailItem ok={features.rainOk}>雨OK</DetailItem>
            <DetailItem ok={features.typhoonOk}>台風OK</DetailItem>
            <DetailItem ok={features.hasParking}>駐車場</DetailItem>
            <DetailItem ok={features.parkingFree}>駐車場無料</DetailItem>
            <DetailItem ok={features.hasKidsSpace}>キッズスペース</DetailItem>
            <DetailItem ok={features.hasPlayground ?? false}>遊具</DetailItem>
            <DetailItem ok={features.hasKidsChair}>
              <span className="inline-flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5" /> 子供用椅子
              </span>
            </DetailItem>
            <DetailItem ok={features.noiseTolerant}>泣いてもOK</DetailItem>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold mb-3">{spot.name}の子連れ設備Q&amp;A</h2>
          <div className="rounded-2xl bg-white border border-border divide-y divide-border">
            {facilityQa(spot).map(({ q, a, note }) => (
              <div key={q} className="px-4 py-3">
                <h3 className="text-sm font-bold text-charcoal">{q}</h3>
                <p className="text-sm text-charcoal/80 mt-1 leading-relaxed">{a}</p>
                {(note?.source || note?.checkedOn) && (
                  <p className="text-[11px] text-charcoal/60 mt-1.5">
                    {note.source ? (
                      <>
                        出典:{" "}
                        <a
                          href={note.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-charcoal"
                        >
                          {note.source.name}
                        </a>
                      </>
                    ) : (
                      "現地確認"
                    )}
                    {note.checkedOn && `（${note.checkedOn}確認）`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 本文（設備情報）を読み終えた位置に置く。関連スポットより前に出して誤タップを避ける */}
        <AdSlot slot={ADSENSE_SLOTS.content} className="mb-10" />

        {sameCity.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold mb-3">
              {CITY_LABELS[spot.city]}の他の子連れスポット
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sameCity.map((s) => (
                <SpotCard key={s.id} spot={s} />
              ))}
            </div>
          </section>
        )}

        {sameCategory.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold mb-3">
              沖縄の他の{CATEGORY_LABELS[spot.category]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sameCategory.map((s) => (
                <SpotCard key={s.id} spot={s} />
              ))}
            </div>
          </section>
        )}

        <Link
          href="/spots"
          className="inline-flex items-center text-sm text-primary-700 hover:underline"
        >
          ← 一覧にもどる
        </Link>
      </div>
    </article>
  );
}

function FeatureItem({
  ok,
  icon,
  label,
}: {
  ok: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div
      className={
        "flex items-center gap-2 px-3 py-2 rounded-xl text-sm " +
        (ok
          ? "bg-white text-charcoal border border-primary-200"
          : "bg-white/40 text-charcoal/40 border border-dashed border-border")
      }
    >
      <span className={ok ? "text-primary-700" : "text-charcoal/30"}>{icon}</span>
      <span className="font-medium">{label}</span>
      {ok ? (
        <span className="ml-auto text-xs text-primary-700">●</span>
      ) : (
        <span className="ml-auto text-xs">―</span>
      )}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <span className="grid place-items-center w-7 h-7 rounded-full bg-sand-light text-primary-700 shrink-0 mt-0.5">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-bold text-charcoal/70 uppercase tracking-wide">
          {label}
        </div>
        <div className="text-sm text-charcoal break-words">{value}</div>
      </div>
    </div>
  );
}

function DetailItem({
  ok,
  children,
}: {
  ok: boolean;
  children: React.ReactNode;
}) {
  return (
    <li
      className={
        "flex items-center gap-1.5 px-3 py-2 rounded-lg " +
        (ok
          ? "bg-primary-50 text-charcoal"
          : "bg-sand-light/40 text-charcoal/40 line-through")
      }
    >
      <span
        aria-hidden
        className={
          "inline-block w-1.5 h-1.5 rounded-full " +
          (ok ? "bg-primary" : "bg-charcoal/20")
        }
      />
      {children}
    </li>
  );
}
