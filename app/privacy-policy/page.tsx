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
    <LegalPage title="Privacy Policy" effectiveDate="September 10, 2026">
      <p>
        This policy explains what information Blue Blaze Estates, operated by
        BLUE BLAZE MHP LLC,
        {" "}
        (&ldquo;we,&rdquo; &ldquo;us&rdquo;) collects through this website, how
        we use it, and the choices you have. It applies to
        blueblazeestates.com only.
      </p>

      <h2>Information we collect</h2>
      <p>
        <strong>Rental application information.</strong> If you submit our
        rental application, we collect what you type into that form: your name,
        present address, phone number, date of birth, employment and income
        details, your spouse&apos;s details if you provide them, the total
        number of people who would live in the home, the names of any other
        adults who would live with you, your rental history and landlord
        contacts, your answer to the criminal-history question, which unit you
        are interested in, and your typed electronic signature.
      </p>
      <p>
        <strong>Your date of birth is used for one purpose only:</strong>{" "}
        confirming you are 18 or older and can enter into a lease. It plays no
        part in how your application is assessed, and it is never sent to the
        automated review tool described below.
      </p>
      <p>
        <strong>
          We do not ask for your Social Security number or your driver&apos;s
          licence number on this website.
        </strong>{" "}
        Any identity information required by the separate background-check
        provider is handled through that provider&apos;s process. Additional
        information needed to prepare a lease is collected separately, not
        through this website&apos;s application form.
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
        summary of an application when you submit, unless you select
        &ldquo;Review my application manually instead.&rdquo; Selecting that
        option skips the automated tool entirely: none of your application
        information is sent to it, and a person reviews your application.
      </p>
      <p>
        <strong>Exactly what is sent to that tool:</strong> the monthly rent of
        the unit you applied for; your employer, how long you have been there,
        your stated monthly wages, and your previous employer; the same
        employment details for your spouse if you provided them; how long you
        have lived at your current address and what you pay there and paid
        previously; whether you supplied a current and previous landlord and a
        phone number for each; and your answer to the criminal-history question.
      </p>
      <p>
        <strong>What is deliberately withheld from it:</strong> your name,
        address, phone number and email; your spouse&apos;s name; how many people
        would live in the home and who they are; the names and phone numbers of
        the landlords you list; and any free-text notes. Your date of birth is
        never sent (and we no longer collect a driver&apos;s licence number at
        all).
      </p>
      <p>
        <strong>
          The score does not decide anything. A person at Blue Blaze Estates
          reviews every application and makes the final decision.
        </strong>{" "}
        You may choose manual review before submitting. If a summary has already
        been produced, you may also ask us to set it aside, assess your
        application manually, and explain a decision. Contact us using the
        details below and we will do so. Choosing manual review does not
        disadvantage your application.
      </p>
      <p>
        To produce that summary, the information listed above — and only that
        information — is sent to our service provider Anthropic, PBC, which
        operates the automated tool. It is used to generate your summary and is
        not used to train their models.
      </p>

      <h2>Separate background and credit checks</h2>
      <p>
        We use Tenant Background Search for rental background screening. Its
        privacy policy identifies TransUnion SmartMove, provided by TransUnion
        Rental Screening Solutions, Inc., as its credit-report service. The
        reports available depend on the screening package selected.
      </p>
      <p>
        This is separate from the automated application-summary tool described
        above. Submitting this website&apos;s application does not itself order a
        Tenant Background Search report. After the initial in-person contact,
        applicants receive a screening invitation and pay $41 for the background
        check. The provider describes a separate
        online authorization process sent to the applicant by email. Follow the
        provider&apos;s instructions for identity verification; do not send us
        your Social Security number through this website or by email.
      </p>
      <p>
        Information provided to the screening services is governed by their own
        privacy notices: <a
          href="https://www.tenantbackgroundsearch.com/privacy.cfm"
          rel="noopener noreferrer"
        >
          Tenant Background Search
        </a>{" "}
        and <a
          href="https://www.transunion.com/privacy/rental-screening-services"
          rel="noopener noreferrer"
        >
          TransUnion Rental Screening Solutions
        </a>. To dispute information in a report, use the reporting agency&apos;s
        contact information and dispute instructions supplied with that report.
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
          <strong>Tenant Background Search and TransUnion Rental Screening
          Solutions, Inc.</strong> — the separate background and credit screening
          process described above.
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
        We keep rental applications on file indefinitely, including applications
        that do not result in a tenancy, unless deletion is required by applicable
        law. You may request deletion using the contact details below. We review
        these requests in accordance with applicable law.
      </p>
      <p>
        <strong>Background and credit reports are handled separately.</strong>{" "}
        When we receive a screening report about you, we may keep a downloaded or
        printed copy of it. Those copies are kept apart from the application
        itself and are disposed of securely — shredded on paper, and erased so
        they cannot be recovered when held electronically. Our indefinite
        retention of applications does not apply to these reports.
      </p>

      <h2>How we protect it</h2>
      <p>
        Applications are transmitted over an encrypted HTTPS connection and
        stored in a database that is not publicly reachable. The admin dashboard
        is password protected and is not indexed by search engines. No system is
        perfectly secure, so we limit what a breach could expose in the first
        place: we do not collect Social Security or driver&apos;s licence
        numbers through this site at all.
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
        BLUE BLAZE MHP LLC
        <br />
        3309 Robbins Road #106
        <br />
        Springfield, Illinois 62704
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
