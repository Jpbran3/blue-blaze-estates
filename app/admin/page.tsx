"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { upload } from "@vercel/blob/client";

// ── Types ──────────────────────────────────────────────────────────────────────

interface City {
  id: string;
  name: string;
  state: string;
  slug: string;
  imageUrl?: string | null;
  availableCount: number;
}

interface Listing {
  id: string;
  cityId: string;
  title: string;
  description?: string | null;
  bedrooms: number;
  bathrooms: number;
  rentPrice: number;
  imageUrl?: string | null;
  images: string[];
  status: string;
  city?: { name: string; slug: string };
}

interface Application {
  id: string;
  applicantName: string;
  presentAddress?: string | null;
  townStateZip?: string | null;
  phone: string;
  ssn?: string | null;
  driversLicense?: string | null;
  birthDate?: string | null;
  employer?: string | null;
  employerAddress?: string | null;
  employerTownStateZip?: string | null;
  employerPhone?: string | null;
  employmentDuration?: string | null;
  monthlyWages?: string | null;
  previousEmployer?: string | null;
  spouseName?: string | null;
  spouseDriversLicense?: string | null;
  spouseBirthDate?: string | null;
  spouseSsn?: string | null;
  spouseEmployer?: string | null;
  spouseEmployerAddress?: string | null;
  spouseEmployerTownStateZip?: string | null;
  spouseEmployerPhone?: string | null;
  spouseEmploymentDuration?: string | null;
  spouseMonthlyWages?: string | null;
  spousePreviousEmployer?: string | null;
  childrenResiding?: string | null;
  adultsResiding?: string | null;
  currentLandlord?: string | null;
  currentLandlordPhone?: string | null;
  currentTenancyDuration?: string | null;
  currentRentAmount?: string | null;
  previousLandlord?: string | null;
  previousLandlordPhone?: string | null;
  previousAddressRented?: string | null;
  previousRentAmount?: string | null;
  felonyHistory?: string | null;
  interest?: string | null;
  electronicSignature?: string | null;
  signatureDate?: string | null;
  email?: string | null;
  listingId?: string | null;
  rentPrice?: number | null;
  status: string;
  archived: boolean;
  aiScore?: number | null;
  aiSummary?: string | null;
  createdAt: string;
}

// ── Shared application field definitions ──────────────────────────────────────

const APPLICATION_FIELDS: [string, keyof Application][] = [
  ["Full Name", "applicantName"],
  ["Phone", "phone"],
  ["Email", "email"],
  ["Interest / Unit", "interest"],
  ["Present Address", "presentAddress"],
  ["Town, State, Zip", "townStateZip"],
  ["SSN", "ssn"],
  ["Driver's License #", "driversLicense"],
  ["Birth Date", "birthDate"],
  ["Employer", "employer"],
  ["Employer Address", "employerAddress"],
  ["Employer Town/State/Zip", "employerTownStateZip"],
  ["Employer Phone", "employerPhone"],
  ["Employment Duration", "employmentDuration"],
  ["Monthly Wages", "monthlyWages"],
  ["Previous Employer", "previousEmployer"],
  ["Spouse Name", "spouseName"],
  ["Spouse DL #", "spouseDriversLicense"],
  ["Spouse Birth Date", "spouseBirthDate"],
  ["Spouse SSN", "spouseSsn"],
  ["Spouse Employer", "spouseEmployer"],
  ["Spouse Employer Address", "spouseEmployerAddress"],
  ["Spouse Employer Town/State/Zip", "spouseEmployerTownStateZip"],
  ["Spouse Employer Phone", "spouseEmployerPhone"],
  ["Spouse Employment Duration", "spouseEmploymentDuration"],
  ["Spouse Monthly Wages", "spouseMonthlyWages"],
  ["Spouse Previous Employer", "spousePreviousEmployer"],
  ["Children Residing", "childrenResiding"],
  ["Other Adults Residing", "adultsResiding"],
  ["Current Landlord", "currentLandlord"],
  ["Current Landlord Phone", "currentLandlordPhone"],
  ["Current Tenancy Duration", "currentTenancyDuration"],
  ["Current Rent", "currentRentAmount"],
  ["Previous Landlord", "previousLandlord"],
  ["Previous Landlord Phone", "previousLandlordPhone"],
  ["Previous Address Rented", "previousAddressRented"],
  ["Previous Rent", "previousRentAmount"],
  ["Felony History", "felonyHistory"],
  ["Electronic Signature", "electronicSignature"],
  ["Signature Date", "signatureDate"],
];

