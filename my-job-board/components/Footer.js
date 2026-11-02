import Link from "next/link";
import Brand from "./Brand";
import Icon from "./Icon";
export default function Footer() {
  return <footer className="site-footer"><div className="container-wide footer-grid"><div><Brand light /><p>Your next chapter starts here.<br />Connecting people and possibilities in Ethiopia.</p><a className="footer-community" href="https://t.me/NewWorkInEthiopia_VacancyGroup" target="_blank" rel="noopener noreferrer">Join our Telegram community <Icon size={16} /></a></div><div><h2>For job seekers</h2><Link href="/jobs">Explore vacancies</Link><Link href="/jobs?category=NGO">NGO opportunities</Link><Link href="/dashboard">My applications</Link></div><div><h2>For employers</h2><Link href="/post-a-job">Post a vacancy</Link><Link href="/signup">Create an account</Link><Link href="/login">Employer sign in</Link></div></div><div className="container-wide footer-bottom"><span>© {new Date().getFullYear()} EthioWork. All rights reserved.</span><span>Made for your next move <span aria-hidden="true">↗</span></span></div></footer>;
}
