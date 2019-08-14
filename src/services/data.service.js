let numPatients = 10;
let numTests = 20;

export const dataService = {
  getAssessmentPart,
  setAssessmentPart,
  numPatients,
  numTests
};

function getAssessmentPart() {

  let part = localStorage.getItem('assessmentPart');
  if(part == null){
    part = 1
  }
  console.log('Getting part ' + part);
  return part;
}

function setAssessmentPart(value) {
  localStorage.setItem('assessmentPart', value);
  console.log('Setting part ' + value);
}
