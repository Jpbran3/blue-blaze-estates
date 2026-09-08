import Anthropic from "@anthropic-ai/sdk";

export interface ApplicationData {
  id?: string;
  applicantName?: string | null;
  presentAddress?: string | null;
  townStateZip?: string | null;
  phone?: string | null;
  email?: string | null;
  employer?: string | null;
  employerAddress?: string | null;
  employerTownStateZip?: string | null;
  employerPhone?: string | null;
  employmentDuration?: string | null;
  monthlyWages?: string | null;
  previousEmployer?: string | null;
  spouseName?: string | null;
  spouseEmployer?: string | null;
  spouseEmployerAddress?: string | null;
  spouseEmployerTownStateZip?: string | null;
  spouseEmployerPhone?: string | null;
  spouseEmploymentDuration?: string | null;
  spouseMonthlyWages?: string | null;
  spousePreviousEmployer?: string | null;
  /** @deprecated Never sent to the model — see the fair-housing note below. */
  childrenResiding?: string | null;
  occupantCount?: string | null;
  adultsResiding?: string | null;
  currentLandlord?: string | null;
  currentLandlordPhone?: string | null;
  currentTenancyDuration?: string | null;
  currentRentAmount?: string | null;
  previousLandlord?: string | null;
  previousLandlordPhone?: string | null;
  previousAddressRented?: string | null;
  previousRentAmount?: string | null;
  felonyHistory?: string | null;
  interest?: string | null;
  electronicSignature?: string | null;
  signatureDate?: string | null;
}

// NOTE ON FAIR HOUSING — read before changing this prompt.
//
// This score is advisory input for a human decision, never a decision itself.
// Two things are deliberately absent and must stay absent:
//
//   1. Household composition is NOT scored. Familial status is a protected
//      class under the Fair Housing Act and the Illinois Human Rights Act, so
//      occupant counts, children, and "unrelated adults" are not sent to the
//      model at all (see buildUserMessage) and carry no scoring weight.
//   2. There is no short-circuit. Every application is evaluated on all rules
//      regardless of what the felony field says.
//
// The felony rule below reflects the owner's stated policy: a reported felony
// lands the application at 1 so it surfaces at the bottom of the queue for
// human review. It is NOT an automatic denial, and the summary must say so.
// [NEEDS OWNER SIGN-OFF] — HUD guidance treats criminal-history screening
// without individualized assessment (nature, recency, relevance of the offense)
// as a disparate-impact risk. Scoring every felony 1 regardless of what it was
// or when it happened preserves most of that exposure even though the hard stop
// is gone. The owner should confirm this policy in writing.
const SYSTEM_PROMPT = `You are a tenant screening assistant for Blue Blaze Estates, a residential property company in Illinois. Evaluate the rental application below and return a preliminary score and summary.

Your output is ADVISORY ONLY. A person at Blue Blaze Estates reviews every application and makes the final decision. Nothing you return approves or denies anyone.

Evaluate every application against every rule below. Never stop early or skip fields.

RULE 1 — RENT-TO-INCOME RATIO:
The "Rent Price (monthly)" field is the monthly rent of the unit applied for.
Parse monthlyWages and spouseMonthlyWages (strip $ and commas, treat blank as 0).
totalIncome = monthlyWages + spouseMonthlyWages.
If totalIncome > 0:
  ratio = rentPrice / totalIncome
  If ratio > 0.33: deduct 3-4 points from the base score. Include in summary: "Rent of $X is Y% of stated income of $Z — exceeds the 33% threshold."
  If ratio <= 0.33: no penalty. Include in summary: "Rent-to-income ratio of Y% is within the acceptable range."
If totalIncome = 0 (no wages provided anywhere): deduct 2 points. Include in summary: "Income not disclosed — rent-to-income ratio cannot be verified."
If rentPrice is not provided or is 0: skip this rule entirely.

RULE 2 — EMPLOYMENT & INCOME STABILITY (roughly 55% of base score 2-10):
Strong: employer named + duration >= 1 year + wages stated.
Moderate: employer named but short or missing duration/wages.
Weak: no employer listed.
Boost: spouse income also present.

RULE 3 — RENTAL HISTORY (roughly 45% of base score):
The landlord fields are yes/no flags — the landlords' own names and phone numbers are withheld from you because they are third parties' personal data. Score only on whether a contactable reference was supplied.
Strong: current AND previous landlord provided, both with a phone.
Moderate: only one landlord provided, or landlords provided without phones.
Weak: no landlord information at all.

RULE 4 — CRIMINAL HISTORY:
Evaluate this AFTER completing Rules 1-3 — never let it stop the evaluation.
If felonyHistory contains "yes" or describes any conviction, set the final score to 1, but still report the full assessment from Rules 1-3 in your summary.
In that case the summary MUST state, verbatim as its final sentence: "A reported felony is flagged for individualized review by Blue Blaze Estates, not an automatic denial."
If felonyHistory is blank, "no", or does not describe a conviction, this rule changes nothing.

SCORING:
Derive a base score 2-10 from Rules 2-3.
Subtract the rent-to-income penalty from Rule 1. Minimum score after penalty is 2.
Apply Rule 4 last: a reported felony sets the score to 1 regardless of the above.

Score guide:
9-10: Excellent — strong income, good ratio, solid rental history
7-8:  Good — meets most criteria with minor gaps
5-6:  Fair — some concerns, worth a conversation
3-4:  Poor — significant gaps in income, bad ratio, or missing rental history
2:    Very poor — nearly no qualifying information provided
1:    Felony reported — flagged for individualized human review

SUMMARY: 2-4 sentences. Always include the rent-to-income result with actual dollar figures. Include the top positive and the top concern.

NEVER base any part of the score or summary on, or make any reference to, the following — doing so is unlawful housing discrimination: race, color, religion, sex, national origin, disability, familial status, age, marital status, number or presence of children, household size, sexual orientation, gender identity, military status, order of protection status, or source of income (including housing vouchers or public assistance). Do not infer any of these from names, addresses, or employers. Also never mention driver's license or birth date.

OUTPUT: Respond ONLY with valid JSON — no markdown, no explanation, no preamble:
{"score": <integer 1-10>, "summary": "<string>"}`;

