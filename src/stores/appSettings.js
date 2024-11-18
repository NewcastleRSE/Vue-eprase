import { defineStore } from 'pinia'

export const appSettingsStore = defineStore('appSettings', {
  state: () => {
    return {
      version: '3.0.0',
      debugMode: false,
      appOpen: true,
      year: new Date().getFullYear(),     
      passwordMinLength: 6,
      passwordMaxLength: 50,
      assessmentNumPatients: 15,
      numConfigError: 5,
      numPrescriptions: 45,
      epSystemOptions: [
        { value: 'Altera (Sunrise, Allscripts)', text: 'Altera (Sunrise, Allscripts)' },
        { value: 'Better', text: 'Better' },
        { value: 'Cerner (Oracle)', text: 'Cerner (Oracle)' },
        { value: 'CIS Chemocare', text: 'CIS Chemocare' },
        { value: 'Civica', text: 'Civica' },
        { value: 'CMM System C (JAC, Wellsky)', text: 'CMM System C (JAC, Wellsky)' },
        { value: 'Dedalus', text: 'Dedalus' },
        { value: 'EMIS', text: 'EMIS' },
        { value: 'EPIC', text: 'EPIC' },
        { value: 'InterSystems', text: 'InterSystems' },
        { value: 'Dedalus - Lorenzo', text: 'Dedalus - Lorenzo' },
        { value: 'Dedalus - Medchart', text: 'Dedalus - Medchart' },
        { value: 'Meditech', text: 'Meditech' },
        { value: 'Medchart', text: 'Medchart' },
        { value: 'NerveCentre', text: 'NerveCentre' },
        { value: 'Quadramed', text: 'Quadramed' },
        { value: 'Servelec', text: 'Servelec' },
        { value: 'TPP (SystmOne)', text: 'TPP (SystmOne)' },
        { value: 'Medway', text: 'Medway' },
        { value: 'Open EP ', text: 'Open EP ' },
        { value: 'Phillips ICCA', text: 'Phillips ICCA' },
        { value: 'Other', text: 'Own System/Other (please specify)' }
      ],
      highRiskMeds: [
        { text: 'All medicines (e.g. Licensed / Unlicensed / Formulary)', value: 'All medicines' },
        { text: 'IV Infusions (e.g. Continuous / Intermittent / Complex)', value: 'IV infusions' },
        { text: 'Warfarin', value: 'Warfarin' },
        { text: 'Heparin', value: 'Heparin' },
        { text: 'Insulin', value: 'Insulin' },
        { text: 'Insulin Sliding Scales', value: 'Insulin Sliding Scales' },
        { text: 'Chemotherapy oral', value: 'Chemotherapy oral' },
        { text: 'Chemotherapy IV', value: 'Chemotherapy IV'},
        { text: 'Scheduling system for Immunisations / Vaccinations', value: 'Scheduling System' },
        { text: 'Antimicrobials', value: 'Antimicrobials' },
        { text: 'Antipsychotics / Antidepressants (e.g. Depot Injections)', value: 'Antipsychotics' },
        { text: 'Controlled Drugs', value: 'Controlled Drugs' },
        { text: 'Patient Controlled Analgesia', value: 'PCA' },
        { text: 'Multi-Ingredient Infusions (e.g Morphine, Cyclizine, Water for Injection)', value: 'MII' },
        { text: 'Pharmacogenomics', value: 'Pharmacogenomics' },
        { text: 'Fluids', value: 'Fluids' },
        { text: 'Blood Products / Components (e.g. red cells, platelets, fresh frozen plasma and cryoprecipitate, or plasma derivatives)', value: 'Blood Products' },
        { text: 'Medical Gases (e.g. Oxygen, Medical Air, Nitrous Oxide)', value: 'Medical Gases' },
        { text: 'Parenteral Nutrition', value: 'Parenteral Nutrition' },
        { text: 'Other Nutrition', value: 'Other Nutrition' },
        { text: 'Linked Therapeutic Drug Monitoring (e.g. Gentamicin / Vancomycin)', value: 'LTDM' },
        { text: 'Ability to prescribe dose titration', value: 'Dose Titration' }
      ],
      clinicalAreas: [
        { text: 'Accident and Emergency EPMA Accessible i.e. open to view medication records (A&E) ', value: 'A&E EPMA Acc' },
        { text: 'Accident and Emergency EPMA being used for prescribing (A&E) ', value: 'A&E EPMA Prescribing' },
        { text: 'Inpatient (e.g. Ambulatory unit, Care of the Elderly, Orthopaedics)', value: 'Inpatient' },
        { text: 'Intensive Care Unit (ICU)', value: 'ICU' },
        { text: 'Theatre', value: 'Theatre' },
        { text: 'Day Cases ( e.g. procedures)', value: 'Day Cases' },
        { text: 'Outpatients', value: 'Outpatients' },
        { text: 'Special Clinics (e.g. Dialysis / Renal)', value: 'Special Clinics' },
        { text: 'Sexual and Reproductive Health (SRH) services or Genitourinary Medicine Clinics (GUM)', value: 'SRH' },
        { text: 'Maternity', value: 'Maternity' },
        { text: 'Neonatal', value: 'Neonatal' },
        { text: 'Special Care Baby Unit (SCBU) / Neonatal Intensive Care (NICU)', value: 'SCBU' },
        { text: 'Paediatrics', value: 'Paediatrics' },
        { text: 'Paediatric Intensive Care (PICU)', value: 'PICU' },
        { text: 'Cancer Services', value: 'Cancer Services' },
        { text: 'Community', value: 'Community' },
        { text: 'Intermediate Care', value: 'Intermediate Care' },
        { text: 'Virtual Wards', value: 'Virtual Wards' },
        { text: 'Homecare medicines service', value: 'HMS' },
        { text: 'Clinical Trials ', value: 'Clinical Trials' },
        { text: 'Other (please specify)', value: 'Other' }
      ]
    }
  },
  actions: {
    setOpen: (isOpen) => {
      this.appOpen = isOpen
    },
    setDebug: (isDebug) => {
      this.debugMode = isDebug
    }
  }
})
