import {
  CATEGORY_LABELS,
  CITY_LABELS,
  type AgeTag,
  type Category,
  type City,
  type FilterFeature,
  type Spot,
} from "@/lib/types";

/**
 * 一覧ページ（授乳室ありの設備ページ・ビーチ・水族館・0歳）の導入文と「選び方・確認していること」。
 *
 * 文章はすべて SPOTS から数えた値で組み立てる（手書きの数字・断定は入れない）。
 * 数えるのは「値が明示されている」ものだけにする。
 * - 授乳室・オムツ替え台・ベビーカー貸出・屋内・雨OK・台風OKは、true のときだけ明示しているフラグ。
 * - ベビーカー可・駐車場あり・駐車場無料は spots.ts の既定値が true のため、件数には使わない。
 * - 駐車場・授乳室の「出典つき」は parkingNote / nursingNote に source があるものだけ。
 * 静的書き出し時にサーバーで描画される（クライアント JS に依存しない）。
 */
export type CollectionEditorial = {
  intro: string;
  checksHeading: string;
  checks: string[];
};

export type EditorialTarget =
  | { type: "feature"; feature: FilterFeature }
  | { type: "category"; category: Category }
  | { type: "age"; age: AgeTag };

const count = (spots: Spot[], pred: (s: Spot) => boolean) => spots.filter(pred).length;
const hasSourcedNursing = (s: Spot) => !!s.nursingNote?.source;
const hasSourcedParking = (s: Spot) => !!s.parkingNote?.source;

/** 市町村の分布。件数が1件ずつで順位に意味がないときは「1件ずつ」と書く */
function cityBreakdown(spots: Spot[]): string {
  const m = new Map<City, number>();
  for (const s of spots) m.set(s.city, (m.get(s.city) ?? 0) + 1);
  const k = m.size;
  const multi = [...m.entries()]
    .filter(([, v]) => v >= 2)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 3)
    .map(([c, v]) => `${CITY_LABELS[c]}${v}件`);
  if (multi.length === 0) return `${k}市町村に1件ずつあります。`;
  return `${k}市町村にあり、${multi.join("・")}が多めです。`;
}

function topCategories(spots: Spot[], n = 2): string {
  const m = new Map<Category, number>();
  for (const s of spots) m.set(s.category, (m.get(s.category) ?? 0) + 1);
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, n)
    .map(([c, k]) => `${CATEGORY_LABELS[c]}${k}件`)
    .join("・");
}

const COUNT_NOTE = "件数は、データで「あり」と明示されている設備だけを数えた値です。";

/** 「なし」の意味の注意書き。データ上は「ない」と「未確認」を区別できないため */
const NONE_NOTE =
  "「あり」と表示しているのはデータで「あり」としているものだけで、「なし」の表示にはない場合と未確認の場合の両方が含まれます。";

const CONFIRM_NOTE =
  "掲載内容は変更されることがあるため、おでかけ前に各施設の公式サイトで最新の情報をご確認ください。";

