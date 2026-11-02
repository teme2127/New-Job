"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Brand from "./Brand";
import Icon from "./Icon";
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    fetch("/api/auth/me").then(r => r.ok ? r.json() : { user: null }).then(data => { if (active) setUser(data.user); }).catch(() => {});
    return () => { active = false; };
  }, [pathname]);
  async function logout() {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error();
      setUser(null); setOpen(false); router.push("/"); router.refresh();
    } catch { setError("Could not sign out. Please try again."); }
  }
  const links = [{ href: "/jobs", label: "Find a job" }, { href: "/jobs?category=NGO", label: "NGO opportunities" }, { href: "/post-a-job", label: "For employers" }];
  return <header className="site-header">
    <a href="#main-content" className="skip-link">Skip to content</a>
    <nav className="site-nav container-wide" aria-label="Main navigation">
      <Brand />
      <div className="desktop-links">{links.map(link => <Link key={link.href} href={link.href} className={pathname === link.href ? "nav-active" : ""} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link>)}</div>
      <div className="desktop-actions">{user ? <><Link href="/dashboard" className="nav-account"><span className="avatar">{user.name?.charAt(0)}</span>My dashboard</Link><button className="nav-signout" onClick={logout}>Sign out</button></> : <><Link href="/login" className="nav-login">Sign in</Link><Link href="/signup" className="button button-dark">Get started <Icon size={16} /></Link></>}</div>
      <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation"><Icon name={open ? "close" : "menu"} /></button>
    </nav>
    {open && <div id="mobile-navigation" className="mobile-navigation">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}{user ? <><Link href="/dashboard" onClick={() => setOpen(false)}>My dashboard</Link><button onClick={logout}>Sign out</button></> : <><Link href="/login" onClick={() => setOpen(false)}>Sign in</Link><Link href="/signup" onClick={() => setOpen(false)}>Create an account</Link></>}</div>}
    {error && <p role="alert" className="notice notice-error">{error}</p>}
  </header>;
}
