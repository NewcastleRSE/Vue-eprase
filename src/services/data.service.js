
import { settings } from '../settings';
import { router } from '../router';
import axios from "axios";

let baseURL = process.env.BASE_URL;

export const dataService = {
  getAssessmentById,
  getAssessmentLatestCompletedPart,
  getReportByInstitutionId,
  getAllReports,
  getAssessmentStatus,
  getInstitutions,
  getCategories,
  getPrescriptionTestData,
  setAssessmentPart,
  saveSystemData,
  saveCreatePatients,
  savePatientData,
  savePatientList,
  savePrescriptionData,
  saveMitigationResults,
  getMitigationResults,
  getAllMitigationResults,
  saveConfigError,
  getConfigErrors,
  getConfigErrorByCode,
  failedLoginAudit,
  audit,
  logout,
  updateInstitutionAssessment
};

function saveSystemData(ep_service, other_service, ep_version, ep_usage, other_ep_system, patient_type, lab_results, man_results, diagnosis_results, med_history, high_risk_meds, clinical_areas, time_taken){

  let token = getToken();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ ep_service, other_service, ep_version, ep_usage, other_ep_system, patient_type, lab_results, man_results, diagnosis_results, med_history, high_risk_meds, clinical_areas, time_taken })
  };

  return fetch(baseURL + 'system', requestOptions)
    .then(handleResponse)
    .then(response => {
      let assessmentId = JSON.stringify(response);
      if (assessmentId) {
       // store assessment id
       localStorage.setItem('assessmentId', assessmentId);
     }
    })
    .catch(function() {
       console.log('Error returning from saveSystemData');
    });
}

function saveCreatePatients(time_taken){

  let token = getToken();
  let assessmentId = getAssessmentId();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ time_taken })
  };

  return fetch(baseURL + 'createpatients?ID=' + assessmentId, requestOptions)
    .then(handleResponse)
    .then(response => {
    })
    .catch(function() {
      console.log('Error returning from saveCreatePatientData');
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

  return fetch(baseURL + 'patientdata?ID=' + assessmentId, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from savePatientData');
    });
}

function savePatientList(patient_list){

  let token = getToken();
  let institutionId = getInstitutionId();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body:  patient_list
  };

  return fetch(baseURL + 'savepatientlist?INSTITUTION_ID=' + institutionId, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from savePatientList');
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

  return fetch(baseURL + 'prescriptionData?ID=' + assessmentId + '&TEST_ID='  + prescription, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })

}


// should only save if result doesn't already exist
function saveMitigationResults(assessmentId, goodMitigation, someMitigation, notMitigated, overMitigated, invalidTests){

  let token = getToken();
  let institutionId = getInstitutionId();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ goodMitigation, someMitigation, notMitigated, overMitigated, invalidTests})
  };

  return fetch(baseURL + 'saveMitigationResults?ID=' + assessmentId + '&INSTITUTION_ID='  + institutionId, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from saveMitigationResults');
    });
}

function saveConfigError(test_id, result, time_taken ) {

  let token = getToken();
  let assessmentId = getAssessmentId();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ test_id, result, time_taken })
  };

  return fetch(baseURL + 'config?ID=' + assessmentId, requestOptions)
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

   return fetch(baseURL + 'audit', requestOptions)
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

  return fetch(baseURL + 'failedLoginAudit', requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
}

function logout() {
  // remove all items from local storage
  localStorage.clear();
}

// param assessment id
function getAssessmentById(assessment_id) {

  let token = getToken();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(baseURL + 'resultByAssessmentId?ID=' + assessment_id, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from getAssessmentById');
    });
}

function getInstitutions() {

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  };

  return fetch(baseURL + 'auth/institutions', requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from getInstitutions');
    });
}

// returns a  list of all categories
function getCategories() {

  let token = getToken();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(baseURL + 'categories', requestOptions)
    .then(handleResponse)
    .then(response => {
      // console.log(response);
      return response;
    })
    .catch(function() {
      console.log('Error returning from getCategories');
    });
}

// returns all the prescription test results for an institution by assessment id
function getPrescriptionTestData(id) {

  let token = getToken();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(baseURL + 'resultCategories?ID=' + id, requestOptions)
    .then(handleResponse)
    .then(response => {
      //console.log(response);
      return response;
    })
    .catch(function() {
      console.log('Error returning from resultCategories');
    });
}

// institution assessment id supplied
function getMitigationResults(id) {

  let token = getToken();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(baseURL + 'getMitigationResults?ID=' + id, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from getMitigationResults');
    });
}

// institution assessment id supplied
function getAllMitigationResults() {

  let token = getToken();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(baseURL + 'getAllMitigationResults', requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from getAllMitigationResults');
    });
}

function getConfigErrors() {

  let token = getToken();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(baseURL + 'configerrors', requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from getConfigErrors');
    });
}

function getConfigErrorByCode(code){

  let token = getToken();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(baseURL + 'configerrorbycode?CODE=' + code, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from getConfigErrorByCode');
    });
}


//TODO  expand this function to deal with multiple results over more than one year
function getAssessmentStatus(institution_id) {

  let token = getToken();
  let ins_id = 0;

  if(institution_id !== undefined){
    ins_id = institution_id;
  }
  else {
    ins_id = getInstitutionId();
  }

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(baseURL + 'getAssessmentStatus?INSTITUTION_ID=' + ins_id, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from getAssessmentStatus');
    });

}


function getAssessmentLatestCompletedPart() {

  let token = getToken();
  let institution_id = getInstitutionId();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(baseURL + 'getAssessmentLatestCompletedPart?INSTITUTION_ID=' + institution_id, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from getAssessmentLatestCompletedPart');
    });

}

function getReportByInstitutionId() {

  let token = getToken();
  let institution_id = getInstitutionId();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(baseURL + 'resultByInstitutionId?ID=' + institution_id, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function () {
    });
}

function getAssessmentIdByInstitutionId(institution_id) {

  let token = getToken();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(baseURL + 'assessmentIdByInstitutionId?ID=' + institution_id, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function () {
    });

}

function getAllReports() {

  let token = getToken();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(baseURL + 'results', requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function () {
    });
}

function updateInstitutionAssessment(){

  let token = getToken();
  let institutionId = getInstitutionId();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(baseURL + 'updateInstitutionAssessment?INSTITUTION_ID=' + institutionId, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from updateInstitutionAssessment');
    });

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


//------- local storage functions

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




