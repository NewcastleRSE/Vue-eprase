<template>
  <div>
    <table id="test-patients">
      <tr>
        <td>
          <strong>Name</strong>
        </td>
        <td>
          <strong>Date of Birth</strong>
        </td>
        <td>
          <strong>Gender</strong>
        </td>
      </tr>
    <tr v-for="patient in patientList">
      <td>
        {{patient.first_name}} {{patient.surname}}
      </td>
      <td>
        {{patient.dob}}
      </td>
      <td>
        {{patient.gender}}
      </td>
    </tr>
    </table>
  </div>

</template>

<script>
    import json from '../json/patients.json'

    export default {
        name: "Patients",
        components: {
        },
        data() {
            return {
                patients : json,
                numPatients : 0,
                patientList : [],
                patientIds : []
            }
        },
        methods: {
            setPatients: function() {

               this.numPatients = this.patients.length;
               let patientIndex = [];

                // create a list of 10 patient indexes randomly from all patients
                for(let i = 0; i < this.numPatients; i++){
                    let index = Math.floor(Math.random() * this.numPatients);
                    if(patientIndex.length < 10){
                        // don't want the same patient twice
                        if (!(patientIndex.includes(index))) {
                            patientIndex.push(index);
                        }
                    }
                }

                // loop through indexes and set the patient list and patient id list
                for(let i = 0; i < patientIndex.length; i++) {
                    this.patientList.push(this.patients[patientIndex[i]]);
                    let patient = this.patients[patientIndex[i]];
                    this.patientIds.push(patient.id);
                }

                // set the data in the central store
                const patientList = this.patientList;
                const patientIds = this.patientIds;
                this.$store.dispatch('setPatientList', { patientList, patientIds });

                // fix patient DOBs
                for(let i = 0; i < this.patientList.length; i++) {
                    this.patientList[i].dob = this.getDOB(this.patientList[i]);
                }
            },
            getDOB(patient)
            {
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
        },
        created: function() {
            this.setPatients();
        }
    }
</script>

<style scoped>

  #test-patients {
    padding: 15px;
    margin-top: 20px;
    margin-bottom: 20px;
    width: 600px;
    border: 1px solid #6b9bc7;
  }


  #test-patients td {
    width: 150px;
    font-size: 16px;
    background-color: #cdf8ff;
    padding: 5px;
    border:  1px solid #6b9bc7;
  }


</style>
