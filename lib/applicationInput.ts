import { applicationText, RequestError } from "./requestBody";

export const APPLICATION_TEXT_FIELDS = ["presentAddress", "townStateZip", "driversLicense", "birthDate", "employer", "employerAddress", "employerTownStateZip", "employerPhone", "employmentDuration", "monthlyWages", "previousEmployer", "spouseName", "spouseDriversLicense", "spouseBirthDate", "spouseEmployer", "spouseEmployerAddress", "spouseEmployerTownStateZip", "spouseEmployerPhone", "spouseEmploymentDuration", "spouseMonthlyWages", "spousePreviousEmployer", "occupantCount", "adultsResiding", "currentLandlord", "currentLandlordPhone", "currentTenancyDuration", "currentRentAmount", "previousLandlord", "previousLandlordPhone", "previousAddressRented", "previousRentAmount", "felonyHistory", "interest", "electronicSignature", "signatureDate"] as const;

export function parseApplication(body: Record<string, unknown>) {
  const applicantName = applicationText(body, "applicantName", true)!;
  const phone = applicationText(body, "phone", true)!;
  if (!/^[\d\s\-().+]{7,40}$/.test(phone)) throw new RequestError("Enter a valid phone number.");
  const fields = Object.fromEntries(APPLICATION_TEXT_FIELDS.map(key => [key, applicationText(body, key)])) as Record<typeof APPLICATION_TEXT_FIELDS[number], string | null>;
  if (!fields.electronicSignature) throw new RequestError("Signature is required.");
  if (fields.occupantCount && !/^[1-9]\d{0,2}$/.test(fields.occupantCount)) throw new RequestError("Enter a whole number of occupants.");
  if (body.manualReviewRequested !== undefined && typeof body.manualReviewRequested !== "boolean") throw new RequestError("Invalid review preference.");
  // Only allowlisted fields are returned. Legacy SSN/children fields and admin-only fields are ignored.
  return { ...fields, applicantName, phone, listingId: applicationText(body, "listingId"), manualReviewRequested: body.manualReviewRequested === true };
}