export function collectionEditorial(
  target: EditorialTarget,
  spots: Spot[],
): CollectionEditorial | undefined {
  const n = spots.length;
  if (n === 0) return undefined;

  if (target.type === "feature" && target.feature === "hasNursingRoom") {
    const sourced = count(spots, hasSourcedNursing);
    const diaper = count(spots, (s) => s.features.hasDiaperTable);
    const rental = count(spots, (s) => s.features.strollerRental);
    const indoor = count(spots, (s) => s.features.isIndoor);
    const parkingNotes = count(spots, hasSourcedParking);
    return {
      intro:
        `沖縄本島で授乳室があるとデータに載せているスポットを${n}件まとめています。` +
        `${cityBreakdown(spots)}カテゴリ別では${topCategories(spots)}が多めです。` +
        `このうち授乳室の場所や設備を出典つきで説明しているのは${sourced}件で、残りの${n - sourced}件は授乳室の有無のみの掲載です（階数・室数は未確認）。` +
        `オムツ替え台もあるのは${diaper}件、ベビーカー貸出があるのは${rental}件です。${COUNT_NOTE}`,
      checksHeading: "授乳室で選ぶときの見方と、このページで確認していること",
      checks: [
        `出典つきの説明がある${sourced}件は、各スポットのQ&A欄で出典リンクと確認時期を見られます。授乳室の場所を事前に知りたいときは、ここから選んでください。`,
        `雨の日や台風の日に使うなら、屋内の施設（${indoor}件）から選べます。屋外の公園やビーチは、授乳室が園内・施設内のどこにあるかを各ページで確認してください。`,
        `車で行く場合は、駐車場の台数や料金を出典つきで説明しているスポットが${parkingNotes}件あります。それ以外は駐車場の有無のみの掲載です。`,
        CONFIRM_NOTE,
      ],
    };
  }

  if (target.type === "category" && target.category === "beach") {
    const nursing = count(spots, (s) => s.features.hasNursingRoom);
    const diaper = count(spots, (s) => s.features.hasDiaperTable);
    const rain = count(spots, (s) => s.features.rainOk);
    const typhoon = count(spots, (s) => s.features.typhoonOk);
    const parkingNotes = count(spots, hasSourcedParking);
    const sourced = count(spots, hasSourcedNursing);
    const rainPhrase =
      rain === 0
        ? "ビーチは屋外のため、雨の日に使えるとしているものはありません。"
        : `雨の日に使えるとしているのは${rain}件です。`;
    return {
      intro:
        `沖縄本島のビーチを${n}件掲載しています。${cityBreakdown(spots)}` +
        `駐車場について台数や料金を出典つきで説明しているのは${parkingNotes}件、授乳室の場所を出典つきで説明しているのは${sourced}件です。` +
        `授乳室があるビーチは${nursing}件、オムツ替え台があるのは${diaper}件です。${rainPhrase}` +
        `シャワー・更衣室・遊泳できる期間は当サイトでは掲載していないため、公式情報でご確認ください。${COUNT_NOTE}`,
      checksHeading: "ビーチ選びの見方と、このページで確認していること",
      checks: [
        `授乳室・オムツ替え台の有無は各スポットの「設備・サービス」欄にあります（授乳室あり${nursing}件、オムツ替え台あり${diaper}件）。${NONE_NOTE}`,
        rain === 0 && typhoon === 0
          ? "雨の日や台風のときに使えるとしているビーチはありません。天候が不安な日は、屋内の施設を含む他のカテゴリも合わせて探してください。"
          : `雨の日に使えるとしているのは${rain}件、台風のときにも使えるのは${typhoon}件です。天候が不安な日は、屋内の施設を含む他のカテゴリも合わせて探してください。`,
        `駐車場は、台数や料金を出典つきで説明している${parkingNotes}件を優先して確認できます。それ以外は有無のみの掲載です。`,
        `遊泳できる区域・期間・監視員の有無は当サイトでは扱っていません。${CONFIRM_NOTE}`,
      ],
    };
  }

  if (target.type === "category" && target.category === "aquarium") {
    const indoor = count(spots, (s) => s.features.isIndoor);
    const rain = count(spots, (s) => s.features.rainOk);
    const nursing = count(spots, (s) => s.features.hasNursingRoom);
    const rental = count(spots, (s) => s.features.strollerRental);
    const paid = count(spots, (s) => (s.price?.adult ?? 0) > 0);
    const parkingNotes = count(spots, hasSourcedParking);
    const sourced = count(spots, hasSourcedNursing);
    return {
      intro:
        `沖縄本島の水族館・動物の施設を${n}件掲載しています。${cityBreakdown(spots)}` +
        `屋内で楽しめるのは${indoor}件、雨の日にも利用できるのは${rain}件です。` +
        `授乳室があるのは${nursing}件、ベビーカー貸出があるのは${rental}件で、入館料（大人料金）が設定されているのは${paid}件です。` +
        `駐車場は、台数や料金を出典つきで説明しているのが${parkingNotes}件、授乳室の場所を出典つきで説明しているのが${sourced}件です。${COUNT_NOTE}`,
      checksHeading: "水族館選びの見方と、このページで確認していること",
      checks: [
        `入館料は各スポットの「料金」欄に、データにある大人・子供などの料金を載せています。料金が載っていない場合は、公式サイトで確認してください。`,
        `雨の日や台風の日に使うなら、屋内の施設（${indoor}件）から選べます。屋外の展示が中心の施設は、天候で見られる範囲が変わることがあります。`,
        `授乳室（${nursing}件）・ベビーカー貸出（${rental}件）は、設備欄で「あり」と明示しているものだけを数えています。${NONE_NOTE}`,
        CONFIRM_NOTE,
      ],
    };
  }

  if (target.type === "age" && target.age === "0") {
    const nursing = count(spots, (s) => s.features.hasNursingRoom);
    const diaper = count(spots, (s) => s.features.hasDiaperTable);
    const rental = count(spots, (s) => s.features.strollerRental);
    const rain = count(spots, (s) => s.features.rainOk);
    const sourced = count(spots, hasSourcedNursing);
    return {
      intro:
        `沖縄本島で0歳の赤ちゃんと行ける目安として掲載しているスポットが${n}件あります。${cityBreakdown(spots)}` +
        `授乳室があるのは${nursing}件、オムツ替え台があるのは${diaper}件、ベビーカー貸出があるのは${rental}件で、雨の日にも使えるのは${rain}件です。` +
        `授乳室の場所を出典つきで説明しているのは${sourced}件です。${COUNT_NOTE}` +
        `対象年齢は目安のため、月齢や体調に合わせて無理のない範囲でお選びください。`,
      checksHeading: "0歳連れの見方と、このページで確認していること",
      checks: [
        `授乳室の場所や設備を出典つきで説明している${sourced}件は、出典リンクと確認時期が各スポットのQ&A欄にあります。`,
        `授乳室・オムツ替え台・ベビーカー貸出は、設備欄で「あり」と明示しているものだけを数えています。${NONE_NOTE}`,
        `雨の日に使えるとしている${rain}件は、天候が崩れた日の候補になります。外出前に営業状況をご確認ください。`,
        CONFIRM_NOTE,
      ],
    };
  }

  return undefined;
}
