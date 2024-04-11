<template>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>
          Appointment ID:
          <input v-model="apt_id" type="number" />
        </label>
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
        <label>
          Time Queued:
          <input v-model="time_queued" type="time" />
        </label>
      </div>
      <div>
        <button class="submit-button" type="submit" @click="searchAppointments">Submit</button>
        <p id="errors" :style="{ color: 'red'}">{{error}}</p>
      </div>
    </form>
  </template>

<script>
export default{

    props: ['sleep'],
    data() {
        return{
        appointments: [],
        apt_id: null,
        patient_name: null,
        patient_age: null,
        doctor_name: null,
        doctor_specialty: null,
        clinic_name: null,
        clinic_city: null,
        island_group: null,
        appointment_date: null,
        appointment_status: null,
        time_queued: null,
        error: "",
        server_url: import.meta.env.VITE_SERVER_URL,
        };
    },
    methods: {
        
                async searchAppointments() {

                    const max_records = 50
                    let object = {}
                    if(this.apt_id){
                        object['apt_id'] = this.apt_id
                    }
                    if(this.patient_name){
                        object['patient_name'] = this.patient_name
                    }
                    if(this.patient_age){
                        object['patient_age'] = this.patient_age
                    }
                    if(this.doctor_name){
                        object['doctor_name'] = this.doctor_name
                    }
                    if(this.doctor_specialty){
                        object['doctor_specialty'] = this.doctor_specialty
                    }
                    if(this.clinic_name){
                        object['clinic_name'] = this.clinic_name
                    }
                    if(this.clinic_city){
                        object['clinic_city'] = this.clinic_city
                    }
                    if(this.island_group){
                        object['island_group'] = this.island_group
                    }
                    if(this.appointment_date){
                        object['appointment_date'] = this.appointment_date
                    }
                    if(this.appointment_status){
                        object['appointment_status'] = this.appointment_status
                    }
                    if(this.time_queued){
                        object['time_queued'] = this.time_queued
                    }

                    try{
                    // Perform search operation (e.g., fetch data from server based on search criteria)
                    // You can implement this based on your specific requirements
                    // For demonstration purpose, let's assume it fetches data from the server
                        
                        console.log(object)
                        const jString = JSON.stringify(object)
                        if(object){
                          console.log("Searching appointments")
                          console.log(`Calling ${this.server_url}/appointments/search/${this.sleep} with ${jString}`)
                          const response = await fetch(`${this.server_url}/appointments/search/${this.sleep}`, {
                              method: "POST",
                              body: jString,
                              headers: {
                                  "Content-Type": "application/json"
                              }
                        });
                        //const data = await response.json();
                        const data = await response.json()
                        console.log(data)
                        this.appointments = []
                        for (let x = 0; x < Math.min(max_records, data.length); x++) {
                            this.appointments.push(data[x]);
                        }
                        //console.log(this.appointments.length)
                        if(this.appointments.length > 0){
                            this.error = ""
                        }else{
                            //console.log("no records found")
                            this.error = "No record exists"
                        }
                        this.$emit('notify', this.appointments)
                        }else{
                            const max_records = 50;
                            console.log("Get All Appointments because no search criteria was provided")
                            console.log(`Calling ${this.server_url}/appointments/${this.sleep}`);
                            const response = await fetch(`${this.server_url}/appointments/${this.sleep}`, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            });
                            const data = await response.json();
                            // Push fetched data to the appointments array
                            this.appointments = []
                            for (let x = 0; x < Math.min(max_records, data.length); x++) {
                                this.appointments.push(data[x]);
                            }
                            this.error = ""
                            this.$emit('notify', this.appointments)
                        }
                    }catch(err){
                        console.error(err)
                        this.appointments = [];
                        this.error = "No record exists"
                    }
                },

            }
}
</script>