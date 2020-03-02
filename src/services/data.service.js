
import { settings } from '../settings';
import { router } from '../router';

export const dataService = {
  getAssessment,
  getAssessmentPart,
  getInstitutions,
  getCategories,
  getCategoryData,
  setAssessmentPart,
  saveSystemData,
  savePart2Data,
  savePatientData,
  savePrescriptionData,
  saveConfigError,
  getConfigErrors,
  audit
};

function saveSystemData(ep_service, other_service, ep_version, ep_usage, patient_type, lab_results, man_results, diagnosis_results, med_history, high_risk_meds, clinical_areas, time_taken){

  let token = getToken();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ ep_service, other_service, ep_version, ep_usage, patient_type, lab_results, man_results, diagnosis_results, med_history, high_risk_meds, clinical_areas, time_taken })
  };

  return fetch(settings.baseUrl + 'system', requestOptions)
    .then(handleResponse)
    .then(response => {
      let assessmentId = JSON.stringify(response);
      if (assessmentId) {
       // store assessment id
       localStorage.setItem('assessmentId', assessmentId);
       dataService.setAssessmentPart(2);
       router.push({ path: './assessmentpatients' });
     }
    })
    .catch(function() {
       console.log('Error returning from saveSystemData');
    });
}

function savePart2Data(time_taken){

  let token = getToken();
  let assessmentId = getAssessmentId();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ time_taken })
  };

  return fetch(settings.baseUrl + 'createpatients?ID=' + assessmentId, requestOptions)
    .then(handleResponse)
    .then(response => {
      dataService.setAssessmentPart(3);
      router.push({ path: './assessmentpatientdetails' });
    })
    .catch(function() {
      console.log('Error returning from savePart2Data');
    });

}

function savePatientData(qualitative_data, patient_id, time_taken){

  let token = getToken();
  let assessmentId = getAssessmentId();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ qualitative_data, patient_id, time_taken })
  };

  return fetch(settings.baseUrl + 'patientdata?ID=' + assessmentId, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from savePatientData');
    });
}

function savePrescriptionData(prescription, outcome, other, selected_type, risk_level, result,  result_score, time_taken, qualitative_data){

  let token = getToken();
  let assessmentId = getAssessmentId();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({outcome, other, selected_type, risk_level, result,  result_score, time_taken, qualitative_data})
  };

  return fetch(settings.baseUrl + 'prescriptionData?ID=' + assessmentId + '&TEST_ID='  + prescription, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })

}

function saveConfigError(  test_id, result, time_taken ) {

  let token = getToken();
  let assessmentId = getAssessmentId();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ test_id, result, time_taken })
  };

  return fetch(settings.baseUrl + 'config?ID=' + assessmentId, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from saveConfigError');
    });
}


function audit(action, uri) {

  let token = getToken();

  console.log('Audit ' + action, uri);

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify( {action, uri})
  };

   return fetch(settings.baseUrl + 'audit', requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
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

function getInstitutions() {

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  };

  return fetch(settings.baseUrl + 'auth/institutions', requestOptions)
    .then(handleResponse)
    .then(response => {
     // console.log(response);
      return response;
    })
    .catch(function() {
      console.log('Error returning from getInstitutions');
    });
}


function getCategories() {

  let token = getToken();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(settings.baseUrl + 'categories', requestOptions)
    .then(handleResponse)
    .then(response => {
      // console.log(response);
      return response;
    })
    .catch(function() {
      console.log('Error returning from getCategories');
    });
}


function getCategoryData(id) {

  let token = getToken();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(settings.baseUrl + 'resultCategories?ID=' + id, requestOptions)
    .then(handleResponse)
    .then(response => {
     // console.log(response);
      return response;
    })
    .catch(function() {
      console.log('Error returning from resultCategories');
    });
}

function getConfigErrors() {

  let token = getToken();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(settings.baseUrl + 'configerrors', requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from getConfigErrors');
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




