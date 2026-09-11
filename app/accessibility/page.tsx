import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Accessibility — Blue Blaze Estates",
  description:
    "Blue Blaze Estates' commitment to keeping this website usable for everyone, and how to report a barrier.",
};

export default function AccessibilityPage() {
  return (
    <LegalPage title="Accessibility Statement" effectiveDate="September 10, 2026">
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
      <p>
        <strong>We do not claim full WCAG 2.1 AA conformance.</strong> The items
        below were checked by measuring the site as a browser actually renders
        it, not by an automated scanner alone. Automated checks cannot confirm
        conformance, and the outstanding work listed further down is real. We
        would rather tell you exactly what has been verified than make a blanket
        claim.
      </p>

      <h2>What we have verified</h2>
      <ul>
        <li>
          Every field on the rental application has a real, programmatically
          associated label — not just placeholder text. All 27 were checked.
        </li>
        <li>
          Validation errors are tied to their field, so a screen reader
          announces which field is wrong rather than relying on red colour. A
          failed submission announces how many fields need attention.
        </li>
        <li>
          Text, placeholder text, error messages, input borders and buttons were
          measured against WCAG ratios as rendered in a browser (4.5:1 for normal
          text, 3:1 for controls). Placeholder text was previously 2.63:1 and is
          now 7.56:1.
        </li>
        <li>
          A &ldquo;Skip to main content&rdquo; link appears on the first Tab, and
          activating it moves focus into the page content.
        </li>
        <li>
          The homepage photo slideshow does not move on its own. It starts
          paused, has a Play/Pause button, and stays paused for visitors whose
          device asks for reduced motion.
        </li>
        <li>
          Only the photo actually on screen is described to a screen reader; the
          others are hidden from it.
        </li>
        <li>
          The listing photo gallery opens as a proper dialog: focus moves into
          it, stays inside while it is open, Escape closes it, and focus returns
          to the button that opened it.
        </li>
        <li>
          Pages reflow without horizontal scrolling down to a 320-pixel-wide
          screen.
        </li>
        <li>
          Buttons and links say what they do, and icon-only controls carry
          accessible names.
        </li>
      </ul>

      <h2>Known limitations</h2>
      <p>
        We would rather list these than imply the work is finished:
      </p>
      <ul>
        <li>
          <strong>No screen reader audit has been completed.</strong> Our checks
          measured the underlying markup and colours; they are not a substitute
          for testing with JAWS, NVDA or VoiceOver, which we have not yet done.
        </li>
        <li>
          <strong>Browser zoom has not been tested directly.</strong> We
          confirmed the layout reflows when scaled to 200%, but not through a
          browser&apos;s own zoom control at every step.
        </li>
        <li>
          The owner-facing admin dashboard has had contrast and labelling fixes
          but no full accessibility audit.
        </li>
        <li>
          Any downloadable document we publish in future needs checking so it is
          a tagged, readable file rather than a flat scan. We do not currently
          publish any.
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
        We aim to respond within one week. If you cannot complete the rental
        application on this website for any
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
