# Adverse action runbook — consumer reports used in tenant screening

**Status: standard first pass. NOT legal advice.** This document was assembled from the
FTC's published guidance for landlords
([Using Consumer Reports: What Landlords Need to Know](https://www.ftc.gov/business-guidance/resources/using-consumer-reports-what-landlords-need-know)).
It is a generic operational template, not advice about BLUE BLAZE MHP LLC's specific
obligations, and it has not been reviewed by a lawyer. **Have counsel review this runbook
and the notice templates before the first notice is sent.** Illinois state and local
landlord–tenant and fair-housing rules may add requirements this document does not cover.

## Why this exists

Blue Blaze obtains consumer reports on rental applicants through Tenant Background Search,
which uses TransUnion SmartMove / TransUnion Rental Screening Solutions for credit data.
The applicant pays $41. See `SCREENING-PROVIDER-RESEARCH.md` in the repository root for
what is sourced versus unconfirmed about that arrangement.

Under the FCRA, a landlord who takes an unfavorable action against an applicant or tenant
**based even partly on a consumer report** must give that person an adverse action notice.
**Blue Blaze sends this notice itself** — BLUE BLAZE MHP LLC notifies the applicant
directly; the screening vendor does not do it on Blue Blaze's behalf. Blue Blaze currently
has no documented process for this. This runbook is the first pass at one.

---

## What to confirm before first use

1. **The CRA's exact notice address and telephone number.** This is the one piece of the
   notice template that cannot be completed from anything in this repository, and it is the
   item most likely to be gotten wrong. It must come from Blue Blaze's Tenant Background
   Search account documentation or from the report itself — **not** from a web search and
   **not** a general TransUnion corporate address. Tenant Background Search, TransUnion
   Rental Screening Solutions, and the provider's other listed data sources (CoreLogic,
   BDS) are different entities with different contact points, and a single report may
   involve more than one. An address that cannot service a dispute or a free-report request
   defeats the purpose of the notice. See Part 2 for the exact question to ask the vendor.
2. **Whether a credit score was used in the decision.** If yes, the score disclosure in
   Part 6 is also required, and you need the score, its source, the date it was created,
   the score range for that model, and the key adverse factors — all taken from the report.
3. **How the notice reaches the applicant.** The website application does not collect an
   email address, so an applicant's only recorded contact details may be a phone number and
   whatever address was given. Decide the default channel and how the mailing address is
   captured. Written notice is strongly preferred — see item 5.
4. **Report-copy handling.** Blue Blaze downloads or prints report copies and keeps them, so
   Part 7 applies in full. Fill in its storage, access, retention and disposal fields once,
   then follow them.
5. **Whether any deadline applies, and whether non-written delivery will ever be used.** The
   FTC landlord guidance does not state a specific number of days for rental adverse action
   notices; ask counsel whether any federal, Illinois or local deadline applies, and until
   then send promptly. The FCRA permits adverse action notices to be delivered orally, in
   writing, or electronically; this runbook standardizes on written notice because it is the
   only version that produces a record. Confirm with counsel before relying on another
   channel.
6. **The name and title of the person who signs the notice** (Part 5 template).

---

## Part 1 — When a notice is required

A notice is required for **any action unfavorable to the interests of a rental applicant or
tenant** that is based even partly on a consumer report. Per the FTC guidance, that
includes:

| Action taken | Notice required? |
| --- | --- |
| Denying the application | Yes |
| Requiring a co-signer on the lease | Yes |
| Requiring a deposit that would not be required of another applicant | Yes |
| Requiring a larger deposit than might be required of another applicant | Yes |
| Charging a higher rent than another applicant | Yes |
| Approving with no unfavorable change in terms | No |

Two points that are easy to get wrong:

- **"Based even partly" is the test.** The FTC is explicit that the notice is required
  *even if information in the consumer report wasn't the primary reason for the decision*.
  If the report was one input among several — income, landlord references, the stated
  felony-history answer, the automated summary — the notice is still required. "We would
  have denied them anyway" is not an exception.
- **A website privacy policy is not a notice.** General disclosures on
  blueblazeestates.com do not discharge this duty. The notice is applicant-specific and
  must be delivered to that applicant.

Not covered by this runbook: unfavorable decisions made with **no** consumer report
involved at all (for example, a denial based purely on an in-person conversation). Those do
not trigger an FCRA adverse action notice, but document the actual basis anyway.

## Part 2 — Getting the CRA contact details (do this once, before the first notice)

Every notice must name the consumer reporting agency that supplied the report, with its
address and phone number. Obtain this from Tenant Background Search in writing and keep the
answer on file. Ask exactly this:

> For the tenant screening reports supplied on our account, which consumer reporting
> agency is the furnisher of each report we receive — including the credit, criminal and
> eviction components, if they come from different agencies? For each one, what is the
> mailing address and telephone number that we must print on an FCRA adverse action notice
> so that an applicant can request a free copy of the report and dispute its accuracy? If
> your platform supplies an adverse action notice containing those details, please send us
> a sample.

Record the answer here once received:

```
[NEEDS OWNER INPUT: CRA name exactly as it should appear on the notice]
[NEEDS OWNER INPUT: CRA mailing address for disputes and free-report requests]
[NEEDS OWNER INPUT: CRA telephone number]
[NEEDS OWNER INPUT: if more than one agency supplies components, list each with its own
address and phone, and note which report component each one furnished]
```

Re-verify this against each report before sending a notice; if a report names a different
furnisher, use the one on that report.

## Part 3 — Before the report is pulled

From the same FTC guidance, two upstream obligations:

- **Permissible purpose.** You may obtain a consumer report only if you have a permissible
  purpose, and you must certify to the company supplying the report that you will use it
  **only for housing purposes**. It may not be used for any other purpose.
- Treat that certification as binding on internal use too: do not reuse a screening report
  for an unrelated decision.

`[NEEDS OWNER INPUT: confirm where the housing-purpose certification was made to Tenant
Background Search — account signup, per-order, or a signed agreement — and keep a copy on
file.]`

## Part 4 — Runbook: steps when an unfavorable decision is made

1. **Record the decision and its basis** before sending anything: date, applicant name, the
   action taken (denial / co-signer / higher deposit / higher rent), and which inputs the
   decision relied on. Note explicitly whether a consumer report was one of them.
2. **If no consumer report informed the decision**, stop — no FCRA notice is required. Keep
   the record from step 1.
3. **If a consumer report informed the decision even partly**, continue.
4. **Confirm the CRA named on the report actually used** against the details recorded in
   Part 2.
5. **Determine whether a credit score was used.** If yes, gather the score, its source, the
   date it was created, the range of scores under that model, and the key factors that
   adversely affected it.
6. **Fill in the template in Part 5** (and the addendum in Part 6 if a score was used). Do
   not add reasons or explanations that are not accurate, and do not attribute the decision
   to the CRA.
7. **Send it yourself.** Blue Blaze sends the notice directly to the applicant; do not
   assume the screening vendor has sent anything on your behalf. Written notice by mail is
   the default. Record the date sent and the channel used.
8. **File a copy** of the notice with the decision record from step 1.
9. **Diary the 60-day window.** If the applicant asks the CRA for a free copy of the report
   within 60 days of the notice, that request goes to the CRA, not to Blue Blaze. Be ready
   to point the applicant to the CRA's contact details rather than handing over your copy.
10. **Schedule disposal** of the report copies per Part 7.

## Part 5 — Required contents, and the notice template

The notice must contain all of the following:

- the **name, address, and phone number of the CRA** that supplied the report;
- a statement that the **CRA did not make the decision** to take the unfavorable action and
  **cannot give specific reasons** for it;
- a notice of the person's **right to dispute the accuracy or completeness** of any
  information the CRA furnished; and
- a notice of the person's right to **get a free report from the CRA** if they ask for it
  **within 60 days**.

### Template — adverse action notice

> Copy this into a letter. Replace every `[...]` placeholder. Delete nothing from the four
> required elements.

```
BLUE BLAZE MHP LLC
3309 Robbins Road #106
Springfield, Illinois 62704
Phone: 618-942-7624
Email: blueblazeestates@gmail.com

[Date]

[Applicant name]
[Applicant address]

Re: Your rental application [for [unit / property], ] dated [application date]

Dear [Applicant name]:

Thank you for your interest in renting from Blue Blaze Estates. We are writing to let you
know that we have [choose one and delete the others:
  - declined your rental application.
  - approved your application only on the condition that you provide a co-signer on the
    lease.
  - approved your application with a security deposit of $[amount], which is higher than
    the deposit we would otherwise require.
  - approved your application at a rent of $[amount] per month, which is higher than the
    rent we would otherwise charge.]

In making this decision, we used information from a consumer report about you. The
consumer reporting agency that supplied that report is:

    [NEEDS OWNER INPUT: CRA name exactly as identified on the report — see Part 2]
    [NEEDS OWNER INPUT: CRA mailing address for notices, disputes and report requests]
    [NEEDS OWNER INPUT: CRA telephone number]

The consumer reporting agency named above did not make the decision to take this action
and is not able to give you the specific reasons for it.

You have the right to dispute the accuracy or completeness of any information the consumer
reporting agency furnished about you. You also have the right to obtain a free copy of your
consumer report from that agency if you request it within 60 days of receiving this notice.
Contact the agency at the address or telephone number above to request your report or to
dispute information in it.

[Include only if accurate and if you choose to state reasons — the FCRA does not require
you to list your own reasons in this notice, and anything you write here must be correct:
The information we relied on related to: [brief, factual description].]

If you have questions about this letter, you can reach us at the phone number or email
address above.

Sincerely,

[NEEDS OWNER INPUT: name and title of the person signing for BLUE BLAZE MHP LLC]
BLUE BLAZE MHP LLC
```

Do **not** include in the notice: the applicant's Social Security number, a copy of the
consumer report itself, or any claim that the CRA denied the application.

## Part 6 — Additional disclosures if a credit score was used

If a credit score influenced the decision, the FTC guidance requires **written or
electronic** notice that additionally includes:

- the **credit score**;
- a **description of the score** — its **source**, the **date it was created**, and the
  **range of scores** under that credit model; and
- the **key factors that adversely affected** the credit score.

All of these come from the report; do not reconstruct or estimate them.

### Template — credit score addendum

```
Credit score information

Because a credit score was used in the decision described above, we are required to give
you the following information:

Your credit score:            [NEEDS OWNER INPUT: score as shown on the report]
Source of the score:          [NEEDS OWNER INPUT: entity that provided the score, per the report]
Date the score was created:   [NEEDS OWNER INPUT: date shown on the report]
Range of possible scores
under this model:             [NEEDS OWNER INPUT: e.g. low to high, exactly as stated by the model]

Key factors that adversely affected your credit score:
  1. [NEEDS OWNER INPUT: factor as stated on the report]
  2. [NEEDS OWNER INPUT: factor as stated on the report]
  3. [NEEDS OWNER INPUT: factor as stated on the report]
  4. [NEEDS OWNER INPUT: factor as stated on the report]

A credit score is a number that reflects information in a consumer report. Scores can
change when the information in the report changes.
```

`[NEEDS OWNER INPUT: confirm whether the Blue Blaze screening package returns a credit
score at all, and whether the score is actually used in decisions. If no score is returned
or used, this addendum is not required — record that determination rather than leaving it
ambiguous.]`

## Part 7 — Storing and securely disposing of report copies

**This section applies in full: Blue Blaze downloads or prints consumer report copies and
keeps them.** That is a deliberate choice with real obligations attached — a landlord who
only viewed reports on the vendor's website would have far less to manage here.

### The disposal duty

When you are done using a consumer report, you must **securely dispose of the report and any
information you gathered from it**. Per the FTC guidance, that means:

- **Paper copies:** burn, pulverize, or shred them. Ordinary trash or recycling is not
  secure disposal, and neither is tearing a page in half.
- **Electronic copies:** dispose of the information so that it **cannot be read or
  reconstructed**. Moving a PDF to the trash is not enough if it remains recoverable —
  empty the trash, and for a whole device use a wipe or physical destruction rather than a
  simple delete.
- **Derived information counts.** The duty covers notes, spreadsheets, screenshots,
  summaries and emails that contain information taken from the report — not only the report
  PDF or printout itself.
- **Every copy counts.** A single report can exist as a printout, a download, an email
  attachment, a file in sent mail, a cloud-sync copy, a copy on a phone, and a backup.
  Disposal means all of them.

### Retention: a recommendation

**Recommendation: set a definite retention period for consumer report copies rather than
keeping them indefinitely.** Every copy retained is a copy that can be lost, copied, or
breached, and the disposal duty above attaches for as long as you hold it. A common approach
is to keep the report only as long as it is needed for the decision and any follow-on
dispute, then dispose of it on a fixed schedule — with the adverse action notice and the
decision record kept separately, since those are the documents that show the process was
followed.

**Important distinction, do not collapse these two:**

| | Rental applications (this website's database) | Consumer report copies |
| --- | --- | --- |
| Retention | Indefinite, by the owner's decision | **Not yet set — see below** |
| Basis | Owner's business choice | FCRA secure-disposal duty applies |

The owner's choice to retain *applications* indefinitely is the owner's call and is reflected
in the privacy policy. **That decision does not extend to consumer reports.** Reports carry
their own FCRA disposal obligations, and the application retention policy must not be
applied to them by default. Decide the report retention period separately and deliberately.

Also: do not paste report contents into the application record in this website's database.
That database is retained indefinitely and is not an appropriate home for consumer report
data — doing so would silently merge the two rows of the table above.

### Fields to fill in once, then follow

```
Where report copies are stored
  Paper copies:        [NEEDS OWNER INPUT: physical location, e.g. which file and whether it locks]
  Electronic copies:   [NEEDS OWNER INPUT: device, folder, email account, and any cloud or
                        backup location the file reaches]

Who may access them
  [NEEDS OWNER INPUT: named people or roles with access to the copies above, and whether
   anyone outside the business can reach them]

Retention period for report copies
  [NEEDS OWNER INPUT: how long a report copy is kept after the rental decision — set a
   definite period; see the recommendation above. This is a separate decision from the
   indefinite retention of applications.]

Disposal trigger and practice
  Trigger:             [NEEDS OWNER INPUT: what starts disposal — e.g. retention period
                        elapsed, decision final, applicant moved in or was declined]
  Paper method:        [NEEDS OWNER INPUT: shred / burn / pulverize, and who does it]
  Electronic method:   [NEEDS OWNER INPUT: how files and email copies are destroyed so they
                        cannot be reconstructed, including backups]
  Who is responsible:  [NEEDS OWNER INPUT: named person]
```

## Part 8 — Common mistakes to avoid

- Sending no notice because the report "wasn't the main reason." The test is whether it was
  a reason at all.
- Sending no notice for a conditional approval. A co-signer requirement, a higher deposit,
  or a higher rent is an adverse action.
- Assuming the screening vendor sent the notice. Blue Blaze sends it.
- Naming the wrong agency, or naming a convenient corporate address instead of the notice
  address for the report actually used.
- Telling the applicant the screening company made the decision. The notice must say the
  opposite.
- Omitting the 60-day free-report right or the dispute right.
- Relying on the website privacy policy instead of an applicant-specific notice.
- Keeping report copies indefinitely by default because applications are kept indefinitely.
- Shredding the printout but leaving the downloaded PDF and the email attachment in place.
- Handling the same facts inconsistently between applicants. Apply the same criteria to
  everyone; inconsistency is how a fair-housing claim starts.

## Part 9 — Open placeholders, collected

Every `[NEEDS OWNER INPUT: ...]` in this document, in one list:

1. **CRA name, notice mailing address, and telephone number** for the reports supplied on
   Blue Blaze's account — obtained from the vendor or the report, never guessed (Parts 2
   and 5). This is the blocking item.
2. Name and title of the person signing the notice for BLUE BLAZE MHP LLC (Part 5).
3. Whether the screening package returns a credit score, whether it is used, and the score
   details and adverse factors if so (Part 6).
4. Report-copy storage locations, who may access them, the retention period, and the
   disposal trigger, methods and responsible person (Part 7).
5. Where the housing-purpose certification to the provider was made, and a filed copy
   (Part 3).
6. Delivery channel for the notice and how the applicant's mailing address is captured,
   given that the website application collects no email address
   ("What to confirm", item 3).
7. Whether any federal, Illinois, or local deadline applies to sending the notice, and
   whether non-written delivery will ever be used ("What to confirm", item 5 — questions
   for counsel).

Resolved and therefore **not** placeholders: Blue Blaze sends the notice itself (not the
vendor); the business name, mailing address, phone and email in the letterhead; and the
fact that report copies are downloaded or printed and kept.

---

**Source for the requirements above:** FTC,
[Using Consumer Reports: What Landlords Need to Know](https://www.ftc.gov/business-guidance/resources/using-consumer-reports-what-landlords-need-know).
Statutory and regulatory citations have deliberately been left out of this draft rather than
guessed; counsel should supply them and confirm that each requirement above is stated
correctly for Blue Blaze's situation before any notice is sent.

*This file is excluded from deployment via `.vercelignore`. It is internal operational
documentation and is not published on blueblazeestates.com.*
