import Link from "next/link";
import Image from "next/image";

interface CityCardProps {
  name: string;
  state: string;
  slug: string;
  imageUrl?: string | null;
  availableCount: number;
}

export default function CityCard({
  name,
  slug,
  imageUrl,
  availableCount,
}: CityCardProps) {
  return (
    <Link href={`/cities/${slug}`} className="group block">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
        {/* Image */}
        <div className="relative h-48 bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <svg
                width="64"
                height="64"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-30"
              >
                <path d="M16 3L3 14h4v15h8v-9h2v9h8V14h4L16 3z" fill="#374151" />
              </svg>
            </div>
          )}
          {/* Available badge */}
          <div
            className={`absolute top-3 right-3 text-white text-xs font-semibold px-3 py-1 rounded-full ${
              availableCount > 0 ? "bg-blue-900" : "bg-gray-500"
            }`}
          >
            {availableCount > 0
              ? `${availableCount} ${availableCount === 1 ? "unit" : "units"} available`
              : "No units available"}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-900 transition-colors leading-snug">
            {name}
          </h2>
          <div className="mt-4 flex items-center text-blue-900 text-sm font-medium">
            <span>View listings</span>
            <svg
              className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
