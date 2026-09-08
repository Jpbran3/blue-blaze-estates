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
<<<<<<< Updated upstream
        We use an automated tool to produce a preliminary score and written
        summary of each application. It runs automatically when you submit.
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
        the landlords you list; and any free-text notes. Your driver&apos;s
        licence number and date of birth are never sent.
      </p>
      <p>
        <strong>
          The score does not decide anything. A person at Blue Blaze Estates
          reviews every application and makes the final decision.
        </strong>{" "}
        Because the tool runs at the moment you submit, we cannot prevent it from
        producing a summary — but you may ask us to set that summary aside and
        assess your application manually, and to explain any decision. Contact us
        using the details below and we will do so.
      </p>
      <p>
        To produce that summary, the information listed above — and only that
        information — is sent to our service provider Anthropic, PBC, which
        operates the automated tool. It is used to generate your summary and is
        not used to train their models.
=======
        Unless you select “Manual review only,” this site sends application information to Anthropic to generate a preliminary score and summary. The information sent includes your name, contact and address details, employer and income information, spouse name and employment information if supplied, landlord and rental-history information, criminal-history response, the selected unit or notes, and the unit’s rent.
      </p>
      <p>
        Social Security numbers are not collected. Driver’s license numbers, birth dates, electronic signatures, occupant count, and other-adult names are not included in the structured information sent to the tool. Please do not put those details into other fields.
      </p>
      <p>
        The tool applies the property owner’s income, employment, rental-history, and criminal-history screening criteria. A reported felony is assigned the lowest preliminary score for individualized human review. The score is advisory and does not automatically approve or deny an application.
      </p>
      <p>
        Select <strong>Manual review only</strong> before submitting if you do not want your application sent to Anthropic. That preference is saved with the application and also prevents automatic screening when staff edit it. For an application already submitted, contact us about manual review, correction, or deletion; a later request cannot undo information already sent to a provider.
      </p>
      <p>
        Anthropic processes information to provide the screening service. Its processing and retention are governed by the service agreement and applicable provider policies. Contact us with questions about this processing.
>>>>>>> Stashed changes
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
        The website does not include advertising pixels, analytics integrations, or cross-site tracking scripts. An essential <code>admin_session</code> cookie keeps authorized staff signed in for up to seven days, unless they sign out sooner. Ordinary listing and application visitors do not need this cookie. We do not currently use non-essential tracking cookies that require a tracking preference control.
      </p>
      <p>
        To limit abusive requests, the site stores a hashed network identifier and temporary request counters. Expired counters are cleared during subsequent rate-limit checks after a one-day grace period. Hosting logs may contain additional technical information under the host’s retention settings.
      </p>

      <h2>How long we keep it</h2>
      <p>
        <em>
          [NEEDS OWNER INPUT: application-retention period, deletion process, and any legal recordkeeping exceptions.]
        </em>
      </p>

      <h2>How we protect it</h2>
      <p>
        Applications are transmitted over an encrypted HTTPS connection and
        stored in an access-controlled database. The admin dashboard
        is password protected and is not indexed by search engines. No system is
        perfectly secure, but we do not collect Social Security numbers through
        this site specifically to limit what a breach could expose.
      </p>
      <p>
        If a breach affecting personal information occurs, we will notify
        affected people and authorities as required by applicable law.
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
