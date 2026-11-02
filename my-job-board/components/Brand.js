import Link from "next/link";
import Icon from "./Icon";
export default function Brand({ light = false }) {
  return <Link href="/" className={`brand ${light ? "brand-light" : ""}`} aria-label="EthioWork home"><span className="brand-mark"><Icon name="bag" size={22} /></span><span>Ethio<span className="brand-word">Work</span><span className="brand-dot">.</span></span></Link>;
}
