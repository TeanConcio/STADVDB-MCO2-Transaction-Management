<script setup>
import { ref } from 'vue';
import FormComponent from './components/Form.vue';
import Search from './components/Search.vue';
import SearchFormComponent from './components/SearchForm.vue'; //This is the same as Form.vue but allows null, can't get it to work with just form

const tab = ref('insert');
const showForm = ref(false);
const updateInput = ref('');
const deleteInput = ref('');
const showDevPanel = ref(false);

const sampleData = ref({
  id: 123,
  patientName: 'John Doe',
  patientAge: 30,
  doctorName: 'Dr. Smith',
  doctorSpecialty: 'Cardiology',
  clinicName: 'Health Clinic',
  clinicCity: 'New York',
  islandGroup: 'Luzon',
  appointmentDate: '2022-01-01',
  appointmentStatus: 'Queued',
  timeQueued: '08:00'
});

const selectTab = (selectedTab) => {
  tab.value = selectedTab;
};

const toggleForm = () => {
  showForm.value = !showForm.value;
};

const toggleDevPanel = () => {
  showDevPanel.value = !showDevPanel.value;
}
</script>

<template>
  <div id="app">

    <div class="navbar">
      <button @click="toggleForm">Search</button>
      <Search v-if="showForm" @notify="updateAppointments($event)"/>
    </div>

    <div class="tabs">
      <button :class="{ active: tab === 'insert' }" @click="selectTab('insert')">Insert</button>
      <button :class="{ active: tab === 'update' }" @click="selectTab('update')">Update</button>
      <button :class="{ active: tab === 'delete' }" @click="selectTab('delete')">Delete</button>
    </div>
    
    <FormComponent v-if="tab === 'insert'" :allFieldsRequired="true" />

    <!-- Check if ID exists, then shows form. If field not filled out, keep as is -->
    <div v-if="tab === 'update'">
      <input v-model="updateInput" type="text" placeholder="Enter ID to update">
      <FormComponent v-if="updateInput" :allFieldsRequired="true" />
    </div>

    <!-- Check if ID exists, if exists, show delete button -->
    <div v-if="tab === 'delete'">
      <input v-model="deleteInput" type="text" placeholder="Enter ID to delete">
      <button v-if="deleteInput" @click="confirmDelete">Confirm Deletion</button>
    </div>
  </div>

  <div>
    <h1>Appointments</h1>
            <ul>
                <!-- Iterate over filteredAppointments instead of appointments -->
                <li v-for="appointment in appointments" :key="appointment.id">
                    {{ appointment.apt_id }} - {{appointment.patient_name}} - {{appointment.patient_age}} - {{appointment.doctor_name}} - {{appointment.doctor_specialty}} - {{appointment.clinic_name}} - {{appointment.clinic_city}} - {{appointment.island_group}} -- {{appointment.appointment_date}} - {{appointment.appointment_status}} - {{appointment.time_queued}}
                </li>
          </ul>
  </div>

  <button class="dev-button" @click="toggleDevPanel">DEV</button>
    <div class="dev-panel" v-if="showDevPanel">
      <h2>Node Status</h2>
      <p>Node 1: {{ node1Status }}</p>
      <p>Node 2: {{ node2Status }}</p>
      <p>Node 3: {{ node3Status }}</p>
      <button @click="getStatus">Refresh</button>
    </div>

</template>

<script>

import Search from './components/Search.vue';

export default{
  components: {
    Search
  },
  
  data(){
    return{
      appointments : [],
      node1Status : false,
      node2Status : false,
      node3Status : false,
    }
  },

  methods:{
    updateAppointments(appointments){
      console.log("EVENT TRIGGERED")
      this.appointments = appointments
    },

    async getStatus(){
      const response = await fetch(`http://localhost:8081/ping`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
      });

      const data = await response.json()
      this.node1Status = data.central_status
      this.node2Status = data.luzon_status
      this.node3Status = data.vismin_status
    }
  },

  async mounted() {
    // Fetch initial appointments data when the component is mounted
    const max_records = 50;
    const response = await fetch('http://localhost:8081/appointments', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    // Push fetched data to the appointments array
    for (let x = 0; x < Math.min(max_records, data.length); x++) {
        this.appointments.push(data[x]);
    }
  }
}

</script>

<style scoped>
#app {
  text-align: left;
  width: 100%;
}
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: #333;
  color: white;
  padding: 10px 0;
  padding-left: 20px;
}
.navbar button {
  color: white;
  background-color: #555;
  border: none;
  padding: 10px;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 10px;
}
.navbar button:hover, .active {
  background-color: #777;
}

.dev-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px;
  background-color: #555;
  color: white;
  border: none;
  cursor: pointer;
}

.dev-panel {
  position: fixed;
  bottom: 60px;
  right: 20px;
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ccc;
  width: 200px;
  color: black;
}
</style>