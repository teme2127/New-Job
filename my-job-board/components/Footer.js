// components/Footer.js
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-white py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/telegram_vacancy_logo.png"
                alt="EthioWork Logo"
                className="h-9 w-9 rounded-xl object-cover border border-primary/20 shadow-sm"
              />
              <span className="font-extrabold text-lg tracking-tight text-primary">
                EthioWork
              </span>
            </Link>
            <p className="text-xs text-muted leading-relaxed">
              Ethiopia&apos;s modern job directory connecting top talent with NGOs, banking institutions, government agencies, and trading enterprises.
            </p>
          </div>

          {/* Column 1: For Job Seekers */}
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Candidates</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs" className="text-xs text-muted hover:text-primary transition-colors">
                  Browse All Vacancies
                </Link>
              </li>
              <li>
                <Link href="/jobs?category=NGO" className="text-xs text-muted hover:text-primary transition-colors">
                  NGO Vacancies
                </Link>
              </li>
              <li>
                <Link href="/jobs?category=Healthcare" className="text-xs text-muted hover:text-primary transition-colors">
                  Healthcare Vacancies
                </Link>
              </li>
              <li>
                <a
                  href="https://t.me/NewWorkInEthiopia_VacancyGroup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted hover:text-primary transition-colors"
                >
                  Telegram Vacancy channel
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: For Employers */}
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Employers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/post-a-job" className="text-xs text-muted hover:text-primary transition-colors">
                  Post a Job Opening
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-xs text-muted hover:text-primary transition-colors">
                  Employer Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-xs text-muted hover:text-primary transition-colors">
                  Employer Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact/Legal */}
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">EthioWork</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-xs text-muted hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs text-muted hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs text-muted hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-muted-foreground">
            &copy; {new Date().getFullYear()} EthioWork. Inspired by Ethiojobs.net. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="https://t.me/NewWorkInEthiopia_VacancyGroup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors"
            >
              <span className="sr-only">Telegram</span>
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
