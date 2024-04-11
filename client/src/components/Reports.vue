<template>
    <div>
      <div v-if="error">
        Error: {{ error.message }}
      </div>
      <div v-else-if="reports">
        <pre>{{ reports }}</pre>
      </div>
      <div v-else>
        Loading...
      </div>
    </div>
</template>
  
<script>
export default {
  name: 'Reports',
  props: ['sleep'],
  data() {
    return {
      reports: null,
      error: null,
      server_url: import.meta.env.VITE_SERVER_URL

    };
  },
  async mounted() {
    try {

      console.log(`Calling ${this.server_url}/reports/${this.sleep}`);
      const response = await fetch(`${this.server_url}/reports/${this.sleep}`);

      this.reports = await response.json();
    } catch (error) {
      this.error = error;
    }
  }
}
</script>