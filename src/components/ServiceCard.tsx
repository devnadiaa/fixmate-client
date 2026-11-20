import Link from "next/link";
import { ArrowRight, MapPin, Wrench, Star } from "lucide-react";

type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
  averageRating?: number;
};

type ServiceCardProps = {
  service: Service;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden bg-slate-100">
        {service.image ? (
          <img
            src={service.image}
            alt={service.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            No Image Available
          </div>
        )}

        <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
          {service.category}
        </span>

        {service.averageRating && service.averageRating > 0 ? (
          <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm">
            <Star size={15} className="fill-amber-400 text-amber-400" />
            {service.averageRating.toFixed(1)}
          </span>
        ) : null}
      </div>

      <div className="p-6">
        <h3 className="line-clamp-1 text-xl font-bold text-slate-900 transition group-hover:text-blue-600">
          {service.title}
        </h3>

        <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
          {service.description}
        </p>

        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="inline-flex items-center gap-2 text-slate-500">
              <Wrench size={16} className="text-blue-600" />
              Service Mode
            </span>

            <span className="font-medium text-slate-700">
              {service.serviceMode || "Not specified"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin size={16} className="shrink-0 text-blue-600" />
            <span className="line-clamp-1">
              {service.serviceArea || "Service Area Available"}
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Starting from
            </p>

            <p className="mt-1 text-xl font-bold text-blue-600">
              ${service.basePrice}
            </p>
          </div>

          <Link
            href={`/services/${service._id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Details
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}