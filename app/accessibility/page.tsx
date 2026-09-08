import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Accessibility — Blue Blaze Estates",
  description:
    "Blue Blaze Estates' commitment to keeping this website usable for everyone, and how to report a barrier.",
};

export default function AccessibilityPage() {
  return (
    <LegalPage title="Accessibility Statement" effectiveDate="September 7, 2026">
      <p>
        Blue Blaze Estates wants every person looking for a home to be able to
        use this website, including people who use screen readers, keyboard
        navigation, screen magnification, or voice control.
      </p>

      <h2>Our commitment</h2>
      <p>
        We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1
        at Level AA. We build accessibility into the site&apos;s own markup
        rather than layering a plugin or overlay on top of it.
      </p>

      <h2>What we have done</h2>
      <ul>
        <li>
          Every form field on our rental application has a real, programmatically
          associated label — not just placeholder text.
        </li>
        <li>
          The whole site can be operated by keyboard alone, and the element you
          are on always shows a visible focus outline.
        </li>
        <li>
          A &ldquo;Skip to main content&rdquo; link lets keyboard and screen
          reader users bypass the navigation.
        </li>
        <li>
          Text and interface colors are checked against WCAG contrast ratios
          (4.5:1 for normal text, 3:1 for large text and controls).
        </li>
        <li>
          Meaningful images carry descriptive alternative text; decorative
          images are hidden from screen readers.
        </li>
        <li>
          The homepage photo carousel stops advancing automatically for visitors
          whose device is set to reduce motion.
        </li>
        <li>
          Buttons and links are labeled with what they actually do, and
          icon-only controls carry accessible names.
        </li>
        <li>
          The site reflows without horizontal scrolling at 200% browser zoom.
        </li>
      </ul>

      <h2>Known limitations</h2>
      <p>
        We are honest about what is not finished. We are currently working on:
      </p>
      <ul>
        <li>
          A full audit with assistive technology on the photo gallery and the
          longer application form.
        </li>
        <li>
          Reviewing any downloadable document we publish so it is a tagged,
          readable file rather than a flat scan.
        </li>
      </ul>

      <h2>Tell us about a barrier</h2>
      <p>
        If any part of this site is difficult or impossible for you to use, we
        want to hear about it and we will fix it. Please tell us the page and
        what happened:
      </p>
      <p>
        Phone: <a href="tel:6189427624">618-942-7624</a>
        <br />
        Email:{" "}
        <a href="mailto:blueblazeestates@gmail.com">
          blueblazeestates@gmail.com
        </a>
      </p>
      <p>
        We aim to respond within{" "}
        <em>[NEEDS OWNER INPUT: response commitment — e.g. &ldquo;two business
        days&rdquo;]</em>
        . If you cannot complete the rental application on this website for any
        reason, call us and we will take your application over the phone or in
        person. You will not be disadvantaged for applying that way.
      </p>

      <h2>Requesting an accommodation</h2>
      <p>
        Separately from this website, if you have a disability and need a
        reasonable accommodation or modification in order to apply for or live
        in one of our homes, contact us using the details above. We will work
        with you as required by the Fair Housing Act and the Illinois Human
        Rights Act.
      </p>
    </LegalPage>
  );
}
