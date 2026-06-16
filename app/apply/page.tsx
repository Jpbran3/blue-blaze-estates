"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface City {
  id: string;
  name: string;
  slug: string;
}

interface Listing {
  id: string;
  title: string;
  rentPrice: number;
  cityId: string;
}

const EMPTY_FORM = {
  applicantName: "",
  presentAddress: "",
  townStateZip: "",
  phone: "",
  ssn: "",
  driversLicense: "",
  birthDate: "",
  employer: "",
  employerAddress: "",
  employerTownStateZip: "",
  employerPhone: "",
  employmentDuration: "",
  monthlyWages: "",
  previousEmployer: "",
  spouseName: "",
  spouseDriversLicense: "",
  spouseBirthDate: "",
  spouseSsn: "",
  spouseEmployer: "",
  spouseEmployerAddress: "",
  spouseEmployerTownStateZip: "",
  spouseEmployerPhone: "",
  spouseEmploymentDuration: "",
  spouseMonthlyWages: "",
  spousePreviousEmployer: "",
  childrenResiding: "",
  adultsResiding: "",
  currentLandlord: "",
  currentLandlordPhone: "",
  currentTenancyDuration: "",
  currentRentAmount: "",
  previousLandlord: "",
  previousLandlordPhone: "",
  previousAddressRented: "",
  previousRentAmount: "",
  felonyHistory: "",
  interest: "",
  listingId: "",
  electronicSignature: "",
};

type FormKey = keyof typeof EMPTY_FORM;

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 mt-8">
      {children}
    </h2>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        <span className="mb-1 inline-block">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        <span className="block font-normal">{children}</span>
      </label>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

const inputCls = (hasError?: boolean) =>
  `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
    hasError ? "border-red-400 bg-red-50" : "border-gray-300"
  }`;

