import Link from "next/link";
import Icon from "@/components/Icon";
export default function NotFound() { return <section className="container-wide py-24 text-center"><p className="eyebrow justify-center">A SMALL DETOUR</p><h1 className="text-4xl font-medium mt-5 mb-4">This page has moved on.</h1><p className="text-muted mb-8">The opportunity may have closed, or this link may no longer exist.</p><Link href="/jobs" className="button button-dark">Explore opportunities <Icon size={18} /></Link></section>; }
