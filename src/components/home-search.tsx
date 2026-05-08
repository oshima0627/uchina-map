"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
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
      className="relative"
    >
      <Search
        aria-hidden
        className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/60 pointer-events-none"
      />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="施設名・キーワードで検索（例: 水族館、首里）"
        className="w-full h-14 pl-13 pr-28 rounded-full bg-white shadow-md border border-white/60 focus:outline-none focus:border-primary-300 focus:ring-4 focus:ring-primary-100 text-charcoal placeholder:text-charcoal/50 text-sm md:text-base"
        style={{ paddingLeft: "3.25rem" }}
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-11 px-5 rounded-full bg-hibiscus text-white text-sm font-bold hover:opacity-90 active:scale-[0.98] transition"
      >
        検索
      </button>
    </form>
  );
}
