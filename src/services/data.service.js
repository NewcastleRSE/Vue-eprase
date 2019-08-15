let numPatients = 10;
let numTests = 20;

let baseURL = 'http://localhost:6001/api';

export const dataService = {
  getAssessmentPart,
  setAssessmentPart,
  saveAssessmentData,
  numPatients,
  numTests
};

function saveAssessmentData(ep_service, ep_version, ep_usage, patient_type, lab_results, med_history, time_taken){

  let token = localStorage.getItem('token');
  let user = localStorage.getItem('user');
  let part = getAssessmentPart();
  let newpart = part + 1;

  // type conversions
  let path = 'part' + part;
  let newassessment = 'assessmentpart' + newpart;

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ ep_service, ep_version, ep_usage, patient_type, lab_results, med_history, time_taken })
  };

  return fetch(baseURL + '/users/' + user + '/' + path, requestOptions)
    .then(response => {
      window.location.href = './' + newassessment;
      dataService.setAssessmentPart(newpart);
    })
    .catch(error => this.errors = error.response.data)

}

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
