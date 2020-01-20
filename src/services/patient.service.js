import jsonpatients from '../json/patients.json'
import jsontests from '../json/prescriptions.json'
import jsonerrors from '../json/configerror.json'
import { store } from '../store/index';
import { settings } from '../settings';

export const patientService = {
  setPatients,
  getPatients,
  getDOB,
  getNumPatients,
  getPatientIndex,
  getTestIndex,
  getAllPatients
};

function setPatients() {

  let patients = [];
  const tests = jsontests;
  const errors = jsonerrors;
  const patientList = [];
  const patientIds = [];
  const testList = [];
  const testIndex = [];
  const allTests = tests.length;

  // loop through the tests at random and assign them to testList
  for(let i = 0; i < allTests; i++){
    let index = Math.floor(Math.random() * allTests);

    // don't want the same test twice
    if (testIndex.indexOf(index) === -1) {
      // keep a note of the index
      testIndex.push(index);
      if (testList.length < settings.numPrescriptions) {
        testList.push(tests[index]);
        patientIds.push(tests[index].patient_id);
      }
    }
  }

  console.log(patientIds);

  // create a random point to insert a config error between 2 and 5
  let configInsert = Math.floor(Math.random() * 4) + 2;

  // add it into the array without deleting anything
  testList.splice(configInsert, 0, errors);

  // returns a promise
  getAllPatients().then(data => {
    patients = data;
    // loop through patients and set the patient list
    for(let index in patients)
    {
      if(patients.hasOwnProperty(index)){
        let patientarray = patients[index];
        let mypatient = formatData(patientarray);
        if (patientIds.includes(mypatient.patient_id)){
          patientList.push(mypatient);
        }
      }
    }
    console.log(patientList.length);

    for(let i = 0; i < patientList.length; i++) {
      // fix patient DOBs
      patientList[i].dob = patientService.getDOB(patientList[i]);

      // assign id and name to local storage
      let myid = patientList[i].patient_id;
      let myname = patientList[i].first_name + ' ' + patientList[i].surname;
      localStorage.setItem(myid, myname);
    }

    localStorage.setItem('numPatients', patientList.length);
    store.dispatch('setPatientList', { patientList, patientIds, testList });

  });
}

function getDOB(patient) {

  // get today's date
  let today = new Date();

  //randomise the date within the last 12 months
  let days = Math.random() * 360;
  today.setDate(today.getDate()-days);

  // get date string info
  let d = today.getDate();
  let m = today.getMonth() + 1;
  let yyyy = today.getFullYear();

  // subtract patient's age
  yyyy = yyyy - patient.age;

  let dd = d.toString();
  let mm = m.toString();

  if (d < 10) {
    dd = '0' + d;
  }
  if (m < 10) {
    mm = '0' + m;
  }
  return dd + '/' + mm + '/' + yyyy;
}

function getAllPatients() {

  let token = getToken();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(settings.baseUrl + 'patients', requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from getAllPatients');
    });
}

function getPatientDetails() {

  let token = getToken();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(settings.baseUrl + 'patientdetails', requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from getPatientDetails');
    });
}

function getToken(){
  return localStorage.getItem('token');
}

function getPatients() {
  return store.state.patientList;
}

function getPatientIndex() {
  return store.state.patientIndex;
}

function getNumPatients() {
  return localStorage.getItem('numPatients');
}

function getTestIndex() {
  return store.state.testIndex;
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

function formatPartialData(patientarray){

  let patient = {
    patient_id: patientarray[0],
    first_name : patientarray[1],
    surname : patientarray[2],
    age : patientarray[3],
    gender : patientarray[4],
    height : patientarray[5],
    weight: patientarray[6],
    is_adult: patientarray[7]
  };

  console.log(patient);
  return patient;

}

function formatData(patientarray){

  let patient = {
    patient_id: patientarray['patient_id'],
    first_name : patientarray['first_name'],
    surname : patientarray['surname'],
    age : patientarray['age'],
    gender : patientarray['gender'],
    height : patientarray['height'],
    weight: patientarray['weight'],
    is_adult: patientarray['is_adult'],
    allergy: formatAllergy(patientarray['allergy']),
    diagnosis: formatDiagnosis(patientarray['diagnosis']),
    medication_histories: patientarray['medication_histories'],
    clinical_data : patientarray['clinical_data']
  };
  return patient;
}

function formatAllergy(allergy){
  let allergyArray = [];
  for(let index in allergy){
    allergyArray.push(allergy[index].allergy);
  }
  return allergyArray;
}

function formatDiagnosis(diagnosis){
  let diagnosisArray = [];

  for(let index in diagnosis){
    diagnosisArray.push(diagnosis[index].diagnosis);
  }
  return diagnosisArray;
}

/*
function formatMedicationHistories(medication_histories){
  let medicationHistoriesArray = {
    name : '',
    dose : '',
    units: '',
    route: '',
    form : '',
    frequency : ''
  };

  for(let index in medication_histories){
    medicationHistoriesArray.name = medication_histories[index].medication_histories['name'];
    medicationHistoriesArray.dose = medication_histories[index].medication_histories['dose'];
  }

  console.log(medicationHistoriesArray);
  return medicationHistoriesArray;
} */



