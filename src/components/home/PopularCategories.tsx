import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Snowflake,
  Refrigerator,
  Tv,
  WashingMachine,
  Zap,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    name: "Smartphone",
    description: "Mobile phone repair and troubleshooting.",
    icon: Smartphone,
  },
  {
    name: "Laptop & PC",
    description: "Computer repair, upgrades, and maintenance.",
    icon: Laptop,
  },
  {
    name: "AC",
    description: "Air conditioner repair and servicing.",
    icon: Snowflake,
  },
  {
    name: "Refrigerator",
    description: "Fridge repair and cooling solutions.",
    icon: Refrigerator,
  },
  {
    name: "TV",
    description: "Television repair and technical support.",
    icon: Tv,
  },
  {
    name: "Washing Machine",
    description: "Washing machine repair and maintenance.",
    icon: WashingMachine,
  },
  {
    name: "Electrical",
    description: "Electrical repair and installation services.",
    icon: Zap,
  },
];

export default function PopularCategories() {
  return (
    <section className="bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <span className="font-semibold uppercase tracking-wider text-blue-600">
            What Do You Need Fixed?
          </span>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Explore Popular Categories
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Find the right repair service for your devices and home appliances
            from our available service categories.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={`/services?category=${encodeURIComponent(category.name)}`}
                className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={28} strokeWidth={1.8} />
                  </div>

                  <ArrowUpRight
                    size={22}
                    className="text-slate-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-600"
                  />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {category.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
