
import { settings } from '../settings';
import { router } from '../router';

export const dataService = {
  getAssessment,
  getAssessmentPart,
  setAssessmentPart,
  savePart1Data,
  savePart2Data,
  savePart3Data,
  savePrescriptionData,
  saveConfigError,
  audit
};

function savePart1Data(ep_service, other_service, ep_version, ep_usage, patient_type, lab_results, med_history, time_taken){

  let token = getToken();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ ep_service, other_service, ep_version, ep_usage, patient_type, lab_results, med_history, time_taken })
  };

  return fetch(settings.baseUrl + 'part1', requestOptions)
    .then(handleResponse)
    .then(response => {
      let assessmentId = JSON.stringify(response);
      if (assessmentId) {
       // store assessment id
       localStorage.setItem('assessmentId', assessmentId);
       dataService.setAssessmentPart(2);
       router.push({ path: './assessmentpart2' });
     }
    })
    .catch(function() {
       console.log('Error returning from savePart1Data');
    });
}

function savePart2Data(qualitative_data, time_taken){

  let token = getToken();
  let assessmentId = getAssessmentId();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ qualitative_data, time_taken })
  };

  return fetch(settings.baseUrl + 'part2?ID=' + assessmentId, requestOptions)
    .then(handleResponse)
    .then(response => {
      dataService.setAssessmentPart(3);
      router.push({ path: './assessmentpart3' });
    })
    .catch(function() {
      console.log('Error returning from savePart2Data');
    });

}

function savePart3Data(qualitative_data, patient_id, time_taken){

  let token = getToken();
  let assessmentId = getAssessmentId();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ qualitative_data, patient_id, time_taken })
  };

  return fetch(settings.baseUrl + 'part3?ID=' + assessmentId, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from savePart3Data');
    });
}

function savePrescriptionData(test_id, outcome, other, override, risk_score, result_score, time_taken, qualitative_data, assessmentResponses){

  let token = getToken();
  let assessmentId = getAssessmentId();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ test_id, outcome, other, override, risk_score, result_score, time_taken, qualitative_data, assessmentResponses })
  };

  return fetch(settings.baseUrl + 'prescription?ID=' + assessmentId, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })

}

function saveConfigError(  test_id, risk_score, result_score, result, time_taken, qualitative_data ) {

  let token = getToken();
  let assessmentId = getAssessmentId();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ test_id, risk_score, result_score, result, time_taken, qualitative_data })
  };

  return fetch(settings.baseUrl + 'config?ID=' + assessmentId, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from savePrescriptionData');
    });
}

function audit(user_id, action, uri) {

  console.log('Audit ' + user_id, action, uri);

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( {user_id, action, uri})
  };

  /* return fetch(settings.baseUrl + 'audit', requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    }) */

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

function getAssessment(id) {

  let token = getToken();
  let assessmentId = id;

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(settings.baseUrl + 'result?ID=' + assessmentId, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from getAssessment');
    });

}

function getAssessmentPart() {

  let part = localStorage.getItem('assessmentPart');
  if(part == null){
    part = 1
  }
  return part;
}

function setAssessmentPart(value) {
  localStorage.setItem('assessmentPart', value);
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




