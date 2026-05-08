"use client";

import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { useState } from "react";

export function HomeSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    router.push(trimmed ? `/spots?q=${encodeURIComponent(trimmed)}` : "/spots");
  };

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      aria-label="スポット検索"
      className="relative group"
    >
      <div className="absolute inset-0 rounded-full bg-white/40 backdrop-blur-md shadow-pop ring-1 ring-white/60 pointer-events-none" />
      <div className="relative flex items-center">
        <Search
          aria-hidden
          className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/55 pointer-events-none"
        />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="例: 水族館、首里、雨の日"
          className="w-full h-14 pl-13 pr-32 rounded-full bg-white/95 border-0 focus:outline-none focus:ring-4 focus:ring-primary-300/50 text-charcoal placeholder:text-charcoal/45 text-[15px]"
          style={{ paddingLeft: "3.25rem" }}
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 h-11 pl-5 pr-4 rounded-full bg-charcoal text-white text-sm font-bold hover:bg-charcoal/90 active:scale-[0.97] transition shadow-soft"
        >
          検索
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
