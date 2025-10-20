<template>
  <GenericModal :modalName="'AboutModal'" :modalId="'aboutModal'" :title="'About ePRaSE'" :closeBtnText="'Close'">
    <p>The ePrescribing Risk and Safety Evaluation tool (ePRaSE) is designed to evaluate 
      ePrescribing systems, to determine their usefulness and to encourage the correct 
      use of these systems and deliver improved patient outcomes.</p>

    <p>ePRaSE has been developed by the Pharmacy Department at the Newcastle Hospitals 
      NHS Foundation Trust and Newcastle University.</p>

    <h4>Credits</h4>

    <p>The prescribing assessments were developed originally for the 2019 version by 
      Jude Heed (Senior Lecturer in Pharmacy Practice, Newcastle University Faculty of 
      Medical Sciences) and Stephanie Klein (Pharmacist, ePRaSE Programme Manager, 
      Newcastle upon Tyne Hospitals NHS Trust). The development of new and updated 
      assessments in following tool iterations were additionally supported by Jamie 
      Coleman (Consultant in Clinical Pharmacology / Associate Medical Director Medicines 
      Management, University Hospital Birmingham NHS FT) and members of expert clinical 
      reference groups. For the 2024 version, the clinical reference group members were 
      volunteers from mental health Trusts and Medicines Safety Officers from across England 
      who were able to identify prescribing risks based on their lived experience and 
      knowledge of patient-related harms. The development of a new paediatric module for 
      2025 was supported by a Stephen Tomlin (Director of the Children's Medicines 
      Research & Innovation Centre - CMRIC Associate Chief Pharmacist - Research and 
      Innovation Great Ormond Street Hospital) and a members of a paediatric clinical 
      reference group drawn from experts across England NHS trusts.</p>

      <p>In addition, support was provided at the outset by Graeme Kirkpatrick, the 
        now former Head of Patient Safety NHS England. The NHS England national patient 
        safety team undertake a regular review of all reported patient safety incidents 
        that are categorised as death or severe harm. Through this process the national 
        patient safety team were able to support the ePRaSE team to identify several 
        prescribing errors that could be mitigated against by a trust's EP system. These 
        included errors that are currently categorised as Never Events by NHS England.</p>

      <p>The technical development of the tool is led by Rebecca Osselton, Senior Research 
        Software Engineer, Newcastle University.</p>


  </GenericModal>
</template>

<script>

import { mapState } from 'pinia'
import { rootStore } from '../stores/root'
import GenericModal from './GenericModal'

export default {
  name: "AboutModal",
  components: {
    GenericModal
  },
  computed: {
    ...mapState(rootStore, ['audit'])
  },
  methods: {
    close() {
      this.audit('View about', '/assessmentintro')
    }
  }
}
</script>

<style scoped></style>
