# Screening provider research

Researched September 10, 2026. Owner confirms use of Tenant Background Search and TransUnion. Public sources establish vendor capabilities, not this property's account configuration.

## Verified sources

- [Tenant Background Search privacy policy](https://www.tenantbackgroundsearch.com/privacy.cfm): identifies TransUnion SmartMove / TransUnion Rental Screening Solutions as the credit-report service; describes sharing identifying information for verification and report access.
- [Provider FAQ](https://www.tenantbackgroundsearch.com/faq.aspx): describes an emailed applicant authorization link, landlord-paid and applicant-paid options, and reports viewable for 30 days. The viewing window is not a confirmed data-deletion period.
- [Packages](https://www.tenantbackgroundsearch.com/): offers criminal screening, packages with credit, packages adding eviction records, and an assets/income option. Do not assume Blue Blaze orders all categories or quote an applicant fee until the owner's package is confirmed.
- [About the provider](https://www.tenantbackgroundsearch.com/aboutus.aspx): lists TransUnion, CoreLogic, BDS and other data sources. Do not claim every background record comes solely from TransUnion.
- [Provider contact page](https://www.tenantbackgroundsearch.com/contactUs.aspx): contact form and weekday 9 a.m.–5 p.m. Central support hours. This page does not establish the correct CRA mailing address and telephone number for a particular adverse-action notice.
- [TransUnion Rental Screening Solutions privacy notice](https://www.transunion.com/privacy/rental-screening-services): identifies the company as TransUnion Rental Screening Solutions, Inc. and describes its own information practices. Blue Blaze's retention decision does not determine this vendor's retention.

## Operational requirements to finish

[FTC landlord guidance](https://www.ftc.gov/business-guidance/resources/using-consumer-reports-what-landlords-need-know) explains that unfavorable decisions based even partly on a consumer report require an adverse-action notice. Examples include denial, higher rent/deposit, or requiring a co-signer. The notice identifies the supplying CRA with its address and phone, explains that the CRA did not make the rental decision, and describes dispute rights and a free report requested within 60 days. Use of a credit score adds written/electronic score disclosures. Reports must be securely disposed of when no longer used.

Before finalizing an operational notice/template, confirm the actual reporting agency and its notice contact details from the report/account documentation. Do not guess that a general TransUnion contact covers every report. Website disclosures alone do not deliver an applicant-specific notice.

## Owner-confirmed workflow

- The applicant pays $41 for screening. Use this owner-confirmed fee; do not substitute a publicly advertised package price or infer a package from the amount.
- The screening invitation is sent after the initial in-person contact. No website email field has been added.
- The owner says "the company" communicates acceptance or denial. Clarification is pending on whether this means BLUE BLAZE MHP LLC or Tenant Background Search. Do not assign this responsibility in public copy until clarified.

## Account-specific facts still needed

- The exact package/report categories Blue Blaze orders; the provider name alone does not identify a package.
- How invitation contact details are collected after the initial in-person contact (the current website application does not collect email).
- Whether reports are downloaded or printed, where those copies are stored, who can access them, and their retention/disposal practice. The owner specified indefinite retention for applications; this does not establish vendor/report-copy retention.
- Who sends adverse-action notices and whether the vendor account provides the complete notice for the report used.

## Local implementation

Added the confirmed provider identity and privacy links to the website privacy policy. Distinguished provider screening from the existing Anthropic application summary. No provider API integration was found in app, lib, or prisma; website submission does not order the external report. Existing screening rules were not changed. No background report was ordered, applicant contacted, or deployment performed.
