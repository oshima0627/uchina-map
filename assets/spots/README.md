# スポット画像の配置

**このディレクトリに元画像を置きます。ここは配信されません。**
`pnpm optimize:images` で `public/spots/` に配信用の WebP が生成されます。

```
assets/spots/<name>.{jpg,png,webp}    元画像（このディレクトリ・配信されない）
  ├→ public/spots/<name>.webp         詳細ヒーロー用（最大幅1600・生成物）
  └→ public/spots/card/<name>.webp    一覧カード用（最大幅800・生成物）
```

生成物もコミットしてください（Cloudflare Pages のビルドでは生成しません）。

## 命名規則

**スポット名（日本語そのまま）または `id` のどちらでもOK** です。

例：
```
assets/spots/
  首里城.webp
  沖縄県立博物館.jpg
  那覇空港 キッズスペース.jpg     # 半角スペース可（URLエンコード自動）
  浦添大公園.jpg
  美々ビーチいとまん.jpg
```

ファイル名は `src/data/spots.ts` の各スポットの `imageUrl` フィールドから参照されます。実際にどのファイルを使うかはコード側で指定するため、**ファイル名は人間が分かりやすい名前で構いません**。

ビルド後は `https://uchina-map.nexeed-lab.com/spots/{ファイル名}` で配信されます（日本語・スペースは自動でURLエンコードされます）。

## 推奨フォーマット

| 項目 | 推奨 |
|---|---|
| 形式 | JPEG / PNG / WebP のいずれでも可 |
| サイズ | **横1600px以上**（縮小はスクリプト側で行う。これより小さいと拡大されずそのまま） |
| カラースペース | sRGB |
| メタデータ | プライバシーのためEXIF GPSは事前に削除 |

**圧縮は不要です。** `pnpm optimize:images` が WebP 変換とリサイズを行います
（ヒーロー 最大1600px/品質80、カード 最大800px/品質70）。
元画像が更新されていなければスキップするので、再実行しても再圧縮による劣化は起きません。

## データへの紐付け

`src/data/spots.ts` の各スポットに `imageUrl` を追加してください：

```ts
{
  id: "naha-okimu",
  // ...既存フィールド
  imageUrl: "/spots/沖縄県立博物館.webp",   // 生成物を指す（拡張子は .webp）
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
