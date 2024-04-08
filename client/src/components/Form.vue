<template>
  <form @submit.prevent="submitForm">
    <div>
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