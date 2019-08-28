import json from '../json/patients.json'
import { store } from '../store/index';

let numPatients = 10;
let numTests = 20;

export const patientService = {
  setPatients,
  getPatients,
  getDOB,
  numPatients,
  numTests
};

function setPatients() {

  const patients = json;
  const patientList = [];
  const patientIds = [];
  const patientIndex = [];

  const numPatients = patients.length;

  // create a list of 10 patient indexes randomly from all patients
  for(let i = 0; i < numPatients; i++){
    let index = Math.floor(Math.random() * numPatients);
    if(patientIndex.length < 10){
      // don't want the same patient twice
      if (!(patientIndex.includes(index))) {
        patientIndex.push(index);
      }
    }
  }

  // loop through indexes and set the patient list and patient id list
  for(let i = 0; i < patientIndex.length; i++) {
    patientList.push(patients[patientIndex[i]]);
    let patient = patients[patientIndex[i]];
    patientIds.push(patient.id);
  }

  store.dispatch('setPatientList', { patientList, patientIds });

  // fix patient DOBs
  for(let i = 0; i < patientList.length; i++) {
    patientList[i].dob = patientService.getDOB(patientList[i]);
  }
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
