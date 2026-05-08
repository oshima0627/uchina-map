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
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 font-bold shrink-0">
          <span className="text-2xl" aria-hidden>🏝️</span>
          <span className="text-charcoal hidden sm:inline">うちなー子連れマップ</span>
          <span className="text-charcoal sm:hidden text-sm">うちな子マップ</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {PRIMARY_NAV.map(({ href, label, Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors",
                  active
                    ? "bg-primary-100 text-primary-800"
                    : "text-charcoal/75 hover:bg-sand-light hover:text-charcoal",
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
            "relative grid place-items-center w-10 h-10 rounded-full border border-border shrink-0 transition-colors",
            pathname.startsWith("/favorites")
              ? "bg-hibiscus/10 border-hibiscus/40 text-hibiscus"
              : "bg-white text-charcoal hover:bg-sand-light",
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4",
              hydrated && favCount > 0 && "fill-hibiscus text-hibiscus",
            )}
          />
          {hydrated && favCount > 0 && (
            <span className="absolute -top-1 -right-1 grid place-items-center min-w-5 h-5 px-1 rounded-full bg-hibiscus text-white text-[10px] font-bold border-2 border-background">
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
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur-md border-t border-border safe-bottom">
      <ul className="grid grid-cols-4">
        {PRIMARY_NAV.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium",
                  active ? "text-primary-700" : "text-charcoal/75",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    active && "fill-primary-100 stroke-primary-700",
                  )}
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
