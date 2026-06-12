// app/page.js
import Link from "next/link";
import JobCard from "@/components/JobCard";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import { seedJobs } from "@/lib/seed";
import { getJobs } from "@/lib/jobsData";

export default async function Home() {
  let featuredJobs = [];
  
  try {
    await dbConnect();
    await seedJobs();
    const dbJobs = await Job.find({}).sort({ postedAt: -1 }).limit(3);
    featuredJobs = JSON.parse(JSON.stringify(dbJobs));
  } catch (error) {
    console.warn("MongoDB connection failed on Home, falling back to mock data:", error.message);
    featuredJobs = getJobs().slice(0, 3).map(j => ({ ...j, _id: j.id }));
  }

  const categories = [
    { name: "NGO", icon: "🌍", count: "45+ open roles", bg: "bg-emerald-50 text-emerald-800" },
    { name: "Banking", icon: "🏦", count: "30+ open roles", bg: "bg-blue-50 text-blue-800" },
    { name: "Healthcare", icon: "🩺", count: "15+ open roles", bg: "bg-rose-50 text-rose-800" },
    { name: "Agriculture", icon: "🌾", count: "20+ open roles", bg: "bg-amber-50 text-amber-800" },
  ];

  const popularTags = ["NGO", "Finance", "Healthcare", "Agriculture", "Logistics", "Consulting"];

  const featuredCompanies = [
    { name: "United Nations ECA", tag: "NGO & Development", logo: "🇺🇳" },
    { name: "Norwegian Refugee Council", tag: "Humanitarian Assistance", logo: "🏢" },
    { name: "Plan International", tag: "Child Rights NGO", logo: "🌍" },
    { name: "Kerchanshe Trading", tag: "Coffee & Logistics", logo: "☕" },
    { name: "BDA Agricultural Dev", tag: "Agriculture PLC", logo: "🌾" }
  ];

  return (
    <div className="relative isolate overflow-hidden hero-gradient">
      {/* Hero section */}
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-16 sm:pt-16 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Search & Intro */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold leading-6 text-primary mb-4 w-fit">
              🇪🇹 Ethiojobs Inspired Modern Platform
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl leading-tight">
              Find Your Next Job in{" "}
              <span className="text-primary bg-primary/5 px-2 rounded">
                Ethiopia
              </span>
            </h1>
            
            <p className="mt-4 text-sm text-muted leading-relaxed max-w-xl">
              EthioWork is Ethiopia&apos;s premier career marketplace. Browse recent vacancies in international NGOs, banks, trading sectors, and agricultural firms.
            </p>

            {/* Ethiojobs Style Double Search Box */}
            <div className="mt-6 w-full max-w-xl">
              <form action="/jobs" method="GET" className="glass-card p-2 rounded-xl flex flex-col sm:flex-row items-center gap-2 shadow-md">
                <div className="relative w-full flex-grow flex items-center">
                  <svg className="absolute left-3 h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
                  </svg>
                  <input
                    type="text"
                    name="q"
                    placeholder="Job Title, Category, or Company..."
                    className="w-full bg-transparent pl-9 pr-3 py-2.5 text-xs text-foreground placeholder-muted border-0 focus:ring-0 focus:outline-none"
                  />
                </div>
                
                <div className="hidden sm:block h-6 w-px bg-border"></div>

                <div className="relative w-full sm:w-40 flex items-center">
                  <svg className="absolute left-3 h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <input
                    type="text"
                    name="location"
                    placeholder="Location..."
                    className="w-full bg-transparent pl-9 pr-3 py-2.5 text-xs text-foreground placeholder-muted border-0 focus:ring-0 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-secondary transition-all cursor-pointer"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Popular tags cloud */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-muted font-semibold mr-1">Popular:</span>
              {popularTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/jobs?category=${tag}`}
                  className="bg-white/70 hover:bg-white text-muted-foreground px-2 py-0.5 rounded border border-border transition-colors font-medium text-[11px]"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: Graphic Representation */}
          <div className="lg:col-span-5 hidden lg:flex justify-center">
            <div className="relative w-72 h-72 rounded-2xl bg-white border border-border p-6 shadow-md flex flex-col justify-between">
              <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm shadow">
                ★
              </div>
              <div>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
                  Verified Recruitment
                </span>
                <h3 className="font-extrabold text-lg text-foreground mt-2">
                  Find NGO and Corporate Roles Instantly
                </h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Join candidates applying to verified organizations across Addis Ababa, Hawassa, and regional hubs.
                </p>
              </div>
              <div className="border-t border-border pt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px]">🏢</div>
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px]">🩺</div>
                  <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">🌍</div>
                </div>
                <Link href="/jobs" className="text-xs text-primary font-bold hover:underline">
                  Browse Active ➔
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Partner Companies Band */}
      <div className="w-full bg-primary py-8 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-[10px] font-bold tracking-wider uppercase text-center text-emerald-250 mb-4">
            Vacancy Providers & Partners
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
            {featuredCompanies.map((c, i) => (
              <div key={i} className="flex flex-col items-center p-3 bg-white/5 rounded-lg border border-white/10 text-center">
                <span className="text-lg mb-1">{c.logo}</span>
                <span className="text-xs font-bold truncate w-full">{c.name}</span>
                <span className="text-[9px] text-emerald-200 truncate w-full">{c.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 bg-white border-b border-border">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Explore by popular sector categories
          </h2>
          <p className="mt-2 text-xs text-muted">
            Find the right vacancy matching your educational track and career level.
          </p>
        </div>
        <div className="mx-auto mt-6 grid max-w-4xl grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={`/jobs?category=${cat.name}`}
              className="group flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-slate-50/50 text-center transition-all duration-300 hover:bg-white hover:border-primary/20 hover:shadow"
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-xl mb-2.5 group-hover:scale-105 transition-transform ${cat.bg}`}>
                {cat.icon}
              </span>
              <h3 className="font-bold text-foreground text-xs group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
              <p className="mt-0.5 text-[10px] text-muted">{cat.count}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Branded Telegram Channel Promotion Banner */}
      <div className="mx-auto max-w-7xl px-6 pt-12 lg:px-8">
        <div className="relative rounded-2xl bg-gradient-to-r from-secondary to-accent px-6 py-6 shadow-md sm:px-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-36 w-36 rounded-full bg-white opacity-10 blur-xl"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <img
              src="/telegram_vacancy_logo.png"
              alt="Telegram Vacancies Channel Logo"
              className="h-14 w-14 rounded-2xl object-cover shadow-md border-2 border-white/20 bg-white"
            />
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Join our Telegram Vacancy Group!
              </h3>
              <p className="mt-1 text-xs text-white/90 max-w-lg">
                Stay updated daily on Ethiopian vacancies. Follow **@NewWorkInEthiopia_VacancyGroup** for instant updates on your mobile device.
              </p>
            </div>
          </div>
          
          <a
            href="https://t.me/NewWorkInEthiopia_VacancyGroup"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex justify-center items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-accent shadow-sm hover:bg-slate-50 transition-all active:scale-95 whitespace-nowrap relative z-10"
          >
            <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.36-.49.99-.74 3.88-1.69 6.47-2.8 7.77-3.32 3.7-1.47 4.46-1.73 4.96-1.74.11 0 .36.03.52.16.14.11.18.26.2.42-.01.06-.01.12-.02.19z"/>
            </svg>
            Join Telegram
          </a>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Featured Job Openings
            </h2>
            <p className="mt-1 text-muted text-xs">
              Explore recently updated career vacancies from verify partners in Ethiopia.
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-secondary transition-colors group"
          >
            Browse All Jobs
            <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </div>

      {/* Recruiters CTA */}
      <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-foreground px-6 py-8 shadow-lg sm:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-primary opacity-20 blur-2xl"></div>
          
          <div className="max-w-xl text-center md:text-left relative z-10">
            <h2 className="text-xl font-bold tracking-tight text-white">
              Are you recruiting top Ethiopian professionals?
            </h2>
            <p className="mt-2 text-xs text-slate-350 leading-relaxed">
              Post your job vacancy on EthioWork and reach thousands of daily job hunters, NGO finance officers, healthcare providers, and traders.
            </p>
          </div>
          <div className="relative z-10 flex flex-shrink-0 flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/post-a-job"
              className="inline-flex justify-center items-center rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-foreground hover:bg-slate-100 transition-all active:scale-95"
            >
              Post a Vacancy
            </Link>
            <Link
              href="/jobs"
              className="inline-flex justify-center items-center rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition-all active:scale-95"
            >
              Find Vacancies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
