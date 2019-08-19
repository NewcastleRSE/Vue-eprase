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
    import Patient from './Patient'

    export default {
        name: "Patients",
        components: {
          Patient
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

                // create a list of 10 patients randomly
                for(let i = 0; i < this.numPatients; i++){
                    let index = Math.floor(Math.random() * this.numPatients);

                    if(!this.patientIds.includes(index)){
                        this.patientIds.push(index);
                        if(this.patientIds.length <= 10){
                            this.patientList.push(this.patients[index]);
                        }
                    }
                }

                // set patient DOBs
                for(let i = 0; i < this.patientList.length; i++) {
                    this.patientList[i].dob = this.getDOB(this.patientList[i]);
                }
            },
            getPatients: function () {
                return this.patientList;
            },
            getDOB(patient)
            {
                // get today's date
                var today = new Date();

                //randomise the date within the last 12 months
                var days = Math.random() * 360;
                today.setDate(today.getDate()-days);

                // get date string info
                var d = today.getDate();
                var m = today.getMonth() + 1;
                var yyyy = today.getFullYear();

                // subtract patient's age
                yyyy = yyyy - patient.age;

                var dd = d.toString();
                var mm = m.toString();

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
