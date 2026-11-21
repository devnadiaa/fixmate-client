import Link from "next/link";
import { Wrench, Mail, Phone, MapPin } from "lucide-react";

const categories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
];

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5h1.7V3.1c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.6v2h-2.9v3.2h2.9V21z" />
      </svg>
    ),
    hover: "hover:bg-blue-600",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="18" cy="6" r="1" fill="currentColor" />
      </svg>
    ),
    hover: "hover:bg-pink-600",
  },
  {
    name: "X",
    href: "https://x.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.901 1.153h3.68L14.54 11.06 24 23.847h-7.406l-5.8-7.584-6.64 7.584H.47l8.59-9.82L0 1.153h7.594l5.243 6.932zm-1.29 20.44h2.039L6.427 3.29H4.239z" />
      </svg>
    ),
    hover: "hover:bg-black",
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2.5 text-white shadow-lg shadow-blue-600/20">
              <Wrench size={24} />
            </div>

            <span className="text-2xl font-bold tracking-tight text-white">
              Fix<span className="text-blue-500">Mate</span>
            </span>
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
            Your trusted partner for reliable home appliance and device repair
            services. Find skilled technicians and get things fixed with ease.
          </p>

          <div className="mt-6 flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit FixMate on ${social.name}`}
                title={social.name}
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white transition-all duration-300 hover:-translate-y-1 ${social.hover}`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-base font-semibold text-white">
            Quick Links
          </h3>

          <ul className="space-y-4">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-sm text-slate-400 transition hover:text-blue-400"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-base font-semibold text-white">
            Popular Categories
          </h3>

          <ul className="space-y-4">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/services?category=${encodeURIComponent(category)}`}
                  className="text-sm text-slate-400 transition hover:text-blue-400"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-base font-semibold text-white">
            Contact Us
          </h3>

          <ul className="space-y-5 text-sm text-slate-400">
            <li className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-blue-500" />
              <div>
                <span className="mb-1 block font-medium text-white">
                  Email
                </span>
                <span>Contact information coming soon</span>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <Phone size={18} className="mt-0.5 shrink-0 text-blue-500" />
              <div>
                <span className="mb-1 block font-medium text-white">
                  Phone
                </span>
                <span>Contact information coming soon</span>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-blue-500" />
              <div>
                <span className="mb-1 block font-medium text-white">
                  Address
                </span>
                <span>Service available online</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-slate-500">
            © 2026 FixMate. All rights reserved.
          </p>

          <p className="text-sm text-slate-500">
            Making repairs easier, one service at a time.
          </p>
        </div>
      </div>
    </footer>
  );
}