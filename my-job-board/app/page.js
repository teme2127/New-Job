// app/page.js
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import { seedJobs } from "@/lib/seed";
import { getJobs } from "@/lib/jobsData";
import HomeJobFeed from "@/components/HomeJobFeed";

export default async function Home() {
  let allJobs = [];
  
  try {
    await dbConnect();
    await seedJobs();
    const dbJobs = await Job.find({}).sort({ postedAt: -1 }).limit(20);
    allJobs = JSON.parse(JSON.stringify(dbJobs));
  } catch (error) {
    console.warn("MongoDB connection failed on Home, falling back to mock data:", error.message);
    allJobs = getJobs().map(j => ({ ...j, _id: j.id }));
  }

  const categories = [
    { name: "NGO", icon: "🌍", count: "45+ open roles", bg: "bg-emerald-50 text-emerald-800 border-emerald-100" },
    { name: "Banking", icon: "🏦", count: "30+ open roles", bg: "bg-blue-50 text-blue-800 border-blue-100" },
    { name: "Healthcare", icon: "🩺", count: "15+ open roles", bg: "bg-rose-50 text-rose-800 border-rose-100" },
    { name: "Agriculture", icon: "🌾", count: "20+ open roles", bg: "bg-amber-50 text-amber-800 border-amber-100" },
    { name: "Trading & Distribution", icon: "☕", count: "12+ open roles", bg: "bg-amber-50 text-amber-900 border-amber-200" },
    { name: "General", icon: "💼", count: "25+ open roles", bg: "bg-slate-50 text-slate-800 border-slate-200" }
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
    <div className="relative isolate overflow-hidden bg-slate-50/50">
      
      {/* Premium Hero section with Forest Green Pattern */}
      <div className="relative bg-gradient-to-br from-secondary via-[#0a2e1d] to-[#031d10] text-white py-16 px-6 sm:py-20 lg:px-8 shadow-inner overflow-hidden">
        {/* Abstract design elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-accent/10 blur-3xl"></div>
        
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left Column: Heading & Search form */}
            <div className="w-full lg:max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold leading-6 text-accent mb-4 border border-white/10">
                🇪🇹 Ethiojobs-Style Premium Career Directory
              </div>
              
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl leading-tight">
                Find Your Next Career in <span className="text-accent underline decoration-wavy decoration-1 underline-offset-4">Ethiopia</span>
              </h1>
              
              <p className="mt-4 text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
                Browse verified vacancies in international NGOs, banking networks, logistics PLCs, and regional health bureaus. Apply directly with ease.
              </p>

              {/* Ethiojobs Style 3-Field Search Container */}
              <div className="mt-8 w-full">
                <form action="/jobs" method="GET" className="bg-white p-2.5 rounded-2xl flex flex-col md:flex-row items-stretch gap-2 shadow-xl border border-white/10 text-slate-800">
                  
                  {/* Keyword */}
                  <div className="relative flex-grow flex items-center border-b md:border-b-0 md:border-r border-slate-100 py-1.5 md:py-0 px-2">
                    <svg className="h-4.5 w-4.5 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
                    </svg>
                    <input
                      type="text"
                      name="q"
                      placeholder="Job title, skills, or company..."
                      className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 border-0 focus:ring-0 focus:outline-none py-1.5"
                    />
                  </div>

                  {/* Sector Dropdown */}
                  <div className="relative flex-grow flex items-center border-b md:border-b-0 md:border-r border-slate-100 py-1.5 md:py-0 px-2">
                    <svg className="h-4.5 w-4.5 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-10.5h16.5M2.25 9h19.5M2.25 12h19.5m-18-6h16.5" />
                    </svg>
                    <select
                      name="category"
                      className="w-full bg-transparent text-xs text-slate-700 focus:ring-0 focus:outline-none py-1.5 border-0"
                    >
                      <option value="">All Sectors (Categories)</option>
                      <option value="NGO">NGO & Humanitarian</option>
                      <option value="Banking">Banking & Finance</option>
                      <option value="Healthcare">Healthcare & Medicine</option>
                      <option value="Agriculture">Agriculture & Farming</option>
                      <option value="Trading & Distribution">Trading & Logistics</option>
                      <option value="General">General / Other</option>
                    </select>
                  </div>

                  {/* Location Input */}
                  <div className="relative w-full md:w-44 flex items-center py-1.5 md:py-0 px-2">
                    <svg className="h-4.5 w-4.5 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <input
                      type="text"
                      name="location"
                      placeholder="Addis Ababa..."
                      className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 border-0 focus:ring-0 focus:outline-none py-1.5"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full md:w-auto inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white hover:bg-secondary transition-all cursor-pointer shadow-md shadow-primary/20 active:scale-95"
                  >
                    Search
                  </button>
                </form>
              </div>

              {/* Popular tags cloud */}
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-emerald-150 font-bold mr-1">Trending:</span>
                {popularTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/jobs?category=${tag}`}
                    className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg border border-white/10 transition-all font-semibold text-[10.5px]"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Column: Mini Graphic Summary Card */}
            <div className="w-full lg:max-w-md hidden lg:block">
              <div className="glass-card bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-white space-y-4">
                <h3 className="text-base font-extrabold text-accent">Career Portal Quick Facts</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between pb-2 border-b border-white/10">
                    <span>Verified Vacancies</span>
                    <span className="font-bold">120+ Active</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-white/10">
                    <span>Partner Organizations</span>
                    <span className="font-bold">45 Employers</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-white/10">
                    <span>NGO Sectors</span>
                    <span className="font-bold">Doloo Ado & Shire regional hubs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Review Time</span>
                    <span className="font-bold">48 Hours</span>
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-center">
                  <p className="text-[11px] text-emerald-150">Upload your CV to apply to all NGO & banking jobs instantly!</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Featured Partner Companies Band */}
      <div className="w-full bg-white py-8 border-b border-border/80">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-[10px] font-extrabold tracking-wider uppercase text-center text-muted mb-6">
            Featured Vacancy Providers
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
            {featuredCompanies.map((c, i) => (
              <div key={i} className="flex flex-col items-center p-3.5 bg-slate-50/50 rounded-xl border border-border/50 text-center transition-all hover:shadow-sm">
                <span className="text-2xl mb-1">{c.logo}</span>
                <span className="text-xs font-extrabold text-foreground truncate w-full">{c.name}</span>
                <span className="text-[9px] text-muted truncate w-full">{c.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Section: Tabbed Job Feed */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Job Feed List (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="mb-4">
              <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                Current Opportunities
              </h2>
              <p className="text-xs text-muted mt-1 font-normal">
                Filter verified roles in major sectors. Click "Quick Apply" to view description or submit details.
              </p>
            </div>
            
            {/* Client Tab Switcher & Feed List */}
            <HomeJobFeed initialJobs={allJobs} />
          </div>

          {/* Right Column: CTA Banners & Info (4 cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            
            {/* Telegram Channel Promotion */}
            <div className="relative rounded-2xl bg-gradient-to-r from-[#009A44] to-[#134931] p-5 text-white shadow overflow-hidden">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 h-28 w-28 rounded-full bg-white opacity-10 blur-xl"></div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-xl shadow">📢</div>
                <div>
                  <h4 className="font-extrabold text-xs">Telegram Channel</h4>
                  <p className="text-[10px] text-emerald-150">@NewWorkInEthiopia_VacancyGroup</p>
                </div>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed mb-4">
                Get notified immediately on your phone when new NGO and corporate vacancies are published in Addis Ababa!
              </p>
              <a
                href="https://t.me/NewWorkInEthiopia_VacancyGroup"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex justify-center items-center rounded-xl bg-accent hover:bg-accent/90 px-4 py-2.5 text-xs font-bold text-foreground transition-all active:scale-95 whitespace-nowrap"
              >
                Join Channel
              </a>
            </div>

            {/* Candidate CV Upload Banner */}
            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm space-y-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-bold text-xl">📄</span>
              <h3 className="font-extrabold text-sm text-foreground">Submit Your Resume</h3>
              <p className="text-xs text-muted leading-relaxed font-normal">
                Let recruiters find you. Upload your CV details today so matching NGOs and corporate firms can contact you directly.
              </p>
              <Link
                href="/login"
                className="w-full inline-flex justify-center items-center rounded-xl border border-border bg-slate-50 hover:bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 transition-all text-center"
              >
                Upload CV Details
              </Link>
            </div>

            {/* Recruiter / Post a Job Banner */}
            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm space-y-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xl">💼</span>
              <h3 className="font-extrabold text-sm text-foreground">Post a Vacancy</h3>
              <p className="text-xs text-muted leading-relaxed font-normal">
                Are you looking to hire top professionals in Ethiopia? Advertise your vacancy on EthioWork and receive qualified applications.
              </p>
              <Link
                href="/post-a-job"
                className="w-full inline-flex justify-center items-center rounded-xl bg-primary text-white hover:bg-secondary px-4 py-2.5 text-xs font-bold transition-all text-center shadow-md shadow-primary/10"
              >
                Post Job Opening
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Categories / Browse by Sector Grid */}
      <div className="bg-white border-t border-border/80 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-10">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Browse Vacancies by Sector
            </h2>
            <p className="mt-2 text-xs text-muted font-normal">
              Find open positions matching your area of study and industry interest.
            </p>
          </div>
          
          <div className="mx-auto grid max-w-4xl grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={`/jobs?category=${cat.name}`}
                className="group flex flex-col items-center justify-center p-5 rounded-2xl border border-border bg-slate-50/50 text-center transition-all duration-300 hover:bg-white hover:border-primary/20 hover:shadow"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold text-xl mb-3 group-hover:scale-105 transition-transform ${cat.bg} border`}>
                  {cat.icon}
                </span>
                <h3 className="font-extrabold text-foreground text-xs group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-0.5 text-[10px] text-muted">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
