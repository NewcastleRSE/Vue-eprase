// Container for common constants and methods relating to patient and scenario processing

// Tab name/title values for patient build
export const patientDataTabValues = {
  'profile': 'Profile',
  'allergy': 'Allergies',
  'comorbidity': 'Comorbidities',
  'diagnosis': 'Presenting Complaints',
  'prescription': 'Current Medication',
  'clinical_data': 'Clinical Data'
}

// Tab name/title values for practice mode
export const practiceTabValues = {
  'intro': 'Introduction',
  'patients': 'Patient entry',
  'scenarios': 'Scenarios'
}

// Response text for the different mitigation codes
// NOTE: this undesirably hard-codes the mitigation codes in order to associate them with labels - perhaps label text better stored in the database?
export const systemMitigationResponses = [
  { value: 'MT2', label: 'You were able to complete the prescription (includes followed order sentence) <span class="fw-bold">without any additional user or system input</span>' },
  { value: 'MT4', label: 'You were able to complete the prescription, <span class="fw-bold">but had to override components of the order sentence</span>' },
  { value: 'MT1', label: 'You were able to complete the prescription, <span class="fw-bold">with system/user intervention</span>' },
  { value: 'MT3', label: 'Prevented from prescribing' },
  { value: 'MT99', label: 'Medicine or formulary alternative not available in the system' },
]

// Tooltips explaining the possible system responses
export const systemResponseTooltips = [
  'You placed the order for the new medicine using your normal processes, which may have included the selection of a provided order sentence and did not receive any advice or information from the electronic prescribing system',
  'You placed the order for the new medicine but had to ignore, modify or override a provided order sentence to complete it',
  'You prescribed the medicine and received some system advice or information in relation to allergies, abnormal lab results, dosing, route, patient age, therapeutic duplication, monitoring, contraindication or something else, which required you to make a decision to modify the prescription, like adjusting doses or monitoring parameters, to mitigate risk without outright prevention.',
  'These are prescribing actions that should never occur, where it is clear cut with no additional prescriber decision point. The EP system blocks completion of the prescriptions entirely.',
  'Where the medicine presented in the test is not available in your system, the question will be passed over. This will be classed as an invalid test. It will not affect the overall mitigation results, which are calculated on the valid tests taken.'
]

// Mitigation matrix
// Done as <recorded_response> : { <expected_response1>: <mitigation_result1>, ... }
// Transcription of document posted on Slack eprase2 channel by Becky 18/08/2025
export const GOOD_MITIGATION = 'Good mitigation'
export const SOME_MITIGATION = 'Some mitigation'
export const OVER_MITIGATION = 'Over mitigation'
export const NO_MITIGATION = 'No mitigation'
export const INVALID_TEST = 'Invalid test'
export const MITIGATION_DESCRIPTIONS = [NO_MITIGATION, GOOD_MITIGATION, SOME_MITIGATION, OVER_MITIGATION, INVALID_TEST]
export const MITIGATION_MATRIX = {
  'MT2': { // Recorded response : You were able to complete the prescription without any additional user or system input
    'MT2': GOOD_MITIGATION,     // Expected response : No intervention
    'MT1': NO_MITIGATION,       // Expected response : User/system intervention
    'MT3': NO_MITIGATION        // Expected response : Prescribing prevented
  },
  'MT4': { // Recorded response : You were able to complete the prescription, but had to override components of the order sentence
    'MT2': OVER_MITIGATION,     // Expected response : No intervention
    'MT1': SOME_MITIGATION,     // Expected response : User/system intervention
    'MT3': SOME_MITIGATION      // Expected response : Prescribing prevented
  },
  'MT1': { // Recorded response : You were able to complete the prescription, with system/user intervention
    'MT2': OVER_MITIGATION,     // Expected response : No intervention
    'MT1': GOOD_MITIGATION,     // Expected response : User/system intervention
    'MT3': SOME_MITIGATION      // Expected response : Prescribing prevented
  },
  'MT3': { // Recorded response : Prevented from prescribing
    'MT2': OVER_MITIGATION,     // Expected response : No intervention
    'MT1': OVER_MITIGATION,     // Expected response : User/system intervention
    'MT3': GOOD_MITIGATION      // Expected response : Prescribing prevented
  },
  'MT99': { // Recorded response : Medicine or formulary alternative not available in the system
    'MT2': INVALID_TEST,        // Expected response : No intervention
    'MT1': INVALID_TEST,        // Expected response : User/system intervention
    'MT3': INVALID_TEST         // Expected response : Prescribing prevented
  }
}

// Is given patient a baby?
export function patientIsBaby(patient) {
  return patient.is_adult === false && (patient.age_days != null && patient.age_days != 0) || (patient.gestational_age != null && patient.gestational_age != 0)
}

// Output string formatter for age based on age_years / age_days / gestational_age
export function patientAgeString(patient) {
  let ageString = 'Unspecified'
  if (patient.age_years != null && patient.age_years != 0) {
    ageString = patient.age_years + ' years'
  } else if (patient.age_days != null && patient.age_days != 0) {
    ageString = patient.age_days + ' days'
  } else if (patient.gestational_age != null && patient.gestational_age != 0) {
    ageString = patient.gestational_age + ' weeks'
  }
  return ageString
}

// Caption for age based on the active field
export function patientAgeCaption(patient, uppercaseFirst = false) {
  const caption = (patient.gestational_age != null && patient.gestational_age != 0) ? 'gestational age' : 'age'
  return uppercaseFirst ? (caption.substring(0, 1).toUpperCase() + caption.substring(1)) : caption
}