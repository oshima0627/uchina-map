/**
 * assets/spots/ の元画像から public/spots/ の配信用 WebP を生成する。
 *
 * 静的エクスポートのため next/image の最適化が使えず（images.unoptimized: true）、
 * 元画像がそのまま配信されていた。900px で 900KB の PNG などがあり、
 * 一覧ページではカード1枚あたり数百KBを読み込んでいた。
 *
 *   assets/spots/<name>.{jpg,png,webp}   元画像（配信されない）
 *     ├→ public/spots/<name>.webp        詳細ページのヒーロー用（最大幅 1600）
 *     └→ public/spots/card/<name>.webp   一覧カード用（最大幅 800）
 *
 * 元画像より大きくはしない（半数以上が元から1000px未満のため）。
 * 元画像が更新されていなければスキップするので、再実行しても再圧縮による劣化は起きない。
 *
 * 使い方: pnpm optimize:images
 * 画像を追加・差し替えしたら assets/spots/ に置いて実行し、生成物ごとコミットする。
 */
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC_DIR = "assets/spots";
const OUT_DIR = "public/spots";
const VARIANTS = [
  { dir: OUT_DIR, width: 1600, quality: 80 },
  { dir: path.join(OUT_DIR, "card"), width: 800, quality: 70 },
];

async function mtime(p) {
  try {
    return (await stat(p)).mtimeMs;
  } catch {
    return 0;
  }
}

async function main() {
  for (const { dir } of VARIANTS) await mkdir(dir, { recursive: true });

  const files = (await readdir(SRC_DIR)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  let written = 0;
  let skipped = 0;
  let before = 0;
  let after = 0;

  for (const file of files) {
    const src = path.join(SRC_DIR, file);
    const base = file.replace(/\.[^.]+$/, "");
    const srcTime = await mtime(src);
    before += (await stat(src)).size;

    for (const { dir, width, quality } of VARIANTS) {
      const out = path.join(dir, `${base}.webp`);
      if ((await mtime(out)) > srcTime) {
        after += (await stat(out)).size;
        skipped++;
        continue;
      }
      const buf = await sharp(src)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality })
        .toBuffer();
      await writeFile(out, buf);
      after += buf.length;
      written++;
    }
  }

  const mb = (n) => (n / 1024 / 1024).toFixed(1) + "MB";
  console.log(
    `元画像 ${files.length} 枚 ${mb(before)} → 配信用 ${written + skipped} 件 ${mb(after)}` +
      `（生成 ${written} / スキップ ${skipped}）`,
  );
}

await main();
