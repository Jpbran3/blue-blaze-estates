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

## Marketing to voucher holders without changing screening — 2026-09-11

The owner asked for the site to appeal to renters using housing vouchers, and
that copy is now live: hero, homepage intro, a feature card, the footer, and the
page title and meta description.

**The conflict was raised and the owner chose to proceed without changing the
screening rules.** Recorded here because it is not self-evident from the code.

`lib/screenTenant.ts` rewards a named employer and stated wages, and penalises
their absence ("Weak: no employer listed", and a 2-point deduction when no
wages are given). A renter whose income is a housing subsidy plus benefits can
trigger those penalties *because of the source of their income*. Illinois
protects source of income in housing.

Marketing to that group while running those criteria is a different risk from
either on its own: the advertising establishes that the applicants were
deliberately solicited, and the screening then applies criteria that can
disadvantage them.

The fix discussed and declined for now was narrow — count verified income from
any lawful source (wages, vouchers, benefits, self-employment, support
payments) instead of employment specifically, leaving the 33% rent-to-income
threshold, the weightings and the felony rule untouched. It remains available.

Note also that the copy avoids naming the federal program at the owner's
request. That is a presentational choice, not a legal one, and it costs the
search traffic from people looking for that program by name.

---

## Other decisions

| Decision | Date | Note |
|---|---|---|
| Social Security numbers not collected | 2026-09-07 | Removed from form, API, admin and print view. Legacy columns retained, never written. |
| Driver's licence numbers not collected | 2026-09-09 | Same treatment. |
| Date of birth retained | 2026-09-09 | Sole purpose: confirming the applicant is 18. Never sent to the screening model. |
| Under-18 dates: warn, do not block | 2026-09-11 | The form shows a warning but still accepts the submission. A minor's application can therefore still be stored. |
| ~~Applications retained indefinitely~~ **superseded** | 2026-09-10 | Replaced by the row below. |
| Applications kept until the unit is filled | 2026-09-11 | Owner revised the retention period. A shorter, defensible period — better than indefinite. Assumption made in the privacy policy wording: an application that **leads to a tenancy** is kept as part of the tenant file for the duration of the tenancy. Confirm that reading. Does **not** extend to consumer reports, which carry separate FCRA disposal duties. |
| Consumer report copies downloaded and kept | 2026-09-10 | Triggers the FTC Disposal Rule. See `docs/FCRA-ADVERSE-ACTION.md`. |
| Report copies kept until tenant leaves the property | 2026-09-11 | Owner-confirmed for tenants. **Does not cover denied applicants**, who never become tenants — that disposal trigger is still undecided and is the larger group. |
| Screening split confirmed | 2026-09-11 | Credit via TransUnion; criminal and eviction supplied by Tenant Background Search itself. A notice may need to name both agencies. |
| Blue Blaze sends adverse-action notices | 2026-09-10 | Not the vendor. The notice template still needs the CRA's exact notice address and phone from the Tenant Background Search account. |

---

## Still outstanding

- **The CRA's notice address and phone — partially resolved 2026-09-11.** The
  published contact for the credit component (TransUnion Rental Screening
  Solutions, P.O. Box 800, Woodlyn PA 19094, 800-230-9376 option 4) is confirmed
  against the CFPB's list of consumer reporting companies and TransUnion's own
  dispute page, and is now filled into the notice template. Still outstanding:
  written confirmation from Tenant Background Search that this is correct for
  this account, and the furnisher details for the criminal and eviction
  components, which may come from a different agency (their site lists CoreLogic
  and BDS among its sources). Always check the specific report before sending.
- **Tenant Background Search's mailing address.** Their phone (1-844-205-0177) and
  support email are published; no mailing address is. An adverse action notice must
  carry name, address AND phone, so this blocks any criminal- or eviction-based denial.
  One question to them settles it.
- **A disposal trigger for denied applicants' report copies.** "Until the tenant leaves"
  does not apply to someone who never became a tenant.
- **Which screening package** is ordered, and whether a credit score is
  returned and used (score disclosures are required if so).
- **Where report copies are stored, who can access them, and the disposal
  trigger.** Fill-once fields in `docs/FCRA-ADVERSE-ACTION.md`.
- **Response-time claim.** "Within one business day" was softened to "as soon
  as we can" because it was unsubstantiated. Restore the specific wording only
  if the owner confirms they can meet it.
