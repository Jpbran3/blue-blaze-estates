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
  childrenResiding?: string | null;
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

const SYSTEM_PROMPT = `You are a tenant screening assistant for Blue Blaze Estates, a residential property company in Illinois. Evaluate the rental application below and return a score and summary. Follow these rules in exact order.

RULE 1 — FELONY CHECK (overrides all other rules):
If felonyHistory contains "yes" or describes any conviction, immediately return:
{"score": 1, "summary": "Automatic disqualification: felony conviction reported."}
Do not read or evaluate any other field.

RULE 2 — RENT-TO-INCOME RATIO (apply before scoring, heavy penalty):
The "Rent Price (monthly)" field is the monthly rent of the unit applied for.
Parse monthlyWages and spouseMonthlyWages (strip $ and commas, treat blank as 0).
totalIncome = monthlyWages + spouseMonthlyWages.
If totalIncome > 0:
  ratio = rentPrice / totalIncome
  If ratio > 0.33: deduct 3-4 points from the final score. Include in summary: "Rent of $X is Y% of stated income of $Z — exceeds the 33% threshold."
  If ratio <= 0.33: no penalty. Include in summary: "Rent-to-income ratio of Y% is within the acceptable range."
If totalIncome = 0 (no wages provided anywhere): deduct 2 points. Include in summary: "Income not disclosed — rent-to-income ratio cannot be verified."
If rentPrice is not provided or is 0: skip this rule entirely.

RULE 3 — EMPLOYMENT & INCOME STABILITY (40% of base score 2-10):
Strong: employer named + duration >= 1 year + wages stated.
Moderate: employer named but short or missing duration/wages.
Weak: no employer listed.
Boost: spouse income also present.

RULE 4 — RENTAL HISTORY (35% of base score):
Strong: current AND previous landlord with phone numbers.
Moderate: only one landlord provided.
Weak: no landlord information at all.

RULE 5 — HOUSEHOLD COMPOSITION (25% of base score):
Neutral: single occupant or standard family.
Slight negative: multiple unrelated adults listed.

SCORING:
Derive a base score 2-10 from Rules 3-5.
Subtract rent-to-income penalty from Rule 2. Minimum score after penalty is 2 (unless Rule 1 applies — felony is always 1).
Score 1 is reserved exclusively for Rule 1.

Score guide:
9-10: Excellent — strong income, good ratio, solid rental history, clean background
7-8:  Good — meets most criteria with minor gaps
5-6:  Fair — some concerns, worth a conversation
3-4:  Poor — significant gaps in income, bad ratio, or missing rental history
2:    Very poor — nearly no qualifying information provided
1:    Disqualified — felony reported

SUMMARY: 2-4 sentences. Always include the rent-to-income result with actual dollar figures. Include top positive and top concern. Never mention SSN, driver's license, or birth date.

OUTPUT: Respond ONLY with valid JSON — no markdown, no explanation, no preamble:
{"score": <integer 1-10>, "summary": "<string>"}`;

function buildUserMessage(
  app: ApplicationData,
  rentPrice?: number | null
): string {
  const fields: [string, string | null | undefined][] = [
    ["Applicant Name", app.applicantName],
    ["Present Address", app.presentAddress],
    ["Town/State/Zip", app.townStateZip],
    ["Phone", app.phone],
    ["Email", app.email],
    ["Rent Price (monthly)", rentPrice != null ? String(rentPrice) : null],
    ["Employer", app.employer],
    ["Employer Address", app.employerAddress],
    ["Employer Town/State/Zip", app.employerTownStateZip],
    ["Employer Phone", app.employerPhone],
    ["Employment Duration", app.employmentDuration],
    ["Monthly Wages", app.monthlyWages],
    ["Previous Employer", app.previousEmployer],
    ["Spouse Name", app.spouseName],
    ["Spouse Employer", app.spouseEmployer],
    ["Spouse Employer Address", app.spouseEmployerAddress],
    ["Spouse Employer Town/State/Zip", app.spouseEmployerTownStateZip],
    ["Spouse Employer Phone", app.spouseEmployerPhone],
    ["Spouse Employment Duration", app.spouseEmploymentDuration],
    ["Spouse Monthly Wages", app.spouseMonthlyWages],
    ["Spouse Previous Employer", app.spousePreviousEmployer],
    ["Children Residing", app.childrenResiding],
    ["Other Adults Residing", app.adultsResiding],
    ["Current Landlord", app.currentLandlord],
    ["Current Landlord Phone", app.currentLandlordPhone],
    ["Current Tenancy Duration", app.currentTenancyDuration],
    ["Current Rent Amount", app.currentRentAmount],
    ["Previous Landlord", app.previousLandlord],
    ["Previous Landlord Phone", app.previousLandlordPhone],
    ["Previous Address Rented", app.previousAddressRented],
    ["Previous Rent Amount", app.previousRentAmount],
    ["Felony History", app.felonyHistory],
    ["Interest/Notes", app.interest],
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
  console.log("screenTenant called");
  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log("apiKey present:", !!apiKey);

  if (!apiKey) {
    console.log("No API key — returning error");
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

    console.log("API response received, content length:", message.content.length);
    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    console.log("Raw API response:", raw);

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
