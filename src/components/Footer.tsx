import Link from "next/link";
import { Wrench } from "lucide-react";

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

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-xl bg-blue-600 p-2 text-white">
              <Wrench size={25} />
            </div>

            <span className="text-2xl font-bold text-white">
              Fix<span className="text-blue-600">Mate</span>
            </span>
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
            Your trusted partner for reliable home appliance and device repair
            services. Find skilled technicians and get things fixed with ease.
          </p>

          <div className="mt-6 flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white transition hover:bg-blue-600"
            >
              f
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white transition hover:bg-pink-600"
            >
              ◎
            </a>

            <a
              href="#"
              aria-label="X"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white transition hover:bg-black"
            >
              𝕏
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">
            Quick Links
          </h3>

          <ul className="space-y-3">
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
          <h3 className="mb-5 text-lg font-semibold text-white">
            Popular Categories
          </h3>

          <ul className="space-y-3">
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
          <h3 className="mb-5 text-lg font-semibold text-white">
            Contact Us
          </h3>

          <ul className="space-y-4 text-sm text-slate-400">
            <li>
              <span className="mb-1 block font-medium text-white">Email</span>
              your-email@example.com
            </li>

            <li>
              <span className="mb-1 block font-medium text-white">Phone</span>
              +880 1XXXXXXXXX
            </li>

            <li>
              <span className="mb-1 block font-medium text-white">Address</span>
              Your business address
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-center text-sm text-slate-500 sm:flex-row sm:text-left">
          <p>© 2026 FixMate. All rights reserved.</p>
          <p>Making repairs easier, one service at a time.</p>
        </div>
      </div>
    </footer>
  );
}