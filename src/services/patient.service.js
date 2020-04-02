import { dataService } from '../services/data.service'
import { store } from '../store/index';
import { settings } from '../settings';
import _ from 'lodash';

export const patientService = {
  getPatients,
  getDOB,
  getNumPatients,
  getPatientIndex,
  getTestIndex,
  getPatientTests,
  setPatientsInStore,
 // setPrescriptionsInStore
};


/*
function setPrescriptionsInStore() {

  let drugAgeTests = [];
  let drugLabTests = [];
  let drugInteractionTests = [];
  let drugDiseaseTests = [];
  let drugDoseTests = [];
  let drugFrequencyTests = [];
  let theraputicDuplicationTests = [];
  let drugAllergyTests = [];
  let drugBrandTests = [];
  let drugRouteTests = [];
  let drugOmissionTests = [];
  let drugOverdoseTests = [];
  let drugDuplicationTests = [];

  // get all prescription tests
  getAllPrescriptions().then(data => {

    let testList= [];
    let tests = data;

    for(let index in tests){
      if(tests.hasOwnProperty(index)){
        let testarray = tests[index];
        let mytest= formatTestList(testarray);
        testList.push(mytest);
      }
    }

    // group the tests by category
    for(let index in testList){
      if(testList.hasOwnProperty(index)){

        if(testList[index].in_use === true){

          switch(testList[index].category_name){
            case "Drug Age":
              drugAgeTests.push(testList[index]);
              break;
            case "Drug Dose":
              drugDoseTests.push(testList[index]);
              break;
            case "Drug Interaction":
              drugInteractionTests.push(testList[index]);
              break;
            case "Drug Allergy":
              drugAllergyTests.push(testList[index]);
              break;
            case "Drug Duplication":
              drugDuplicationTests.push(testList[index]);
              break;
            case "Drug Disease":
              drugDiseaseTests.push(testList[index]);
              break;
            case "Drug Omission":
              drugOmissionTests.push(testList[index]);
              break;
            case "Theraputic Duplication":
              theraputicDuplicationTests.push(testList[index]);
              break;
            case "Drug Lab":
              drugLabTests.push(testList[index]);
              break;
            case "Drug Brand":
              drugBrandTests.push(testList[index]);
              break;
            case "Drug Route":
              drugRouteTests.push(testList[index]);
              break;
            case "Drug Overdose":
              drugOverdoseTests.push(testList[index]);
              break;
            case "Drug Frequency":
              drugFrequencyTests.push(testList[index]);
              break;
          }
        }
      }
    }
    // select 4 at random from each category
    let allTests = [];
    let temp;

    temp = _.sampleSize(drugAgeTests, 4);
    for(let index in temp){
      allTests.push(temp[index]);
    }
    temp = _.sampleSize(drugDoseTests, 4);
    for(let index in temp){
      allTests.push(temp[index]);
    }
    temp = _.sampleSize(drugInteractionTests, 4);
    for(let index in temp){
      allTests.push(temp[index]);
    }
    temp = _.sampleSize(drugAllergyTests, 4);
    for(let index in temp){
      allTests.push(temp[index]);
    }
    temp = _.sampleSize(drugDuplicationTests, 4);
    for(let index in temp){
      allTests.push(temp[index]);
    }
    temp = _.sampleSize(drugDiseaseTests, 4);
    for(let index in temp){
      allTests.push(temp[index]);
    }
    temp = _.sampleSize(drugOmissionTests, 4);
    for(let index in temp){
      allTests.push(temp[index]);
    }
    temp = _.sampleSize(theraputicDuplicationTests, 4);
    for(let index in temp){
      allTests.push(temp[index]);
    }
    temp = _.sampleSize(drugLabTests, 4);
    for(let index in temp){
      allTests.push(temp[index]);
    }
    temp = _.sampleSize(drugBrandTests, 4);
    for(let index in temp){
      allTests.push(temp[index]);
    }
    temp = _.sampleSize(drugRouteTests, 4);
    for(let index in temp){
      allTests.push(temp[index]);
    }
    temp = _.sampleSize(drugOverdoseTests, 4);
    for(let index in temp){
      allTests.push(temp[index]);
    }
    temp = _.sampleSize(drugFrequencyTests, 4);
    for(let index in temp){
      allTests.push(temp[index]);
    }

    // get the patients and set the patientList
    let tempPatientCodes = [];
    let tempPatientList = [];

    for(let index in allTests) {
      if(allTests.hasOwnProperty(index)){
          tempPatientCodes.push(allTests[index].code)
      }
    }
    tempPatientCodes =  _.uniq(tempPatientCodes);
    localStorage.setItem('numPatients', tempPatientCodes.length);

    // set the patient list
    for(let index in tempPatientCodes){
      if(tempPatientCodes.hasOwnProperty(index)){
        getPatientByCode(tempPatientCodes[index]).then(data => {
          let patient = data;
            patient = formatPatientData(patient);

            // fix patient DOBs
            patient.dob = patientService.getDOB(patient);

            // assign id and name to local storage
            let myid = patient.code;
            let myname = patient.first_name + ' ' + patient.surname;
            localStorage.setItem(myid, myname);
            tempPatientList.push(patient);
        });
      }
    }

    // set const for dispatch
    const patientCodes = tempPatientCodes;
    const patientList = tempPatientList;
    store.dispatch('setPatientList', { patientList, patientCodes});

    // set up insert points for config errors
    let numConfigErrors = settings.numConfigError;
    let insertPoints = [];

    while(insertPoints.length < numConfigErrors){
      // create a random point to insert a config error between 2 and 20
      let configInsert = Math.floor(Math.random() * 20) + 2;
      if(!insertPoints.includes(configInsert)){
        insertPoints.push(configInsert);
      }
    }

    // get all the config errors (another promise)
    dataService.getConfigErrors().then(data => {
      let configErrors = data;

      // splice the config errors into allTests at the insertPoints (array length changes after each insert)
      for(let i = 0; i < insertPoints.length; i++){
          // add new element without deleting anything
          allTests.splice(insertPoints[i], 0, configErrors[i]);
      }

      const testList = allTests;
      store.dispatch('setTestList', { testList });
    });

  });
} */


