
import { settings } from '../settings';
import { router } from '../router';

export const dataService = {
  getAssessment,
  getAssessmentPart,
  getAssessmentStatus,
  getInstitutions,
  getCategories,
  getCategoryData,
  setAssessmentPart,
  saveSystemData,
  savePart2Data,
  savePatientData,
  savePrescriptionData,
  saveMitigationResults,
  getMitigationResults,
  saveConfigError,
  getConfigErrors,
  failedLoginAudit,
  audit,
  logout
};

function saveSystemData(ep_service, other_service, ep_version, ep_usage, other_ep_system, patient_type, lab_results, man_results, diagnosis_results, med_history, high_risk_meds, clinical_areas, time_taken){

  let token = getToken();
  let year = settings.year;

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ ep_service, other_service, ep_version, ep_usage, other_ep_system, patient_type, lab_results, man_results, diagnosis_results, med_history, high_risk_meds, clinical_areas, time_taken })
  };

  return fetch(settings.baseUrl + 'system?YEAR=' + year, requestOptions)
    .then(handleResponse)
    .then(response => {
      let assessmentId = JSON.stringify(response);
      if (assessmentId) {
       // store assessment id
       localStorage.setItem('assessmentId', assessmentId);
       dataService.setAssessmentPart(2);
       let type = patient_type;
       router.push({ path: './setpatients/' + type});
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

function savePatientData(qualitative_data, code, time_taken){

  let token = getToken();
  let assessmentId = getAssessmentId();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ qualitative_data, code, time_taken })
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

function savePrescriptionData(prescription, outcome, other, intervention_type, selected_type, risk_level, result,  result_score, time_taken, qualitative_data){

  let token = getToken();
  let assessmentId = getAssessmentId();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({outcome, other, intervention_type, selected_type, risk_level, result,  result_score, time_taken, qualitative_data})
  };

  return fetch(settings.baseUrl + 'prescriptionData?ID=' + assessmentId + '&TEST_ID='  + prescription, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })

}


// should only save if result doesn't already exist
function saveMitigationResults(goodMitigation, someMitigation, notMitigated, overMitigated){

  let token = getToken();
  let assessmentId = getAssessmentId();
  let institutionId = getInstitutionId();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ goodMitigation, someMitigation, notMitigated, overMitigated })
  };

  return fetch(settings.baseUrl + 'saveMitigationResults?ID=' + assessmentId + '&INSTITUTION_ID='  + institutionId, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from saveMitigationResults');
    });
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

function failedLoginAudit(action, uri) {

  let token = getToken();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( {action, uri})
  };

  return fetch(settings.baseUrl + 'failedLoginAudit', requestOptions)
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
        router.push({ path: './login' }).catch(err => {});
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}

function logout() {
  // remove all items from local storage
  localStorage.clear();
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

function getMitigationResults(id) {

  let token = getToken();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(settings.baseUrl + 'getMitigationResults?ID=' + id, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from getMitigationResults');
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

function getAssessmentStatus() {

  let token = getToken();
  let user_id = getUserId();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(settings.baseUrl + 'getAssessmentStatus?USER_ID=' + user_id, requestOptions)
    .then(handleResponse)
    .then(response => {
      // console.log(response);
      return response;
    })
    .catch(function() {
      console.log('Error returning from getAssessmentStatus');
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

function getUserId() {
  return localStorage.getItem('userId');
}

function getAssessmentId() {
  return localStorage.getItem('assessmentId');
}

function getInstitutionId() {
  return localStorage.getItem('institutionId');
}




