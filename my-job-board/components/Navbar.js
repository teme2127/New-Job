// components/Navbar.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Error fetching user session:", err);
      }
    }
    checkUser();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setUser(null);
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Jobs Directory", href: "/jobs" },
    { name: "NGO Jobs", href: "/jobs?category=NGO" },
    { name: "Post a Vacancy", href: "/post-a-job" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/80 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="ethiopian-tricolour"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/telegram_vacancy_logo.png"
                alt="EthioWork Logo"
                className="h-10 w-10 rounded-xl object-cover border border-primary/20 shadow-sm"
              />
              <span className="font-extrabold text-xl tracking-tight text-primary">
                EthioWork
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex gap-6 mr-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-secondary ${
                      isActive ? "text-primary font-bold" : "text-muted"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Telegram Channel Promotion */}
            <a
              href="https://t.me/NewWorkInEthiopia_VacancyGroup"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent border border-accent/20 px-3 py-1.5 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors mr-2"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.36-.49.99-.74 3.88-1.69 6.47-2.8 7.77-3.32 3.7-1.47 4.46-1.73 4.96-1.74.11 0 .36.03.52.16.14.11.18.26.2.42-.01.06-.01.12-.02.19z" />
              </svg>
              Telegram channel
            </a>

            {/* Session Actions */}
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 border-l border-border pl-4">
                  <span className="text-xs text-muted max-w-[100px] truncate">
                    Hello, <span className="font-semibold text-foreground">{user.name}</span>
                  </span>
                  <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded capitalize">
                    {user.role}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-semibold text-red-600 hover:text-red-500 hover:underline cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
                {user.role === "employer" && (
                  <Link
                    href="/post-a-job"
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-secondary transition-all"
                  >
                    Post a Job
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 border-l border-border pl-4">
                {pathname === '/login' ? (
                  <Link href="/login" className="text-primary font-bold">Login</Link>
                ) : (
                  <Link href="/login" className="text-xs font-bold text-muted hover:text-primary transition-colors">Login</Link>
                )}
                {pathname === '/signup' ? (
                  <Link href="/signup" className="text-primary font-bold">Sign Up</Link>
                ) : (
                  <Link href="/signup" className="inline-flex items-center justify-center rounded-lg bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-secondary transition-all">Sign Up</Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-muted hover:bg-slate-50 focus:outline-none"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-white px-4 pt-2 pb-4 shadow-lg flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-50 ${
                  isActive ? "bg-slate-50 text-primary" : "text-muted"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <a
            href="https://t.me/NewWorkInEthiopia_VacancyGroup"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-accent hover:bg-slate-50"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.36-.49.99-.74 3.88-1.69 6.47-2.8 7.77-3.32 3.7-1.47 4.46-1.73 4.96-1.74.11 0 .36.03.52.16.14.11.18.26.2.42-.01.06-.01.12-.02.19z" />
            </svg>
            Telegram Group
          </a>

          <div className="pt-2 border-t border-border mt-2 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-slate-50"
                >
                  Dashboard
                </Link>
                {user.role === "employer" && (
                  <Link
                    href="/post-a-job"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm"
                  >
                    Post a Job
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