function buildUserMessage(
  app: ApplicationData,
  rentPrice?: number | null
): string {
  // MINIMAL PAYLOAD — this list is the whole basis of the score, and the privacy
  // policy describes it to applicants. Keep the two in sync: if you add a field
  // here, update app/privacy-policy/page.tsx in the same change.
  //
  // Deliberately WITHHELD, and why:
  //   - Identity and contact (name, address, phone, email, spouse name): no
  //     scoring rule uses them, and a name or address is exactly the kind of
  //     signal a model could use to infer race, national origin, or familial
  //     status. Withholding them is what makes the system-prompt prohibition
  //     enforceable rather than aspirational.
  //   - Household composition (occupant count, other adults): familial status is
  //     a protected class. Kept in the dashboard for the owner's occupancy
  //     check, never sent for scoring.
  //   - Free-text notes ("Interest/Notes"): applicant-authored prose that can
  //     volunteer protected characteristics (disability, family, religion) with
  //     no scoring value.
  const fields: [string, string | null | undefined][] = [
    ["Rent Price (monthly)", rentPrice != null ? String(rentPrice) : null],
    // Employment & income — Rule 2
    ["Employer", app.employer],
    ["Employment Duration", app.employmentDuration],
    ["Monthly Wages", app.monthlyWages],
    ["Previous Employer", app.previousEmployer],
    ["Spouse Employer", app.spouseEmployer],
    ["Spouse Employment Duration", app.spouseEmploymentDuration],
    ["Spouse Monthly Wages", app.spouseMonthlyWages],
    ["Spouse Previous Employer", app.spousePreviousEmployer],
    // Rental history — Rule 3. Landlord phone presence is what the rule scores.
    ["Current Landlord Provided", app.currentLandlord ? "yes" : "no"],
    ["Current Landlord Phone Provided", app.currentLandlordPhone ? "yes" : "no"],
    ["Current Tenancy Duration", app.currentTenancyDuration],
    ["Current Rent Amount", app.currentRentAmount],
    ["Previous Landlord Provided", app.previousLandlord ? "yes" : "no"],
    ["Previous Landlord Phone Provided", app.previousLandlordPhone ? "yes" : "no"],
    ["Previous Rent Amount", app.previousRentAmount],
    // Criminal history — Rule 4. Disclosed in the privacy policy.
    ["Felony History", app.felonyHistory],
  ];

  const lines = fields.map(
    ([label, value]) => `${label}: ${value ?? "(not provided)"}`
  );
  return lines.join("\n");
}

export async function screenTenant(
  application: ApplicationData,
  rentPrice?: number | null
): Promise<{ score: number; summary: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is not set — skipping screening.");
    return { score: 0, summary: "Screening error — please review manually." };
  }

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildUserMessage(application, rentPrice),
        },
      ],
    });

    // Do NOT log `raw` — the summary contains the applicant's income figures
    // and other personal data, which would land in Vercel's runtime logs.
    const raw = message.content[0].type === "text" ? message.content[0].text : "";

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { score: 0, summary: "Screening error — please review manually." };
    }

    const parsed = JSON.parse(jsonMatch[0]) as { score: number; summary: string };
    if (
      typeof parsed.score !== "number" ||
      typeof parsed.summary !== "string"
    ) {
      return { score: 0, summary: "Screening error — please review manually." };
    }

    return { score: parsed.score, summary: parsed.summary };
  } catch (apiErr) {
    console.error("Anthropic API call failed:", apiErr);
    return { score: 0, summary: "Screening error — please review manually." };
  }
}