// ── Print / Save application as a file ──────────────────────────────────────────

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function printApplication(a: Application) {
  const submitted = new Date(a.createdAt).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const rows = APPLICATION_FIELDS.map(([label, key]) => {
    const raw = a[key];
    const value = raw != null && String(raw).trim() !== "" ? String(raw) : "—";
    return `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`;
  }).join("");

  const aiBlock =
    a.aiScore != null && a.aiScore > 0
      ? `<div class="ai">
           <p class="ai-score">AI Screening Score: <strong>${a.aiScore}/10</strong></p>
           ${a.aiSummary ? `<p class="ai-summary">${escapeHtml(a.aiSummary)}</p>` : ""}
         </div>`
      : "";

  const title = `Rental Application — ${a.applicantName || "Applicant"}`;

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #1f2937; margin: 40px; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  .meta { color: #6b7280; font-size: 13px; margin-bottom: 20px; }
  .ai { border-left: 4px solid #111827; background: #f9fafb; padding: 12px 16px; margin-bottom: 20px; }
  .ai-score { margin: 0 0 4px; font-size: 14px; }
  .ai-summary { margin: 0; font-size: 13px; color: #4b5563; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { text-align: left; vertical-align: top; padding: 7px 10px; border-bottom: 1px solid #e5e7eb; }
  th { width: 38%; color: #6b7280; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.04em; }
  td { color: #111827; white-space: pre-wrap; }
  @media print { body { margin: 0.5in; } }
</style>
</head>
<body>
  <h1>Blue Blaze Estates — Rental Application</h1>
  <p class="meta">${escapeHtml(a.applicantName || "Applicant")} &middot; Submitted ${escapeHtml(submitted)}${a.rentPrice ? ` &middot; Listing rent $${a.rentPrice.toLocaleString()}/mo` : ""}</p>
  ${aiBlock}
  <table><tbody>${rows}</tbody></table>
  <script>window.onload = function () { window.focus(); window.print(); };</script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) {
    alert("Please allow pop-ups for this site to print/save the application.");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}

// ── Login ──────────────────────────────────────────────────────────────────────

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      onLogin();
    } else {
      setError("Invalid password. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-sm">
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
        <p className="text-gray-500 text-sm mb-6">Blue Blaze Estates Dashboard</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label htmlFor="admin-password" className="sr-only">
              Password
            </label>
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 px-4 text-sm font-medium text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            {loading ? "Checking..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Multi-Image Upload Helper ──────────────────────────────────────────────────

function MultiImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [progress, setProgress] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadError(null);

    const failed: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress(`Uploading ${i + 1} of ${files.length}…`);
      try {
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const blob = await upload(`listings/${safeName}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        onChange([...images, blob.url]);
        images = [...images, blob.url];
      } catch (err) {
        failed.push(`${file.name}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    setProgress(null);
    if (failed.length) setUploadError(`Failed: ${failed.join(", ")}`);
    e.target.value = "";
  }

  function remove(idx: number) {
    onChange(images.filter((_, i) => i !== idx));
  }

  function setMain(idx: number) {
    const next = [...images];
    const [item] = next.splice(idx, 1);
    next.unshift(item);
    onChange(next);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Images{images.length > 0 && <span className="text-gray-400 font-normal ml-1">— first is main photo</span>}
      </label>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((url, i) => (
            <div key={`${url}-${i}`} className="relative group w-24 h-24 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
              />
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-blue-900 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded pointer-events-none">
                  Main
                </span>
              )}
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remove image ${i + 1}`}
                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer"
              >
                ×
              </button>
              {i !== 0 && (
                <button
                  type="button"
                  onClick={() => setMain(i)}
                  className="absolute bottom-1 inset-x-1 bg-black/70 hover:bg-blue-900 text-white text-[10px] px-1 py-0.5 rounded text-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Set Main
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <label className={`cursor-pointer inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors ${progress ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
        {progress ?? "+ Add Images"}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
          disabled={!!progress}
        />
      </label>
      {uploadError && (
        <p className="mt-2 text-xs text-red-500">{uploadError}</p>
      )}
    </div>
  );
}

// Keep single ImageUploader for Cities tab
function ImageUploader({
  current,
  onChange,
}: {
  current?: string | null;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      onChange(url);
    }
    setUploading(false);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={current ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or upload →"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg transition-colors">
          {uploading ? "Uploading..." : "Upload"}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      </div>
      {current && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={current} alt="preview" className="mt-2 h-20 rounded object-cover" />
      )}
    </div>
  );
}

// ── Cities Tab ─────────────────────────────────────────────────────────────────

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function CitiesTab() {
  const [cities, setCities] = useState<City[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editCity, setEditCity] = useState<City | null>(null);
  const [form, setForm] = useState({ name: "", state: "IL", slug: "", imageUrl: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = useCallback(async () => {
    const res = await fetch("/api/cities");
    if (!res.ok) return null;
    return (await res.json()) as City[];
  }, []);

  const load = useCallback(async () => {
    const nextCities = await fetchCities();
    if (nextCities) setCities(nextCities);
  }, [fetchCities]);

  useEffect(() => {
    let cancelled = false;

    fetchCities().then((nextCities) => {
      if (!cancelled && nextCities) setCities(nextCities);
    });

    return () => {
      cancelled = true;
    };
  }, [fetchCities]);

  function openAdd() {
    setEditCity(null);
    setForm({ name: "", state: "IL", slug: "", imageUrl: "" });
    setError(null);
    setShowForm(true);
  }

  function openEdit(c: City) {
    setEditCity(c);
    setForm({ name: c.name, state: c.state, slug: c.slug, imageUrl: c.imageUrl ?? "" });
    setError(null);
    setShowForm(true);
  }

  async function save() {
    setError(null);
    // Derive a slug from the name if the user left it blank.
    const slug = form.slug.trim() || slugify(form.name);
    const name = form.name.trim();
    const state = form.state.trim();
    if (!name || !state) {
      setError("Name and state are required.");
      return;
    }
    if (!slug) {
      setError("Could not generate a slug — please enter one manually.");
      return;
    }

    const body = { name, state, slug, imageUrl: form.imageUrl || null };
    setSaving(true);
    try {
      const res = editCity
        ? await fetch(`/api/cities/${editCity.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
        : await fetch("/api/cities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

      if (!res.ok) {
        let message = `Save failed (${res.status}).`;
        if (res.status === 401) {
          message = "Your session expired. Please sign out and sign back in.";
        } else {
          const data = await res.json().catch(() => null);
          if (data?.error) message = data.error;
        }
        setError(message);
        return;
      }

      setShowForm(false);
      load();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function del(id: string) {
    if (!confirm("Delete this city? All its listings will also be deleted.")) return;
    await fetch(`/api/cities/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Cities</h2>
        <button
          onClick={openAdd}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors"
        >
          + Add City
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-gray-700">
            {editCity ? "Edit City" : "New City"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    name,
                    // Auto-fill slug from the name unless the user has typed
                    // their own slug (or is editing an existing city).
                    slug:
                      !editCity && prev.slug === slugify(prev.name)
                        ? slugify(name)
                        : prev.slug,
                  }));
                }}
                placeholder="Edwardsville"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                placeholder="IL"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug{" "}
                <span className="text-gray-400 font-normal">— auto-filled</span>
              </label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="edwardsville-il"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <ImageUploader
            current={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
          />
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={saving}
              className="bg-blue-900 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-800 disabled:bg-gray-400 transition-colors"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Slug</th>
              <th className="pb-3 pr-4">Available</th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {cities.map((c) => (
              <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 pr-4 font-medium text-gray-800">
                  {c.name}, {c.state}
                </td>
                <td className="py-3 pr-4 text-gray-500">{c.slug}</td>
                <td className="py-3 pr-4">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    {c.availableCount} units
                  </span>
                </td>
                <td className="py-3 text-right space-x-2">
                  <button
                    onClick={() => openEdit(c)}
                    className="text-gray-600 hover:text-gray-900 text-xs font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => del(c.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {cities.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">
                  No cities yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Listings Tab ───────────────────────────────────────────────────────────────

function ListingsTab() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editListing, setEditListing] = useState<Listing | null>(null);
  const [form, setForm] = useState({
    cityId: "",
    title: "",
    description: "",
    bedrooms: "2",
    bathrooms: "1",
    rentPrice: "",
    images: [] as string[],
    status: "available",
  });

  const fetchListingData = useCallback(async () => {
    const [lr, cr] = await Promise.all([
      fetch("/api/listings"),
      fetch("/api/cities"),
    ]);
    if (!lr.ok || !cr.ok) return null;
    return {
      listings: (await lr.json()) as Listing[],
      cities: (await cr.json()) as City[],
    };
  }, []);

  const load = useCallback(async () => {
    const data = await fetchListingData();
    if (!data) return;
    setListings(data.listings);
    setCities(data.cities);
  }, [fetchListingData]);

  useEffect(() => {
    let cancelled = false;

    fetchListingData().then((data) => {
      if (cancelled || !data) return;
      setListings(data.listings);
      setCities(data.cities);
    });

    return () => {
      cancelled = true;
    };
  }, [fetchListingData]);

  function openAdd() {
    setEditListing(null);
    setForm({
      cityId: cities[0]?.id ?? "",
      title: "",
      description: "",
      bedrooms: "2",
      bathrooms: "1",
      rentPrice: "",
      images: [],
      status: "available",
    });
    setShowForm(true);
  }

  function openEdit(l: Listing) {
    setEditListing(l);
    setForm({
      cityId: l.cityId,
      title: l.title,
      description: l.description ?? "",
      bedrooms: String(l.bedrooms),
      bathrooms: String(l.bathrooms),
      rentPrice: String(l.rentPrice),
      images: l.images ?? (l.imageUrl ? [l.imageUrl] : []),
      status: l.status,
    });
    setShowForm(true);
  }

  async function save() {
    const body = {
      ...form,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      rentPrice: Number(form.rentPrice),
      images: form.images,
      description: form.description || null,
    };
    if (editListing) {
      await fetch(`/api/listings/${editListing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    setShowForm(false);
    load();
  }

  async function toggleStatus(l: Listing) {
    const next = l.status === "available" ? "unavailable" : "available";
    await fetch(`/api/listings/${l.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    load();
  }

  async function del(id: string) {
    if (!confirm("Delete this listing?")) return;
    await fetch(`/api/listings/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Listings</h2>
        <button
          onClick={openAdd}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors"
        >
          + Add Listing
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-gray-700">
            {editListing ? "Edit Listing" : "New Listing"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select
                value={form.cityId}
                onChange={(e) => setForm({ ...form, cityId: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="flex items-center gap-3 h-[42px]">
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.status === "available"}
                  onClick={() =>
                    setForm({
                      ...form,
                      status: form.status === "available" ? "unavailable" : "available",
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    form.status === "available" ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      form.status === "available" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span
                  className={`text-sm font-medium ${
                    form.status === "available" ? "text-green-700" : "text-gray-500"
                  }`}
                >
                  {form.status === "available" ? "Listed" : "Unlisted"}
                </span>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Cozy 2BR near downtown"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <input
                type="number"
                min="0"
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={form.bathrooms}
                onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Rent ($)
              </label>
              <input
                type="number"
                min="0"
                value={form.rentPrice}
                onChange={(e) => setForm({ ...form, rentPrice: e.target.value })}
                placeholder="1200"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of the unit..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
          <MultiImageUploader
            images={form.images}
            onChange={(images) => setForm((prev) => ({ ...prev, images }))}
          />
          <div className="flex gap-2">
            <button
              onClick={save}
              className="bg-blue-900 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="pb-3 pr-4">Title</th>
              <th className="pb-3 pr-4">City</th>
              <th className="pb-3 pr-4">Beds/Baths</th>
              <th className="pb-3 pr-4">Rent</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 pr-4 font-medium text-gray-800 max-w-xs truncate">
                  {l.title}
                </td>
                <td className="py-3 pr-4 text-gray-500">
                  {l.city?.name ?? "—"}
                </td>
                <td className="py-3 pr-4 text-gray-600">
                  {l.bedrooms}bd / {l.bathrooms}ba
                </td>
                <td className="py-3 pr-4 text-gray-700 font-medium">
                  ${l.rentPrice.toLocaleString()}
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={l.status === "available"}
                      onClick={() => toggleStatus(l)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                        l.status === "available" ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                          l.status === "available" ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span
                      className={`text-xs font-medium ${
                        l.status === "available" ? "text-green-700" : "text-gray-500"
                      }`}
                    >
                      {l.status === "available" ? "Listed" : "Unlisted"}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-right space-x-2">
                  <button
                    onClick={() => openEdit(l)}
                    className="text-gray-600 hover:text-gray-900 text-xs font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => del(l.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {listings.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  No listings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── AI Score badge helper ──────────────────────────────────────────────────────

function AiScoreBadge({ score }: { score?: number | null }) {
  if (score != null && score > 0) {
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          score >= 8
            ? "bg-green-100 text-green-700"
            : score >= 5
            ? "bg-yellow-100 text-yellow-700"
            : score >= 2
            ? "bg-orange-100 text-orange-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {score}
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-400">
      Pending
    </span>
  );
}

// ── Applications Tab ───────────────────────────────────────────────────────────

function ApplicationsTab() {
  const [apps, setApps] = useState<Application[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "aiScore">("date");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const fetchApplications = useCallback(async () => {
    const res = await fetch("/api/applications");
    if (!res.ok) return null;
    return (await res.json()) as Application[];
  }, []);

  const load = useCallback(async () => {
    const nextApps = await fetchApplications();
    if (nextApps) setApps(nextApps);
  }, [fetchApplications]);

  useEffect(() => {
    let cancelled = false;

    fetchApplications().then((nextApps) => {
      if (!cancelled && nextApps) setApps(nextApps);
    });

    return () => {
      cancelled = true;
    };
  }, [fetchApplications]);

  async function markContacted(id: string) {
    await fetch(`/api/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "contacted" }),
    });
    load();
  }

  async function archive(id: string) {
    await fetch(`/api/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: true }),
    });
    if (expandedId === id) setExpandedId(null);
    load();
  }

  async function del(id: string) {
    if (!confirm("Delete this application? This cannot be undone.")) return;
    await fetch(`/api/applications/${id}`, { method: "DELETE" });
    if (expandedId === id) setExpandedId(null);
    load();
  }

  function startEdit(a: Application) {
    const draft: Record<string, string> = {};
    for (const [, key] of APPLICATION_FIELDS) {
      const val = a[key];
      draft[key as string] = val != null ? String(val) : "";
    }
    setEditDraft(draft);
    setEditingId(a.id);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft({});
  }

  async function saveEdit(id: string) {
    setSaving(true);
    const body: Record<string, string | null> = {};
    for (const [key, val] of Object.entries(editDraft)) {
      body[key] = val || null;
    }
    await fetch(`/api/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    setEditingId(null);
    setEditDraft({});
    load();
  }

  function toggle(id: string) {
    if (editingId === id) return;
    setExpandedId((cur) => (cur === id ? null : id));
  }

  const sortedApps = useMemo(() => {
    return [...apps].sort((a, b) => {
      if (sortBy === "aiScore") {
        return (b.aiScore ?? -1) - (a.aiScore ?? -1);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [apps, sortBy]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Applications</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{apps.length} total</span>
          <button
            onClick={() => setSortBy((s) => (s === "date" ? "aiScore" : "date"))}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              sortBy === "aiScore"
                ? "bg-blue-900 text-white border-black"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
            }`}
          >
            {sortBy === "aiScore" ? "Sorted by AI Score ▼" : "Sort by AI Score"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Phone</th>
              <th className="pb-3 pr-4 hidden sm:table-cell">Interest</th>
              <th className="pb-3 pr-4 hidden md:table-cell">Date</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">AI Score</th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {sortedApps.map((a) => (
              <React.Fragment key={a.id}>
                <tr
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggle(a.id)}
                >
                  <td className="py-3 pr-4 font-medium text-gray-800">
                    {a.applicantName}
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{a.phone}</td>
                  <td className="py-3 pr-4 text-gray-500 hidden sm:table-cell max-w-[180px] truncate">
                    {a.interest ?? "—"}
                  </td>
                  <td className="py-3 pr-4 text-gray-400 text-xs hidden md:table-cell whitespace-nowrap">
                    {new Date(a.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        a.status === "new"
                          ? "bg-blue-900 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <AiScoreBadge score={a.aiScore} />
                  </td>
                  <td className="py-3 text-right text-gray-400 text-xs pr-1">
                    {expandedId === a.id ? "▲" : "▼"}
                  </td>
                </tr>
                {expandedId === a.id && (
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td colSpan={7} className="px-4 py-5">
                      {/* AI Screening Result Card */}
                      {a.aiScore != null && a.aiScore > 0 ? (
                        <div
                          className={`mb-5 rounded-lg p-4 border-l-4 bg-white shadow-sm ${
                            a.aiScore >= 8
                              ? "border-green-500"
                              : a.aiScore >= 5
                              ? "border-yellow-500"
                              : a.aiScore >= 2
                              ? "border-orange-500"
                              : "border-red-500"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div>
                              <span
                                className={`text-3xl font-bold ${
                                  a.aiScore >= 8
                                    ? "text-green-700"
                                    : a.aiScore >= 5
                                    ? "text-yellow-700"
                                    : a.aiScore >= 2
                                    ? "text-orange-700"
                                    : "text-red-700"
                                }`}
                              >
                                {a.aiScore}
                              </span>
                              {a.rentPrice && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Listing rent: ${a.rentPrice.toLocaleString()}/mo
                                </p>
                              )}
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                              AI Screening Score
                            </span>
                          </div>
                          {a.aiSummary && (
                            <p className="text-sm text-gray-600">{a.aiSummary}</p>
                          )}
                        </div>
                      ) : (
                        <p className="mb-5 text-xs text-gray-400 italic">
                          Screening pending...
                        </p>
                      )}

                      {/* Field grid — view or edit mode */}
                      {editingId === a.id ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm mb-5">
                          {APPLICATION_FIELDS.map(([label, key]) => (
                            <div key={key as string}>
                              <label className="block text-gray-400 text-xs uppercase tracking-wide mb-0.5">
                                {label}
                              </label>
                              <input
                                value={editDraft[key as string] ?? ""}
                                onChange={(e) =>
                                  setEditDraft((d) => ({ ...d, [key as string]: e.target.value }))
                                }
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-sm mb-5">
                          {APPLICATION_FIELDS.map(([label, key]) => (
                            <div key={key as string}>
                              <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">
                                {label}
                              </p>
                              <p className={`font-medium whitespace-pre-wrap ${a[key] ? "text-gray-700" : "text-gray-300"}`}>
                                {a[key] ? String(a[key]) : "—"}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {editingId === a.id ? (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); saveEdit(a.id); }}
                              disabled={saving}
                              className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-400 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                            >
                              {saving ? "Saving…" : "Save Changes"}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); cancelEdit(); }}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            {a.status === "new" && (
                              <button
                                onClick={(e) => { e.stopPropagation(); markContacted(a.id); }}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Mark Contacted
                              </button>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); startEdit(a); }}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Edit Fields
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); printApplication(a); }}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Print / Save PDF
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); archive(a.id); }}
                              className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Archive
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); del(a.id); }}
                              className="bg-red-100 hover:bg-red-200 text-red-600 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {sortedApps.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">
                  No applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Archive Tab ────────────────────────────────────────────────────────────────

function ArchiveTab() {
  const [apps, setApps] = useState<Application[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const fetchArchivedApplications = useCallback(async () => {
    const res = await fetch("/api/applications?archived=true");
    if (!res.ok) return null;
    return (await res.json()) as Application[];
  }, []);

  const load = useCallback(async () => {
    const nextApps = await fetchArchivedApplications();
    if (nextApps) setApps(nextApps);
  }, [fetchArchivedApplications]);

  useEffect(() => {
    let cancelled = false;

    fetchArchivedApplications().then((nextApps) => {
      if (!cancelled && nextApps) setApps(nextApps);
    });

    return () => {
      cancelled = true;
    };
  }, [fetchArchivedApplications]);

  async function unarchive(id: string) {
    await fetch(`/api/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: false }),
    });
    if (expandedId === id) setExpandedId(null);
    load();
  }

  async function del(id: string) {
    if (!confirm("Permanently delete this application? This cannot be undone.")) return;
    await fetch(`/api/applications/${id}`, { method: "DELETE" });
    if (expandedId === id) setExpandedId(null);
    load();
  }

  function startEdit(a: Application) {
    const draft: Record<string, string> = {};
    for (const [, key] of APPLICATION_FIELDS) {
      const val = a[key];
      draft[key as string] = val != null ? String(val) : "";
    }
    setEditDraft(draft);
    setEditingId(a.id);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft({});
  }

  async function saveEdit(id: string) {
    setSaving(true);
    const body: Record<string, string | null> = {};
    for (const [key, val] of Object.entries(editDraft)) {
      body[key] = val || null;
    }
    await fetch(`/api/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    setEditingId(null);
    setEditDraft({});
    load();
  }

  function toggle(id: string) {
    if (editingId === id) return;
    setExpandedId((cur) => (cur === id ? null : id));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Archived Applications</h2>
        <span className="text-sm text-gray-500">{apps.length} archived</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Phone</th>
              <th className="pb-3 pr-4 hidden sm:table-cell">Interest</th>
              <th className="pb-3 pr-4 hidden md:table-cell">Date</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">AI Score</th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {apps.map((a) => (
              <React.Fragment key={a.id}>
                <tr
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggle(a.id)}
                >
                  <td className="py-3 pr-4 font-medium text-gray-500">
                    {a.applicantName}
                  </td>
                  <td className="py-3 pr-4 text-gray-500">{a.phone}</td>
                  <td className="py-3 pr-4 text-gray-400 hidden sm:table-cell max-w-[180px] truncate">
                    {a.interest ?? "—"}
                  </td>
                  <td className="py-3 pr-4 text-gray-400 text-xs hidden md:table-cell whitespace-nowrap">
                    {new Date(a.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-400">
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <AiScoreBadge score={a.aiScore} />
                  </td>
                  <td className="py-3 text-right text-gray-400 text-xs pr-1">
                    {expandedId === a.id ? "▲" : "▼"}
                  </td>
                </tr>
                {expandedId === a.id && (
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td colSpan={7} className="px-4 py-5">
                      {a.aiScore != null && a.aiScore > 0 && (
                        <div
                          className={`mb-5 rounded-lg p-4 border-l-4 bg-white shadow-sm ${
                            a.aiScore >= 8
                              ? "border-green-500"
                              : a.aiScore >= 5
                              ? "border-yellow-500"
                              : a.aiScore >= 2
                              ? "border-orange-500"
                              : "border-red-500"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div>
                              <span
                                className={`text-3xl font-bold ${
                                  a.aiScore >= 8
                                    ? "text-green-700"
                                    : a.aiScore >= 5
                                    ? "text-yellow-700"
                                    : a.aiScore >= 2
                                    ? "text-orange-700"
                                    : "text-red-700"
                                }`}
                              >
                                {a.aiScore}
                              </span>
                              {a.rentPrice && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Listing rent: ${a.rentPrice.toLocaleString()}/mo
                                </p>
                              )}
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                              AI Screening Score
                            </span>
                          </div>
                          {a.aiSummary && (
                            <p className="text-sm text-gray-600">{a.aiSummary}</p>
                          )}
                        </div>
                      )}

                      {editingId === a.id ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm mb-5">
                          {APPLICATION_FIELDS.map(([label, key]) => (
                            <div key={key as string}>
                              <label className="block text-gray-400 text-xs uppercase tracking-wide mb-0.5">
                                {label}
                              </label>
                              <input
                                value={editDraft[key as string] ?? ""}
                                onChange={(e) =>
                                  setEditDraft((d) => ({ ...d, [key as string]: e.target.value }))
                                }
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-sm mb-5">
                          {APPLICATION_FIELDS.map(([label, key]) => (
                            <div key={key as string}>
                              <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">
                                {label}
                              </p>
                              <p className={`font-medium whitespace-pre-wrap ${a[key] ? "text-gray-700" : "text-gray-300"}`}>
                                {a[key] ? String(a[key]) : "—"}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {editingId === a.id ? (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); saveEdit(a.id); }}
                              disabled={saving}
                              className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-400 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                            >
                              {saving ? "Saving…" : "Save Changes"}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); cancelEdit(); }}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); startEdit(a); }}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Edit Fields
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); unarchive(a.id); }}
                              className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Unarchive
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); del(a.id); }}
                              className="bg-red-100 hover:bg-red-200 text-red-600 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {apps.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">
                  No archived applications.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

type Tab = "applications" | "archive" | "listings" | "cities";

function Dashboard() {
  const [tab, setTab] = useState<Tab>("applications");

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="font-display text-xl font-bold">Blue Blaze Estates — Admin</h1>
        <button
          onClick={logout}
          className="text-blue-100 hover:text-white text-sm transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          {(["applications", "archive", "listings", "cities"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-current={tab === t ? "page" : undefined}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px cursor-pointer ${
                tab === t
                  ? "border-blue-900 text-blue-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {tab === "applications" && <ApplicationsTab />}
          {tab === "archive" && <ArchiveTab />}
          {tab === "listings" && <ListingsTab />}
          {tab === "cities" && <CitiesTab />}
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((r) => setAuthed(r.ok))
      .catch(() => setAuthed(false));
  }, []);

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (!authed) return <LoginForm onLogin={() => setAuthed(true)} />;
  return <Dashboard />;
}
