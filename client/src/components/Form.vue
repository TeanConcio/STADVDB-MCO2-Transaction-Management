<template>
  <form @submit.prevent="submitForm">
    <div>
      <label>
        Patient Name:
        <input v-model="patient_name" type="text" />
      </label>
      <label>
        Patient Age:
        <input v-model="patient_age" type="number" />
      </label>
    </div>
    <div>
      <label>
        Doctor Name:
        <input v-model="doctor_name" type="text" />
      </label>
      <label>
        Doctor Specialty:
        <input v-model="doctor_specialty" type="text" />
      </label>
    </div>
    <div>
      <label>
        Clinic Name:
        <input v-model="clinic_name" type="text" />
      </label>
      <label>
        Clinic City:
        <input v-model="clinic_city" type="text" />
      </label>
    </div>
    <div>
      <label>
        Island Group:
        <select v-model="island_group">
          <option disabled value="">Please select an island group</option>
          <option>Luzon</option>
          <option>Visayas</option>
          <option>Mindanao</option>
        </select>
      </label>
    </div>
    <div>
      <label>
        Appointment Date:
        <input v-model="appointment_date" type="date" />
      </label>
      <label>
        Appointment Status:
        <select v-model="appointment_status">
          <option disabled value="">Please select a status</option>
          <option>Cancel</option>
          <option>Complete</option>
          <option>NoShow</option>
          <option>Queued</option>
          <option>Serving</option>
          <option>Skip</option>
        </select>
      </label>
    </div>
    <div>
      <button class="submit-button" type="submit" @click="createAppointment">Submit</button>
    </div>
  </form>
</template>

<script>

export default{
    data(){
      return{
        patient_name : "",
        patient_age : 0,
        doctor_name : "",
        doctor_specialty : "",
        clinic_name : "",
        clinic_city : "",
        island_group : "",
        appointment_date : "",
        appointment_status :"",
        time_queued : "",
      }
    },

    methods: {
      async createAppointment(){
        const patient_name = this.patient_name
        const patient_age = this.patient_age
        const doctor_name = this.doctor_name
        const doctor_specialty = this.doctor_specialty
        const clinic_name = this.clinic_name
        const clinic_city = this.clinic_city
        const island_group = this.island_group
        const appointment_date = this.appointment_date
        const appointment_status = this.appointment_status
        const time_queued = this.time_queued
        const jString = JSON.stringify({patient_name, patient_age, doctor_name, doctor_specialty, clinic_name, clinic_city, island_group, appointment_date, appointment_status, time_queued})
        const response = await fetch(`http://localhost:8081/appointments/`, {
            method: "POST",
            body: jString,
            headers: {
              "Content-Type": "application/json"
            }
        });

        const insert = await response.json()
        this.$emit('notifyInsert', insert.apt_id)
        console.log(response);
      }
    }
  }
  /*
import { ref, computed, defineProps } from 'vue';

const props = defineProps({
  allFieldsRequired: {
    type: Boolean,
    default: false
  }
});

const patientName = ref('');
const patientAge = ref('');
const doctorName = ref('');
const doctorSpecialty = ref('');
const clinicName = ref('');
const clinicCity = ref('');
const islandGroup = ref('');
const appointmentDate = ref('');
const appointmentStatus = ref('');
const timeQueued = ref('');

const isFormValid = computed(() => {
  const isValid = [patientName, patientAge, doctorName, doctorSpecialty, clinicName, clinicCity, islandGroup, appointmentDate, appointmentStatus, timeQueued].every(field => field.value !== '');
  console.log('Is form valid:', isValid);
  return isValid;
});

const submitForm = () => {
  console.log('Form submitted. Is form valid:', isFormValid.value);
  if (!isFormValid.value) {
    console.log('Form is invalid. Not submitting.');
    alert('All fields are required. Please fill out all fields.');
    return;
  }

  console.log('Submitted fields:');
  console.log('Patient Name:', patientName.value);
  console.log('Patient Age:', patientAge.value);
  console.log('Doctor Name:', doctorName.value);
  console.log('Doctor Specialty:', doctorSpecialty.value);
  console.log('Clinic Name:', clinicName.value);
  console.log('Clinic City:', clinicCity.value);
  console.log('Island Group:', islandGroup.value);
  console.log('Appointment Date:', appointmentDate.value);
  console.log('Appointment Status:', appointmentStatus.value);
  console.log('Time Queued:', timeQueued.value);
  // Submit the form
};
*/
</script>
<style scoped>
#app, .form {
  text-align: left;
  width: 100%;
}
.form label,
.form input,
.form select {
  display: block;
  width: 100%;
}
.submit-button {
  margin: 35px auto 0;
}
form div {
  margin-bottom: 10px;
}
label {
  margin-right: 10px;
}
</style>