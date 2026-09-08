import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions — Blue Blaze Estates",
  description:
    "The terms that govern your use of the Blue Blaze Estates website.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" effectiveDate="September 7, 2026">
      <p>
        These terms govern your use of blueblazeestates.com, operated by Blue
        Blaze Estates{" "}
        <em>[NEEDS OWNER INPUT: exact legal entity name]</em> (&ldquo;we,&rdquo;
        &ldquo;us&rdquo;). By using this site you agree to them. If you do not
        agree, please do not use the site.
      </p>

      <h2>What this site is</h2>
      <p>
        This site lists rental units we have available and lets you submit a
        rental application. Listings are informational and are not an offer or a
        binding commitment to rent. Availability, rent, and terms can change at
        any time, and a unit shown as available may already be spoken for.
        Nothing on this site creates a tenancy. A tenancy is created only by a
        signed written lease.
      </p>

      <h2>Applying</h2>
      <p>
        When you submit an application you agree that
        the information you provide is true and complete to the best of your
        knowledge, and you authorize us to contact the employers and landlords
        you list in order to verify it. Submitting an application does not
        guarantee approval or reserve a unit.
      </p>
      <p>
        How we handle the information you submit — including our use of an
        automated tool to produce a preliminary summary that a person then
        reviews — is described in our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>

      <h2>Equal housing opportunity</h2>
      <p>
        We comply with the federal Fair Housing Act and the Illinois Human
        Rights Act. We do not discriminate against any person because of race,
        color, religion, sex, national origin, familial status, disability, or
        any other class protected by applicable federal, state, or local law.
      </p>
      <p>
        If you need a reasonable accommodation or modification because of a
        disability — including help completing this application — contact us and
        we will work with you.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Submit false, misleading, or fraudulent information.</li>
        <li>Submit an application on someone else&apos;s behalf without their permission.</li>
        <li>
          Use automated means to scrape, copy, or bulk-submit to this site.
        </li>
        <li>
          Attempt to gain unauthorized access to any part of the site, its
          administrative area, or its underlying systems.
        </li>
        <li>Interfere with the operation or security of the site.</li>
      </ul>

      <h2>Our content</h2>
      <p>
        Rights in text, photographs, logos, and other materials remain with their respective rights holders. Contact us before reproducing materials from this site. Property photographs are intended to be
        representative; individual units may differ.
      </p>

      <h2>No warranty</h2>
      <p>
        This site is provided &ldquo;as is.&rdquo; We do not warrant that it
        will be uninterrupted, error-free, or that the information on it is
        complete or current. To the fullest extent permitted by law, we disclaim
        all implied warranties, including merchantability and fitness for a
        particular purpose.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by Illinois law, we are not liable for
        indirect, incidental, special, or consequential damages arising from
        your use of this site, including any inability to access it or any error
        in a listing. Nothing in these terms limits liability that cannot be
        limited by law. This provision governs your use of the website; it does
        not limit any right or remedy you may have as a tenant or applicant
        under landlord-tenant or fair housing law.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of the State of Illinois, without
        regard to its conflict-of-laws rules.
      </p>

      <h2>Disputes</h2>
      <p>
        <em>
          [NEEDS ATTORNEY REVIEW: determine appropriate dispute-resolution terms for this website. No arbitration agreement, class-action waiver, or exclusive court venue is established by this placeholder.]
        </em>
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. Changes take effect when posted, and the
        effective date above will be updated.
      </p>

      <h2>Contact us</h2>
      <p>
        Phone: <a href="tel:6189427624">618-942-7624</a>
        <br />
        Email:{" "}
        <a href="mailto:blueblazeestates@gmail.com">
          blueblazeestates@gmail.com
        </a>
      </p>
    </LegalPage>
  );
}
