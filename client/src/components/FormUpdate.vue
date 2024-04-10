<template>
  <form @submit.prevent="updateAppointment">
    <div>
      <label>
        Patient Name:
        <input v-model="patient_name" type="text" @input="checkInputs"/>
      </label>
      <label>
        Patient Age:
        <input v-model="patient_age" type="number" @input="checkInputs"/>
      </label>
    </div>
    <div>
      <label>
        Doctor Name:
        <input v-model="doctor_name" type="text" @input="checkInputs"/>
      </label>
      <label>
        Doctor Specialty:
        <input v-model="doctor_specialty" type="text" @input="checkInputs"/>
      </label>
    </div>
    <div>
      <label>
        Clinic Name:
        <input v-model="clinic_name" type="text" @input="checkInputs"/>
      </label>
      <label>
        Clinic City:
        <input v-model="clinic_city" type="text" @input="checkInputs"/>
      </label>
    </div>
    <div>
      <label>
        Island Group:
        <select disabled v-model="island_group">
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
        <input v-model="appointment_date" type="date" @input="checkInputs"/>
      </label>
      <label>
        Appointment Status:
        <select v-model="appointment_status" @input="checkInputs">
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
      <label>
        Time Queued:
        <input v-model="time_queued" type="text" disabled />
      </label>
    </div>
    <div>
      <button ref="submit" class="submit-button" type="submit" @click="updateAppointment">Submit</button>
    </div>
  </form>
</template>

<script>

export default {
  name: 'FormUpdate',
  props: ['appointment'],

  data() {
    return {
      patient_name : this.appointment.patientName,
      patient_age : this.appointment.patientAge,
      doctor_name : this.appointment.doctorName,
      doctor_specialty : this.appointment.doctorSpecialty,
      clinic_name : this.appointment.clinicName,
      clinic_city : this.appointment.clinicCity,
      appointment_date : this.appointment.appointmentDate,
      appointment_status : this.appointment.appointmentStatus,
      id : this.appointment.apt_id,
      time_queued: new Date(this.appointment.timeQueued),
      island_group: this.appointment.islandGroup,
      server_url: import.meta.env.VITE_SERVER_URL
    };
  },
  methods: {
    async updateAppointment() {
      const patient_name = this.patient_name;
      const patient_age = this.patient_age;
      const doctor_name = this.doctor_name;
      const doctor_specialty = this.doctor_specialty;
      const clinic_name = this.clinic_name;
      const clinic_city = this.clinic_city;
      const appointment_date = this.appointment_date;
      const appointment_status = this.appointment_status;
      const time_queued = this.time_queued;
      const island_group = this.island_group;
      // Add more form fields as needed...

      console.log(this.appointment.apt_id)

      const jString = JSON.stringify({patient_name, patient_age, doctor_name, doctor_specialty, clinic_name, clinic_city, appointment_date, appointment_status, time_queued, island_group});
      console.log(jString)
      const response = await fetch(`${this.server_url}/appointments/${this.appointment.apt_id}`, {
        method: "PATCH",
        body: jString,
        headers: {
          "Content-Type": "application/json"
        }
      });

      const update = await response.json();
      console.log(update)
      this.$emit('notifyUpdate', update);
    },

    checkInputs(){
      if(this.patient_name == "" || this.patient_age == "" || this.doctor_name == "" || this.doctor_specialty == "" || this.clinic_name == "" || this.clinic_city == "" || this.appointment_date == "" || this.appointment_status == ""){
        this.$refs.submit.disabled = true
        this.$refs.submit.textContent = "All fields must be filled out"
      }else{
        this.$refs.submit.disabled = false
        this.$refs.submit.textContent = "Submit"
      }
    }

  },

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