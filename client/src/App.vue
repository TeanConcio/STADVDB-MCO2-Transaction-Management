<script setup>
import { ref } from 'vue';
import FormComponent from './components/Form.vue';
import Search from './components/Search.vue';
import SearchFormComponent from './components/SearchForm.vue'; //This is the same as Form.vue but allows null, can't get it to work with just form

const tab = ref('insert');
const showForm = ref(false);
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
      <SearchForm v-if="showForm" @notify="updateAppointments($event)"/>
    </div>

    <div class="tabs">
      <button :class="{ active: tab === 'insert' }" @click="selectTab('insert')">Insert</button>
      <button :class="{ active: tab === 'update' }" @click="selectTab('update')">Update</button>
      <button :class="{ active: tab === 'delete' }" @click="selectTab('delete')">Delete</button>
    </div>
    
    <FormComponent v-if="tab === 'insert'" :allFieldsRequired="true" @notifyInsert="displayInsert($event)"/>

    <!-- Check if ID exists, then shows form. If field not filled out, keep as is -->
    <div v-if="tab === 'update'">
      <form @submit.prevent="submitSearch">
        <input v-model="updateInput" type="text" placeholder="Enter ID to update"/>
        <button type="submit">Search</button>
      </form>
      <FormUpdate v-if="appointmentToUpdate" :allFieldsRequired="true" :appointment="appointmentToUpdate" @notifyUpdate="displayUpdate($event)"/>
      <p v-else-if="updateInput">No appointment found with ID: {{ updateInput }}</p>
    </div>

    <!-- Check if ID exists, if exists, show delete button -->
    <div v-if="tab === 'delete'">
      <form @submit.prevent="searchAppointmentToDelete">
        <input v-model="deleteInput" type="text" placeholder="Enter ID to delete"/>
        <button type="submit">Search</button>
      </form>
      <div v-if="deleteStatus === 'found'">
        <p>Appointment found. Are you sure you want to delete it?</p>
        <div>
          <p>Apt ID: {{ appointmentToDelete.apt_id }}</p>
          <p>Patient Name: {{ appointmentToDelete.patient_name }}</p>
          <p>Patient Age: {{ appointmentToDelete.patient_age }}</p>
          <p>Doctor Name: {{ appointmentToDelete.doctor_name }}</p>
          <p>Doctor Specialty: {{ appointmentToDelete.doctor_specialty }}</p>
          <p>Clinic Name: {{ appointmentToDelete.clinic_name }}</p>
          <p>Clinic City: {{ appointmentToDelete.clinic_city }}</p>
          <p>Island Group: {{ appointmentToDelete.island_group }}</p>
          <p>Appointment Date: {{ appointmentToDelete.appointment_date }}</p>
          <p>Appointment Status: {{ appointmentToDelete.appointment_status }}</p>
        </div>
        <button @click="deleteAppointment(appointmentToDelete.apt_id)">Confirm Delete</button>
      </div>
      <p v-else-if="deleteStatus === 'not found'">No appointment found with ID: {{ deleteInput }}</p>
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
import FormUpdate from './components/FormUpdate.vue';
import SearchForm from './components/SearchForm.vue';

export default{
  components: {
    Search,
    FormUpdate
  },
  
  data(){
    return{
      appointments : [],
      node1Status : false,
      node2Status : false,
      node3Status : false,
      updateInput : "",
      deleteInput: "",
      deleteStatus: '',
      updateInput: '',
      appointmentToUpdate: null
    };
  },
  watch: {
    updateInput(newId) {
      this.searchAppointment(newId);
    }
  },

  methods:{
    updateAppointments(appointments){
      console.log("EVENT TRIGGERED")
      //console.log(appointments)
      this.appointments = appointments
    },

    async displayInsert(insert){
      try {
        console.log("EVENT TRIGGERED")
        console.log(insert)
        const response = await fetch(`http://localhost:8081/appointments/${insert}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
          throw new Error('Server response was not ok');
        }

        const data = await response.json()
        console.log(data)
        this.appointments = []
        this.appointments.push(data)
      } catch (error) {
        console.error('Failed to insert appointment:', error);
        this.errorMessage = 'Failed to insert appointment. Please try again later.';
      }
    },

    async displayUpdate(apt_id){
      try {
        console.log("EVENT TRIGGERED")
        const response = await fetch(`http://localhost:8081/appointments/${apt_id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
          throw new Error('Server response was not ok');
        }

        const data = await response.json()
        this.appointments = []
        this.appointments.push(data)
      } catch (error) {
        console.error('Failed to update appointment:', error);
        this.errorMessage = 'Failed to update appointment. Please try again later.';
      }
    },

    log(){
      console.log(this.updateInput);
    },

    submitSearch() {
    console.log("Submit search triggered with input:", this.updateInput);
    this.searchAppointment(this.updateInput);
  },

    async getStatus(){
      const response = await fetch(`http://localhost:8081/ping`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
      });

      const data = await response.json()
      //console.log(data)
      this.node1Status = data.central_db_status
      this.node2Status = data.luzon_db_status
      this.node3Status = data.vismin_db_status
    },

    async confirmDelete(){
      console.log(this.deleteInput)
      const response = await fetch(`http://localhost:8081/appointments/${this.deleteInput}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
      });

      const data = await response.json()
      console.log(data.apt_id)
      const response2 = await fetch(`http://localhost:8081/appointments/${data.apt_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
      });
      const data2 = await response2.json()
      this.appointments = []
      this.appointments.push(data2)
    },

    async searchAppointment(id) {
      try {
        console.log("Search appointment triggered with ID:", id);
        const response = await fetch(`http://localhost:8081/appointments/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await response.json();
        console.log("Search appointment response:", data);
        if (data) {
          this.appointmentToUpdate = data;
        } else {
          this.appointmentToUpdate = null;
        }
      } catch (error) {
        console.error('Failed to search appointment:', error);
        this.errorMessage = 'Failed to search appointment. Please try again later.';
      }
  },

  async searchAppointmentToDelete() {
    const response = await fetch(`http://localhost:8081/appointments/${this.deleteInput}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
    }
  });

      const data = await response.json();
      console.log("Search appointment to delete response:", data);

      if (data && data.apt_id) {
        this.appointmentToDelete = data;
        this.deleteStatus = 'found';
      } else {
        this.appointmentToDelete = null;
        this.deleteStatus = 'not found';
      }
    },

    async deleteAppointment(id) {
      try {
        const response = await fetch(`http://localhost:8081/appointments/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error('Server response was not ok');
        }

        console.log(`Appointment with ID ${id} deleted successfully.`);
        this.appointmentToDelete = null;
        this.deleteStatus = 'not found';
      } catch (error) {
        console.error(`Failed to delete appointment with ID ${id}.`, error);
        this.errorMessage = 'Failed to delete appointment. Please try again later.';
      }
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