<template>
  <GroupElement ref="practiceReportGroup" name="practiceReportGroup" :class="'my-4'">  
    <StaticElement name="practiceReportHeading">
      <h2>Step 4: Review Feedback</h2>
    </StaticElement>
    <StaticElement name="practiceReportInfo">
      <div class="vf-col-12 alert alert-info" role="alert">                            
        <p>
          We are unable to provide a full report here because the practice session only has one question. However, in the live assessment, all 45 questions are scored and combined 
          to generate an individual report accessible once all scenarios are completed.
        </p>
        <p>
          This shows overall mitigation performance, results against mandatory questions and performance across clinical decision support categories. The categories are good mitigation, 
          some mitigation, no mitigation and over mitigation and these are added together to produce the users overall mitigation performance report.
        </p>                                      
        <ul class="list-group mb-2"> 
          <li>For this practice scenario, the expected outcome is <span class="fw-bold bg-white border rounded p-2">prescribing prevented</span> where Paracetamol is prescribed at an extreme overdose.</li>
        </ul>                                     
        <p>
          The mitigation scoring explanations for each outcome are recorded below. If you did not select <span class="fw-bold">prescribing prevented</span> please review the outcome you selected 
          below and what mitigation score this would give you and the reason why.
        </p>
        <ul class="list-group mb-2">            
          <li class="list-group-item">
            <div class="fw-bold">Prescribing completed with no system/user intervention</div>
            This would score as No Mitigation as the ePrescribing system would permit unsafe prescribing of a paracetamol overdose.
          </li>
          <li class="list-group-item">
            <div class="fw-bold">Prescribing completed but had to override components of the order sentence</div>
            This would score as Some Mitigation as the ePrescribing system had some safety measure in place for Paracetamol. However it does not meet Good Mitigation requirements because it 
            can be bypassed and permit the prescribing of a Paracetamol overdose.
          </li> 
          <li class="list-group-item">
            <div class="fw-bold">Prescribing completed with system/user intervention</div>
            This would score as Some Mitigation where the ePrescribing system provided some form of guidance alerting the prescriber to the Paracetamol overdose.
          </li>
          <li class="list-group-item">
            <div class="fw-bold">Prescribing prevented</div>
            This would score as Good Mitigation as the Paracetamol overdose is prevented.
          </li>
          <li class="list-group-item">
            <div class="fw-bold">Unable to perform test</div>
            This would score as an invalid test and excluded from the final score calculations.
          </li>
        </ul>                                   
      </div>                          
    </StaticElement>    
  </GroupElement>  
</template>

<script>

export default {
  name: 'PracticeReport'
}
</script>

<style scoped></style>
