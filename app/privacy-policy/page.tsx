import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Blue Blaze Estates",
  description:
    "How Blue Blaze Estates collects, uses, and protects the information you provide through this website.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" effectiveDate="September 7, 2026">
      <p>
        This policy explains what information Blue Blaze Estates
        {" "}<em>[NEEDS OWNER INPUT: exact legal entity name, e.g. &ldquo;Blue Blaze
        Estates LLC&rdquo;]</em>{" "}
        (&ldquo;we,&rdquo; &ldquo;us&rdquo;) collects through this website, how
        we use it, and the choices you have. It applies to
        blueblazeestates.com only.
      </p>

      <h2>Information we collect</h2>
      <p>
        <strong>Rental application information.</strong> If you submit our
        rental application, we collect what you type into that form: your name,
        present address, phone number, driver&apos;s license number, date of
        birth, employment and income details, your spouse&apos;s details if you
        provide them, the total number of people who would live in the home, the
        names of any other adults who would live with you, your rental history
        and landlord contacts, your answer to the criminal-history question,
        which unit you are interested in, and your typed electronic signature.
      </p>
      <p>
        <strong>We do not ask for your Social Security number on this website.</strong>{" "}
        If a rental is approved, any additional information needed to prepare a
        lease is collected separately and directly, not through this site.
      </p>
      <p>
        <strong>Basic technical information.</strong> Like any website, our host
        records standard server request data such as IP address, browser type,
        and the pages requested, for security and reliability purposes.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To evaluate your rental application and decide how to follow up.</li>
        <li>
          To contact you about your application, a unit, or your tenancy, using
          the phone number you provided.
        </li>
        <li>
          To verify what you told us by contacting the employers and landlords
          you listed.
        </li>
        <li>To keep records required for our business and to comply with law.</li>
      </ul>
      <p>
        We do not sell your personal information. We do not share it for
        cross-context behavioral advertising. We do not use it to send marketing
        messages unless you separately ask us to.
      </p>

      <h2>Automated review of applications</h2>
      <p>
        We use an automated tool to produce a preliminary score and written
        summary of each application, based only on the employment, income, and
        rental-history information you provide and the rent of the unit you
        applied for. Information about your household — how many people would
        live in the home, or who they are — is deliberately excluded from that
        automated review.
      </p>
      <p>
        <strong>
          The score does not decide anything. A person at Blue Blaze Estates
          reviews every application and makes the final decision.
        </strong>{" "}
        You may ask us to review your application without the automated tool, or
        ask why a decision was made, by contacting us using the details below.
        We will review it manually on request.
      </p>
      <p>
        To produce that summary, the information you submit is sent to our
        service provider Anthropic, PBC, which operates the automated tool. It
        is used to generate your summary and is not used to train their models.
      </p>

      <h2>Who else your information reaches</h2>
      <p>
        We share information only with service providers who help us operate the
        site and our business, and only as needed for that purpose:
      </p>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> — website hosting and server logs.
        </li>
        <li>
          <strong>Turso (ChiselStrike, Inc.)</strong> — the database where
          applications are stored.
        </li>
        <li>
          <strong>Anthropic, PBC</strong> — the automated application-summary
          tool described above.
        </li>
        <li>
          The employers and landlords you list, when we contact them to verify
          your application.
        </li>
      </ul>
      <p>
        We may also disclose information if required by law, subpoena, or court
        order, or to protect our legal rights.
      </p>

      <h2>Cookies and tracking</h2>
      <p>
        This site uses <strong>no advertising pixels, no analytics services, and
        no cross-site trackers</strong>. We set exactly one cookie: a session
        cookie used to keep the property owner signed in to the private admin
        dashboard. It is strictly necessary for that function, and it is never
        set for ordinary visitors browsing listings or submitting an
        application. Because we run no non-essential tracking, there is nothing
        here to opt out of.
      </p>

      <h2>How long we keep it</h2>
      <p>
        <em>
          [NEEDS OWNER INPUT: how long applications are retained — e.g.
          &ldquo;applications that do not result in a tenancy are deleted after
          12 months.&rdquo; Illinois has no fixed rule, but keeping applicant
          data indefinitely increases both risk and obligation. Pick a period
          and hold to it.]
        </em>
      </p>

      <h2>How we protect it</h2>
      <p>
        Applications are transmitted over an encrypted HTTPS connection and
        stored in a database that is not publicly reachable. The admin dashboard
        is password protected and is not indexed by search engines. No system is
        perfectly secure, but we do not collect Social Security numbers through
        this site specifically to limit what a breach could expose.
      </p>
      <p>
        If a breach affecting personal information occurs, we will notify
        affected Illinois residents as required by the Illinois Personal
        Information Protection Act.
      </p>

      <h2>Your choices</h2>
      <p>You may contact us at any time to:</p>
      <ul>
        <li>Ask what information we hold about you.</li>
        <li>Ask us to correct information that is wrong.</li>
        <li>Ask us to delete your application.</li>
        <li>
          Ask for your application to be reviewed without the automated tool.
        </li>
      </ul>
      <p>
        We will respond within a reasonable time. Depending on where you live,
        you may have additional rights under your state&apos;s law; tell us
        which state you reside in and we will honor the rights that apply.
      </p>

      <h2>Children</h2>
      <p>
        This site is intended for adults seeking housing. We do not knowingly
        collect information directly from children.
      </p>

      <h2>Changes</h2>
      <p>
        If we change this policy we will update the effective date above.
        Material changes will be noted on this page.
      </p>

      <h2>Contact us</h2>
      <p>
        Blue Blaze Estates
        <br />
        <em>[NEEDS OWNER INPUT: business mailing address]</em>
        <br />
        Phone: <a href="tel:6189427624">618-942-7624</a>
        <br />
        Email:{" "}
        <a href="mailto:blueblazeestates@gmail.com">
          blueblazeestates@gmail.com
        </a>
      </p>
      <p>
        See also our <Link href="/accessibility">Accessibility Statement</Link>{" "}
        and <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>.
      </p>
    </LegalPage>
  );
}
