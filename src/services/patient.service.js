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
  getTestList,
  getPatientTests,
  getPatientIds,
  setPatientsInStore,
  setPatientsInStoreFromIds,
  setConfigErrors,
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

function setConfigErrors() {

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
    let testList = JSON.parse(localStorage.getItem('testList'));

    // splice the config errors into allTests at the insertPoints (array length changes after each insert)
    for(let i = 0; i < insertPoints.length; i++){
      // add new element without deleting anything
      testList.splice(insertPoints[i], 0, configErrors[i]);
    }
    // update the test list
    store.dispatch('setTestList', { testList });
  });
}

function setPatientsInStore(patient_type) {

  let patients = [];
  let tempList = [];
  const adultPatientList = [];
  const childPatientList = [];
  const allPatientList = [];
  let patientList = [];
  let testList = [];

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
        }
        else {
          childPatientList.push(mypatient);
        }
        allPatientList.push(mypatient);
      }
    }

    let requiredAdultPatients = [];
    let requiredChildPatients = [];
    let allRequiredPatients = [];
  //  let numRequiredChildPatients = settings.numRequiredChildPatients;
  //  let numRequiredAdultPatients = settings.numRequiredAdultPatients;
    let numAllRequiredPatients = settings.numAllRequiredPatients;

    getRequiredTests().then(data => {
      let tests = data;
      for(let test in tests) {
        if (tests.hasOwnProperty(test)) {
          let requiredPatient = tests[test].patient;
          requiredPatient = formatPatientData(requiredPatient);
          if(requiredPatient.age >= 18){
            requiredAdultPatients.push(requiredPatient);
          }
          else {
            requiredChildPatients.push(requiredPatient);
          }
          allRequiredPatients.push(requiredPatient);
        }
      }
    });

    if(patient_type === 'Adults'){

      let myAdultPatientList = adultPatientList;
      shuffle(myAdultPatientList);

      // (currently 20 patients, but may increase)
      let numAdultPatients = myAdultPatientList.length;
      let diff = numAdultPatients - 15;
      // diff += numRequiredAdultPatients;

      // reduce number of patients (5)
      myAdultPatientList.splice(0,diff);

      // check to see if the list contains any required patients (works with single required at the moment)
      if(!myAdultPatientList.includes(requiredAdultPatients)){
        // add the required patients
         myAdultPatientList.concat(requiredAdultPatients);
      }

      for(let index in myAdultPatientList){
        if(myAdultPatientList.hasOwnProperty(index)){
           let id = myAdultPatientList[index].id;

           // promise, must return testList
           getPatientTests(id).then(data => {
            tempList = data;
            for(let i = 0; i < tempList.length; i++){
              testList.push(tempList[i]);
            }
             store.dispatch('setTestList', { testList });
             localStorage.setItem('testList',  JSON.stringify(testList));

           });

          for(let i = 0; i < patientList.length; i++) {
            // fix patient DOBs
            myAdultPatientList[i].dob = patientService.getDOB(myAdultPatientList[i]);

            // assign id and name to local storage
            let myid = myAdultPatientList[i].code;
            let myname = myAdultPatientList[i].first_name + ' ' + myAdultPatientList[i].surname;
            localStorage.setItem(myid, myname);
          }

          localStorage.setItem('numPatients', myAdultPatientList.length);
          patientList = myAdultPatientList;
        }
      }

    }
    else if (patient_type === 'Paediatrics'){

      let myChildPatientList = childPatientList;

      // currently correct number of child patients
      myChildPatientList.concat(requiredChildPatients);
      myChildPatientList = _.uniq(myChildPatientList);
      shuffle(myChildPatientList);


      for(let index in myChildPatientList){
        if(myChildPatientList.hasOwnProperty(index)){
          let id = myChildPatientList[index].id;
          getPatientTests(id).then(data => {
            tempList = data;
            for(let i = 0; i < tempList.length; i++){
              testList.push(tempList[i]);
            }
            store.dispatch('setTestList', { testList});
            localStorage.setItem('testList',  JSON.stringify(testList));
          });
        }
      }

      for(let i = 0; i < myChildPatientList.length; i++) {
        // fix patient DOBs
        myChildPatientList[i].dob = patientService.getDOB(myChildPatientList[i]);

        // assign id and name to local storage
        let myid = myChildPatientList[i].code;
        let myname = myChildPatientList[i].first_name + ' ' + myChildPatientList[i].surname;
        localStorage.setItem(myid, myname);
      }

      localStorage.setItem('numPatients', myChildPatientList.length);
      patientList = myChildPatientList;
    }
    else if (patient_type === 'Both'){

      let myAllPatientList = allPatientList;
      shuffle(myAllPatientList);

      // (currently 35 patients, but may increase)
      let numAllPatients = myAllPatientList.length;
      let diff = numAllPatients - 15;
      //diff += numAllRequiredPatients;

      // reduce number of patients (currently 35 patients)
      myAllPatientList.splice(0, diff);

      // add the required patients, reduce list if necessary
      myAllPatientList.concat(allRequiredPatients);
      myAllPatientList = _.uniq(myAllPatientList);

      for(let index in myAllPatientList){
        if(myAllPatientList.hasOwnProperty(index)){
          let id = myAllPatientList[index].id;
          getPatientTests(id).then(data => {
            tempList = data;
            for(let i = 0; i < tempList.length; i++){
              testList.push(tempList[i]);
            }
            store.dispatch('setTestList', { testList});
            localStorage.setItem('testList',  JSON.stringify(testList));
          });
        }
      }

      for(let i = 0; i < myAllPatientList.length; i++) {
        // fix patient DOBs
        myAllPatientList[i].dob = patientService.getDOB(myAllPatientList[i]);

        // assign id and name to local storage
        let myid = myAllPatientList[i].code;
        let myname = myAllPatientList[i].first_name + ' ' +  myAllPatientList[i].surname;
        localStorage.setItem(myid, myname);
      }

      localStorage.setItem('numPatients', myAllPatientList.length);
      patientList = myAllPatientList;
    }

    store.dispatch('setPatientList', { patientList });

  });
}

