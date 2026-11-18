import {
  ShieldCheck,
  BadgeCheck,
  Clock,
  Headset,
  ThumbsUp,
  CreditCard,
} from "lucide-react";

const features = [
  {
    title: "Verified Technicians",
    description:
      "Find skilled technicians whose services are reviewed and approved by our admin team.",
    icon: ShieldCheck,
  },
  {
    title: "Quality Service",
    description:
      "Explore detailed service information and choose the repair solution that suits your needs.",
    icon: BadgeCheck,
  },
  {
    title: "Easy Booking",
    description:
      "Submit repair requests easily and manage your bookings from your personal dashboard.",
    icon: Clock,
  },
  {
    title: "Reliable Support",
    description:
      "Stay informed about your repair requests through clear booking status updates.",
    icon: Headset,
  },
  {
    title: "Customer Friendly",
    description:
      "Enjoy a simple platform designed to make finding repair services easier.",
    icon: ThumbsUp,
  },
  {
    title: "Secure Payments",
    description:
      "Complete your payments securely after your repair service has been completed.",
    icon: CreditCard,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="font-semibold uppercase tracking-wider text-blue-600">
            Why FixMate
          </span>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Repair Services You Can Trust
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            We make the repair experience simple, transparent, and convenient
            by connecting customers with trusted technicians.
          </p>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon size={28} strokeWidth={1.8} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}