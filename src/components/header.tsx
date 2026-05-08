"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Map as MapIcon, Sparkles, Home, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "ホーム", Icon: Home },
  { href: "/spots", label: "さがす", Icon: Search },
  { href: "/map", label: "マップ", Icon: MapIcon },
  { href: "/recommend", label: "今日どこ？", Icon: Sparkles },
  { href: "/favorites", label: "お気に入り", Icon: Heart },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="text-2xl" aria-hidden>🏝️</span>
          <span className="text-charcoal">うちなー子連れマップ</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ href, label, Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors",
                  active
                    ? "bg-primary-100 text-primary-800"
                    : "text-charcoal/70 hover:bg-sand-light hover:text-charcoal",
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur-md border-t border-border safe-bottom">
      <ul className="grid grid-cols-5">
        {NAV.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium",
                  active ? "text-primary-700" : "text-charcoal/60",
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
