// components/Footer.js
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#081810] text-slate-350 border-t border-emerald-950 py-12 mt-auto relative overflow-hidden">
      {/* Flag gold line top highlight */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-accent to-accent-red"></div>
      
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/telegram_vacancy_logo.png"
                alt="EthioWork Logo"
                className="h-10 w-10 rounded-xl object-cover border border-white/10 shadow-sm"
              />
              <span className="font-extrabold text-lg tracking-tight text-white">
                EthioWork
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Ethiopia&apos;s modern job directory connecting top talent with NGOs, banking institutions, healthcare facilities, and trading enterprises. Inspired by Ethiojobs.net.
            </p>
          </div>

          {/* Column 1: For Job Seekers */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Candidates</h3>
            <ul className="space-y-2.5 text-xs font-normal">
              <li>
                <Link href="/jobs" className="text-slate-400 hover:text-accent transition-colors">
                  Browse All Vacancies
                </Link>
              </li>
              <li>
                <Link href="/jobs?category=NGO" className="text-slate-400 hover:text-accent transition-colors">
                  NGO Opportunities 🌍
                </Link>
              </li>
              <li>
                <Link href="/jobs?category=Healthcare" className="text-slate-400 hover:text-accent transition-colors">
                  Healthcare Vacancies
                </Link>
              </li>
              <li>
                <a
                  href="https://t.me/NewWorkInEthiopia_VacancyGroup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-accent transition-colors flex items-center gap-1"
                >
                  Telegram Channel
                  <span className="text-[9px] bg-accent/20 text-accent px-1 py-0.2 rounded font-bold uppercase">LIVE</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: For Employers */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Employers</h3>
            <ul className="space-y-2.5 text-xs font-normal">
              <li>
                <Link href="/post-a-job" className="text-slate-400 hover:text-accent transition-colors">
                  Post a Job Opening
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-400 hover:text-accent transition-colors">
                  Employer Log In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-slate-400 hover:text-accent transition-colors">
                  Employer Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Legal */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">EthioWork</h3>
            <ul className="space-y-2.5 text-xs font-normal">
              <li>
                <Link href="#" className="text-slate-400 hover:text-accent transition-colors">
                  About Our Platform
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-emerald-950/60 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-normal text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} EthioWork. All rights reserved. Designed to look like Ethiojobs.
          </p>
          <div className="flex gap-4">
            <a
              href="https://t.me/NewWorkInEthiopia_VacancyGroup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-450 hover:text-accent transition-colors"
              aria-label="Telegram"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.36-.49.99-.74 3.88-1.69 6.47-2.8 7.77-3.32 3.7-1.47 4.46-1.73 4.96-1.74.11 0 .36.03.52.16.14.11.18.26.2.42-.01.06-.01.12-.02.19z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
