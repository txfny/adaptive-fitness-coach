"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingUp, Settings } from "lucide-react";

const tabs = [
  { href: "/", label: "Today", icon: Home },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-cream-50/90 backdrop-blur-xl border-t border-cream-300/60 px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center h-14 max-w-lg mx-auto">
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 px-5 py-2 rounded-2xl transition-all duration-200 ${
                  active
                    ? "text-sage-dark"
                    : "text-cream-500 hover:text-cream-700"
                }`}
              >
                <Icon size={19} strokeWidth={active ? 2.5 : 1.5} />
                <span className="text-[10px] font-medium tracking-wide">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop sidebar nav */}
      <nav className="hidden lg:flex fixed left-0 top-0 bottom-0 w-16 flex-col items-center py-8 gap-6 bg-cream-50/80 backdrop-blur-xl border-r border-cream-300/40">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl transition-all duration-200 ${
                active
                  ? "text-sage-dark bg-sage/8"
                  : "text-cream-500 hover:text-cream-700 hover:bg-cream-200/50"
              }`}
              title={label}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[9px] font-medium tracking-wide">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
