import { pageMetadata } from "@/lib/site";

// The application page is a client component, so its metadata lives here.
export const metadata = pageMetadata({
  title: "Apply for a Rental — Blue Blaze Estates",
  description:
    "Apply online for a rental at Blue Blaze Estates in Herrin, Illinois. Free to submit; housing vouchers and rental assistance are welcome.",
  path: "/apply",
});

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
