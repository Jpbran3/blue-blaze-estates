# Owner decisions on file

A record of choices the owner made during the compliance work, so anyone
maintaining this site knows what was decided deliberately rather than
overlooked. Dates are when the decision was given.

**This file records decisions. It is not legal advice, and owner approval is
not legal clearance.** Where an item is marked as proceeding without attorney
review, that means the risk was explained and accepted — not that it was
assessed by a lawyer and found compliant.

---

## Proceeding without attorney review — 2026-09-10

Three items were flagged `[NEEDS ATTORNEY REVIEW]`. The owner elected to
proceed without engaging counsel. The in-code flags are deliberately left in
place so the risk stays visible to future maintainers.

| Item | Where | Status |
|---|---|---|
| Dispute-resolution terms | `app/terms-and-conditions/page.tsx` | No dispute terms are in effect. The section says so plainly rather than asserting a venue or arbitration clause. Lower risk than a badly drafted clause. |
| Rights in the AI-generated logo | `app/terms-and-conditions/page.tsx` | Stated as provenance, not as a copyright claim. US Copyright Office guidance is that AI-generated material without sufficient human authorship is not registrable, so an exclusive copyright claim may not hold. Trademark rights can still arise from use. Counsel should advise before asserting ownership, registering the mark, or sending a takedown. |
| Felony and income screening criteria | `lib/screenTenant.ts` | **The two items with genuine exposure.** See below. |

### On the screening criteria specifically

These were explained and accepted, and they remain the largest legal risk in
the project:

- **Criminal history.** A reported felony sets the preliminary score to 1
  regardless of the offence, its recency, or its relevance to tenancy. HUD
  guidance treats criminal-history screening without individualised assessment
  as a disparate-impact risk under the Fair Housing Act. The automatic
  short-circuit was removed and the result is surfaced for human review rather
  than as an automatic denial, but scoring every felony at 1 preserves most of
  the underlying exposure.
- **Income.** The rules reward having an employer and stated wages and penalise
  their absence. Illinois protects **source of income** in housing, so criteria
  built around wage employment may disadvantage applicants using housing
  vouchers, benefits, or other lawful non-wage income.

Thresholds were preserved exactly as the owner asked and are locked by tests in
`tests/screening.test.ts` so they cannot drift unnoticed.

---

## Other decisions

| Decision | Date | Note |
|---|---|---|
| Social Security numbers not collected | 2026-09-07 | Removed from form, API, admin and print view. Legacy columns retained, never written. |
| Driver's licence numbers not collected | 2026-09-09 | Same treatment. |
| Date of birth retained | 2026-09-09 | Sole purpose: confirming the applicant is 18. Never sent to the screening model. |
| Under-18 dates: warn, do not block | 2026-09-11 | The form shows a warning but still accepts the submission. A minor's application can therefore still be stored. |
| Applications retained indefinitely | 2026-09-10 | Owner's choice, stated plainly in the privacy policy with a deletion-request path. Does **not** extend to consumer reports, which carry separate FCRA disposal duties. |
| Consumer report copies downloaded and kept | 2026-09-10 | Triggers the FTC Disposal Rule. See `docs/FCRA-ADVERSE-ACTION.md`. |
| Blue Blaze sends adverse-action notices | 2026-09-10 | Not the vendor. The notice template still needs the CRA's exact notice address and phone from the Tenant Background Search account. |

---

## Still outstanding

- **The CRA's notice address and phone.** Blocking for the adverse-action
  notice. Must come from the Tenant Background Search account documentation —
  a general TransUnion address is not a substitute.
- **Which screening package** is ordered, and whether a credit score is
  returned and used (score disclosures are required if so).
- **Where report copies are stored, who can access them, and the disposal
  trigger.** Fill-once fields in `docs/FCRA-ADVERSE-ACTION.md`.
- **Whether "the company" that communicates acceptance or denial** means
  BLUE BLAZE MHP LLC or Tenant Background Search. This determines who is
  operationally responsible for the adverse-action notice.
- **Response-time claim.** "Within one business day" was softened to "as soon
  as we can" because it was unsubstantiated. Restore the specific wording only
  if the owner confirms they can meet it.