function ApplyForm() {
  const searchParams = useSearchParams();
  const cityParam = searchParams.get("city");

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState<Partial<Record<FormKey, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [spouseOpen, setSpouseOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedCitySlug, setSelectedCitySlug] = useState("");

  useEffect(() => {
    fetch("/api/cities")
      .then((r) => r.json())
      .then(setCities)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (cityParam) setSelectedCitySlug(cityParam);
  }, [cityParam]);

  useEffect(() => {
    if (!selectedCitySlug) { setListings([]); return; }
    fetch(`/api/listings?citySlug=${selectedCitySlug}&status=available`)
      .then((r) => r.json())
      .then(setListings)
      .catch(() => setListings([]));
  }, [selectedCitySlug]);

  function set(field: FormKey, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const errs: Partial<Record<FormKey, string>> = {};
    if (!form.applicantName.trim()) errs.applicantName = "Name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^[\d\s\-().+]{7,}$/.test(form.phone))
      errs.phone = "Enter a valid phone number";
    if (!form.electronicSignature.trim())
      errs.electronicSignature = "Signature is required";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, signatureDate: today }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Application Submitted!
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Thank you! We&apos;ve received your application and will be in touch
          within one business day.
        </p>
        <Link
          href="/"
          className="bg-blue-900 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200 inline-block"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-900 font-medium mb-6">
        There is no application fee. Complete all sections below and we&apos;ll
        be in touch within one business day.
      </div>

      {/* Applicant Information */}
      <SectionHeader>Applicant Information</SectionHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Field label="Name" required error={errors.applicantName}>
            <input
              type="text"
              value={form.applicantName}
              onChange={(e) => set("applicantName", e.target.value)}
              className={inputCls(!!errors.applicantName)}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Present Address">
            <input
              type="text"
              value={form.presentAddress}
              onChange={(e) => set("presentAddress", e.target.value)}
              className={inputCls()}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Town, State and Zip">
            <input
              type="text"
              value={form.townStateZip}
              onChange={(e) => set("townStateZip", e.target.value)}
              placeholder="Herrin, IL 62948"
              className={inputCls()}
            />
          </Field>
        </div>
        <Field label="Phone #" required error={errors.phone}>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="(618) 555-0000"
            className={inputCls(!!errors.phone)}
          />
        </Field>
        <Field label="Social Security #">
          <input
            type="text"
            value={form.ssn}
            onChange={(e) => set("ssn", e.target.value)}
            placeholder="XXX-XX-XXXX"
            className={inputCls()}
          />
        </Field>
        <Field label="Driver's License #">
          <input
            type="text"
            value={form.driversLicense}
            onChange={(e) => set("driversLicense", e.target.value)}
            className={inputCls()}
          />
        </Field>
        <Field label="Birth Date">
          <input
            type="date"
            value={form.birthDate}
            onChange={(e) => set("birthDate", e.target.value)}
            className={inputCls()}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Current Place of Employment">
            <input
              type="text"
              value={form.employer}
              onChange={(e) => set("employer", e.target.value)}
              className={inputCls()}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Employer Address">
            <input
              type="text"
              value={form.employerAddress}
              onChange={(e) => set("employerAddress", e.target.value)}
              className={inputCls()}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Employer Town, State and Zip">
            <input
              type="text"
              value={form.employerTownStateZip}
              onChange={(e) => set("employerTownStateZip", e.target.value)}
              className={inputCls()}
            />
          </Field>
        </div>
        <Field label="Employer Phone #">
          <input
            type="tel"
            value={form.employerPhone}
            onChange={(e) => set("employerPhone", e.target.value)}
            className={inputCls()}
          />
        </Field>
        <Field label="How Long Employed There?">
          <input
            type="text"
            value={form.employmentDuration}
            onChange={(e) => set("employmentDuration", e.target.value)}
            placeholder="e.g. 2 years"
            className={inputCls()}
          />
        </Field>
        <Field label="Monthly Wages">
          <input
            type="text"
            value={form.monthlyWages}
            onChange={(e) => set("monthlyWages", e.target.value)}
            placeholder="e.g. $2,500"
            className={inputCls()}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Previous Place of Employment">
            <input
              type="text"
              value={form.previousEmployer}
              onChange={(e) => set("previousEmployer", e.target.value)}
              className={inputCls()}
            />
          </Field>
        </div>
      </div>

      {/* Spouse Information — collapsible */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mt-6">
        <button
          type="button"
          onClick={() => setSpouseOpen(!spouseOpen)}
          aria-expanded={spouseOpen}
          className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 text-left text-sm font-semibold text-gray-700 hover:bg-blue-100 transition-colors cursor-pointer"
        >
          <span>Spouse Information (optional)</span>
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              spouseOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {spouseOpen && (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Spouse's Name">
                <input
                  type="text"
                  value={form.spouseName}
                  onChange={(e) => set("spouseName", e.target.value)}
                  className={inputCls()}
                />
              </Field>
            </div>
            <Field label="Spouse's Driver's License #">
              <input
                type="text"
                value={form.spouseDriversLicense}
                onChange={(e) => set("spouseDriversLicense", e.target.value)}
                className={inputCls()}
              />
            </Field>
            <Field label="Spouse's Birth Date">
              <input
                type="date"
                value={form.spouseBirthDate}
                onChange={(e) => set("spouseBirthDate", e.target.value)}
                className={inputCls()}
              />
            </Field>
            <Field label="Spouse's Social Security #">
              <input
                type="text"
                value={form.spouseSsn}
                onChange={(e) => set("spouseSsn", e.target.value)}
                placeholder="XXX-XX-XXXX"
                className={inputCls()}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Spouse's Place of Employment">
                <input
                  type="text"
                  value={form.spouseEmployer}
                  onChange={(e) => set("spouseEmployer", e.target.value)}
                  className={inputCls()}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Spouse's Employer Address">
                <input
                  type="text"
                  value={form.spouseEmployerAddress}
                  onChange={(e) => set("spouseEmployerAddress", e.target.value)}
                  className={inputCls()}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Spouse's Employer Town, State and Zip">
                <input
                  type="text"
                  value={form.spouseEmployerTownStateZip}
                  onChange={(e) =>
                    set("spouseEmployerTownStateZip", e.target.value)
                  }
                  className={inputCls()}
                />
              </Field>
            </div>
            <Field label="Spouse's Employer Phone #">
              <input
                type="tel"
                value={form.spouseEmployerPhone}
                onChange={(e) => set("spouseEmployerPhone", e.target.value)}
                className={inputCls()}
              />
            </Field>
            <Field label="How Long Employed There?">
              <input
                type="text"
                value={form.spouseEmploymentDuration}
                onChange={(e) =>
                  set("spouseEmploymentDuration", e.target.value)
                }
                className={inputCls()}
              />
            </Field>
            <Field label="Spouse's Monthly Wages">
              <input
                type="text"
                value={form.spouseMonthlyWages}
                onChange={(e) => set("spouseMonthlyWages", e.target.value)}
                className={inputCls()}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Spouse's Previous Place of Employment">
                <input
                  type="text"
                  value={form.spousePreviousEmployer}
                  onChange={(e) =>
                    set("spousePreviousEmployer", e.target.value)
                  }
                  className={inputCls()}
                />
              </Field>
            </div>
          </div>
        )}
      </div>

      {/* Household Information */}
      <SectionHeader>Household Information</SectionHeader>
      <div className="space-y-4">
        <Field label="Names and ages of children residing with you">
          <textarea
            value={form.childrenResiding}
            onChange={(e) => set("childrenResiding", e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </Field>
        <Field label="Names of any adult (other than spouse) residing with you">
          <textarea
            value={form.adultsResiding}
            onChange={(e) => set("adultsResiding", e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </Field>
      </div>

      {/* Rental History */}
      <SectionHeader>Rental History</SectionHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name of Current Landlord">
          <input
            type="text"
            value={form.currentLandlord}
            onChange={(e) => set("currentLandlord", e.target.value)}
            className={inputCls()}
          />
        </Field>
        <Field label="Current Landlord Phone #">
          <input
            type="tel"
            value={form.currentLandlordPhone}
            onChange={(e) => set("currentLandlordPhone", e.target.value)}
            className={inputCls()}
          />
        </Field>
        <Field label="How Long Have You Lived There?">
          <input
            type="text"
            value={form.currentTenancyDuration}
            onChange={(e) => set("currentTenancyDuration", e.target.value)}
            className={inputCls()}
          />
        </Field>
        <Field label="Current Rent Amount">
          <input
            type="text"
            value={form.currentRentAmount}
            onChange={(e) => set("currentRentAmount", e.target.value)}
            placeholder="e.g. $800"
            className={inputCls()}
          />
        </Field>
        <Field label="Previous Landlord">
          <input
            type="text"
            value={form.previousLandlord}
            onChange={(e) => set("previousLandlord", e.target.value)}
            className={inputCls()}
          />
        </Field>
        <Field label="Previous Landlord Phone #">
          <input
            type="tel"
            value={form.previousLandlordPhone}
            onChange={(e) => set("previousLandlordPhone", e.target.value)}
            className={inputCls()}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Address Rented">
            <input
              type="text"
              value={form.previousAddressRented}
              onChange={(e) => set("previousAddressRented", e.target.value)}
              className={inputCls()}
            />
          </Field>
        </div>
        <Field label="Previous Rent Amount">
          <input
            type="text"
            value={form.previousRentAmount}
            onChange={(e) => set("previousRentAmount", e.target.value)}
            placeholder="e.g. $700"
            className={inputCls()}
          />
        </Field>
      </div>

      {/* Additional */}
      <SectionHeader>Additional Information</SectionHeader>
      <div className="space-y-4">
        <Field label="Have you or anyone residing in the home ever been convicted of a felony?">
          <input
            type="text"
            value={form.felonyHistory}
            onChange={(e) => set("felonyHistory", e.target.value)}
            placeholder="Yes or No — please explain if yes"
            className={inputCls()}
          />
        </Field>
        <Field label="Which city are you interested in?">
          <select
            value={selectedCitySlug}
            onChange={(e) => {
              setSelectedCitySlug(e.target.value);
              set("listingId", "");
              set("interest", "");
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Select a city —</option>
            {cities.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </Field>
        {selectedCitySlug && (
          <Field label="Select a unit">
            <select
              value={form.listingId}
              onChange={(e) => {
                const listing = listings.find((l) => l.id === e.target.value);
                set("listingId", e.target.value);
                set("interest", listing?.title ?? "");
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Select a unit —</option>
              {listings.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title} — ${l.rentPrice.toLocaleString()}/mo
                </option>
              ))}
              {listings.length === 0 && (
                <option disabled>No units available in this city</option>
              )}
            </select>
          </Field>
        )}
      </div>

      {/* Disclosure */}
      <SectionHeader>Disclosure</SectionHeader>
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700">
        I, the undersigned, represent that the above statements are true and
        complete. I hereby authorize the disclosure of my credit information to
        Blue Blaze Estates.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <Field
          label="Electronic Signature (type your full name)"
          required
          error={errors.electronicSignature}
        >
          <input
            type="text"
            value={form.electronicSignature}
            onChange={(e) => set("electronicSignature", e.target.value)}
            placeholder="Full legal name"
            className={inputCls(!!errors.electronicSignature)}
          />
        </Field>
        <Field label="Date">
          <input
            type="text"
            value={today}
            readOnly
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-default"
          />
        </Field>
      </div>

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mt-4">
          Something went wrong. Please try again or call us directly.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition-colors duration-200 text-lg mt-6"
      >
        {status === "submitting" ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}

export default function ApplyPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Rental Application
          </h1>
          <p className="text-gray-500 mb-8">
            Complete all sections and submit. We will contact you within one
            business day.
          </p>
          <Suspense fallback={<p className="text-gray-400">Loading form...</p>}>
            <ApplyForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
