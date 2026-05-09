# スポット画像の配置

このディレクトリに各スポットの画像ファイルを置きます。

## 命名規則

`{spot-id}.{jpg|webp}` という形式で配置してください。

`spot-id` は `src/data/spots.ts` の各スポットの `id` フィールドそのままです。例：

```
public/spots/
  naha-okimu.jpg
  naha-shuri-castle-park.webp
  itoman-peace-park.jpg
  tomi-dmm-aquarium.webp
```

ビルド後は `https://uchina-map.nexeed-lab.com/spots/{spot-id}.jpg` で配信されます。

## 推奨フォーマット

| 項目 | 推奨 |
|---|---|
| 形式 | **WebP**（軽い）または JPEG |
| サイズ | **1200×800 (3:2)** または 1200×675 (16:9) |
| ファイルサイズ | 150〜300KB / 枚（圧縮後） |
| カラースペース | sRGB |
| メタデータ | プライバシーのためEXIF GPSは事前に削除 |

カードでも詳細ヒーローでも同じ画像を使い回せます。Cloudflare Pagesは画像最適化を提供しないため、配置前に圧縮してください（例: [Squoosh](https://squoosh.app/)）。

## データへの紐付け

`src/data/spots.ts` の各スポットに `imageUrl` を追加してください：

```ts
{
  id: "naha-okimu",
  // ...既存フィールド
  imageUrl: "/spots/naha-okimu.jpg",
  // 著作権情報（外部出典の場合は必須・自前撮影は省略可）
  imageCredit: {
    author: "撮影者名",
    license: "CC-BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:..."
  },
},
```

`imageUrl` 未設定のスポットは、従来通りカテゴリ色グラデーション + 絵文字で表示されます（フォールバック）。

## 著作権について

- **NG**: 各施設の公式サイト・Google画像検索・SNS（Instagram等）の無断利用
- **OK**: 自前撮影 / Wikimedia Commons / Unsplash / 施設からの正式提供（書面）/ パブリックドメイン

外部画像を利用する場合は必ず `imageCredit` を設定してください。詳細ページに「📷 著者名（ライセンス）」として表示され、出典URLにリンクされます。
