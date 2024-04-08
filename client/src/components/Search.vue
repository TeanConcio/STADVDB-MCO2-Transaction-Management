<template>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>
          Appointment ID:
          <input v-model="search" type="text" />
        </label>
        <button class="submit-button" type="submit" v-on:click="searchAppointments">Submit</button>
        <p id="errors" :style="{ color: 'red'}">{{error}}</p>
      </div>
    </form>
  </template>

<script>
export default{
    data() {
        return{
        appointments: [],
        search: null,
        error: "",
        };
    },
    methods: {
                async searchAppointments() {
                    try{
                    // Perform search operation (e.g., fetch data from server based on search criteria)
                    // You can implement this based on your specific requirements
                    // For demonstration purpose, let's assume it fetches data from the server
                        console.log(this.search)
                        if(this.search){
                        const response = await fetch(`http://localhost:8081/appointments/${this.search}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        });
                        //const data = await response.json();
                        const data = await response.json()
                        this.appointments = [];
                        this.appointments.push(data)
                        this.error = ""
                        this.$emit('notify', this.appointments)
                        }else{
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