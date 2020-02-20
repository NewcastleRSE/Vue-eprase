import { dataService } from '../services/data.service'
import { store } from '../store/index';
import { settings } from '../settings';

export const patientService = {
  getPatients,
  getDOB,
  getNumPatients,
  getPatientIndex,
  getTestIndex,
  getPatientTests,
  setPatientsInStore
};

function setPatientsInStore() {

  let patients = [];
  let tests = [];
  let tempList = [];
  let tempErrors = [];
  let testList = [];
  let configErrors = [];
  const patientList = [];
  const patientIds = [];
  const patientIndex = [];

  // create local variables to help set up insert points for config errors
  let numTests = settings.numPrescriptions;
  let testLimit = settings.testLimit;
  let numConfigErrors = settings.numConfigError;
  let insertPoints = [];

  while(insertPoints.length < numConfigErrors){
    // create a random point to insert a config error between 2 and the total number of tests
    let configInsert = Math.floor(Math.random() * testLimit) + 2;
    if(!insertPoints.includes(configInsert)){
      insertPoints.push(configInsert);
    }
  }

  console.log(insertPoints);

  // get all the patients
  // returns a promise
  getAllPatients().then(data => {
    patients = data;
    // loop through patients and set the patient list
    for(let index in patients) {
      if (patients.hasOwnProperty(index)) {
        let patientarray = patients[index];
        let mypatient = formatData(patientarray);
        patientList.push(mypatient);
        patientIds.push(patients[index].patient_id);
      }

      // increment to get valid patient ids (promise)
      if(patients.hasOwnProperty(index)){
        index++;
        // get the tests associated with each patient
        getPatientTests(index).then(data => {
          tempList = data;
          for(let i = 0; i < tempList.length; i++){
             testList.push(tempList[i]);
          }

          // get all the config errors (another promise)
          dataService.getConfigErrors().then(data => {
            configErrors = data;

            // splice the config errors into the testList at the insertPoints (array length changes after each insert)
            for(let j = 0; j < insertPoints.length; j++){
              if(index === insertPoints[j]){
                // add new element without deleting anything
                testList.splice(insertPoints[j], 0, configErrors[j]);
              }
            }
            store.dispatch('setTestList', { testList});
          });
        });
      }
    }

    for(let i = 0; i < patientList.length; i++) {
      // fix patient DOBs
      patientList[i].dob = patientService.getDOB(patientList[i]);

      // assign id and name to local storage
      let myid = patientList[i].patient_id;
      let myname = patientList[i].first_name + ' ' + patientList[i].surname;
      localStorage.setItem(myid, myname);
    }

    localStorage.setItem('numPatients', patientList.length);
    store.dispatch('setPatientList', { patientList, patientIds});
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

// used by setPatientsInStore
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


function getPatientTests(index) {

  let token = getToken();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(settings.baseUrl + 'prescriptions?ID=' + index, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from getPatientTests');
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
    if(allergy.hasOwnProperty(index)){
      allergyArray.push(allergy[index].allergy);
    }
  }
  return allergyArray;
}

function formatDiagnosis(diagnosis) {
  let diagnosisArray = [];
  for (let index in diagnosis) {
    if (diagnosis.hasOwnProperty(index)) {
      diagnosisArray.push(diagnosis[index].diagnosis);
    }
  }
  return diagnosisArray;
}

function formatTestList(testList){

  let test = {
    id: testList['id'],
    patient_id : testList['patient'].patient_id,
    prescription_id : testList['prescription_id'],
    description : testList['indicator'].description,
    risk_score : testList['risk_score'],
    drug_name : testList['drug_name'],
    drug_dose : testList['drug_dose'],
    route: testList['route'],
    duration: testList['duration'],
    drug_frequency: testList['drug_frequency']
  };
  return test;

}



