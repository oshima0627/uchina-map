"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Map as MapIcon, Sparkles, Home, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/lib/favorites-store";

const PRIMARY_NAV = [
  { href: "/", label: "ホーム", Icon: Home },
  { href: "/spots", label: "さがす", Icon: Search },
  { href: "/map", label: "マップ", Icon: MapIcon },
  { href: "/recommend", label: "今日どこ？", Icon: Sparkles },
];

export function Header() {
  const pathname = usePathname();
  const favCount = useFavorites((s) => s.ids.length);
  const hydrated = useFavorites((s) => s.hydrated);

  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-border/60">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 font-black shrink-0 tracking-tight">
          <img
            src="/icon-192.svg"
            alt=""
            aria-hidden
            width={32}
            height={32}
            className="w-8 h-8 shadow-soft rounded-xl"
          />
          <span className="text-charcoal text-sm sm:text-base">うちなー子連れマップ</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {PRIMARY_NAV.map(({ href, label, Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-colors",
                  active
                    ? "bg-charcoal text-white shadow-soft"
                    : "text-charcoal/75 hover:bg-charcoal/5 hover:text-charcoal",
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/favorites"
          aria-label={`お気に入り${hydrated && favCount > 0 ? `（${favCount}件）` : ""}`}
          className={cn(
            "relative grid place-items-center w-10 h-10 rounded-full border border-border shrink-0 transition-all shadow-soft",
            pathname.startsWith("/favorites")
              ? "bg-hibiscus text-white border-hibiscus"
              : "bg-card text-charcoal hover:bg-sand-light",
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4",
              hydrated &&
                favCount > 0 &&
                !pathname.startsWith("/favorites") &&
                "fill-hibiscus text-hibiscus",
            )}
          />
          {hydrated && favCount > 0 && (
            <span className="absolute -top-1 -right-1 grid place-items-center min-w-[18px] h-[18px] px-1 rounded-full bg-hibiscus text-white text-[10px] font-black border-2 border-background">
              {favCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="メインナビゲーション"
      className="md:hidden fixed bottom-3 inset-x-3 z-30 safe-bottom"
    >
      <ul className="grid grid-cols-4 gap-1 p-1.5 rounded-full glass-strong shadow-float border border-white/60">
        {PRIMARY_NAV.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 rounded-full text-[11px] font-bold transition-all",
                  active
                    ? "bg-charcoal text-white shadow-soft"
                    : "text-charcoal/75 hover:bg-charcoal/5",
                )}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
