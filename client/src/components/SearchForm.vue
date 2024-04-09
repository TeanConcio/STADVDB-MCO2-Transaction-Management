<!-- This is the same as Form.vue but allows null, can't get it to work with just form-->
<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>
        Patient ID:
        <input v-model="patientID" type="number" />
      </label>
      <label>
        Patient Name:
        <input v-model="patientName" type="text" />
      </label>
      <label>
        Patient Age:
        <input v-model="patientAge" type="number" />
      </label>
    </div>
    <div>
      <label>
        Doctor Name:
        <input v-model="doctorName" type="text" />
      </label>
      <label>
        Doctor Specialty:
        <input v-model="doctorSpecialty" type="text" />
      </label>
    </div>
    <div>
      <label>
        Clinic Name:
        <input v-model="clinicName" type="text" />
      </label>
      <label>
        Clinic City:
        <input v-model="clinicCity" type="text" />
      </label>
    </div>
    <div>
      <label>
        Island Group:
        <select v-model="islandGroup">
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
        <input v-model="appointmentDate" type="date" />
      </label>
      <label>
        Appointment Status:
        <select v-model="appointmentStatus">
          <option disabled value="">Please select a status</option>
          <option>Cancel</option>
          <option>Complete</option>
          <option>NoShow</option>
          <option>Queued</option>
          <option>Serving</option>
          <option>Skip</option>
        </select>
      </label>
      <label>
        Time Queued:
        <input v-model="timeQueued" type="time" />
      </label>
    </div>
    <div>
      <button class="submit-button" type="submit">Submit</button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';

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

const handleSubmit = () => {
  console.log('Form submitted with the following data:');
  console.log({
    patientName: patientName.value,
    patientAge: patientAge.value,
    doctorName: doctorName.value,
    doctorSpecialty: doctorSpecialty.value,
    clinicName: clinicName.value,
    clinicCity: clinicCity.value,
    islandGroup: islandGroup.value,
    appointmentDate: appointmentDate.value,
    appointmentStatus: appointmentStatus.value,
    timeQueued: timeQueued.value,
  });
};
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