function setPatientsInStoreFromIds() {

  let patient_ids = [];
  let patient_codes = [];
  let tempList = [];
  let patientList = [];
  let testList = [];

  getPatientIds().then(data => {

      let ids = data.split(',');
      ids.forEach(function(obj){
        patient_ids.push(parseInt(obj));
      });
      if(isNaN(patient_ids[patient_ids.length-1])){
        patient_ids.pop();
      }

      for(let index in patient_ids){
          if(patient_ids.hasOwnProperty(index)){
              let id = patient_ids[index];

              // promise, must return testList
              getPatientTests(id).then(data => {
                  tempList = data;
                  for(let i = 0; i < tempList.length; i++){
                    testList.push(tempList[i]);
                  }
                  store.dispatch('setTestList', { testList });
                  localStorage.setItem('testList',  JSON.stringify(testList));
              });

              getPatientById(id).then(patient => {
                  patient.dob = patientService.getDOB(patient);
                  patient.allergy = formatAllergy(patient['allergy']);
                  patient.comorbidity = formatComorbidity(patient['comorbidity']);
                  patient.diagnosis = formatDiagnosis(patient['diagnosis']);
                  let myid = patient.code;
                  let myname = patient.first_name + ' ' + patient.surname;
                  localStorage.setItem(myid, myname);
                  patientList.push(patient);
              });
          }
      }
      localStorage.setItem('numPatients', patient_ids.length);
      store.dispatch('setPatientList', { patientList });
  })
}


function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function insertConfigErrors(i, testList, insertPoints, configErrors){

  // loop through the insertpoints
  for(let j = 0; j < insertPoints.length; j++){
      // add new element without deleting anything
     console.log('Inserting config error at ' + insertPoints[j]);
     if(i === insertPoints[j]){
       testList.push(configErrors[j]);
     }
     return testList;
  }

  store.dispatch('setTestList', { testList});
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



// used by setPatientsInStoreFromIds, (when patient ids are drawn from the database)
function getPatientById(patient_id) {

  let token = getToken();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(settings.baseUrl + 'patientById?PATIENT_ID=' + patient_id, requestOptions)
    .then(handleResponse)
    .then(response => {

      return response;
    })
    .catch(function() {
      console.log('Error returning from getPatientById');
    });
}


// takes patient ID as param, used by setPatientsinStore
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


// used by setPatientsInStoreFromIds
function getPatientIds() {

  let token = getToken();
  let institution_id = getInstitutionId();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(settings.baseUrl + 'getPatientIds?INSTITUTION_ID=' + institution_id , requestOptions)
    .then(handleTextResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from getPatientIds');
    });
}


// used by setPatientsinStore
function getRequiredTests() {

  let token = getToken();

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(settings.baseUrl + 'requiredtests', requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(function() {
      console.log('Error returning from getRequiredTests');
    });

}

function getPatients() {
    let mypatients = store.state.patientList;
    return mypatients;
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

function handleTextResponse(response) {
  return response.text().then(text => {
    const data = text;
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


// store getters

function getPatientIndex() {
  return store.state.patientIndex;
}

function getTestList() {
  return store.state.testList;
}

function getTestIndex() {
  return store.state.testIndex;
}

// local storage getters

function getNumPatients() {
  return localStorage.getItem('numPatients');
}

function getInstitutionId() {
  return localStorage.getItem('institutionId');
}

function getToken(){
  return localStorage.getItem('token');
}



