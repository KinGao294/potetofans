"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { NAV_LINKS, PERSON_INFO, SITE_INFO } from "@/data/site-data";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/10 bg-cream-100/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 focus:outline-none"
          onClick={() => setMobileOpen(false)}
        >
          <span className="font-serif text-xl font-bold tracking-tight text-ink-900">
            {SITE_INFO.name}
          </span>
          <span className="rounded-full border border-amberpoteto-600/35 bg-amberpoteto-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amberpoteto-600">
            非官方
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          aria-label="主导航"
          className="hidden items-center gap-1 lg:flex"
        >
          {NAV_LINKS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-stage-900 font-medium text-cream-50"
                    : "text-ink-700 hover:bg-cream-200/80 hover:text-ink-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA + Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          <a
            href={PERSON_INFO.xUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-stage-900 px-3.5 py-1.5 text-xs font-medium text-cream-50 transition hover:bg-amberpoteto-600 sm:px-4 sm:py-2 sm:text-sm"
          >
            <span>关注 @{PERSON_INFO.xUsername}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          <button
            type="button"
            aria-label={mobileOpen ? "关闭导航菜单" : "打开导航菜单"}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/15 text-ink-900 transition hover:bg-cream-200 lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="border-t border-ink-900/10 bg-cream-50 px-4 py-4 lg:hidden">
          <nav aria-label="移动端主导航" className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-stage-900 text-cream-50"
                      : "border border-ink-900/10 bg-cream-100 text-ink-900 hover:bg-cream-200"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <p className="mt-3 text-xs text-ink-500">
            Unofficial Fan Site · 非官方粉丝应援站，与 @{PERSON_INFO.xUsername}{" "}
            本人及其关联机构无官方隶属关系。
          </p>
        </div>
      )}
    </header>
  );
}
