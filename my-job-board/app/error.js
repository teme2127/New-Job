"use client";
import Link from "next/link";
import Icon from "@/components/Icon";
export default function ErrorPage({ reset }) {
  return <section className="container-wide py-24"><div className="empty-state"><Icon name="globe" size={36} /><h1 className="text-3xl font-medium mb-4">A little pause in the journey.</h1><p>We couldn’t load this page. Give it another try, or head back to the homepage.</p><div className="flex flex-wrap justify-center gap-3"><button onClick={reset} className="button button-dark">Try again <Icon size={17} /></button><Link href="/" className="button button-outline">Back to home</Link></div></div></section>;
}
