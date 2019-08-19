let numPatients = 10;
let numTests = 20;

let baseURL = 'http://localhost:6001/api';

export const dataService = {
  getAssessmentPart,
  setAssessmentPart,
  savePart1Data,
  savePart2Data,
  numPatients,
  numTests
};

function savePart1Data(ep_service, ep_version, ep_usage, patient_type, lab_results, med_history, time_taken){

  let token = getToken();
  let user =  getUser();
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

function savePart2Data(qualitative_data, time_taken){

  let token = getToken();
  let part = getAssessmentPart();
  let newpart = part + 1;

  let newassessment = 'assessmentpart' + newpart;

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ qualitative_data, time_taken })
  };

  // api/part1/{assessmentId}/part2

  return fetch(baseURL + '/part1/1/part2', requestOptions)
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

function getToken(){
  let token = localStorage.getItem('token');
  return token;
}

function getUser() {
  let user = localStorage.getItem('user');
  return user;
}
