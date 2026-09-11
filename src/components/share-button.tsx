"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

/**
 * スポットを家族や友人に送るためのボタン。
 *
 * 訪問の9割がモバイルで、行き先は配偶者やママ友と相談して決まる。
 * Web Share API があればOSの共有シート（LINE・メッセージ等）を開き、
 * 無ければURLをクリップボードにコピーする。
 */
export function ShareButton({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${window.location.origin}${path}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // ユーザーがキャンセルした場合はここに来る。何もしない
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // クリップボードが使えない環境では何も起きない
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full bg-card border border-border text-sm font-bold text-charcoal hover:border-charcoal/30 active:scale-95 transition"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" strokeWidth={2.25} />
          リンクをコピーしました
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" strokeWidth={2.25} />
          家族に送る
        </>
      )}
    </button>
  );
}
