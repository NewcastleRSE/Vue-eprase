import jsonpatients from '../json/patients.json'
import jsontests from '../json/prescriptions.json'
import jsonerrors from '../json/configerror.json'
import { store } from '../store/index';

let numPrescriptions = 19;

export const patientService = {
  setPatients,
  getPatients,
  getDOB,
  getNumPatients,
  getPatientIndex,
  getTestIndex,
  numPrescriptions
};

function setPatients() {

  const patients = jsonpatients;
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
     // console.log('Added to testIndex ' + index);

      if (testList.length <= numPrescriptions) {
        testList.push(tests[index]);
        patientIds.push(tests[index].patient_id);
      }
    }
  }

  // loop through patients and set the patient list
  for(let index in patients)
  {
    if(patients.hasOwnProperty(index)){
      let id = patients[index].id;
      if (patientIds.includes(id)){
        patientList.push(patients[index]);
      }
    }
  }

  for(let i = 0; i < patientList.length; i++) {
    // fix patient DOBs
    patientList[i].dob = patientService.getDOB(patientList[i]);

    // assign id and name to local storage
    let myid = patientList[i].id;
    let myname = patientList[i].first_name + ' ' + patientList[i].surname;
    localStorage.setItem(myid, myname);
  }

  localStorage.setItem('numPatients', patientList.length);
  store.dispatch('setPatientList', { patientList, patientIds, testList });

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