function setPatientsInStore(patient_type) {

  let patients = [];
  let tests = [];
  let tempList = [];
  let tempErrors = [];
  let testList = [];
  let configErrors = [];
  const adultPatientList = [];
  const childPatientList = [];
  const allPatientList = [];
  const adultPatientCodes = [];
  const childPatientCodes = [];
  const allPatientCodes = [];
  const patientIndex = [];
  let patientList = [];
  let patientCodes = [];

  // create local variables to help set up insert points for config errors
  let numTests = settings.numPrescriptions;
  let testLimit = settings.testLimit;
  let numConfigErrors = settings.numConfigError;
  let insertPoints = [];

  while(insertPoints.length < numConfigErrors){
    // create a random point to insert a config error between 2 and 20
    let configInsert = Math.floor(Math.random() * 20) + 2;
    if(!insertPoints.includes(configInsert)){
      insertPoints.push(configInsert);
    }
  }

  // get all the patients
  // returns a promise
  getAllPatients().then(data => {
    patients = data;
    // loop through patients and set the patient lists
    for(let index in patients) {
      if (patients.hasOwnProperty(index)) {
        let patientarray = patients[index];
        let mypatient = formatPatientData(patientarray);

        if(mypatient.age >= 18){
          adultPatientList.push(mypatient);
          adultPatientCodes.push(mypatient.code);
        }
        else {
          childPatientList.push(mypatient);
          childPatientCodes.push(mypatient.code);
        }
        allPatientList.push(mypatient);
        allPatientCodes.push(patients[index].code);
      }

       /*
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
      } */
    }

    //console.log(adultPatientList);
    //console.log(childPatientList);

    if(patient_type === 'Adults'){

      for(let index in adultPatientList){
        if(adultPatientList.hasOwnProperty(index)){
           let id = adultPatientList[index].id;
           getPatientTests(id).then(data => {
            tempList = data;
            for(let i = 0; i < tempList.length; i++){
              testList.push(tempList[i]);
            }
             store.dispatch('setTestList', { testList});
           });
        }
      }

      for(let i = 0; i < adultPatientList.length; i++) {
        // fix patient DOBs
        adultPatientList[i].dob = patientService.getDOB(adultPatientList[i]);

        // assign id and name to local storage
        let myid = adultPatientList[i].code;
        let myname = adultPatientList[i].first_name + ' ' + adultPatientList[i].surname;
        localStorage.setItem(myid, myname);
      }

      localStorage.setItem('numPatients', adultPatientList.length);
      patientList = adultPatientList;
      patientCodes = adultPatientCodes;

    }

    // TODO set patient codes?
    store.dispatch('setPatientList', { patientList });

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

// used by setPrescriptionsInStore
  function getAllPrescriptions() {

    let token = getToken();

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
    };

    return fetch(settings.baseUrl + 'allprescriptions', requestOptions)
      .then(handleResponse)
      .then(response => {
        return response;
      })
      .catch(function() {
        console.log('Error returning from getAllPrescriptions');
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

function getPatientByCode(code) {

  let token = getToken();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(settings.baseUrl + 'patientByCode?code=' + code, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from getPatientByCode');
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

    let mypatients = store.state.patientList;
    console.log('in get patients');
    console.log(mypatients);
    return mypatients;

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
    code: patientarray[0],
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

function formatPatientData(patientarray){

  let patient = {
    id: patientarray['id'],
    code: patientarray['code'],
    first_name : patientarray['first_name'],
    surname : patientarray['surname'],
    age : patientarray['age'],
    gender : patientarray['gender'],
    height : patientarray['height'],
    weight: patientarray['weight'],
    is_adult: patientarray['is_adult'],
    allergy: formatAllergy(patientarray['allergy']),
    diagnosis: formatDiagnosis(patientarray['diagnosis']),
    comorbidity: formatComorbidity(patientarray['comorbidity']),
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

function formatComorbidity(comorbidity) {
  let comorbidityArray = [];
  for(let index in comorbidity){
    if(comorbidity.hasOwnProperty(index)){
      comorbidityArray.push(comorbidity[index].comorbidity);
    }
  }
  return comorbidityArray;
}



function formatTestList(testList){

  let test = {
    id: testList['id'],
    code : testList['patient'].code,
    prescription_id : testList['prescription_id'],
    category_name : testList['indicator'].category['categoryName'],
    in_use : testList['indicator'].category['in_use2020'],
    description : testList['indicator'].description,
    risk_level : testList['risk_level'],
    drug_name : testList['drug_name'],
    drug_dose : testList['drug_dose'],
    route: testList['route'],
    duration: testList['duration'],
    drug_frequency: testList['drug_frequency']
  };
  return test;

}

function groupTests(test){


}



