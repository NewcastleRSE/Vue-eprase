
let baseURL = 'http://localhost:6001/api';

import { router } from '../router';

export const dataService = {
  getAssessmentPart,
  setAssessmentPart,
  savePart1Data,
  savePart2Data,
  savePart3Data
};

function savePart1Data(ep_service, ep_version, ep_usage, patient_type, lab_results, med_history, time_taken){

  let token = getToken();
  let user =  getUser();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ ep_service, ep_version, ep_usage, patient_type, lab_results, med_history, time_taken })
  };

  return fetch(baseURL + '/users/' + user + '/part1', requestOptions)
    .then(handleResponse)
    .then(response => {
      let assessmentId = JSON.stringify(response);
      if (assessmentId) {
       // store assessment id
       localStorage.setItem('assessmentId', assessmentId);
     }
    })
    .then(response => {
      dataService.setAssessmentPart(2);
      router.push({ path: './assessmentpart2' });
    })
}

function savePart2Data(qualitative_data, time_taken){

  let token = getToken();
  let assessmentId = getAssessmentId();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ qualitative_data, time_taken })
  };

  return fetch(baseURL + '/part1/' + assessmentId + '/part2', requestOptions)
    .then(response => {
      dataService.setAssessmentPart(3);
      router.push({ path: './assessmentpart3' });
    })
}

function savePart3Data(qualitative_data, time_taken){

  let token = getToken();
  let assessmentId = getAssessmentId();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ qualitative_data, time_taken })
  };

  return fetch(baseURL + '/part1/' + assessmentId + '/part2', requestOptions)
    .then(response => {
      router.push({ path: './assessmentpart3' });
    })
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        location.reload(true);
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
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
  return localStorage.getItem('token');
}

function getUser() {
  return localStorage.getItem('user');
}

function getAssessmentId() {
  return localStorage.getItem('assessmentId');
}


